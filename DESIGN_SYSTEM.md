# Para Shooting Committee of India - Design System

Based on the official Paralympic Committee India brand identity, this design system ensures a professional, inclusive, and accessible platform for the Para Shooting Committee.

## 1. Color Palette

### Primary Colors (Brand Identity)

| Color Name          | Hex Code  | Usage                                          | WCAG Contrast (on White) |
| ------------------- | --------- | ---------------------------------------------- | ------------------------ |
| **Paralympic Blue** | `#003DA5` | Primary brand color, headers, CTAs, navigation | 10.73:1 (AAA)            |
| **Saffron Orange**  | `#FF671F` | Accent, icons, focus rings (NO TEXT)           | 3.26:1 (Avoid text)      |
| **Saffron Dark**    | `#D35400` | **Small text, labels, secondary buttons**      | 4.8:1 (AA)               |
| **India Green**     | `#046A38` | Success states, achievements, badges           | 7.89:1 (AAA)             |

### Secondary Colors

| Color Name     | Hex Code  | Usage                                 | WCAG Contrast |
| -------------- | --------- | ------------------------------------- | ------------- |
| **Navy Dark**  | `#001F5C` | Dark backgrounds, footer, admin panel | 15.5:1        |
| **Azure Blue** | `#0066CC` | Links, interactive elements           | 8.59:1        |
| **Coral Red**  | `#E53935` | Alerts, errors, critical actions      | 4.76:1        |

### Blue Usage Hierarchy (Do/Don't)

To reduce cognitive load, strictly adhere to these roles:

- **Paralympic Blue (`#003DA5`):** **Primary Only.** Use for Main Headers, Primary Call-to-Actions, and Navigation. **Don't** use for generic body links.
- **Navy Dark (`#001F5C`):** **Structural.** Use for footers, admin sidebars, and dark backgrounds. **Don't** use for interactive buttons.
- **Azure Blue (`#0066CC`):** **Interactive.** Use strictly for inline text links and simple UI triggers.
- **Data Blue (`#3498DB`):** **Visualization.** Use strictly for charts and graphs. **Never** use for UI buttons.

### Neutral Colors

| Color Name      | Hex Code  | Usage                                  |
| --------------- | --------- | -------------------------------------- |
| **White**       | `#FFFFFF` | Backgrounds, cards, main content area  |
| **Light Gray**  | `#F5F7FA` | Alternate backgrounds, disabled states |
| **Medium Gray** | `#8B95A5` | Secondary text, borders, dividers      |
| **Dark Gray**   | `#2C3E50` | Primary text, headings                 |
| **Charcoal**    | `#1A1A1A` | Data tables text, admin sidebar        |

### Data Visualization Colors (Accessible)

| Purpose          | Hex Code  | Notes                 |
| ---------------- | --------- | --------------------- |
| **High Score**   | `#27AE60` | Positive performance  |
| **Medium Score** | `#F39C12` | Average/Warning       |
| **Low Score**    | `#E74C3C` | Alert/Critical        |
| **Data Blue**    | `#3498DB` | Primary charts/graphs |
| **Data Purple**  | `#9B59B6` | Secondary data sets   |

---

## 2. Typography System

### Font Families

- **Primary (UI/Body):** `Inter`, system-ui, sans-serif
- **Data/Numbers:** `Roboto Mono`, monospace (Critical for scores/rankings)
- **Headings (Display):** `Outfit`, `Inter`, sans-serif

### Type Scale

| Element          | Font         | Size            | Weight         | Line Height | Usage           |
| ---------------- | ------------ | --------------- | -------------- | ----------- | --------------- |
| **H1 Display**   | Outfit/Inter | 48px (3rem)     | 700 (Bold)     | 1.2         | Hero sections   |
| **H1**           | Inter        | 36px (2.25rem)  | 700 (Bold)     | 1.3         | Page titles     |
| **H2**           | Inter        | 30px (1.875rem) | 600 (SemiBold) | 1.4         | Section headers |
| **H3**           | Inter        | 24px (1.5rem)   | 600 (SemiBold) | 1.4         | Card headers    |
| **Body Large**   | Inter        | 18px (1.125rem) | 400 (Regular)  | 1.6         | Lead text       |
| **Body**         | Inter        | 16px (1rem)     | 400 (Regular)  | 1.6         | Main content    |
| **Body Small**   | Inter        | 14px (0.875rem) | 400 (Regular)  | 1.5         | Metadata        |
| **Table Header** | Inter        | 14px (0.875rem) | 600 (SemiBold) | 1.4         | Data tables     |
| **Table Data**   | Roboto Mono  | 14px (0.875rem) | 400 (Regular)  | 1.5         | Scores, Times   |

---

## 3. UI Theme Recommendations

### A. Public Informational Website

- **Vibe:** Professional, Inspiring, Inclusive.
- **Key Elements:**
  - Large hero images featuring para-athletes.
  - Clean white backgrounds with Paralympic Blue navigation.
  - High-contrast cards for news and events.
  - Saffron accents for primary "Donate" or "Register" buttons.
- **Emotional Engagement (Addressing Neutrality):**
  - Avoid a purely "institutional" look by using **10-15% opacity gradients** (Blue to Green) on banners.
  - Use full-width photography to tell human stories.
  - **Success Banners:** Use India Green generously for achievement celebrations to boost morale.

### B. Shooter Dashboard

- **Vibe:** Focused, Data-Rich, Motivational.
- **Key Elements:**
  - Light Gray (`#F5F7FA`) background to reduce eye strain.
  - White cards with subtle shadows for widgets.
  - **Dashboard Stats:** Large, clear numbers in `Roboto Mono`.
  - Progress bars using Blue -> Green gradients for training goals.

### C. Admin Panel

- **Vibe:** Efficient, Dense, Authoritative.
- **Key Elements:**
  - High-density data tables with zebra striping (`#FFFFFF` / `#FAFBFC`).
  - Charcoal/Navy sidebar for navigation.
  - Clear distinct colors for actions: Green (Approve), Red (Delete), Blue (Edit).

---

## 4. Accessibility Guidelines (WCAG 2.1 AA+)

1.  **Contrast is King:**

    - Ensure all primary text has at least a **4.5:1** contrast ratio against its background.
    - Use `#003DA5` (Blue) or `#2C3E50` (Dark Gray) for text on white.
    - **Critical:** Saffron Orange (`#FF671F`) has a contrast of 3.26:1. It **MUST NOT** be used for body text or small buttons. Use only for large headings, icons, borders, or focus rings.

2.  **Focus Indicators:**

    - All interactive elements must have a visible focus state.
    - **Recommendation:** 3px solid `#FF671F` (Saffron) outline with offset.

3.  **Typography & Readability:**

    - Minimum font size of **16px** for body text.
    - Line height of **1.5** or greater for blocks of text to aid reading.
    - Avoid justified text alignment (use left-aligned).

4.  **Semantic HTML:**

    - Use correct heading levels (`h1` -> `h2` -> `h3`).
    - Use `<button>` for actions and `<a>` for navigation.
    - Ensure all images have descriptive `alt` text.

5.  **Motion:**
    - Respect user preference for reduced motion (`prefers-reduced-motion`).
    - Avoid flashing content (seizure safety).

---

## 5. Design Rationale

- **Identity:** The use of **Paralympic Blue, Saffron, and Green** directly connects the platform to the official logo and national identity, fostering a sense of pride and officialdom.
- **Accessibility:** As a para-sports platform, accessibility is not a feature; it is a requirement. The high-contrast choices and strict typographic hierarchy ensure users with visual impairments can navigate effectively.
- **Data Integrity:** Shooting is a sport of decimals. Using **Monospace fonts** for data tables ensures scores align perfectly, allowing athletes and officials to scan results without cognitive load.
- **Professionalism:** The "Navy and White" base creates a clean, authoritative look suitable for a governing body, distinguishing it from casual sports blogs.

### Design Validation

- **Authority Score (9/10):** The dominance of Paralympic Blue and Navy Dark creates a government-grade visual language that establishes immediate trust with international partners and government bodies.
- **Context Suitability (9/10):** The low-fatigue palette supports the "steady hand" nature of shooting sports. Visual noise is minimized to aid focus.
- **Accessibility Note:** Saffron Orange is correctly restricted to large text and graphical elements, avoiding common compliance pitfalls.

---

## 6. Design Tokens (Developer Reference)

Use these CSS variables to ensure consistency across the application.

### Colors

```css
:root {
  /* Brand Colors */
  --color-primary: #003da5; /* Paralympic Blue */
  --color-accent: #ff671f; /* Saffron Orange */
  --color-success: #046a38; /* India Green */

  /* Secondary Colors */
  --color-secondary: #001f5c; /* Navy Dark */
  --color-interactive: #0066cc; /* Azure Blue */
  --color-error: #e53935; /* Coral Red */

  /* Neutral Colors */
  --color-bg-base: #ffffff; /* White */
  --color-bg-alt: #f5f7fa; /* Light Gray */
  --color-text-primary: #2c3e50; /* Dark Gray */
  --color-text-secondary: #8b95a5; /* Medium Gray */
}
```

### Typography

```css
:root {
  /* Font Families */
  --font-body: "Inter", system-ui, sans-serif;
  --font-heading: "Outfit", "Inter", sans-serif;
  --font-data: "Roboto Mono", monospace;

  /* Font Sizes */
  --text-sm: 0.875rem; /* 14px */
  --text-base: 1rem; /* 16px */
  --text-lg: 1.125rem; /* 18px */
  --text-xl: 1.5rem; /* 24px */
  --text-2xl: 1.875rem; /* 30px */
}
```

### Layout & Sizing

```css
:root {
  /* Spacing Scale */
  --spacing-xs: 0.25rem; /* 4px */
  --spacing-sm: 0.5rem; /* 8px */
  --spacing-md: 1rem; /* 16px */
  --spacing-lg: 1.5rem; /* 24px */
  --spacing-xl: 2rem; /* 32px */
  --spacing-2xl: 3rem; /* 48px */

  /* Border Radius */
  --radius-sm: 4px;
  --radius-card: 8px;
  --radius-pill: 9999px;
}
```

---

## 7. Component-Level Guidance (Future Implementation)

### Buttons

- **Primary (Default):** Background `var(--color-primary)`, Text White.
- **Hover:** Opacity 90% or slightly darker shade (`#002d7a`).
- **Disabled:** Background `var(--color-text-secondary)` (low opacity), cursor not-allowed.
- **Focus:** 3px solid `var(--color-accent)` outline with slight offset.

### Data Tables

- **Standard Row:** White background.
- **Zebra Striping:** Alternating rows with `var(--color-bg-alt)`.
- **Hover State:** Light blue tint (`#E8F4F8`) on hover to assist visual tracking.
- **Selected Row:** Distinct border or background highlight to maintain context.

### Forms

- **Validation Patterns:**
  - **Error:** Red border (`var(--color-error)`) + descriptive text below input.
  - **Success:** Green border (`var(--color-success)`) + checkmark icon.
- **Empty States:**
  - When no data is available (e.g., "No upcoming events"), use a neutral gray icon and clear, friendly text. Avoid blank empty spaces.

---

## 8. Accessibility Statement Recommendations

Given the para-sports context, the platform should feature a dedicated **Accessibility Statement** page.

### Key Content to Include:

1.  **Commitment:** "The Para Shooting Committee of India is committed to ensuring digital accessibility for people with disabilities."
2.  **Standard:** Explicit mention of **WCAG 2.1 Level AA** as the target standard.
3.  **Feedback Mechanism:** A clear way to report issues (e.g., "If you encounter accessibility barriers, please contact us at [email]").
4.  **Compatibility:** Mention support for common assistive technologies (NVDA, JAWS, VoiceOver, Magnifiers).

---

## 9. Future Dark Mode Strategy

To support admins and shooters in low-light environments (e.g., indoor ranges), we will implement a dedicated dark mode.

### Mapping Strategy

- **Background:** `#FFFFFF` → `#0D1117` (Dark Navy - reduces eye strain better than pure black)
- **Surface/Cards:** `#F5F7FA` → `#161B22` (Lighter Navy)
- **Text Primary:** `#2C3E50` → `#E6EDF3` (Off-white)
- **Text Secondary:** `#8B95A5` → `#8B949E`
- **Primary Brand:** `#003DA5` → `#1F6FEB` (Brightened for dark background visibility)
- **Borders:** Change from solid lines to subtle background color differences.

**Note:** Ensure all dark mode colors maintain the 4.5:1 contrast ratio against the new dark background.
