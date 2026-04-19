- Global Development Workflow (全局 AI 协作工作流)

  ## 0. 核心思考模型 (Critical Thinking)

  在执行任何代码编写前，你必须先进行 `<thinking>` 过程：

  1. 分析当前用户的意图是 `[Feature]`, `[Bugfix]`, 还是 `[Refactor]`。
  2. 检索并确认相关的全局上下文（是否需要调用前端规范或后端规范）。
  3. 给出你的执行计划，并在用户确认后再开始输出代码。

  ---

  ## 1. 任务路由与专属流水线 (Pipelines)

  ### 🔴 Pipeline A: 新功能开发 (Feature Development)
  **适用场景**：用户要求增加新页面、新组件或新 API。
  - **Step 1: 架构设计与确认**
    - 前端：定义组件结构、状态流转（区分全局 Context 与局部 State）。
    - 后端：定义表结构（PostgreSQL）和 REST/GraphQL API 契约。
  - **Step 2: 核心代码实现**
    - 按规范编写核心逻辑。文本内容强制使用中文占位，UI 强制遵循赛博朋克审美。
  - **Step 3: 国际化 (i18n) 注入 [仅前端]**
    - 提取所有硬编码文本，同步至 `translations` 数据源，使用 `useTranslations` 替换。
  - **Step 4: 边界与自测 (Edge Cases)**
    - 检查 Loading/Error 状态。
    - 检查组件重绘性能。

  ### 🔵 Pipeline B: 缺陷修复 (Bugfix)
  **适用场景**：样式错乱、逻辑报错、跨端兼容性问题。
  - **Step 1: 复现与定位**
    - 阐述你对 Bug 成因的猜测（例如：绝对定位导致的闪烁、Safari/WebKit 特有的渲染 BUG、状态竞态条件）。
  - **Step 2: 最小侵入式修复**
    - 提供修复方案。**严禁**为了修复一个 bug 而大面积重构原本正常的代码。
    - 对于 UI 修复，确保修改不破坏项目原有的原子组件一致性。
  - **Step 3: 回归验证**
    - 说明该修复可能会影响到的其他模块，并提示用户进行交叉验证。

  ### 🟢 Pipeline C: 代码重构 (Refactor)
  **适用场景**：优化性能、抽取公共组件、清理冗余代码。
  - **Step 1: 痛点分析**：指出当前代码的坏味道（Smell）。
  - **Step 2: 渐进式重构**：保证输入输出（I/O）不变的情况下，替换内部实现。

  ---

  ## 2. 交付与 Commit 规范 (Quality & Delivery)
  每完成一个完整的 Pipeline 操作，需输出对应的 Conventional Commit Message 建议：
  - **格式**：`<type>(<scope>): <short_english_description>`
  - **Type 选项**：`feat`, `fix`, `refactor`, `chore`, `perf`
  - **注意**：scope 必须具体到组件名或服务名。