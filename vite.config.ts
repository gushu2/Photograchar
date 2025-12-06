import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Standard Vite configuration without API Key injection
  return {
    plugins: [react()],
    // No "define" block needed as we are not using process.env for API keys
  };
});