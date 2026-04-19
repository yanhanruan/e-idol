# Style & Design Guide (赛博朋克 UI 规范)

## 1. 核心视觉理念
- **风格定义**：Cyberpunk / Neon / Glassmorphism (玻璃态)。
- **背景层级**：
  - 基础背景：`#050510` (极深蓝黑)。
  - 容器背景：`#0a0a1a` 配合 `80/90` 的不透明度，必须带 `backdrop-blur-md` 或更高级别的模糊。
- **边框与阴影**：
  - 边框：统一使用 `border-white/10` 或 `border-cyan-500/30`。
  - 辉光 (Glow)：禁止直接使用生硬的 `drop-shadow`。必须通过绝对定位的 `div` 结合 `bg-gradient` 和 `blur` 属性手动构建（参考 CyberButton）。

## 2. Tailwind 配置消费

严格使用 `tailwind.config.ts` 中定义的 Token

- **颜色 Token**：
  - 高亮主色：`text-primary-aqua` (或 `cyan-400`)。
  - 强调副色：`text-primary-purple` (或 `purple-500`)。
  - 文本：主文 `text-accent-slate100`，次文 `text-accent-slate200`。
- **动画曲线**：
  - 扫光/位移必须使用 `ease-shine` (自定义三次贝塞尔)。
  - 霓虹呼吸使用 `animate-animateGlow`。

## 3. 原子组件规范
- **禁止指令**：严禁在业务页面直接手写原生 HTML 标签（如 `<button>`, `<select>`）并赋予复杂样式。
- **强制复用**：
  - 按钮 -> `CyberButton`
  - 下拉框 -> `CyberSelect`
  - 标题 -> `PageTitle`
- **修改限制**：若需微调原子组件外观，优先通过 `className` 透传，不要轻易修改原始组件逻辑。