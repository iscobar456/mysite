<script>
  let { children } = $props();
  import '../app.css';
</script>

<div class="flex justify-center mt-5">
  {@render children()}
</div>
