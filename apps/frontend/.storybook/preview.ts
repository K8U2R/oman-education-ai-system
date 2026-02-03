import type { Preview } from '@storybook/react'
import React from 'react'
import '../src/index.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#1f2937',
        },
        {
          name: 'gray',
          value: '#f3f4f6',
        },
      ],
    },
    docs: {
      toc: true,
    },
  },
  globalTypes: {
    direction: {
      description: 'Text direction',
      defaultValue: 'rtl',
      toolbar: {
        title: 'Direction',
        icon: 'globe',
        items: ['ltr', 'rtl'],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const direction = context.globals.direction || 'rtl'
      return React.createElement(
        'div',
        {
          dir: direction,
          style: { padding: '2rem', minHeight: '100vh' },
        },
        React.createElement(Story)
      )
    },
  ],
}

export default preview
