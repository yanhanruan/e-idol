- Global Development Workflow (全局 AI 协作工作流)

## 0. 开发环境声明 (Environment)
- **OS**: Windows10
- **Shell**: PowerShell 7+
- **路径风格**: Windows (`\`)，脚本输出应避免使用 bash/zsh 专属语法

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

  ### 🟡 Pipeline D: 审查、分析与报告 (Audit, Analysis & Report)

  **适用场景**：模块进度梳理、前端资产统计、代码缺陷审查、前瞻性技术调研。
  
  - **Step 1: 确定单一目标 (Single Responsibility Target)**
    - 每次触发本流水线，**必须且只能选择以下一项**执行，严禁跨界或参杂其他类型的信息：
      1. **Progress (进度与架构)**：仅梳理已完成的 API、表结构、组件树。**严禁包含**任何对代码质量的评价或 Bug 审查。
      2. **Stats (资产统计)**：仅针对特定指标（如 `w`, `h`, `p`, `gap` 频次、组件复用率）进行客观的数据提取与汇总。
      3. **Audit (缺陷与代码审查)**：仅寻找代码中的逻辑漏洞、性能瓶颈、竞态条件或未处理的边缘边界 (Edge Cases)。
      4. **Spike (前瞻调研)**：仅对外部技术方案、第三方库或架构选型进行可行性与优劣对比。
  - **Step 2: 深度检索与逻辑诊断 (Extraction & Diagnosis)**
    - 严格围绕 Step 1 选定的单一目标，遍历本地目标代码或检索线上文档。
  - **Step 3: 物理输出与归档规范 (Output & Archiving)**
    - 报告必须以 Markdown 格式输出至本地 `.reports/` 目录的对应子文件夹下。
    - **文件命名强制包含日期**，格式为 `YYYY-MM-DD_<自定义简短英文名称>.md`。
  - **Step 4: 审核与决策网关 (Review & Decision Gate)**
    - 报告末尾必须包含结构化的“后续行动建议 (Action Items)”。
    - **强制拦截**：报告生成后本流水线即刻终止。绝对禁止系统自动触发 Pipeline A/B/C。
    - 等待人类开发者审阅报告内容，并下达后续决策指令。
  
  
  
  ---
  
  ## 2. 交付与 Commit 规范 (Quality & Delivery)
  
  每完成一个完整的 Pipeline 操作，需输出对应的 Conventional Commit Message 建议：
  - **格式**：`<type>(<scope>): <short_english_description>`
  - **Type 选项**：`feat`, `fix`, `refactor`, `chore`, `perf`
  - **注意**：scope 必须具体到组件名或服务名。