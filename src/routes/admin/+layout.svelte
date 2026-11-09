<script lang="ts">
  import type { LayoutProps } from './$types';

  let { children }: LayoutProps = $props();
</script>

<div class="w-full max-w-5xl mx-auto px-4 pb-10">
  <nav class="flex items-center gap-5 mb-5 pb-3 border-b">
    <a href="/admin/" class="underline">Admin</a>
    <a href="/admin/blog/" class="underline">Posts</a>
    <a href="/admin/readinglist/" class="underline">Reading list</a>
    <a href="/" class="underline">View site</a>
    <form method="POST" action="/admin/logout" class="ml-auto">
      <button type="submit" class="cursor-pointer underline">Log out</button>
    </form>
  </nav>
  {@render children()}
</div>
