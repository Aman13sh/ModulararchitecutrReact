import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // Use environment variables or fall back to localhost
  const chatUrl = env.VITE_CHAT_URL || 'http://localhost:5175';
  const emailUrl = env.VITE_EMAIL_URL || 'http://localhost:5176';

  return {
    plugins: [
      react(),
      federation({
        name: 'host',
        remotes: {
          chatApp: {
            external: `Promise.resolve('${chatUrl}/assets/remoteEntry.js')`,
            from: 'webpack',
            externalType: 'promise'
          },
          emailApp: {
            external: `Promise.resolve('${emailUrl}/assets/remoteEntry.js')`,
            from: 'webpack',
            externalType: 'promise'
          }
        },
        exposes: {
          './designSystem': './src/designSystem/index.ts',
        },
        shared: ['react', 'react-dom', 'react-icons']
      })
    ],
    server: {
      port: 5174,
      strictPort: true,
      cors: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    },
    preview: {
      port: 5174,
      strictPort: true,
      cors: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    },
    build: {
      modulePreload: false,
      target: 'esnext',
      minify: false,
      cssCodeSplit: false
    }
  };
});
