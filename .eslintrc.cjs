const path = require('path'); // <--- 1. 导入 path 模块

// 文件名: .eslintrc.cjs
module.exports = {
  // 1. 定义环境
  env: {
    browser: true,
    es2021: true,
    node: true, // 确保 node 环境也被识别
  },

  // 2. 继承推荐配置 (这是 v8 的核心)
  extends: [
    "eslint:recommended", // ESLint 官方基础规则 (会开启 "no-undef" 规则)
    "plugin:@typescript-eslint/recommended", 
    "plugin:react/recommended", // React 核心规则
    "plugin:react-hooks/recommended", // React Hooks 规则 (!!!)
    "plugin:import/recommended",
    "plugin:import/typescript",  
  ],

  // 3. 插件列表
  plugins: [
    "@typescript-eslint", 
    "react",
    "react-hooks",
    "react-refresh", // Vite 热更新
    "import",
  ],

  // ↓ 新增 TypeScript 解析器
  parser: "@typescript-eslint/parser",
  // 4. 解析器选项
  parserOptions: {
    ecmaVersion: "latest", // 使用最新 JS 语法
    sourceType: "module", // 支持 ES Modules
    ecmaFeatures: {
      jsx: true, // 启用 JSX
    },
  },

  // 5. 规则配置
  rules: {
    // Vite HMR 规则
    "react-refresh/only-export-components": "warn",

    // React 17+ 新 JSX 转换 (您的 React 19 需要)
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "no-unused-vars":"off",
    "@typescript-eslint/no-unused-vars": "warn",
  },

  // 6. 自动检测 React 版本
  settings: {
    react: {
      version: "detect",
    },
    "import/resolver": {
      alias: {
        map: [
          ['@src', path.resolve(__dirname, './src')],
          ['@assets', path.resolve(__dirname, './src/assets')]
        ],
        extensions: [".js", ".jsx", ".mjs", ".ts", ".tsx"] // 保持扩展名
      },
      typescript: {
        alwaysTryTypes: true,
        project: "./tsconfig.json",
      },
      node: {
        extensions: [".js", ".jsx", ".mjs", ".ts", ".tsx"]
      }
    },
  },

  // 7. 忽略文件
  ignorePatterns: ["dist", "node_modules", "build", ".vite"],
};