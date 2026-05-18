# Style & Design Guide (UI Specification)

## 1. Core Visuals & Atomic Standards

- **Style Definition**: Cyberpunk / Neon / Glassmorphism.
- **Background Hierarchy**: Use unified semantic colors, such as `bg-cyber-base` for the base background and `bg-cyber-surface` for container backgrounds.
- **Custom Modifiers (Mandatory)**:
  - **Glow Blur**: Use `blur-glow` (14px) for core effects; use tiered ambient light based on the scene: `blur-ambient-sm` (80px) / `blur-ambient-md` (100px) / `blur-ambient-lg` (120px).
  - **Special Letter Spacing**: `tracking-sm` (0.15em) for small emphasis, `tracking-md` (0.2em) for subheadings, and `tracking-lg` (0.3em) for large slogans/main titles.
- **Polygon Clipping (Clip-Path)**:
  - Strictly forbidden to hardcode values like `[clip-path:...]` in the code.
  - Mandatory use of preset utility classes: `.clip-chamfer-tr`, `.clip-chamfer-bl` (bottom-left chamfer), `.clip-chamfer-br` (bottom-right chamfer).

------

## 2. Color Tokens & Text Standards

**Absolute Restriction: It is strictly forbidden to use Tailwind's default color palettes (e.g., slate/gray). You must use the values defined in the config(tailwind.config.ts).**

- **Primary & Secondary Tones**:
  - Main Text: `text-content-primary`
  - Secondary Text: `text-content-secondary`
  - Muted/Ghost Text: `text-content-muted` or `text-content-ghost`
- **Highlights & Emphasis**:
  - Cyan/Blue Tones: `text-primary-aqua` / `text-primary-cyan400`
  - Purple/Pink Tones: `text-primary-purple` / `text-primary-neonPurple`
  - Warnings/Accents: `text-accent-yellow`

------

## 3. Atomic Component Standards

- **Forbidden Directive**: It is strictly prohibited to manually write native HTML tags (e.g., `<button>`, `<select>`) with complex styles directly in business pages.
- **Mandatory Reuse Mapping**:
  - Button -> `<CyberButton />`
  - Select Box -> `<CyberSelect />`
  - Title -> `<PageTitle />`
- **Modification Restrictions**: If you need to tweak the appearance of an atomic component, prioritize passing a `className`. It is strictly forbidden to modify the internal styling logic of the original component.

------

## 4. Glow & Color Harmony

**⚠️ Pre-emptive Exemption Statement**: The `shadow-neon-*` and `drop-shadow-neon-*` tokens defined in this section are custom Tailwind tokens and are **exempt** from the native shadow ban in Section 1. However, hardcoding arbitrary values (e.g., `shadow-[0_0_20px_rgba(...)]`) remains **absolutely prohibited**.

### 4.1 Color Harmony Binding Principle

The color of the glow must stay strictly in sync with the main color tone (Text / Border / Background) of that component. When generating components, AI should dynamically infer and apply the corresponding shadow; mismatched colors are strictly forbidden:

| **Core Glowing Element Primary Color**      | **Corresponding Box Shadow** | **Corresponding Drop Shadow** |
| ------------------------------------------- | ---------------------------- | ----------------------------- |
| `*-primary-cyan-*` / `*-primary-aqua`       | `shadow-neon-cyan`           | `drop-shadow-neon-cyan`       |
| `*-primary-purple` / `*-primary-neonPurple` | `shadow-neon-purple`         | `drop-shadow-neon-purple`     |
| `*-accent-yellow`                           | `shadow-neon-yellow`         | -                             |

### 4.2 Glow Decision Logic (Authorized AI Thinking Scenarios)

Glow is not a necessity; overuse leads to severe visual fatigue. When building components, AI must independently evaluate the business scenario and decide whether to apply glow effects based on these guidelines:

- **Trigger Scenarios**: Interaction feedback for core Call-to-Action (CTA) buttons (Hover / Active), cards containing key metric numbers, and main page slogans (e.g., `<PageTitle />`).
- **Forbidden Scenarios**: Large blocks of regular body text, secondary auxiliary buttons, disabled states (Ghost), and large-area base background containers.
- **Shape Matching Rules**: Use `shadow-*` for regular container boxes; use `drop-shadow-*` for irregular shapes (SVG Icons, single-line gradient text) to fit the edges of the content.

### 4.3 Behavioral Examples

✅ **Correct Example (Color-synced and state-based trigger)**:

```
// Container applies cyan interactive shadow; child text matches the cyan palette
<div className="border border-primary-cyan-400 hover:shadow-neon-cyan transition-shadow">
  <span className="text-primary-cyan-300">System Online</span>
</div>

// Irregular Icon uses a synced Drop Shadow
<Icon className="fill-primary-purple drop-shadow-neon-purple" />
```

❌ **Incorrect Example (Strictly prohibited patterns)**:

```
// Error 1: Mismatched colors (Purple text paired with Cyan glow)
<div className="text-primary-purple shadow-neon-cyan">...</div>

// Error 2: Ignoring preset config, forcing a hardcoded arbitrary value
<button className="drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">...</button>
```

------

## 5. Tailwind Native Class Control (Whitelist & Blacklist)

To ensure the purity of the Cyberpunk visual specification and global state management, AI **must strictly adhere** to the following blacklist and whitelist when using Tailwind default atomic classes:

### 🚫 Blacklist (Strictly Prohibited)

The following actions are considered serious violations of the design system:

1. **No Native Colors**: Strictly forbidden to use any Tailwind default color palette (e.g., `bg-gray-800`, `text-red-500`, `border-blue-400`). You must use `cyber.*`, `primary.*`, `content.*`, or `status.*` from the config.
2. **No Native Shadows**: Strictly forbidden to use `shadow-sm`, `shadow-md`, `shadow-xl`, etc. All shadows must come from `shadow-neon-*`, `shadow-glass`, `shadow-panel`, or the corresponding `drop-shadow-*`.
3. **No Arbitrary Values (JIT)**: Strictly forbidden to hardcode arbitrary values in code, such as `w-[133px]`, `text-[#ff0000]`, or `bg-[rgba(10,10,16,0.5)]`. You must rely on the preset spacing system and semantic tokens like `cyber.glass`.

### ✅ Whitelist (Fully Permitted)

AI may autonomously decide to use the following Tailwind native engineering utility classes for layout and typography:

1. **Layout & Grid**: `flex`, `grid`, `absolute`, `relative`, `z-*` (standard levels excluding modals), `items-center`, `justify-between`, etc.
2. **Spacing & Sizing**: `w-full`, `max-w-*`, `h-screen`, `p-4`, `mx-auto`, `gap-2`, etc., based on the 4px multiplier system.
3. **Typography Ratios**: Font sizes from `text-xs` to `text-4xl`, and font weights from `font-normal` to `font-black` (Note: text color remains controlled by the blacklist).
4. **State Pseudo-classes**: Encouraged use of `hover:`, `focus:`, `active:`, `group-hover:`, `peer-checked:`, etc., to pair with preset glow and color transitions (e.g., `hover:shadow-neon-cyan`).

------

## 6. Rounding Preference

**AI Constraint**: The project must exhibit a modern Cyberpunk style with a clear "round outside, square inside" hierarchy. Apply rounding utility classes strictly according to these levels; do not mix them randomly:

- **`rounded-full` (Maximum Roundness)**: **Only for** core interactive buttons (Primary Buttons), user avatars, status indicator lights, and ambient decorative spheres.
- **`rounded-2xl` (Level 1 Wrap)**: **Only for** main interface containers (Main Cards), Auth panels (Login/Register), and global Modal pop-ups.
- **`rounded-xl` (Level 2 Wrap)**: For chat bubbles, secondary info containers, and navigation dropdowns.
- **`rounded-lg` (Standard Functional Body)**: Mandatory for regular functional components like dropdown selection areas, body content blocks, and Inputs.
- **`rounded-md / rounded-sm` (Subtle Softening)**: Small icon backgrounds and tiny element edge refinements (like audio wave bars).

------

## 7. Sizing, Spacing & Grid Paradigm

### 7.1 Spacing System

- **Micro Spacing (0.5–2)**: `gap-1.5`, `gap-2`, `space-x-1`, `space-x-2`, `px-1.5`, `py-1`, `py-2`, along with vertical constraints `mb-0.5`, `mb-1`, `mb-2`. Used for tags, small icons, text-to-icon spacing, and subtle inner alignments. 
- **Regular Spacing (3–4)**: `p-3`, `px-4`, `gap-3`, `space-x-3`, `space-y-3`, along with vertical constraints `mb-3`, `mb-4`. Used for card padding, regular component layout, or separating content paragraphs, icons, and block titles.
- **Large / Block Spacing (6–12)**: `px-6`, `py-8`, `space-x-8`, along with vertical constraints `mb-6`, `mb-8`, `mb-12`. Used for page-level container margins and major navigation distances. `mb-12` is a top-tier specification specifically for separating major sections in large pages.

### 7.2 Sizing & Constraints

- **Page-Level Constraints**: `max-w-7xl mx-auto`, used to control the global maximum width and center the layout.
- **Component-Level Constraints**: `w-72 sm:w-80 md:w-88` (for floating panels like chat boxes), `min-w-[200px]`, `max-h-[400px]` (for dropdown menus, etc.).
- **Atomic Sizing**: `w-8 h-8`, `w-4 h-4`, `w-3 h-3`. Commonly used for circular buttons, icons, and status dots, maintaining a perfect circle or square proportionally through equal width and height.

### 7.3 Typography Compactness

- **Font Size System**: Leans toward smaller font sizes to achieve a refined, high-tech aesthetic, such as `text-2xs`, `text-xs`, and `text-sm`. 
- **Letter Spacing Pairings**:
  - `tracking-wide` / `tracking-wider` paired with `text-xs` or `text-sm` to inject reading "breathing room," especially in cyberpunk-styled uppercase letters and tags.
  - `tracking-widest` used for emphasized elements like navigation links.
- **Line Height Pairings**:
  - `leading-none` paired with small font-size tags (e.g., `text-2xs`) to ensure tag heights remain extremely compact with zero excess whitespace.
  - `leading-relaxed` paired with chat bubbles or large blocks of text.
- **Font Families**: A hybrid mix of `font-sans` (main body text) and `font-mono` (decorative tags, specific numerical data).

### 7.4 Responsive Strategy

- **Mobile-First**: Styles are written for mobile viewports by default, then progressively overridden using `sm:`, `md:`, and `lg:` breakpoints.
- **Layout Transformation**: Drastic changes in structure between breakpoints.
  - *Example*: The navigation bar collapses into a hidden menu on mobile (`md:hidden` + absolute-positioned popup) but expands horizontally on desktop (`md:flex`, `space-x-8`).
- **Scaling Dimensions & White Space**:
  - **Container Sizing**: `w-72 sm:w-80 md:w-88` — widths increase as the viewport expands.
  - **Container Height**: `h-14 md:h-12` — mobile elements often require larger touch targets for accessibility, while desktop elements become more compact and precise.
  - **Padding Expansion**: `px-4 sm:px-6 lg:px-8` — side margins increase on larger screens to prevent content from hitting the edge of the display.
- **Desktop Vertical Compression**: A specific "inverse" layout rule for this project.
  - In focused views like authentication pages or complex forms, mobile layouts use large vertical margins (`mb-6`, `mb-8`) to separate layers of information.
  - On desktop, these margins are **aggressively compressed** (`md:mb-1`, `md:mb-2`) to maintain visual focus and that signature high-density, "information-rich" cyberpunk feel.

------

### AI Layout Paradigm Decision Table

| **Scenario / Component Type**           | **Spacing**                                                 | **Sizing & Constraints**                                     | **Typography**                                               | **Responsive Strategy**                                      |
| --------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **Page-Level Container / Outer Layout** | `py-8 px-4` (scales up with screen size: `sm:px-6 lg:px-8`) | `max-w-7xl mx-auto`, `w-full`                                | -                                                            | Increase horizontal safety zone whitespace; shift from a single-column to a multi-column layout grid. |
| **Navigation Bar / Top Header**         | Inner elements scale from `space-x-2` to `space-x-8`        | `h-14` (Mobile) -> `md:h-12` (Desktop)                       | `text-xs`, `font-medium`, `tracking-widest`                  | `md:flex` to expand navigation links, `md:hidden` to collapse into a hamburger menu. |
| **Card Interior / List Item**           | `p-3`, `space-y-2`, `gap-2`, `gap-3`                        | Width is typically controlled by Grid/Flex, filling the parent container. | `text-sm`, paired with responsive CSS variables to control font scaling. | Utilize `md:p-*` to expand inner padding, increasing visual breathing room. |
| **Tag / Micro Decoration (Tag/Badge)**  | `px-1.5 py-1`, `px-2 py-0.5`, `gap-1.5`                     | Adaptive width `w-fit`, `flex-shrink-0`                      | `text-2xs`, `font-bold`, `leading-none`, `tracking-wider`, often paired with `font-mono` | Stays highly consistent; does not change drastically across responsive breakpoints. |
| **Icon Button / Interactive Control**   | Centered internally with no specific padding                | `w-8 h-8` (Regular wrapper), `w-4 h-4` (Icon itself)         | -                                                            | Add desktop hover scaling transitions (`hover:scale-105`).   |
| **Chat Bubble / Text Block**            | `p-2.5`                                                     | `max-w-[85%]`                                                | `text-xs`, `leading-relaxed`, `tracking-wide`                | Floating panel expands with wider viewports: `w-72 sm:w-80 md:w-88`. |
| **Form Input / Dropdown Select**        | `px-3 py-1.5`                                               | `flex-1` or occupies specified grid width                    | `text-xs`, `placeholder:text-content-secondary`              | -                                                            |

------

## 8. Responsive Web Design (RWD) Strategy

**AI Constraint:** The project's responsive strategy strictly prohibits simple "visual hiding" via display utilities. It must strictly follow the core logic of **"component restructuring and interactive degradation."** When generating layout code, the AI must strictly execute the following three sets of matrix specifications:

### 8.1 Density-Based Grid Paradigm

**AI Constraint:** When generating new list or grid components, it is strictly forbidden to force-fit outdated legacy business nomenclature. The AI must first evaluate the target component's **"Information Density"** and **"Base Aspect Ratio,"** classify it into one of the following 4 abstract visual archetypes, and strictly execute the corresponding responsive `grid-cols-*` column progression to ensure optimal visual balance from Mobile to XL viewports:

| **Visual Archetype**                                  | **Characteristics & Target Scenarios**                       | **Mobile** | **sm (640px)** | **md (768px)** |
| ----------------------------------------------------- | ------------------------------------------------------------ | ---------- | -------------- | -------------- |
| **Type A: Micro / Dense Elements (Micro)**            | Contains only icons, small avatars, or micro badges. Extremely low reading cognitive load, ideal for high-density tiling. | `cols-4`   | `cols-4`       | `cols-6`       |
| **Type B: Portrait Standard Card (Portrait)**         | Vertical cards emphasizing visual presentation (e.g., character illustrations, posters, simple image items). Low horizontal information footprint. | `cols-2`   | `cols-3`       | `cols-3`       |
| **Type C: Landscape / High-Density Card (Landscape)** | Complex cards containing mixed graphics/text, multi-line text summaries, and action buttons. Adequate horizontal reading space must be guaranteed. | `cols-1`   | `cols-1`       | `cols-2`       |
| **Type D: Wide Block / Data Panel (Wide)**            | Data analytics dashboards, pricing tier tables, multi-column comparison blocks. A single item requires a large page area to carry structured data. | `cols-1`   | `cols-1`       | `cols-2`       |

### 8.2 Special Page-Level Layout: Type E Split-Screen Immersive Focus View

**AI Constraint:** Distinct from the component-level layout grids detailed above, Type E is a **global page-level** layout engineered for standalone interactive user flows. When generating these core system flows, the AI must strictly apply the following structural breakdown:

1. Core Layout Mechanism (Flex 60/40)

- **Parent Container**: Must utilize a Flex layout and comprehensively address the collapse issues of mobile browser address bars (`flex min-h-[calc(100vh-8rem)] md:min-h-screen md:items-stretch`).
- **Visual Zone (Left)**: `hidden md:flex md:w-[60%] md:relative md:overflow-hidden md:bg-cyber-base`. Specifically dedicated to housing large ambient glows (`blur-ambient-lg`), SVG array schematics, or 3D floating canvas elements.
- **Action Zone (Right)**: `w-full max-w-[400px] md:max-w-none md:w-[40%] md:flex md:items-center md:justify-center`. Must perfectly center the core interaction form both vertically and horizontally.

#### 2. Applicable Scenarios

- **Account Gateways**: Login, Registration, and primary Password Recovery flows.
- **Creator / Idol Onboarding**: Initial setup wizard pages, such as configuring a virtual avatar or entering agency/label information.
- **Premium Upgrade / VIP Checkout**: Left side showcases exclusive tier privileges (e.g., dynamic glowing badges), right side handles the secure payment checkout form.
- **Campaign Landing / Standalone Event Gateway**: Standalone promotional/tournament entry pages like the "Summer Cyber Awards" registration page.

#### 3. Strictly Prohibited Scenarios (Negative List)

- Any secondary settings page inside the app dashboard (e.g., editing profiles, changing passwords, notification preferences).
- Any functional or operational form popping up inside the main application layout (which already features a navigation header/sidebar).
- Regular product, asset, or character details detail pages.
- *(For the prohibited scenarios listed above, please downgrade to using standard Type B or Type C cards nested within the global shell layout, or trigger a Modal popup.)*

### 8.3 Comprehensive Text Size Scaling Rules

Specifying responsive font sizes arbitrarily is prohibited. A clear distinction must be made between two distinct functional mechanisms: "Visual Impact" and "Functional Reading":

- **H1 / Headings (Dramatic Scale)**: 
  - **Logo / Branding**: `text-2xl` → `md:text-3xl`
  - **Hero Title**: `text-2xl` → `md:text-2xl`
  - **Section Title**: `text-xl` → `md:text-2xl`
- **Body / Functional (Subtle Scale)**: 
  - **Regular Body Text**: `text-sm` or `text-xs` (Mobile) remains stable, scaling up slightly on desktop.
  - **Dynamic Variables**: Critical metadata fields (like usernames or stats) should give priority to `text-name-base` combined with media queries for fine-grained tuning.
  - **Button Labels**: "Inverse shrinking" is explicitly permitted (e.g., `text-sm` → `md:text-xs`).

### 8.4 Dynamic Visibility & Component-Level Interactive Degradation

Abuse of `hidden` utilities for simple content cropping is strictly prohibited. The AI must switch between `hidden/block/flex` states to execute the paradigm of **"same data, dual operational logic"**:

- **Header Reconstruction**:
  - Desktop: `<nav className="hidden md:flex">` aligned centrally.
  - Mobile: The corresponding sibling element becomes `<button className="md:hidden">` (hamburger trigger), and the interactive target must collapse down safely into an `absolute top-full` full-width drawer menu.
- **Visual Performance Degradation**:
  - Desktop: Enable high-performance 3D atmospheric backgrounds or ultra-high-resolution character illustrations.
  - Mobile: Switch via `md:hidden` to a low-opacity, blurred, lightweight static background matrix to guarantee strict text contrast ratios on narrow viewports.
- **Interaction Form Transformation**:
  - **Mobile Viewports**: Lean heavily toward "iconization" and "circularization" (e.g., `w-9 h-9 rounded-full`) to optimize directly for ergonomic thumb touch-targets.
  - **Desktop Viewports**: Revert to "listification" and "elongation" (e.g., `w-36 h-auto`) to cater to high-precision mouse pointer interactions.

### 8.5 Responsive Design Philosophy (RWD Philosophy)

Every line of responsive code generated by the AI should reflect: **Mobile layouts prioritize touch ergonomics and clean vertical flow; Desktop layouts maximize visual impact, raw information density, and strict horizontal balance.**