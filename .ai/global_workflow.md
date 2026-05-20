- Global Development Workflow

## 0. Environment

- **OS**: Windows 10
- **Shell**: PowerShell 7+
- **Path Style**: Windows (`\`) — script outputs should avoid bash/zsh-specific syntax.

---

## 1. Task Routing & Pipelines

### 🔴 Pipeline A: Feature Development

**Applicable Scenarios**: Adding new pages, components, or APIs.

- **Step 1: Architecture Design & Confirmation**
  - Frontend: Define component structure and state flow (distinguishing between global Context and local State).
  - Backend: Define database schemas (PostgreSQL) and REST/GraphQL API contracts.
- **Step 2:  Core Implementation**
  - Implement core logic according to standards. All placeholder text must be written in English. UI must strictly follow a cyberpunk aesthetic.
- **Step 3: Internationalization (i18n) Injection [Frontend Only]**
  - Extract all hardcoded text. Sync content to the `translations` data source. Replace text usage with `useTranslations`.
- **Step 4: Edge Cases & Self-Testing**
  - Verify Loading/Error states.
  - Check component re-render performance.

### 🔵 Pipeline B: Bugfix

**Applicable Scenarios**: UI glitches, logic errors, cross-platform compatibility issues.

- **Step 1: Reproduction & Root Cause Analysis**
  - Explain your hypothesis about the root cause of the bug
     (e.g., flickering caused by absolute positioning, Safari/WebKit-specific rendering bugs, state race conditions).
- **Step 2: Minimal-Invasive Fix**
  - Provide a fix with minimal impact.
  - **Strictly prohibited**: large-scale refactoring of otherwise functioning code just to fix a single bug.
  - For UI fixes, ensure consistency with the project’s existing atomic component system.
- **Step 3: Regression Verification**
  - Explain which other modules might be affected by the fix, and prompt the user to perform cross-module validation.

### 🟢 Pipeline C: Refactor

**Applicable Scenarios**: Performance optimization, extracting reusable components, cleaning redundant code.

- **Step 1: Pain Point Analysis**：Identify current code smells.
- **Step 2: Incremental Refactoring**：Replace internal implementations while keeping input/output (I/O) behavior unchanged.

### 🟡 Pipeline D: Audit, Analysis & Report

**Applicable Scenarios**: Module progress tracking, frontend asset statistics, code audits, forward-looking technical research.

- **Step 1: Define a Single Target**
  - Each time this pipeline is triggered, one and only one of the following tasks must be selected. Mixing task types or including unrelated information is strictly prohibited:
    1. **Progress (Architecture & Progress Tracking)**：Only summarize completed APIs, database schemas, and component trees. **Do not include** any code quality evaluation or bug auditing.
    2. **Stats (Asset Statistics)**：Only extract and summarize objective metrics。
    3. **Audit (Defect & Code Review)**：Only identify logic flaws, performance bottlenecks, race conditions, or unhandled edge cases.
    4. **Spike (Technical Research)**：Only evaluate external technical solutions, third-party libraries, or architectural options, including feasibility and trade-off analysis.
- **Step 2: Deep Extraction & Logical Diagnosis**
  - Strictly focus on the single target selected in Step 1, traverse local target code or research external documentation accordingly.
- **Step 3: Output & Archiving Standards**
  - Reports must be exported in Markdown format to the corresponding subdirectory under `.reports/`.
  - **Filenames must include the date**, using the format:
     `YYYY-MM-DD_<custom_short_english_name>.md`
- **Step 4: Review & Decision Gateway**
  - Reports must conclude with a structured **"Action Items"** section.
  - **Mandatory Interception Rule**: Once the report is generated, the pipeline must terminate immediately. Automatic triggering of Pipeline A/B/C is strictly forbidden.
  - Wait for the human developer to review the report and issue further instructions.



---

## 2. Commit conventions (Quality & Delivery)

after completing each pipeline operation，output a suggested conventional commit message：

* Format: `<type>(<scope>): <short_english_description>`
* Type options: `feat`, `fix`, `refactor`, `chore`, `perf`, `docs`, `test`, `style`, `build`, `ci`
* Note: scope must be specific to the component name or service name.
* Body (optional): add details below the subject line, separated by a blank line, using `-` bullet points for each change point.