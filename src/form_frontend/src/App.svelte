<script lang="ts">
  import Form from './lib/Form.svelte';

  let submitted = false;
</script>

<main class="px-6 py-8 font-extralight max-w-2xl mx-auto md:pt-32">
  <h1 class="font-normal text-white text-xl md:text-4xl mb-4 md:mb-8">
    Associate your Distrikt principal with your NNS principal
  </h1>
  {#if !submitted}
    <p class="mb-6 md:mb-10 md:text-xl">
      To receive your neuron airdrop, please specify both your Distrikt and NNS
      princpials.
    </p>
    <Form on:success={() => (submitted = true)} />
  {:else}
    <p class="mb-6 md:mb-10 md:text-xl">
      You have successfully submitted your principal. Thank you!
    </p>
  {/if}
</main>

<style lang="postcss" global>
  @font-face {
    font-family: 'Inter';
    src: url('./assets/Inter-ExtraLight.ttf');
    font-weight: 200;
    font-style: normal;
  }

  @font-face {
    font-family: 'Inter';
    src: url('./assets/Inter-Regular.ttf');
    font-weight: 400;
    font-style: normal;
  }

  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
