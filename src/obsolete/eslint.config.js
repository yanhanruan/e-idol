import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

// ⭐️ 修复 1：导入插件的 "主对象"
import eslintReact from '@eslint-react/eslint-plugin'; 
import reactHooks from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';
import reactRefresh from 'eslint-plugin-react-refresh'; // 导入 Vite 刷新插件

export default defineConfig([
  // 1. 基础 JS 规则
  js.configs.recommended,

  // 2. 你的主配置 (合并所有插件)
  {
    files: ['**/*.{js,jsx}'],
    
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    
    // ⭐️ 修复 2：在这里注册所有插件
    plugins: {
      '@eslint-react': eslintReact,
      'react-hooks': reactHooks,
      'import': importPlugin,
      'react-refresh': reactRefresh, // 注册 Vite 插件
    },

    rules: {
      // ⭐️ 修复 3：像这样 "展开" 规则集
      ...eslintReact.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      
      // b. 你自定义的规则

      'no-unused-vars': ['warn'],
      
      // c. Vite 插件规则
      'react-refresh/only-export-components': 'warn',

      // d. 你的 Import 规则 (现在应该可以工作了)
      'import/no-unresolved': 'error',
    },

    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        'node': {
          'caseSensitive': true,
          'extensions': [
            '.js', 
            '.jsx', 
            '.mjs',
            '.json', 
            '.css', // 确保 .css 在这里
            '.scss'
          ]
        }
      },
    },
  },
]);