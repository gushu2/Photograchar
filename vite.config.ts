import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    base: './', // Ensures assets are loaded relatively
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    }
  };
});