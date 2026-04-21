/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        vibur: ["Vibur", "cursive"],
        sans: [
          '"Inter"',                  // 优选英文字体
          '"SF Pro Display"',         // Apple 系统字体
          '"PingFang SC"',            // 苹方-简 (Mac中文)
          '"Hiragino Sans"',          // 冬青黑体 (Mac日语/中文)
          '"Noto Sans JP"',           // Google Noto (日语)
          '"WenQuanYi Micro Hei"',    // 文泉驿 (Linux)
          'sans-serif',
          // cross systems
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          '"Open Sans"',
          '"Helvetica Neue"',
        ],
      },
      colors: {
        // 主色调 (Neon Cyber Theme)
        primary: {
          pink: '#f472b6',     // 按钮渐变起点
          purple: '#c084fc',   // 按钮渐变终点
          neonPurple: '#7e0fff', // 卡片辉光左端
          aqua: '#0fffc1',       // 卡片辉光右端
          cyan: '#22d3ee',       
          blue: '#3b82f6',
        },

        // 辅助色 (标签渐变 / 文本)
        accent: {
          indigo: '#4f46e5',    // 等级标签文字
          slate100: '#f1f5f9',  // 主文字
          slate200: '#e2e8f0',  // 次文字
        },

        // 赛博风格
        cyber: {
          base: '#050510',    // 极暗底色
          surface: '#0a0a20', // 组件表面/Hover色
          panel: '#0a0a1a',   // 浮窗面板底色
          border: 'rgba(255, 255, 255, 0.1)', // 统一替换 border-white/10
          glass: 'rgba(5, 5, 16, 0.8)',       // 统一替换 bg-[#050510]/80 
          glassPanel: 'rgba(10, 10, 26, 0.82)'// 统一替换 bg-[#0a0a1ad1] 
        }
      },
      boxShadow: {
        'neon-cyan': '0 0 10px rgba(34,211,238,0.2)',
        'glass': '0 0 15px rgba(0,0,0,0.5)',
        'panel': '0 0 30px rgba(0,0,0,0.8)',
      },
      dropShadow: {
        'text-glow': '0 0 5px rgba(255,255,255,0.3)',
      },
      keyframes: {
        wave: {
          '0%, 100%': {
            height: '50%',
          },
          '50%': {
            height: '86%', // 最大高度 (h-6)
          },
        },
        animateGlow: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        autoLift: {
          '0%, 40%, 100%': { transform: 'translateY(0)' },
          '60%, 80%': { transform: 'translateY(-5px)' },
        },
        autoGlow: {
          '0%, 40%, 100%': { opacity: '0', transform: 'scale(1.0)' },
          '60%, 80%': { opacity: '0.8', transform: 'scale(1.15)' },
        },
        autoShine: {
          '0%, 50%, 100%': { transform: 'translateX(-150%) skewX(-30deg)' },
          '65%': { transform: 'translateX(250%) skewX(-30deg)' },
        },
        blink: {
          "78%": {
            color: "inherit",
            textShadow: "inherit",
          },
          "79%": {
            color: "#333",
          },
          "80%": {
            textShadow: "none",
          },
          "81%": {
            color: "inherit",
            textShadow: "inherit",
          },
          "82%": {
            color: "#333",
            textShadow: "none",
          },
          "83%": {
            color: "inherit",
            textShadow: "inherit",
          },
          "92%": {
            color: "#333",
            textShadow: "none",
          },
          "92.5%": {
            color: "inherit",
            textShadow: "inherit",
          },
        },
        "blink-opacity": { // <-- 重命名并优化
          "78%": {
            opacity: 1,
          },
          "79%": {
            opacity: 0,
          },
          "80%": {
            opacity: 0,
          },
          "81%": {
            opacity: 1,
          },
          "82%": {
            opacity: 0,
          },
          "83%": {
            opacity: 1,
          },
          "92%": {
            opacity: 0,
          },
          "92.5%": {
            opacity: 1,
          },
        },
        dropdownFadeIn: {
          'from': {
            opacity: 0,
            transform: 'translateY(-4px)'
          },
          'to': {
            opacity: 1,
            transform: 'translateY(0)'
          },
        },

      },
      animation: {
        'dropdown-fade-in': 'dropdownFadeIn 120ms ease-out',
        wave: 'wave 1.2s ease-in-out infinite',
      },
      // Define the custom cubic-bezier for the shine
      ease: {
        'shine': 'cubic-bezier(0.23, 1, 0.32, 1)',
      }
    },
  },
  plugins: [],
}