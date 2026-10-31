// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig ({
    server: {
        // Le système est souvent à la limite des instances inotify (EMFILE au watch).
        watch: {
            usePolling: true,
            interval: 300,
        },
    },
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                login: resolve(__dirname, 'login.html'),
                register: resolve(__dirname, 'register.html'),
                report: resolve(__dirname, 'report.html'),
                home: resolve(__dirname, 'home.html'),
            },
        },
    },
})