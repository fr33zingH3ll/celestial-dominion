// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig ({
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