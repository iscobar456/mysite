<script lang="ts">
  import type { PageProps } from './$types';
  let { data }: PageProps = $props();
</script>

<div class="px-5 sm:px-0">
  <a href="/books/" class="mb-3 block w-full text-right">← Books I've read</a>
  {#if data.readDate}
    <p class="mb-3 text-gray-500">Read on {data.readDate}</p>
  {/if}
  <article id="post" class="prose prose-base">
    {@html data.post}
  </article>
</div>
