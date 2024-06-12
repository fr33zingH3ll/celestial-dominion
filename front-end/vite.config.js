// vite.config.js
import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()], // Correction ici : plugins au lieu de plugin
    build: {
        rollupOptions: {
            input: {
                index: resolve(__dirname, 'index.html'),
                game: resolve(__dirname, 'game.html'),
            },
        },
    },
});