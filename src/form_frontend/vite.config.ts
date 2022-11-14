import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import * as fs from 'fs';
import { createLogger, defineConfig } from 'vite';

const logger = createLogger();

const DFX_NETWORK = process.env.DFX_NETWORK || 'local';

function getCanisterId(network: string): string {
  if (network === 'ic') {
    try {
      return JSON.parse(
        fs.readFileSync('../../canister_ids.json', { encoding: 'utf-8' })
      )['form_backend'].ic;
    } catch {
      logger.error(
        `Error loading canister_ids.json. Please run \`dfx deploy --network ic\` first.`
      );
      process.exit(1);
    }
  } else {
    try {
      return JSON.parse(
        fs.readFileSync('../../.dfx/local/canister_ids.json', {
          encoding: 'utf-8',
        })
      )['form_backend'].local;
    } catch {
      logger.error(
        `Error finding local 'form_backend' canister id. Please run \`dfx canister create --all\` first.`
      );
      process.exit(1);
    }
  }
}

const backendCanisterId = getCanisterId(DFX_NETWORK);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  define: {
    DFX_NETWORK: JSON.stringify(DFX_NETWORK),
    BACKEND_CANISTER_ID: JSON.stringify(backendCanisterId),
  },
  // Node polyfill agent-js. Thanks solution shared by chovyfu on the Discord channel.
  // https://stackoverflow.com/questions/71744659/how-do-i-deploy-a-sveltekit-app-to-a-dfinity-container
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
        }),
      ],
    },
  },
});
