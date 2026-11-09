<script lang="ts">
  import AdminTable from '$lib/components/AdminTable.svelte';
  import type { PageProps } from './$types';

  let { data, form }: PageProps = $props();
</script>

<AdminTable kind="book" items={data.items} {form} />
