import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' keeps asset paths relative so it works at username.github.io/<repo>/
export default defineConfig({ base: './', plugins: [react()] })
