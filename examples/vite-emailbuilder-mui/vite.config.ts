import { defineConfig } from 'vite';
import { resolve } from 'path';

import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  base: '/email_editor/',
  build: {
    outDir: resolve(__dirname, '../../../public/email_editor'),
    emptyOutDir: true,
  },
  server: {
    port: 3001,
  },
});
