<script lang="ts">
  import type { Post } from '$lib/types/blog';
  import { onMount } from 'svelte';
  import type { PageProps } from './$types';

  let { data, form }: PageProps = $props();
  const emptyPost: Post = { id: -1, title: '', slug: '', type: 'book', file: '' };
  let selectedPost: Post = $state(emptyPost);
  let dialog: HTMLDialogElement;
  let formTitle: HTMLInputElement;
  let formSlug: HTMLInputElement;

  const openPostForm = (post: Post) => {
    selectedPost = post;
    dialog.showModal();
  };

  const slugify = (title: string) => {
    let slug = title;
    slug = slug.toLowerCase().replaceAll(' ', '-');
    return slug;
  };

  onMount(() => {
    if (form?.badData) {
      alert('Unable to process data. Try again.');
    }
    if (form?.databaseConflict) {
      alert('Unable to process data. Try again.');
      openPostForm(form.post);
    }
  });
</script>

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
    {#each data.posts as post}
      <tr class="border-b">
        <td class="p-5 pr-15">{post.title}</td>
        <td class="pr-15">{post.slug}</td>
        <td class="pr-15">{post.type}</td>
        <td class="pr-15">{post.file}</td>
        <td class="pr-15"
          ><button
            class="cursor-pointer px-3 py-1 bg-blue-200 rounded-sm"
            type="button"
            onclick={() => openPostForm(post)}>Edit 🖉</button
          ></td
        >
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
          onclick={() => openPostForm(emptyPost)}>Add new +</button
        ></td
      >
    </tr>
  </tbody>
</table>

<dialog bind:this={dialog} class="max-w-[576px] w-full p-5 m-auto mt-35">
  <form method="POST" class="flex flex-col gap-4">
    <label for="">
      <input type="hidden" name="id" value={selectedPost.id} />
    </label>
    <label for="">
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
    <label for="">
      Slug:
      <input
        type="text"
        name="slug"
        value={selectedPost.slug}
        bind:this={formSlug}
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

      <select
        name="type"
        id=""
        value={selectedPost.type}
        class="border rounded-sm py-1 px-2"
        required
      >
        <option value="book">Book</option>
        <option value="project">Project</option>
        <option value="other">Other</option>
      </select>
    </label>
    <label for="">
      File:
      <select name="file" id="" value={selectedPost.file} class="border rounded-sm py-1 px-2">
        {#each data.files as file}
          <option value={file}>{file}</option>
        {/each}
      </select>
    </label>
    <input
      type="submit"
      value="Submit"
      class="cursor-pointer bg-blue-300 w-min px-2 py-1 rounded-sm ml-auto"
    />
  </form>
</dialog>
