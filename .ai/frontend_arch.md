# Architecture & Data Flow Guide (架构与数据流规范)

## 1. 文件夹职责 (Folder Responsibility)
- `src/components/ui`：存放纯粹的、无状态的原子组件。
- `src/components/features`：存放带有业务逻辑的复合组件（如 GlobalChat）。
- `src/contexts/`：存放全局状态管理（如语言切换、过渡动画）。

## 2. 国际化 (i18n) 处理流程
- **单一数据源**：UI 渲染所需的静态文本严禁存放在局部 `useState` 中。
- **消费方式**：
  - 必须通过 `const { t } = useTranslations();` 钩子获取翻译对象。
  - 使用 `String(t.key)` 或局部断言 `(t.key as string)` 确保类型安全。
- **状态剥离**：
  - 静态欢迎语（Welcome Message）应直接从 `t` 中渲染，不进入消息数组。
  - 消息数组（State）仅存储用户输入的动态内容。
- **同步更新**：Header 切换语言时，所有消费 `t` 的组件必须能够实时重绘（通过 Context 自动触发）。

## 3. TypeScript 严谨性
- **禁止 Any**：除非是 `TranslationMap` 这种极特殊的泛型兜底，否则禁止在业务逻辑中使用 `any`。
- **局部断言**：针对 `TranslationValue` 的联合类型，推荐在组件内部使用 `(t.xxx || {}) as Record<string, string>` 进行局部窄化。