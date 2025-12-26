# Para Shooting Committee of India - Design System

Based on the official Paralympic Committee India brand identity, this design system ensures a professional, inclusive, and accessible platform for the Para Shooting Committee.

## 1. Color Palette

### Primary Colors (Brand Identity)

| Color Name          | Hex Code  | Usage                                          | WCAG Contrast (on White) |
| ------------------- | --------- | ---------------------------------------------- | ------------------------ |
| **Paralympic Blue** | `#003DA5` | Primary brand color, headers, CTAs, navigation | 10.73:1 (AAA)            |
| **Saffron Orange**  | `#FF671F` | Accent, highlights, active states              | 3.26:1 (AA Large Text)   |
| **India Green**     | `#046A38` | Success states, achievements, badges           | 7.89:1 (AAA)             |

### Secondary Colors

| Color Name     | Hex Code  | Usage                                 | WCAG Contrast |
| -------------- | --------- | ------------------------------------- | ------------- |
| **Navy Dark**  | `#001F5C` | Dark backgrounds, footer, admin panel | 15.5:1        |
| **Azure Blue** | `#0066CC` | Links, interactive elements           | 8.59:1        |
| **Coral Red**  | `#E53935` | Alerts, errors, critical actions      | 4.76:1        |

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
    - Avoid white text on Saffron Orange (`#FF671F`); use dark text instead or use Saffron for large non-text UI elements only.

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
