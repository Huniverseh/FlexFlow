import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms'

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#ff9500',
        'background-light': '#f5f5f7',
        'background-dark': '#231b0f',
        'text-primary-light': '#333333',
        'text-secondary-light': '#888888',
      },
      fontFamily: {
        display: ['Lexend', '"Noto Sans SC"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 12px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        xl: '0.75rem',
      },
    },
  },
  plugins: [forms],
}

export default config
