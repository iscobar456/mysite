<script lang="ts">
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<div class="max-w-[768px] w-full mt-10">
  <a href="/" class="mb-3 block w-full text-right">← Home</a>
  <h1 class="text-3xl">Reading List</h1>
  <hr class="block my-3 border-gray-400" />
  <ul>
    {#each data.books as book}
      <li><a href={`/readinglist/${book.slug}`}>{book.title}</a></li>
    {/each}
  </ul>
</div>
