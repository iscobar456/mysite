<script>
  let { children } = $props();
</script>

<div class="content">
  {@render children()}
</div>

<style>
  .content {
    display: flex;
    flex-direction: column;
    width: var(--content-width);
    margin: 20vh auto 0 auto;
    padding: 0 3rem;
  }
  :global(.page-heading h1) {
    font-size: 3rem;
    font-weight: normal;
  }
  :global(.page-heading hr) {
    margin: 1rem 0;
    width: 4rem;
    border: 0;
    height: 2px;
    background: #555;
  }
</style>
