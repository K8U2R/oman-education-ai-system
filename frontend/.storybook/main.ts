import type { StorybookConfig } from '@storybook/react-vite'
import { mergeConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'

// الحصول على __dirname في ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-onboarding',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@chromatic-com/storybook',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {},
  async viteFinal(config) {
    return mergeConfig(config, {
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '../src'),
          '@/application': path.resolve(__dirname, '../src/application'),
          '@/infrastructure': path.resolve(__dirname, '../src/infrastructure'),
          '@/presentation': path.resolve(__dirname, '../src/presentation'),
        },
      },
      css: {
        preprocessorOptions: {
          scss: {
            api: 'modern-compiler',
            includePaths: [path.resolve(__dirname, '../src')],
          },
        },
      },
    })
  },
}

export default config
