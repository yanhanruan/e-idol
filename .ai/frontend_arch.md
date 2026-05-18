# Architecture & Data Flow Guide

## 1. Folder Responsibilities
- `src/components/ui`: Stores purely presentational, stateless atomic components.
- `src/components/features`: Stores composite components containing business logic (e.g., `GlobalChat`).
- `src/contexts/`: Stores global state management logic (such as language switching and transition animations).

## 2. Internationalization (i18n) Workflow
- **Single Source of Truth**:
  - Static text used for UI rendering must never be stored in local `useState`.

- **Consumption Method**:
  - Translation objects must be obtained through the hook:
    ```ts
    const { t } = useTranslations();
    ```
  - Use `String(t.key)` or local assertions like `(t.key as string)` to ensure type safety.

- **State Separation**:
  - Static welcome messages should be rendered directly from `t` and must not be inserted into the message array.
  - The message array (`State`) should only store dynamic user-generated content.

- **Synchronized Updates**:
  - When the Header switches languages, all components consuming `t` must re-render in real time automatically through Context updates.

## 3. TypeScript Strictness
- **No `any` Allowed**:
  - The use of `any` in business logic is prohibited unless absolutely necessary for exceptional generic fallback cases such as `TranslationMap`.

- **Local Type Assertions**:
  - For union types like `TranslationValue`, it is recommended to perform localized narrowing within components:
    ```ts
    (t.xxx || {}) as Record<string, string>
    ```