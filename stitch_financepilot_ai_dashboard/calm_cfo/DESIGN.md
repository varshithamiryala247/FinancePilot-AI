---
name: Calm CFO
colors:
  surface: '#fbf8fa'
  surface-dim: '#dcd9db'
  surface-bright: '#fbf8fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f4'
  surface-container: '#f0edef'
  surface-container-high: '#eae7e9'
  surface-container-highest: '#e4e2e3'
  on-surface: '#1b1b1d'
  on-surface-variant: '#45474c'
  inverse-surface: '#303032'
  inverse-on-surface: '#f3f0f2'
  outline: '#75777d'
  outline-variant: '#c5c6cd'
  surface-tint: '#545f73'
  primary: '#091426'
  on-primary: '#ffffff'
  primary-container: '#1e293b'
  on-primary-container: '#8590a6'
  inverse-primary: '#bcc7de'
  secondary: '#006a61'
  on-secondary: '#ffffff'
  secondary-container: '#86f2e4'
  on-secondary-container: '#006f66'
  tertiary: '#1e1200'
  on-tertiary: '#ffffff'
  tertiary-container: '#35260c'
  on-tertiary-container: '#a38c6a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e3fb'
  primary-fixed-dim: '#bcc7de'
  on-primary-fixed: '#111c2d'
  on-primary-fixed-variant: '#3c475a'
  secondary-fixed: '#89f5e7'
  secondary-fixed-dim: '#6bd8cb'
  on-secondary-fixed: '#00201d'
  on-secondary-fixed-variant: '#005049'
  tertiary-fixed: '#fadfb8'
  tertiary-fixed-dim: '#ddc39d'
  on-tertiary-fixed: '#271902'
  on-tertiary-fixed-variant: '#564427'
  background: '#fbf8fa'
  on-background: '#1b1b1d'
  surface-variant: '#e4e2e3'
typography:
  display-metrics:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  table-header:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  sidebar-width: 260px
  container-max-width: 1440px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
  stack-xs: 4px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
---

## Brand & Style
The design system is engineered for "FinancePilot AI," a fintech platform that balances high-utility data density with a serene, authoritative user experience. The brand personality is that of a "Calm CFO"—someone who is highly organized, dependable, and unflappable under pressure. 

The aesthetic follows a **Corporate / Modern** direction with a focus on precision and clarity. It avoids the frantic energy of consumer trading apps in favor of a stable, structured environment. Visual weight is used to guide the eye toward critical financial insights while maintaining a spacious, breathable feel that reduces the cognitive load associated with bookkeeping and tax management.

## Colors
The palette is rooted in stability. The **Primary** Navy is used for structural elements like headers and navigation to provide a "grounded" frame for the application. The **Accent** Indigo is reserved for primary intent—call-to-actions and key interactive states.

**Secondary** Teal represents positive growth and fiscal health, while **Warning** Amber and **Error** Red are used sparingly to highlight overdue invoices or budget overflows. The background utilizes a very light cool-gray to reduce screen glare during long sessions of financial analysis, with subtle borders providing the necessary definition between data containers.

## Typography
The design system utilizes **Inter** exclusively for its exceptional legibility and neutral, professional tone. 

- **Numerical Hierarchy:** Financial metrics use the `display-metrics` style—bold and slightly tracked-in—to ensure that total balances and revenue figures are the first thing a user sees.
- **Data Tables:** Column headers utilize the `table-header` role, which is small, semi-bold, and uppercase to distinguish them from the actual data rows.
- **Readability:** Body text is optimized for long-form data reading, using a slightly increased line height to maintain a sense of "calm" even in text-heavy views.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy for the main content area, anchored by a persistent left-hand sidebar.

- **Sidebar:** A fixed 260px width provides consistent navigation. On mobile, this transitions to a hidden drawer.
- **Grid:** A 12-column grid is used for the dashboard, allowing cards to span 3, 4, 6, or 12 columns.
- **Rhythm:** An 8px base spacing unit ensures vertical rhythm. Data-dense tables may use a condensed 4px unit, while dashboard layouts utilize 24px or 32px margins to prevent the interface from feeling cluttered.

## Elevation & Depth
This design system uses a **Tonal Layering** approach combined with **Ambient Shadows** to create a structured hierarchy without excessive ornamentation.

- **Background:** The base surface (`#f8fafc`) serves as the canvas.
- **Cards:** White surfaces (`#ffffff`) are elevated by a very soft, diffused shadow (0px 4px 12px rgba(30, 41, 59, 0.05)). This creates a subtle lift that distinguishes actionable modules from the background.
- **Sidebars:** The left sidebar uses a flat, dark primary color (`#1e293b`) with no shadow, acting as a structural anchor.
- **Modals:** Higher elevation is achieved with a more pronounced shadow and a 40% opacity dark overlay to focus user attention.

## Shapes
The shape language is modern and approachable. A consistent 10px (`0.625rem`) corner radius is applied to cards, buttons, and input fields. This softened geometry counteracts the "coldness" of financial data, making the application feel more like a friendly tool and less like a rigid spreadsheet. 
- Small elements like tags or badges use a fully rounded "pill" shape to contrast with the more structural rectangular cards.

## Components
- **Buttons:** Primary buttons are solid Indigo with white text. Secondary buttons use a ghost/outline style with an Indigo border and text. All buttons have a height of 40px for standard actions and 32px for table-row actions.
- **Cards:** The core container for all data. Every card must have a white background, 10px rounded corners, and a 1px border (`#e2e8f0`).
- **Data Tables:** Rows should have a subtle hover state (`#f1f5f9`). Borders should be horizontal only to emphasize the flow of data.
- **Input Fields:** Use a 1px border. On focus, the border transitions to Indigo with a 2px soft glow (ring).
- **Charts:** Bar and line charts should use the Accent (Indigo) and Secondary (Teal) colors. Grid lines within charts must be minimal and use the system border color.
- **Chips/Badges:** Used for "Paid," "Pending," or "Overdue" statuses. These should have a low-opacity background of their respective semantic color (e.g., Teal bg at 10% for "Paid") with high-contrast text.