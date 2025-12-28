/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand Colors
        primary: {
          DEFAULT: '#003DA5',
          dark: '#002d7a',
          light: '#1a5cc9',
        },
        accent: {
          DEFAULT: '#FF671F',
          dark: '#D35400',
          light: '#ff8347',
        },
        success: {
          DEFAULT: '#046A38',
          light: '#27AE60',
        },
        // Secondary Colors
        secondary: '#001F5C',
        interactive: '#0066CC',
        error: '#E53935',
        // Neutral Colors
        neutral: {
          50: '#FFFFFF',
          100: '#F5F7FA',
          200: '#E8ECF0',
          300: '#D1D9E0',
          400: '#8B95A5',
          500: '#6B7280',
          600: '#4B5563',
          700: '#2C3E50',
          800: '#1A1A1A',
        },
        // Data Visualization
        data: {
          blue: '#3498DB',
          purple: '#9B59B6',
          high: '#27AE60',
          medium: '#F39C12',
          low: '#E74C3C',
        },
      },
      fontFamily: {
        body: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'Inter', 'sans-serif'],
        data: ['Roboto Mono', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.5' }],
        'sm': ['0.875rem', { lineHeight: '1.5' }],
        'base': ['1rem', { lineHeight: '1.6' }],
        'lg': ['1.125rem', { lineHeight: '1.6' }],
        'xl': ['1.5rem', { lineHeight: '1.4' }],
        '2xl': ['1.875rem', { lineHeight: '1.4' }],
        '3xl': ['2.25rem', { lineHeight: '1.3' }],
        '4xl': ['3rem', { lineHeight: '1.2' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        'card': '8px',
        'pill': '9999px',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'nav': '0 2px 10px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}

