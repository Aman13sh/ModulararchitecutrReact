import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'host',
      remotes: {
        chatApp: {
          external: `Promise.resolve('http://localhost:5175/assets/remoteEntry.js')`,
          from: 'webpack',
          externalType: 'promise'
        },
        emailApp: {
          external: `Promise.resolve('http://localhost:5176/assets/remoteEntry.js')`,
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
});
