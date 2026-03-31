/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E8449',
          light:   '#E8F5E9',
          50:      '#E8F5E9',
          100:     '#C8E6C9',
          200:     '#A5D6A7',
          400:     '#4CAF70',
          500:     '#1E8449',
          600:     '#1A7340',
          700:     '#145A32',
          800:     '#0F4325',
          900:     '#0A2E1A',
        },
        secondary: {
          DEFAULT: '#F5A623',
          light:   '#FFF8E1',
        },
        error: {
          DEFAULT: '#C0392B',
          light:   '#FDECEA',
        },
        warning: {
          DEFAULT: '#E67E22',
          light:   '#FEF3E2',
        },
        background: '#FFFFFF',
        surface:    '#FFFFFF',
        card:       '#FFFFFF',
        muted:      '#888888',
        divider:    '#F5F5F5',
        sidebar:    '#14532D',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card:       '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 6px -1px rgba(0,0,0,0.08), 0 2px 4px -2px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
}
