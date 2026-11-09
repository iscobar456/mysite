<script lang="ts">
  import type { Post } from '$lib/types/blog';
  import { onMount } from 'svelte';
  import type { PageProps } from './$types';

  let { data, form }: PageProps = $props();
  const emptyPost: Post = { id: -1, title: '', slug: '', type: 'book', file: '' };
  let selectedPost: Post = $state(emptyPost);
  let content = $state('');
  let dialog: HTMLDialogElement;
  let formTitle: HTMLInputElement;
  let formSlug: HTMLInputElement;

  const openPostForm = (post: Post, text?: string) => {
    selectedPost = post;
    content = text ?? data.contents[post.file] ?? '';
    dialog.showModal();
  };

  const slugify = (title: string) =>
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  // Switching to an existing file name loads that file's markdown.
  const onFileInput = (e: Event) => {
    const name = (e.currentTarget as HTMLInputElement).value;
    if (name in data.contents) content = data.contents[name];
  };

  const confirmDelete = (e: SubmitEvent, post: Post) => {
    if (!confirm(`Delete "${post.title}"? The markdown file will be kept.`)) e.preventDefault();
  };

  onMount(() => {
    const failed = form as { post?: Post; content?: string } | null;
    if (failed?.post) {
      openPostForm(failed.post, failed.content);
    }
  });
</script>

{#if form?.error}
  <p role="alert" class="mb-4 p-3 rounded-sm bg-red-100 text-red-900">{form.error}</p>
{/if}
{#if form?.success}
  <p role="status" class="mb-4 p-3 rounded-sm bg-green-100 text-green-900">{form.success}</p>
{/if}

<table class="table border">
  <thead class="border-b">
    <tr class="h-10">
      <th class="pl-5 text-left">Title</th>
      <th class="text-left">Slug</th>
      <th class="text-left">Type</th>
      <th class="text-left">File</th>
      <th class="pr-5 text-left"></th>
    </tr>
  </thead>
  <tbody>
    {#each data.posts as post (post.id)}
      <tr class="border-b">
        <td class="p-5 pr-15">{post.title}</td>
        <td class="pr-15">{post.slug}</td>
        <td class="pr-15">{post.type}</td>
        <td class="pr-15">{post.file}</td>
        <td class="pr-5">
          <div class="flex gap-2">
            <button
              class="cursor-pointer px-3 py-1 bg-blue-200 rounded-sm"
              type="button"
              onclick={() => openPostForm(post)}>Edit 🖉</button
            >
            <form method="POST" action="?/delete" onsubmit={(e) => confirmDelete(e, post)}>
              <input type="hidden" name="id" value={post.id} />
              <button class="cursor-pointer px-3 py-1 bg-red-200 rounded-sm" type="submit"
                >Delete</button
              >
            </form>
          </div>
        </td>
      </tr>
    {/each}
    <tr>
      <td class="p-5 pr-15">—</td>
      <td class="pr-15">—</td>
      <td class="pr-15">—</td>
      <td class="pr-15">—</td>
      <td class="py-5"
        ><button
          class="cursor-pointer px-3 py-1 bg-green-200 rounded-sm"
          onclick={() => openPostForm(emptyPost, '')}>Add new +</button
        ></td
      >
    </tr>
  </tbody>
</table>

<dialog bind:this={dialog} class="max-w-[720px] w-full p-5 m-auto mt-20">
  <form method="POST" action="?/save" class="flex flex-col gap-4">
    <input type="hidden" name="id" value={selectedPost.id} />
    <label>
      Title:
      <input
        type="text"
        name="title"
        value={selectedPost.title}
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
        value={selectedPost.slug}
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
    <label>
      Type:
      <select name="type" value={selectedPost.type} class="border rounded-sm py-1 px-2" required>
        <option value="book">Book</option>
        <option value="project">Project</option>
        <option value="other">Other</option>
      </select>
    </label>
    <label>
      File:
      <input
        type="text"
        name="file"
        list="post-files"
        value={selectedPost.file}
        oninput={onFileInput}
        required
        pattern="[A-Za-z0-9_\-]+\.md"
        placeholder="my-post.md"
        class="border rounded-sm py-1 px-2"
      />
      <datalist id="post-files">
        {#each data.files as file}
          <option value={file}></option>
        {/each}
      </datalist>
    </label>
    <label class="flex flex-col gap-1">
      Markdown:
      <textarea
        name="content"
        bind:value={content}
        rows="16"
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
