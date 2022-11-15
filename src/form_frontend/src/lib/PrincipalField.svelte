<script lang="ts">
  import { Principal } from '@dfinity/principal';

  export let value: Principal | null;
  export let id: string = '';
  export let placeholder: string = '';

  let text = '';
  let touched = false;
  $: {
    try {
      let parsed = Principal.fromText(text.trim());
      if (parsed.isAnonymous()) {
        value = null;
      } else {
        value = parsed;
      }
    } catch {
      value = null;
    }
  }
</script>

<input
  type="text"
  {placeholder}
  class="input input-bordered w-full"
  {id}
  bind:value={text}
  on:blur={() => text.trim().length > 0 && (touched = true)}
  required
/>
{#if text.trim().length > 0 && touched && !value}
  <label class="label" for="distrikt-principal">
    <span class="label-text-alt text-red-500">Invalid principal</span>
  </label>
{/if}
