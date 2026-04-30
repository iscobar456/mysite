<script lang="ts">
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<h1 class="text-3xl">Posts</h1>
<hr class="block my-3" />
<ul>
  {#each data.posts as post}
    <li><a href={`/blog/${post.slug}`}>{post.name}</a></li>
  {/each}
</ul>
