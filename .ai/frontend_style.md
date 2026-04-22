# Style & Design Guide (赛博朋克 UI 规范)

## 1. 核心视觉与基础原子规范
- **风格定义**：Cyberpunk / Neon / Glassmorphism (玻璃态)。
- **背景层级**：统一使用语义化颜色，如基础背景 `bg-cyber-base`，容器背景 `bg-cyber-surface`。
- **自定义修饰符（强制）**：
  - 发光模糊：核心特效使用 `blur-glow`(14px)；氛围光按场景分级使用 `blur-ambient-sm`(80px) / `blur-ambient-md`(100px) / `blur-ambient-lg`(120px)。
  - 特殊字距：`tracking-sm`(0.15em) 用于小号强调，`tracking-md`(0.2em) 用于副标题，`tracking-lg`(0.3em) 用于大字号 Slogan/主标题。
- **多边形裁剪 (Clip-Path)**：
  - 严禁在代码中写死任意值 `[clip-path:...]`。
  - 强制使用预设工具类：`.clip-chamfer-tr`, `.clip-chamfer-bl` (左下倒角), `.clip-chamfer-br` (右下倒角)。

## 2. 颜色 Token 与文本规范
**绝对限制：严禁使用 Tailwind 默认的 slate/gray 等色系，必须使用 config 中的内容。**

- **主副基调**：
  - 主文本：`text-content-primary`
  - 次文本：`text-content-secondary`
  - 弱文本/幽灵：`text-content-muted` 或 `text-content-ghost`
- **高亮与强调**：
  - 青/蓝系：`text-primary-aqua` / `text-primary-cyan400`
  - 紫/粉系：`text-primary-purple` / `text-primary-neonPurple`
  - 警示/点缀：`text-accent-yellow`



## 3. 原子组件规范
- **禁止指令**：严禁在业务页面直接手写原生 HTML 标签（如 `<button>`, `<select>`）并赋予复杂样式。
- **强制复用映射**：
  - 按钮 -> `<CyberButton />`
  - 下拉框 -> `<CyberSelect />`
  - 标题 -> `<PageTitle />`
- **修改限制**：若需微调原子组件外观，优先通过 `className` 透传，严禁修改原始组件内部的样式逻辑。

## 4. 光影与色彩协同规范 (Glow & Color Harmony)

**⚠️ 前置豁免声明**：本节中定义的 `shadow-neon-*` 与 `drop-shadow-neon-*` 为 Tailwind 预设的自定义 Token，**豁免**第 1 节中对原生阴影的禁用限制。但依然**绝对禁止**使用带有硬编码色值的任意值（如 `shadow-[0_0_20px_rgba(...)]`）。

### 4.1 色彩同频绑定原则 (Color Harmony Binding)
光影的颜色必须与该组件内部的主色调（Text / Border / Background）保持严格同频。AI 在生成组件时，需根据元素的颜色动态推理并应用对应阴影，严禁“张冠李戴”：

| 核心发光元素主色调                          | 对应的矩形阴影 (Box Shadow) | 对应的异形阴影 (Drop Shadow) |
| :------------------------------------------ | :-------------------------- | :--------------------------- |
| `*-primary-cyan-*` / `*-primary-aqua`       | `shadow-neon-cyan`          | `drop-shadow-neon-cyan`      |
| `*-primary-purple` / `*-primary-neonPurple` | `shadow-neon-purple`        | `drop-shadow-neon-purple`    |
| *-accent-yellow                             | `shadow-neon-yellow`        | -                            |

### 4.2 光影决策逻辑（授权 AI 思考场景）

光影并非必需品，滥用会导致严重的视觉疲劳。AI 在构建组件时，必须独立思考业务场景，按以下准则决策是否应用发光效果：

- **强制触发场景**：核心 Call to Action 按钮的交互反馈（Hover / Active）、带有关键指标数字的卡片、页面主 Slogan（如 `<PageTitle />`）。
- **绝对禁止场景**：大段常规正文、次要辅助按钮、禁用状态（Ghost）、大面积的基础背景容器。
- **形态匹配规则**：规则的容器盒子优先使用 `shadow-*`；不规则图形（SVG Icon、单行渐变文本）必须使用 `drop-shadow-*` 以贴合内容边缘。

### 4.3 行为规范示例

✅ **正确示例（色彩同频，且基于状态合理触发）**:
```tsx
// 容器应用青色交互阴影，子文本匹配青色系
<div className="border border-primary-cyan-400 hover:shadow-neon-cyan transition-shadow">
  <span className="text-primary-cyan-300">System Online</span>
</div>

// 不规则 Icon 使用同频的 Drop Shadow
<Icon className="fill-primary-purple drop-shadow-neon-purple" />
```

❌ **错误示例（严禁出现的模式）**:

```
// 错误 1：颜色串台（紫色文字配了青色光影）
<div className="text-primary-purple shadow-neon-cyan">...</div>

// 错误 2：无视预设配置，强行使用任意值硬编码
<button className="drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">...</button>
```



## 5. Tailwind 原生类边界管控 (Whitelist & Blacklist)

为确保 Cyberpunk 视觉规范的纯粹性与全局状态管理，AI 在使用 Tailwind 默认原子类时，**必须严格遵守**以下黑白名单：

### 🚫 绝对禁止 (Blacklist)
一旦触发以下行为，视为严重违反设计系统：
1. **禁用原生色彩**：严禁使用任何 Tailwind 默认色板（如 `bg-gray-800`, `text-red-500`, `border-blue-400`）。必须使用 config 中的 `cyber.*`, `primary.*`, `content.*`, `status.*`。
2. **禁用原生阴影**：严禁使用 `shadow-sm`, `shadow-md`, `shadow-xl` 等黑灰阴影。所有阴影必须来自 `shadow-neon-*`, `shadow-glass`, `shadow-panel` 或对应的 `drop-shadow-*`。
3. **禁用任意值 (JIT)**：严禁在代码中写死硬编码的任意值，如 `w-[133px]`, `text-[#ff0000]`, `bg-[rgba(10,10,16,0.5)]`。必须依赖预设的间距系统和 `cyber.glass` 等语义化 Token。
4. **警惕过度圆角**：Cyberpunk 倾向于硬朗风格，非特殊组件（如头像）严禁滥用 `rounded-3xl` 或 `rounded-full`。推荐使用原生 `rounded-none`, `rounded-sm`, 或多边形倒角工具类。

### ✅ 完全放行 (Whitelist)

以下 Tailwind 原生工程化工具类，AI 可根据排版与布局需求自主决策，自由组合：
1. **布局与栅格**：`flex`, `grid`, `absolute`, `relative`, `z-*`（除弹窗外的常规层级）, `items-center`, `justify-between` 等。
2. **间距与尺寸**：`w-full`, `max-w-*`, `h-screen`, `p-4`, `mx-auto`, `gap-2` 等基于 4px 乘数系统的基础类。
3. **排版比例**：`text-xs` 到 `text-4xl` 等字体大小，`font-normal` 到 `font-black` 等字重控制（注意：字色仍受黑名单管控）。
4. **状态伪类组合**：鼓励合理使用 `hover:`, `focus:`, `active:`, `group-hover:`, `peer-checked:` 等伪类来搭配预设的光影与色彩变化（例如：`hover:shadow-neon-cyan`）。
