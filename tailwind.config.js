import daisyui from 'daisyui'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        light: {
          'primary': '#3b82f6',
          'secondary': '#8b5cf6',
          'accent': '#06b6d4',
          'neutral': '#374151',
          'base-100': '#ffffff',
          'base-200': '#f3f4f6',
          'base-300': '#e5e7eb',
          'base-content': '#1f2937',
          'info': '#0ea5e9',
          'success': '#10b981',
          'warning': '#f59e0b',
          'error': '#ef4444',
        },
        dark: {
          'primary': '#60a5fa',
          'secondary': '#a78bfa',
          'accent': '#22d3ee',
          'neutral': '#1f2937',
          'base-100': '#111827',
          'base-200': '#1f2937',
          'base-300': '#374151',
          'base-content': '#f9fafb',
          'info': '#38bdf8',
          'success': '#34d399',
          'warning': '#fbbf24',
          'error': '#f87171',
        },
      }
    ],
    darkTheme: 'dark',
    base: true,
    styled: true,
    utils: true,
  },
}