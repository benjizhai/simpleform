<script lang="ts">
  import { Actor, HttpAgent } from '@dfinity/agent';
  import type { Principal } from '@dfinity/principal';
  import { createEventDispatcher } from 'svelte';
  import type { _SERVICE } from '../../../declarations/form_backend/form_backend.did';
  import { idlFactory } from '../app/backend';
  import { enumIs } from '../app/enums';
  import DistriktHowTo from './DistriktHowTo.svelte';
  import NnsHowTo from './NnsHowTo.svelte';
  import PrincipalField from './PrincipalField.svelte';

  const dispatch = createEventDispatcher<{ success: void }>();

  let distriktPrincipal: Principal | null;
  let nnsPrincipal: Principal | null;

  let error = '';
  let loading = false;

  async function submitPrincipals(e: SubmitEvent) {
    if (!nnsPrincipal || !distriktPrincipal || loading) return;
    e.preventDefault();
    const agent = new HttpAgent({
      host:
        DFX_NETWORK === 'ic'
          ? `https://${BACKEND_CANISTER_ID}.ic0.app`
          : `http://127.0.0.1:8000/?canisterId=${BACKEND_CANISTER_ID}`,
    });

    if (DFX_NETWORK === 'local') {
      await agent.fetchRootKey();
    }

    const actor = Actor.createActor<_SERVICE>(idlFactory, {
      agent,
      canisterId: BACKEND_CANISTER_ID,
    });

    try {
      loading = true;
      error = '';
      const result = await actor.create({
        app_principal: [distriktPrincipal],
        nns_principal: nnsPrincipal,
        app_account: [],
      });
      if (enumIs(result, 'Ok')) {
        dispatch('success');
      } else {
        error = 'An error occurred. Please try again.';
      }
    } catch {
      error = 'An error occurred. Please try again.';
    } finally {
      loading = false;
    }
  }
</script>

<form class="space-y-6 text-sm" on:submit={(e) => submitPrincipals(e)}>
  <div class="form-control w-full mb-6">
    <div class="label">
      <label class="label-text" for="distrikt-principal"
        >Enter your distrikt principal</label
      >
      <label
        class="label-text underline cursor-pointer hover:text-white"
        for="how-to-distrikt-modal">How to find</label
      >
    </div>
    <PrincipalField
      bind:value={distriktPrincipal}
      placeholder="distrikt principal"
      id="distrikt-principal"
    />
  </div>
  <div class="form-control w-full">
    <div class="label">
      <label class="label-text" for="nns-principal"
        >Enter your NNS principal</label
      >
      <label
        class="label-text underline cursor-pointer hover:text-white"
        for="how-to-nns-modal">How to find</label
      >
    </div>

    <PrincipalField
      bind:value={nnsPrincipal}
      placeholder="NNS principal"
      id="nns-principal"
    />
  </div>

  <div class="form-control ">
    <button
      class="btn btn-primary btn-active {loading ? 'loading' : ''}"
      type="submit"
      disabled={!distriktPrincipal || !nnsPrincipal || loading}
      >{loading ? 'Submitting...' : 'Submit'}</button
    >
  </div>
  {#if error}
    <div class="text-center text-red-500">{error}</div>
  {/if}
</form>

<DistriktHowTo />
<NnsHowTo />
