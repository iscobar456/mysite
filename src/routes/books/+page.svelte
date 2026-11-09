<script lang="ts">
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<div class="max-w-[768px] w-full mt-10 px-5 sm:px-0">
  <a href="/" class="mb-3 block w-full text-right">← Home</a>
  <h1 class="text-3xl">Books I've read</h1>
  <hr class="block my-3 border-gray-400" />
  <ul>
    {#each data.books as book}
      <li>
        {#if book.content.trim()}
          <a href={`/books/${book.slug}`}>{book.title}</a>
        {:else}
          <!-- <p> so it picks up the same Lora font as links (static/global.css) -->
          <p class="inline">{book.title}</p>
        {/if}
      </li>
    {/each}
  </ul>
</div>
