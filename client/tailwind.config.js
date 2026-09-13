/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'canvas-bg': '#F5F5F7',
        'surface-card': '#FFFFFF',
        'surface-container-low': '#F4F3F8',
        'surface-container': '#EEEDF3',
        'surface-container-high': '#E9E7ED',
        'surface-container-highest': '#E3E2E7',
        'surface-dim': '#DAD9DF',
        'text-primary': '#1D1D1F',
        'text-secondary': '#86868B',
        'on-surface-variant': '#414753',
        'primary': '#0059B5',
        'primary-container': '#0071E3',
        'on-primary': '#FFFFFF',
        'ai-iridescent-blue': '#2997FF',
        'ai-iridescent-purple': '#AF52DE',
        'border-subtle': 'rgba(0, 0, 0, 0.04)',
        'glass-specular': 'rgba(255, 255, 255, 0.7)',
      },
      boxShadow: {
        'header': '0 1px 8px rgba(0, 0, 0, 0.03)',
        'dilemma-card': '0 8px 30px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
        'ai-consensus': '0 8px 32px -6px rgba(41, 151, 255, 0.08)',
        'btn-primary': '0 2px 8px rgba(0, 113, 227, 0.25)',
      },
      borderRadius: {
        'dilemma': '32px',
        'ai': '24px',
        'ai-rim': '25px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      spacing: {
        'margin': '1.5rem',
        'space-xs': '0.25rem',
        'space-sm': '0.5rem',
        'space-md': '1rem',
        'space-lg': '1.5rem',
        'space-xl': '2.5rem',
        'space-2xl': '4rem',
      },
    },
  },
  plugins: [],
};
