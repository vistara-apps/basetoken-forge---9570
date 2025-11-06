/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'space-blue': '#0066ff',
        'space-dark': '#0a0f1c',
        'space-light': '#1a2332',
        'neon-blue': '#00d4ff',
        'neon-purple': '#8b5cf6',
        'pixel-green': '#00ff00', // Example of a retro color
      },
      backgroundImage: {
        'space-gradient': 'linear-gradient(135deg, #0a0f1c 0%, #1a2332 50%, #0066ff 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(26, 35, 50, 0.8) 0%, rgba(10, 15, 28, 0.9) 100%)',
        'retro-pattern': "url('/path/to/pixelated-background.png')", // Add a retro pattern
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #00d4ff' },
          '100%': { boxShadow: '0 0 20px #00d4ff, 0 0 30px #00d4ff' },
        },
      },
    },
  },
  plugins: [],
}