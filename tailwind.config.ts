/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';
import plugin from 'tailwindcss/plugin'

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
          cyan300: "#67e8f9",
          cyan400: "#22d3ee",
        },
        content: {
          primary: "#f1f5f9",   // 主文本：用于标题、核心强调内容、用户输入 slate-100
          secondary: "#e2e8f0", // 次文本：用于常规正文、主要列表项 slate-200
          muted: "#94a3b8",     // 弱文本：用于辅助说明、副标题、时间戳、次要图标 slate-400
          ghost: "#475569",     // 幽灵文本：用于禁用状态、极弱提示、Placeholder slate-600
        },

        // 辅助色 (标签渐变)
        accent: {
          indigo: '#4f46e5',    // 等级标签文字
          yellow: '#fce300',    // 高亮黄
          // slate100: colors.slate[100],  // obsolete
          // slate200: colors.slate[200],  // obsolete
        },

        // 系统状态色 (工程化必备)
        status: {
          success: colors.emerald[400],
          warning: colors.amber[400],
          error: colors.rose[500],
          info: colors.sky[400],
        },

        // 赛博风格
        cyber: {
          base: '#050510',    // 极暗底色
          surface: '#0a0a20', // 组件表面/Hover色
          panel: '#0a0a1a',   // 浮窗面板底色
          border: 'rgba(255, 255, 255, 0.1)', // 统一替换 border-white/10
          glass: 'rgba(5, 5, 16, 0.8)',       // 统一替换 bg-[#050510]/80 
        }
      },
      zIndex: {
        '1': '1',
        '5': '5',
        'max': '9999',  // 用于顶层弹窗或通知
      },
      blur: {
        'px': '1px', 
        'xs': '3px',        // 微模糊，边缘柔化
        'glow': '14px',     // 元素发光光晕
        'ambient-sm': '80px',  // 小氛围光
        'ambient-md': '100px',    // 标准氛围光
        'ambient-lg': '120px', // 大氛围光
      },
      letterSpacing: {
        'sm': '0.15em',
        'md': '0.2em',
        'lg': '0.3em',
      },
      boxShadow: {
        'glass': '0 0 15px rgba(0,0,0,0.5)',
        'panel': '0 0 30px rgba(0,0,0,0.8)',
        'neon-cyan': '0 0 10px rgba(34,211,238,0.2)',
        'neon-yellow': '0 0 5px rgba(252,227,0,0.4)', // 从 UserCard 提取
        'neon-purple': '0 0 20px rgba(147,51,234,0.3)', // 从 PricingPage 提取
        'neon-purple-lg': '0 0 30px rgba(147,51,234,0.5)',
        'neon-sm': '0 0 10px var(--tw-shadow-color)', // 通用柔和光晕
        'neon-md': '0 0 20px var(--tw-shadow-color)', // 通用标准赛博发光
        'neon-lg': '0 0 30px var(--tw-shadow-color), 0 0 10px var(--tw-shadow-color)', // 通用强烈发光
      },
      // Drop shadow 对原生颜色变量支持有限，定义几个项目主打的语义化光影
      dropShadow: {
        'text-glow': '0 0 5px rgba(255,255,255,0.3)',
        'neon-cyan': '0 0 8px rgba(34,211,238,0.8)',
        'neon-purple': '0 0 15px rgba(168,85,247,0.4)',
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
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.clip-chamfer-tr': {
          clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)',
        },
        '.clip-chamfer-bl': { // Bottom-Left Chamfer
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
        },
        '.clip-chamfer-br': { // Bottom-Right Chamfer
          clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%)',
        }
      })
    })
  ],
}