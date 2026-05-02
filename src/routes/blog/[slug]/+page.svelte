<script lang="ts">
  import type { PageProps } from './$types';
  let { data }: PageProps = $props();
</script>

<article id="post" class="prose prose-base">
  {@html data.post}
</article>
