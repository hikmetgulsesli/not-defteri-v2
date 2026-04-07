# Design System Specification: The Digital Atelier

## 1. Overview & Creative North Star
**Creative North Star: "The Obsidian Manuscript"**
This design system moves away from the "utility-first" clutter of traditional note-taking apps and instead embraces the feeling of a high-end, digital atelier. It is an environment where thoughts are curated, not just stored. 

We achieve a "Signature Editorial" look by rejecting the standard grid. Instead of rigid boxes, we use **intentional asymmetry** and **tonal depth**. The interface should feel like layers of dark, polished slate resting upon one another. By emphasizing white space (breathing room) and dramatic typographic scale, we transform a simple note into a prioritized piece of content.

---

## 2. Colors: Tonal Depth & The "No-Line" Rule
The palette is rooted in deep slates, using warmth and vibrance only to denote urgency and focus.

### Surface Hierarchy & Nesting
To create a premium feel, we prohibit 1px solid borders for sectioning. Boundaries are defined through **Background Color Shifts**.
*   **Base Layer:** `surface` (#0c1324) — The infinite canvas.
*   **Secondary Sections:** `surface_container_low` (#151b2d) — Used for sidebars or navigation groupings.
*   **Content Cards:** `surface_container` (#191f31) — The primary container for note previews.
*   **Elevated Focus:** `surface_container_highest` (#2e3447) — Used for active states or modals.

### The "Glass & Gradient" Rule
Floating elements (Modals, Popovers) must use **Glassmorphism**. Apply `surface_variant` (#2e3447) at 70% opacity with a `backdrop-blur` of 12px. This prevents the UI from feeling heavy and allows the "Obsidian" depth to remain visible.

### Accent Strategy (Importance)
*   **Low (Standard):** `on_secondary_container` (#adb4ce) - Subtle, blended.
*   **Medium (Active):** `primary` (#ffb95f) - Warm amber for focus.
*   **High (Urgent):** `on_tertiary_container` (#e13052) - A sophisticated rose-red for high priority.

---

## 3. Typography: Editorial Authority
We use **Inter** as a variable font to create a hierarchy that feels like a modern broadsheet.

*   **Display-LG (3.5rem):** Use for "Empty State" inspirations or hero headers.
*   **Headline-SM (1.5rem):** Use for Note Titles. It provides an authoritative start to the content.
*   **Body-LG (1rem):** The primary reading experience. Increased line-height (1.6) is mandatory for long-form notes.
*   **Label-MD (0.75rem):** All-caps with 0.05em tracking for metadata (e.g., "SON DÜZENLEME: 12 EKİM").

The contrast between a `display-md` title and `label-sm` metadata creates a "high-fashion" typographic tension that defines this system.

---

## 4. Elevation & Depth: The Layering Principle
We do not use structural lines. We use **Tonal Stacking**.

*   **Layering:** Place a `surface_container_lowest` (#070d1f) card inside a `surface_container` (#191f31) area to create a "sunken" field for text input.
*   **Ambient Shadows:** For floating action buttons or menus, use a shadow color derived from `surface_container_highest` (#2e3447) at 40% opacity, with a 32px blur and 16px Y-offset. It should feel like a soft glow, not a dark drop-shadow.
*   **The Ghost Border:** If a separator is required for accessibility, use `outline_variant` (#46464c) at **15% opacity**. Never use 100% opaque borders.

---

## 5. Components

### Input Fields (Metin Alanları)
*   **Style:** No borders. Use `surface_container_lowest` as the background.
*   **Focus State:** A 1px "Ghost Border" using `primary` (#ffb95f) at 30% opacity and a subtle outer glow.
*   **Typography:** User input uses `body-lg`.

### Buttons (Butonlar)
*   **Primary:** `primary` (#ffb95f) background with `on_primary` (#472a00) text. Corner radius: `xl` (1.5rem).
*   **Secondary:** `secondary_container` (#3f465c) background. 
*   **Tertiary (Ghost):** No background. Text in `primary`. For low-emphasis actions like "Vazgeç".

### Cards & Lists (Not Kartları)
*   **Rule:** Forbid divider lines. Use `1.5rem` (xl) spacing between items.
*   **Interaction:** On hover, transition the background from `surface_container` to `surface_container_high`.
*   **Rounding:** Use `xl` (1.5rem) for main note cards to create a soft, organic feel.

### Priority Chips (Önem Derecesi)
*   **Low:** `secondary_fixed_dim` text on `surface_container_high`.
*   **Medium:** `primary` text on `primary_container` (10% opacity).
*   **High:** `tertiary` (#ffb2b7) text on `tertiary_container`.

---

## 6. Do’s and Don’ts

### Do
*   **Do** use Turkish terminology for clarity (e.g., "Yeni Not", "Taslaklar", "Önemli").
*   **Do** use `xl` (1.5rem) rounded corners for large containers and `md` (0.75rem) for smaller elements like chips.
*   **Do** maximize white space. If a layout feels "full," increase the margins.
*   **Do** use `primary_fixed_dim` for icons to keep them legible but integrated.

### Don't
*   **Don't** use pure white (#FFFFFF). Use `on_surface` (#dce1fb) for primary text to reduce eye strain in dark mode.
*   **Don't** use 1px solid slate-800 borders to wrap everything. Let the background colors do the work.
*   **Don't** use standard "Material Design" blue for links. Stick to the `primary` (Amber) or `secondary` (Slate) tokens.
*   **Don't** cram content. A single note should breathe as if it were a physical piece of paper on a large desk.