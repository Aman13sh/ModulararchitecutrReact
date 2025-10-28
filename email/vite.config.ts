import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const hostUrl = env.VITE_HOST_URL || 'http://localhost:5174';

  return {
    plugins: [
      react(),
      federation({
        name: 'emailApp',
        filename: 'remoteEntry.js',
        exposes: {
          './App': './src/App.tsx',
        },
        remotes: {
          host: {
            external: `Promise.resolve('${hostUrl}/assets/remoteEntry.js')`,
            from: 'webpack',
            externalType: 'promise'
          }
        },
        shared: ['react', 'react-dom', 'react-icons']
      })
    ],
    server: {
      port: 5176,
      strictPort: true,
      cors: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    },
    preview: {
      port: 5176,
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
