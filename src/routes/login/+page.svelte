<div>
  <form method="post" action="">
    <label for="email">
      <span>Email:</span>
      <input type="email" id="email" name="email" />
    </label>
    <label for="password">
      <span>Password:</span>
      <input type="password" id="password" name="password" />
    </label>
    <button>Submit</button>
  </form>
</div>

<style>
  form {
    display: flex;
    flex-direction: column;
  }
  form label {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
    font-size: 1.1rem;
    font-family: Lora;
  }
  form input {
    padding: 0.5rem;
    padding-left: 0;
    border: none;
    border-bottom: 1px solid #000;
    font-size: 1rem;
    font-family: Lora;
  }
  form input[type='password'] {
    font-size: 0.8rem;
  }
  form input:focus {
    outline: none;
  }
  form button {
    padding: 0.5rem 1.3rem;
    border: none;
    width: min-content;
    font-family: Lora;
    font-size: 1rem;
  }
</style>
