<script lang="ts">
  import { onMount } from 'svelte';
  import type { Book, Post } from '$lib/types/blog';
  import 'gridjs/dist/theme/mermaid.min.css';

  type Item = Post | Book;
  type Props = {
    kind: 'post' | 'book';
    items: Item[];
    form?: { error?: string; success?: string; item?: Item } | null;
  };

  let { kind, items, form }: Props = $props();

  const emptyItem = (): Item =>
    kind === 'post'
      ? { id: -1, title: '', slug: '', type: 'other', content: '' }
      : { id: -1, title: '', slug: '', read_date: null, content: '' };

  let selected: Item = $state(emptyItem());
  let dialog: HTMLDialogElement;
  let deleteForm: HTMLFormElement;
  let deleteId = $state(-1);
  let formTitle: HTMLInputElement;
  let formSlug: HTMLInputElement;
  let gridEl: HTMLDivElement;

  const openForm = (item: Item) => {
    selected = item;
    dialog.showModal();
  };

  const slugify = (title: string) =>
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const confirmDelete = (item: Item) => {
    if (!confirm(`Delete "${item.title}"?`)) return;
    deleteId = item.id;
    // Wait for the hidden id input to update before submitting.
    setTimeout(() => deleteForm.requestSubmit());
  };

  onMount(() => {
    if (form?.item) openForm(form.item);

    let grid: { destroy: () => void } | undefined;
    (async () => {
      const { Grid, h } = await import('gridjs');
      const byId = new Map(items.map((i) => [i.id, i]));
      grid = new Grid({
        columns: [
          { id: 'id', name: 'id', hidden: true },
          { id: 'title', name: 'Title' },
          { id: 'slug', name: 'Slug' },
          kind === 'post'
            ? { id: 'type', name: 'Type' }
            : { id: 'read_date', name: 'Read date' },
          {
            id: 'actions',
            name: '',
            sort: false,
            formatter: (_cell: unknown, row: { cells: { data: unknown }[] }) => {
              const item = byId.get(row.cells[0].data as number)!;
              return h(
                'div',
                { className: 'flex gap-2' },
                h('button', { className: 'cursor-pointer px-3 py-1 bg-blue-200 rounded-sm', onClick: () => openForm(item) }, 'Edit'),
                h('button', { className: 'cursor-pointer px-3 py-1 bg-red-200 rounded-sm', onClick: () => confirmDelete(item) }, 'Delete')
              );
            }
          }
        ],
        data: items.map((i) => [
          i.id,
          i.title,
          i.slug,
          kind === 'post' ? (i as Post).type : ((i as Book).read_date ?? ''),
          ''
        ]),
        sort: true,
        search: true
      }).render(gridEl);
    })();

    return () => grid?.destroy();
  });
</script>

{#if form?.error}
  <p role="alert" class="mb-4 p-3 rounded-sm bg-red-100 text-red-900">{form.error}</p>
{/if}
{#if form?.success}
  <p role="status" class="mb-4 p-3 rounded-sm bg-green-100 text-green-900">{form.success}</p>
{/if}

<div class="mb-3 flex justify-end">
  <button
    type="button"
    class="cursor-pointer px-3 py-1 bg-green-200 rounded-sm"
    onclick={() => openForm(emptyItem())}>Add new +</button
  >
</div>

<div bind:this={gridEl}></div>

<form bind:this={deleteForm} method="POST" action="?/delete" class="hidden">
  <input type="hidden" name="id" value={deleteId} />
</form>

<dialog bind:this={dialog} class="max-w-[720px] w-full p-5 m-auto mt-20">
  <form method="POST" action="?/save" class="flex flex-col gap-4">
    <input type="hidden" name="id" value={selected.id} />
    <label>
      Title:
      <input
        type="text"
        name="title"
        value={selected.title}
        bind:this={formTitle}
        required
        class="border rounded-sm py-1 px-2"
      />
    </label>
    <label>
      Slug:
      <input
        type="text"
        name="slug"
        value={selected.slug}
        bind:this={formSlug}
        required
        class="border rounded-sm py-1 px-2"
      />
      <button
        class="rounded-sm bg-gray-300 py-1 px-2"
        type="button"
        onclick={() => (formSlug.value = slugify(formTitle.value))}>Generate slug</button
      >
    </label>
    {#if kind === 'post'}
      <label>
        Type:
        <select name="type" value={(selected as Post).type} class="border rounded-sm py-1 px-2" required>
          <option value="project">Project</option>
          <option value="other">Other</option>
        </select>
      </label>
    {:else}
      <label>
        Date read:
        <input
          type="date"
          name="read_date"
          value={(selected as Book).read_date ?? ''}
          class="border rounded-sm py-1 px-2"
        />
      </label>
    {/if}
    <label class="flex flex-col gap-1">
      Markdown:
      <textarea
        name="content"
        rows="16"
        value={selected.content}
        class="border rounded-sm py-1 px-2 font-mono text-sm"
      ></textarea>
    </label>
    <div class="flex justify-end gap-2">
      <button
        type="button"
        class="cursor-pointer bg-gray-200 px-2 py-1 rounded-sm"
        onclick={() => dialog.close()}>Cancel</button
      >
      <input type="submit" value="Save" class="cursor-pointer bg-blue-300 px-2 py-1 rounded-sm" />
    </div>
  </form>
</dialog>
