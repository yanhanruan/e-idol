# Style & Design Guide (UI 规范)

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

- **可以触发场景**：核心 Call to Action 按钮的交互反馈（Hover / Active）、带有关键指标数字的卡片、页面主 Slogan（如 `<PageTitle />`）。
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

### ✅ 完全放行 (Whitelist)

以下 Tailwind 原生工程化工具类，AI 可根据排版与布局需求自主决策，自由组合：
1. **布局与栅格**：`flex`, `grid`, `absolute`, `relative`, `z-*`（除弹窗外的常规层级）, `items-center`, `justify-between` 等。
2. **间距与尺寸**：`w-full`, `max-w-*`, `h-screen`, `p-4`, `mx-auto`, `gap-2` 等基于 4px 乘数系统的基础类。
3. **排版比例**：`text-xs` 到 `text-4xl` 等字体大小，`font-normal` 到 `font-black` 等字重控制（注意：字色仍受黑名单管控）。
4. **状态伪类组合**：鼓励合理使用 `hover:`, `focus:`, `active:`, `group-hover:`, `peer-checked:` 等伪类来搭配预设的光影与色彩变化（例如：`hover:shadow-neon-cyan`）。

## 	6. 圆角形态规范 (Rounding Preference)

**AI 约束：** 项目整体必须呈现“外圆内方”且层次分明的现代赛博风格，严格按以下层级应用圆角工具类，严禁随意混用：

- **`rounded-full` (极度圆润)**：**仅限**核心交互按钮 (Primary Buttons)、用户头像、状态指示灯、氛围修饰球。
- **`rounded-2xl` (一级包裹)**：**仅限**主要界面容器（主卡片）、登录/注册等 Auth 面板、Modal 全局弹窗。
- **`rounded-xl` (二级包裹)**：适用于聊天气泡、次级信息容器、导航下拉弹窗。
- **`rounded-lg` (标准功能体)**：强制用于常规功能性组件，如下拉选项区、正文内容块、输入框 (Inputs)。
- **`rounded-md / rounded-sm` (细微软化)**：小图标背景、极小元素的边缘（如音频波动条）修饰。



## 7. 抽象网格与组件排版范式 (Sizing, Spacing & Grid Paradigm)

### 7.1 间距系统 (Spacing)

- **微小间距 (0.5~2)**: `gap-1.5`, `gap-2`, `space-x-1`, `space-x-2`, `px-1.5`, `py-1`, `py-2`，以及垂直约束 `mb-0.5`, `mb-1`, `mb-2`。主要用于标签、小图标与文字之间、细微的内部对齐，维持赛博朋克风格的高密度信息感，也常用于将标题与副标题紧密绑定为一个整体。
- **常规间距 (3~4)**: `p-3`, `px-4`, `gap-3`, `space-x-3`, `space-y-3`，以及垂直约束 `mb-3`, `mb-4`。主要用于卡片内边距、常规组件元素之间的排版，或作为内部内容段落、图标与区块标题之间的分隔。
- **大间距/区块间距 (6~12)**: `px-6`, `py-8`, `space-x-8`，以及垂直约束 `mb-6`, `mb-8`, `mb-12`。主要用于页面级容器的内外边距、主要导航项之间的距离。其中 `mb-12` 作为顶级规范，专门用于大页面中核心区块（Major Block，如各个 Section）之间的垂直分隔。

### 7.2 尺寸与边界 (Sizing & Constraints)

- __页面级约束__: `max-w-7xl mx-auto`，用于控制全局最大宽度并居中。
- __组件级约束__: `w-72 sm:w-80 md:w-88` (聊天框等悬浮面板)，`min-w-[200px]`, `max-h-[400px]` (下拉菜单等)。
- __原子尺寸__: `w-8 h-8`、`w-4 h-4`、`w-3 h-3`。常用于圆形按钮、图标、状态圆点，通过等宽高等比例保持正圆或正方形。

### 7.3 排版紧凑度 (Typography)

- __字号体系__: 偏向使用较小字号实现精致感，如 `text-2xs`, `text-xs`, `text-sm`。使用 CSS 变量进行跨断点响应式字号如 `[font-size:var(--font-name-base)]`。

- __字距搭配__:

  - `tracking-wide` / `tracking-wider` 搭配 `text-xs` 或 `text-sm`，增加阅读呼吸感，特别是在赛博朋克风格的大写字母、标签中。
  - `tracking-widest` 用于导航等强调元素。

- __行高搭配__:

  - `leading-none` 搭配小字号标签（如 `text-2xs`）确保标签高度紧凑无多余空白。
  - `leading-relaxed` 搭配聊天气泡或大段文本，提升阅读体验。

- __字体族__: 混合使用 `font-sans`（主体）、`font-mono`（装饰性标签、特定数字）。

### 7.4 响应式策略 (Responsiveness)

- **移动端优先**: 默认写移动端样式，然后通过 `sm:`, `md:`, `lg:` 进行覆盖。
- **布局方向改变**: 例如导航栏在移动端折叠 (`md:hidden` + 绝对定位弹窗)，在桌面端水平展开 (`md:flex`, `space-x-8`)。
- **尺寸与留白放大**:
  - 容器尺寸: `w-72 sm:w-80 md:w-88`，随屏幕变大而加宽。
  - 容器高度: `h-14 md:h-12`，在某些场景下移动端可能需要更大高度方便点击，桌面端则变得紧凑。
  - 边距放大: `px-4 sm:px-6 lg:px-8`，屏幕越大两边留白越多。
  - 字体大小: `[font-size:var(--font-name-base)] md:[font-size:var(--font-name-md)]`。
- **桌面端垂直压缩 (Desktop Vertical Compression)**: 这是一个特定的反向排版规律。在特定表单或聚焦视图（如认证页面）中，移动端为了拉开层级会使用大垂直间距（如 `mb-6`, `mb-8`），而在桌面端会大幅压缩垂直间距（如 `md:mb-1`, `md:mb-2`），以保持视线的聚焦和组件的高密度紧凑感。

### AI 布局范式决策表

| 情景 / 组件类型                 | 间距 (Spacing)                             | 尺寸与边界 (Sizing)                     | 排版 (Typography)                                            | 响应式策略 (Responsive)                        |
| :------------------------------ | :----------------------------------------- | :-------------------------------------- | :----------------------------------------------------------- | :--------------------------------------------- |
| **页面级容器 / 外层布局**       | `py-8 px-4` (随屏幕增大 `sm:px-6 lg:px-8`) | `max-w-7xl mx-auto`, `w-full`           | -                                                            | 增加两侧安全区留白，从单列变为多列布局。       |
| **导航栏 / 顶部 Header**        | 内部元素 `space-x-2` 到 `space-x-8`        | `h-14` (移动端) -> `md:h-12` (桌面端)   | `text-xs`, `font-medium`, `tracking-widest`                  | `md:flex` 展开导航，`md:hidden` 收起汉堡菜单。 |
| **卡片内层 / 列表项**           | `p-3`, `space-y-2`, `gap-2`, `gap-3`       | 宽度通常由 Grid/Flex 控制，占满父容器。 | `text-sm`, 搭配响应式 CSS 变量控制字体。                     | 使用 `md:p-*` 放大内边距，提升呼吸感。         |
| **标签 / 微小装饰 (Tag/Badge)** | `px-1.5 py-1`, `px-2 py-0.5`, `gap-1.5`    | 宽度自适应 `w-fit`, `flex-shrink-0`     | `text-2xs`, `font-bold`, `leading-none`, `tracking-wider`, 常搭 `font-mono` | 基本保持一致，不随断点发生巨变。               |
| **图标按钮 / 交互控件**         | 内部居中无特定 Padding                     | `w-8 h-8` (常规), `w-4 h-4` (图标本身)  | -                                                            | 桌面端增加 hover 效果 (`hover:scale-105`)。    |
| **对话气泡 / 文本块**           | `p-2.5`                                    | `max-w-[85%]`                           | `text-xs`, `leading-relaxed`, `tracking-wide`                | 悬浮面板随屏幕变宽：`w-72 sm:w-80 md:w-88`。   |
| **表单输入框 / Select**         | `px-3 py-1.5`                              | `flex-1` 或占据指定宽度                 | `text-xs`, `placeholder:text-content-secondary`              | -                                              |

## 8. 响应式网页设计 (RWD Strategy)

**AI 约束：** 项目的响应式策略严禁采用简单的“视觉隐藏”，必须遵循**“组件重组与交互降级”**的核心逻辑。AI 在生成布局代码时，必须严格执行以下三套矩阵规范：

### 8.1 抽象网格布局矩阵 (Density-Based Grid Paradigm)

**AI 约束：** 当生成新的列表或网格组件时，严禁试图去硬套旧有业务名称。AI 必须首先评估目标组件的**“信息密度 (Information Density)”**与**“基础纵横比 (Aspect Ratio)”**，将其归类至以下 4 种抽象视觉范式之一，并严格执行对应的响应式 `grid-cols-*` 列数阶梯，以确保从 Mobile 到 XL 端的视觉平衡：

| **组件视觉形态 (Visual Archetype)**   | **特征描述与适用场景 (Characteristics)**                     | **Mobile** | **sm (640px)** | **md (768px)** |
| ------------------------------------- | ------------------------------------------------------------ | ---------- | -------------- | -------------- |
| **Type A: 微型/致密元素 (Micro)**     | 仅包含图标、小头像、微型徽章。阅读负担极低，适合高密度平铺。 | `cols-4`   | `cols-4`       | `cols-6`       |
| **Type B: 纵向标准卡片 (Portrait)**   | 强调视觉展示的纵向卡片（如人物立绘卡、海报、简单图片项）。横向信息少。 | `cols-2`   | `cols-3`       | `cols-3`       |
| **Type C: 横向/高密卡片 (Landscape)** | 包含图文混排、多行文字摘要、操作按钮的复杂卡片。必须保证足够的横向阅读空间。 | `cols-1`   | `cols-1`       | `cols-2`       |
| **Type D: 宽幅区块/数据面板 (Wide)**  | 数据统计看板、定价套餐表、多列对比区块。单项需要极大的页面面积来承载结构化数据。 | `cols-1`   | `cols-1`       | `cols-2`       |

### 8.2 全面字号 (Text Size) 缩放规律

禁止随意指定响应式字号。必须区分“视觉冲击类”与“功能阅读类”两套机制：

- **H1/标题类 (Dramatic Scale)**：强制执行大跨度缩放以维持视觉张力。
  - **Logo/品牌**: `text-2xl` → `md:text-3xl`
  - **Hero Title**: `text-2xl` → `md:text-2xl`
  - **Section Title**: `text-xl` → `md:text-2xl`
- **Body/功能类 (Subtle Scale)**：以可读性为核心，进行微调或反向优化。
  - **常规正文**: `text-sm` 或 `text-xs` (Mobile) 保持稳定，桌面端略增。
  - **动态变量**: 姓名等关键字段优先使用 `[font-size:var(--font-name-base)]` 配合媒体查询微调。
  - **按钮文字**: 允许出现“反向缩小”（如 `text-sm` → `md:text-xs`），以适配桌面端更紧凑的 UI 布局。

### 8.3 动态显隐与组件级交互降级

严禁滥用 `hidden` 进行简单裁切。AI 必须通过 `hidden/block/flex` 的切换实现“同一数据、两套逻辑”：

- **导航重组 (Header Reconstruction)**：
  - 桌面端：`<nav className="hidden md:flex">` 居中排列。
  - 移动端：对应兄弟组件为 `<button className="md:hidden">`（汉堡菜单），交互目标必须折叠入 `absolute top-full` 的抽屉菜单。
- **视觉效果降级 (Visual Performance)**：
  - 桌面端：启用高性能 3D 背景或高分辨率立绘。
  - 移动端：通过 `md:hidden` 切换为低透明度、模糊处理的轻量化背景，确保窄屏下的文字对比度。
- **交互形态转换 (Form Transformation)**：
  - **移动端**：倾向于“图标化”与“圆形化”（如 `w-9 h-9 rounded-full`），适配指尖触控。
  - **桌面端**：恢复为“列表化”与“长条化”（如 `w-36 h-auto`），适配鼠标精准交互。

### 8.4 响应式设计哲学 (RWD Philosophy)

AI 生成的每一行响应式代码都应体现：**移动端重触控、重纵向流动；桌面端重视觉冲击、重信息密度、重横向平衡。**
