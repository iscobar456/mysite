<script lang="ts">
  import type { PageProps } from './$types';
  let { data }: PageProps = $props();
</script>

<div>
  <a href="/readinglist/" class="mb-3 block w-full text-right">← Reading List</a>
  <article id="post" class="prose prose-base">
    {@html data.post}
  </article>
</div>
