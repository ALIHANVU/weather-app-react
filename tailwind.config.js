/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // iOS цвета для светлой темы
        "ios-bg": "#f2f2f6",
        "ios-card-bg": "rgba(255, 255, 255, 0.72)",
        "ios-elevated-bg": "#ffffff",
        "ios-text-primary": "#000000",
        "ios-text-secondary": "#6e6e73",
        "ios-text-tertiary": "#98989d",
        "ios-fill-quaternary": "rgba(118, 118, 128, 0.08)",
        "ios-fill-tertiary": "rgba(118, 118, 128, 0.12)",
        "ios-fill-secondary": "rgba(118, 118, 128, 0.16)",
        "ios-fill-primary": "rgba(118, 118, 128, 0.2)",
        // iOS цвета
        "ios-blue": "#007aff",
        "ios-green": "#34c759",
        "ios-indigo": "#5856d6",
        "ios-orange": "#ff9500",
        "ios-pink": "#ff2d55",
        "ios-purple": "#af52de",
        "ios-red": "#ff3b30",
        "ios-teal": "#5ac8fa",
        "ios-yellow": "#ffcc00",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        // iOS скругления
        "ios-xs": "6px",
        "ios-sm": "10px",
        "ios-md": "14px",
        "ios-lg": "18px",
        "ios-xl": "22px",
        "ios-pill": "100px",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        // iOS тени
        "ios-sm": "0 2px 8px rgba(0, 0, 0, 0.08)",
        "ios-md": "0 4px 16px rgba(0, 0, 0, 0.1)",
        "ios-lg": "0 10px 25px rgba(0, 0, 0, 0.15)",
      },
      fontFamily: {
        // iOS система шрифтов
        sans: [
          "-apple-system", 
          "BlinkMacSystemFont", 
          "'SF Pro Text'", 
          "'SF Pro Display'", 
          "'SF Pro'", 
          "'Helvetica Neue'", 
          "Arial", 
          "sans-serif"
        ],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        // iOS анимации
        "ios-card-entry": {
          from: { 
            opacity: "0", 
            transform: "scale(0.96) translateY(20px)" 
          },
          to: { 
            opacity: "1", 
            transform: "scale(1) translateY(0)" 
          },
        },
        "ios-items-entry": {
          from: { 
            opacity: "0", 
            transform: "translateY(15px)" 
          },
          to: { 
            opacity: "1", 
            transform: "translateY(0)" 
          },
        },
        "ios-shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "ios-fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "ios-fade-out": {
          from: { opacity: "1" },
          to: { 
            opacity: "0", 
            visibility: "hidden" 
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        // iOS анимации
        "ios-card-entry": "ios-card-entry 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
        "ios-items-entry": "ios-items-entry 0.3s cubic-bezier(0, 0, 0.2, 1) forwards",
        "ios-shimmer": "ios-shimmer 1.5s infinite linear",
        "ios-fade-in": "ios-fade-in 0.3s forwards",
        "ios-fade-out": "ios-fade-out 0.25s forwards",
      },
      transitionTimingFunction: {
        // iOS функции плавности
        "ios-standard": "cubic-bezier(0.25, 0.1, 0.25, 1)",
        "ios-accelerate": "cubic-bezier(0.4, 0.0, 1, 1)",
        "ios-decelerate": "cubic-bezier(0.0, 0.0, 0.2, 1)",
        "ios-bounce": "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        "ios-spring": "cubic-bezier(0.5, 1.75, 0.75, 1.25)",
      },
      backdropBlur: {
        // iOS размытие
        "ios-sm": "10px",
        "ios-md": "20px",
        "ios-lg": "30px",
      },
      // Добавляем линии для многоточия
      lineClamp: {
        1: '1',
        2: '2',
        3: '3',
        4: '4',
        5: '5',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    // Добавляем собственный плагин для line-clamp
    function({ addUtilities }) {
      const newUtilities = {
        '.line-clamp-1': {
          display: '-webkit-box',
          '-webkit-line-clamp': '1',
          '-webkit-box-orient': 'vertical',
          overflow: 'hidden',
          'text-overflow': 'ellipsis',
        },
        '.line-clamp-2': {
          display: '-webkit-box',
          '-webkit-line-clamp': '2',
          '-webkit-box-orient': 'vertical',
          overflow: 'hidden',
          'text-overflow': 'ellipsis',
        },
        '.line-clamp-3': {
          display: '-webkit-box',
          '-webkit-line-clamp': '3',
          '-webkit-box-orient': 'vertical',
          overflow: 'hidden',
          'text-overflow': 'ellipsis',
        },
        '.line-clamp-none': {
          display: 'inline',
          '-webkit-line-clamp': 'unset',
          '-webkit-box-orient': 'horizontal',
          overflow: 'visible',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}
