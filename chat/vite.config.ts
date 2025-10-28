import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,
    strictPort: true, // Fail if port is already in use
  },
  resolve: {
    alias: {
      'host': path.resolve(__dirname, '../host/src/designSystem'),
      'host/styles.css': path.resolve(__dirname, '../host/src/designSystem/styles.css'),
    },
  },
});
