# Global Development Workflow (全局 AI 协作工作流)

## 0. 核心思考模型 (Critical Thinking)

在执行任何代码编写前，你必须先进行 **思考** 过程：

1. **意图分类与路由**
   - 判断用户意图：`[Feature]` / `[Bugfix]` / `[Refactor]`
   - 识别涉及的范围：纯前端 / 纯后端 / 前后端联调
   - 如需跨 Pipeline 编排，明确执行顺序

2. **上下文检索**
   - 前端相关任务 → 查阅 `.ai/frontend_arch.md`（组件结构、i18n、TypeScript 规则）
   - 后端相关任务 → 查阅 `.ai/backend_arch.md`（目录职责、Gin/GORM 规范、API 响应格式）
   - 两者均涉及 → 同时查阅两份规范，确认联调接口契约

3. **计划输出**
   - 给出你的执行计划，在用户确认后再开始输出代码

---

## 1. 任务路由与专属流水线 (Pipelines)

### 🔴 Pipeline A: 新功能开发 (Feature Development)
**适用场景**：用户要求增加新页面、新组件或新 API。

- **Step 1: 架构设计与确认**
  - **前端**（参考 `.ai/frontend_arch.md`）：
    - 确定组件层级：`ui/`（无状态原子组件） vs `features/`（业务复合组件）
    - 状态管理决策：全局 `contexts/` vs 局部 `useState`
    - 严禁在业务逻辑中使用 `any`；使用 `TranslationValue` 时做局部窄化断言
  - **后端**（参考 `.ai/backend_arch.md`）：
    - 确定所属目录：`handlers/` / `models/` / `websocket/` / `middleware/`
    - 定义 GORM 模型（`internal/models/`）、API 路由（`internal/routes/`）、Handler 签名
    - API 响应强制遵循 `{ code, message, data }` 统一结构

- **Step 2: 核心代码实现**
  - 按对应规范编写核心逻辑
  - **UI 强制遵循赛博朋克审美**
  - 后端 Handler 保持整洁：复杂逻辑和数据库查询应提取至独立函数
  - 禁止跨层污染（如 `internal/models/` 不得引入 `gin` 包）

- **Step 3: 国际化 (i18n) 注入**
  - 仅前端任务需要
  - 提取所有硬编码文本至 `translations` 数据源
  - 通过 `const { t } = useTranslations()` + `String(t.key)` 替换
  - 静态文案禁止存入 `useState` 消息数组（消息数组仅存储用户动态输入）
  - Header 切换语言时，确保消费 `t` 的组件能自动重绘

- **Step 4: 边界与自测 (Edge Cases)**
  - 前端：Loading / Empty / Error / Timeout / Permission Denied / Responsive Layout
  - 后端：参数校验边界、数据库查询异常、Token 失效、WebSocket 断线重连
  - 组件重绘性能检查（避免不必要的 re-render）

- **Step 5: 测试**
  - 前端：为核心逻辑补充单元测试
  - 后端：为 Handler / Service 补充单元测试 / 集成测试
  - 提交前确保测试通过且不影响已有用例

---

### 🔵 Pipeline B: 缺陷修复 (Bugfix)
**适用场景**：样式错乱（Tailwind）、逻辑报错（React / Gin）、跨端兼容性问题。

- **Step 1: 诊断与定位**
  - 分析 Bug 成因（例如：Tailwind 类冲突、React 状态竞态、GORM 查询条件缺失、WebSocket 心跳超时）
  - 检查浏览器控制台报错 / 后端日志 / Go panic stacktrace
  - 阐述定位结论，而非猜测

- **Step 2: 最小侵入式修复**
  - 提供修复方案，**严禁**大面积重构原本正常的代码
  - UI 修复：确保不破坏项目原有的原子组件（`src/components/ui/`）一致性
  - 后端修复：保持 Handler → Model 的调用链，不跨越目录职责边界
  - 修复后检查 TypeScript 类型安全（`any` 禁令）或 Go 编译无报错

- **Step 3: 回归验证**
  - 说明该修复可能影响到的其他模块
  - 执行对应模块的测试，确保不产生回归
  - 提示用户进行交叉验证

---

### 🟢 Pipeline C: 代码重构 (Refactor)
**适用场景**：优化性能、抽取公共组件、清理冗余代码、提升代码质量。

- **Step 1: 痛点分析**
  - 指出当前代码的坏味道（Smell）
  - 前端：不必要的 re-render、重复的 Tailwind 类、违反 `禁止 any` 规则、i18n 硬编码
  - 后端：Handler 过度臃肿、跨层污染、未使用统一响应格式、数据库查询 N+1

- **Step 2: 安全网建立**
  - 确保重构目标有足够的测试覆盖作为安全网
  - 如测试缺失，先补充关键用例再开始重构

- **Step 3: 渐进式重构**
  - 保证输入输出（I/O）不变的情况下，替换内部实现
  - 前端：保持组件 Props 签名不变；后端：保持 API 响应 `{ code, message, data }` 结构不变
  - 每次变更控制在单个模块内，避免一次性跨层修改

- **Step 4: 验证与基准对比**
  - 量化重构收益（如：组件重绘次数减少、API 响应时间缩短、代码行数减少）
  - 执行完整测试套件，确保绿色通过
  - 校验 TypeScript 编译 / Go 编译无报错

---

## 2. 交付与 Commit 规范 (Quality & Delivery)

每完成一个完整的 Pipeline 操作，需输出对应的 Conventional Commit Message：

- **格式**：`<type>(<scope>): <short_english_description>`
- **Type 选项**：`feat` | `fix` | `refactor` | `chore` | `perf`
- **scope**：必须具体到组件名（前端）或服务/目录名（后端）
  - 前端示例：`feat(GlobalChat): add message pagination`
  - 后端示例：`fix(auth-handler): correct token expiry check`
- **Commit 前检查清单**：
  - [ ] TypeScript 编译无报错（`npx tsc --noEmit`）
  - [ ] Go 编译无报错（`go build ./...`）
  - [ ] 前端 / 后端测试通过
  - [ ] 未引入 `any` 类型（前端）或跨层污染（后端）
  - [ ] API 响应格式符合 `{ code, message, data }` 规范（后端变更时）
