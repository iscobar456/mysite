<script lang="ts">
  import type { LayoutProps } from '../$types';

  let { children }: LayoutProps = $props();
</script>

<div>
  {@render children()}
</div>
