import process from 'node:process'
import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ isPreview }) => {
  const aliases = {}
  if (!isPreview) {
    const cache = resolve('node_modules/.cache/creativity')
    mkdirSync(cache, { recursive: true })
    const checkout = mkdtempSync(join(cache, 'source-'))
    process.once('exit', () => rmSync(checkout, { recursive: true, force: true }))
    execFileSync('git', [
      'clone', '--depth', '1', '--branch', 'main',
      'https://github.com/RithikVerma/creativity.git', checkout,
    ], { stdio: 'inherit' })
    aliases['@creativity'] = join(checkout, 'src')
  }

  return {
    plugins: [react()],
    resolve: { alias: aliases, dedupe: ['react', 'react-dom'] },
    build: {
      rollupOptions: {
        input: ['index.html', 'creativity/index.html'],
      },
    },
  }
})

