// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig ({
    build: {
        rollupOptions: {
            input: {
                index: resolve(__dirname, 'index.html'),
                login: resolve(__dirname, 'login.html'),
                logout: resolve(__dirname, 'logout.html'),
                register: resolve(__dirname, 'register.html'),
                report: resolve(__dirname, 'report.html'),
                game: resolve(__dirname, 'game.html'),
            },
        },
    },
})