<script lang="ts">
  import type { PageProps } from './$types';
  let { data }: PageProps = $props();
</script>

<div class="px-5 sm:px-0">
  <a href="/blog/" class="mb-3 block w-full text-right">← Posts</a>
  <article id="post" class="prose prose-base">
    {@html data.post}
  </article>
</div>
