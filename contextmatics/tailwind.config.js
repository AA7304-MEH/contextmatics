/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', // Enable class-based dark mode for future theming
  theme: {
    extend: {
      // 1. COLOR PALETTE (Derived from Cursor.com analysis)
      colors: {
        background: {
          primary: '#0a0a0a',    // Main dark background
          surface: '#1a1a1a',     // Cards, sidebars
          muted: 'rgba(255,255,255,0.03)',
        },
        text: {
          primary: '#f9f9f9',
          secondary: '#a0a0a0',
          muted: '#6b7280',
        },
        brand: {
          primary: '#3b82f6',     // Blue
          primaryHover: '#2563eb',
          accent: '#8b5cf6',      // Purple accent
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.1)',
          light: 'rgba(255,255,255,0.05)',
        }
      },

      // 2. TYPOGRAPHY SCALE (Matches Cursor's fluid typography)
      fontSize: {
        'display': ['clamp(2.5rem, 5vw, 3.75rem)', { lineHeight: '1.1', fontWeight: '800' }],
        'h1': ['clamp(2rem, 4vw, 2.5rem)', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['clamp(1.5rem, 3vw, 2rem)', { lineHeight: '1.3', fontWeight: '600' }],
        'body': ['1.125rem', { lineHeight: '1.7' }],
        'code': ['0.9em', { lineHeight: '1.5' }],
      },

      // 3. SPACING & LAYOUT
      spacing: {
        'section': '5rem',
        'container': '2rem',
      },
      maxWidth: {
        'content': '65ch',        // Optimal reading width
        'wide': '90ch',
        'screen-2xl': '1400px',
      },

      // 4. EFFECTS & ANIMATIONS
      boxShadow: {
        'card': '0 0 0 1px rgba(255,255,255,0.05)',
        'card-hover': '0 8px 32px rgba(0, 0, 0, 0.2)',
        'glow': '0 0 40px rgba(59, 130, 246, 0.1)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'hue-flow': {
          to: { 'background-position': '200% center' }
        }
      }
    },
  },
  plugins: [],
}