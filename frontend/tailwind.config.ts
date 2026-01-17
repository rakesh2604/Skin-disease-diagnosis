import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Medical Color Palette from Research Paper
        medical: {
          text: '#0f172a',      // Slate-900 for text
          primary: '#0891b2',   // Cyan-600 for primary actions
          surface: '#ffffff',   // White for clean surfaces
          alert: '#dc2626',     // Red-600 for urgent melanoma alerts
          success: '#16a34a',   // Green-600 for success states
          warning: '#ea580c',   // Orange-600 for warnings
          background: '#f8fafc', // Slate-50 for background
          border: '#e2e8f0',    // Slate-200 for borders
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
} satisfies Config;
