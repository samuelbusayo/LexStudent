---
name: The Design System
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e4e2e1'
  on-surface: '#1b1c1c'
  on-surface-variant: '#44474e'
  inverse-surface: '#303030'
  inverse-on-surface: '#f3f0f0'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#465f88'
  primary: '#000a1e'
  on-primary: '#ffffff'
  primary-container: '#002147'
  on-primary-container: '#708ab5'
  inverse-primary: '#aec7f6'
  secondary: '#735c00'
  on-secondary: '#ffffff'
  secondary-container: '#fed65b'
  on-secondary-container: '#745c00'
  tertiary: '#0b0c02'
  on-tertiary: '#ffffff'
  tertiary-container: '#212313'
  on-tertiary-container: '#898b75'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#aec7f6'
  on-primary-fixed: '#001b3d'
  on-primary-fixed-variant: '#2d476f'
  secondary-fixed: '#ffe088'
  secondary-fixed-dim: '#e9c349'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#e4e4cc'
  tertiary-fixed-dim: '#c8c8b0'
  on-tertiary-fixed: '#1b1d0e'
  on-tertiary-fixed-variant: '#474836'
  background: '#fcf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e1'
typography:
  h1:
    fontFamily: Newsreader
    fontSize: 34px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  h2:
    fontFamily: Newsreader
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.01em
  h3:
    fontFamily: Newsreader
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: 0em
  body-lg:
    fontFamily: Public Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: 0em
  body-md:
    fontFamily: Public Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  label-caps:
    fontFamily: Public Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  button:
    fontFamily: Public Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-padding: 20px
  gutter: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is engineered for the high-stakes environment of legal education. It balances the gravitas of traditional legal institutions with the efficiency of modern productivity tools. The brand personality is intellectual, rigorous, and prestigious, aiming to instill confidence and focus in law students.

The visual style follows a **Minimalist-Modern** approach. It utilizes expansive whitespace—specifically using warm neutral tones to reduce eye strain during long study sessions—and relies on editorial-grade typography to establish hierarchy. The interface is intentionally restrained, avoiding decorative clutter to prioritize the comprehension of complex legal texts and case files.

## Colors

The palette is rooted in the "Academic Navy," providing a deep, authoritative base for primary interactions and headers. "Warm Cream" serves as the primary canvas color, offering a softer alternative to pure white that mimics high-quality legal bond paper. "Refined Gold" is used sparingly as a signal color for achievements, progress, and high-priority call-outs.

- **Primary (Navy):** Used for brand elements, primary buttons, and navigational structures.
- **Secondary (Gold):** Used for progress indicators, star ratings, and "Save" actions.
- **Tertiary (Cream):** The primary background color for all screens.
- **Neutral:** A range of navy-tinted grays used for secondary text and borders to maintain a cohesive cool-toned legibility.

## Typography

This design system employs a dual-typeface system to bridge the gap between tradition and utility. 

**Newsreader** is the authoritative serif used for headlines, section titles, and case names. Its literary roots provide the necessary gravitas for legal study. **Public Sans** is the functional workhorse used for body text, interface labels, and inputs. It was chosen for its institutional clarity and exceptional readability on mobile screens, ensuring that even dense legal footnotes remain legible.

Typography should follow a strict vertical rhythm, with ample line height (1.5x for body) to facilitate speed-reading and annotation.

## Layout & Spacing

The layout utilizes a **fluid grid system** optimized for mobile viewports. A 4-column grid is standard, with 20px outside margins to prevent content from feeling cramped against the screen edges. 

The spacing rhythm is based on an **8px base unit**. This mathematical approach ensures that all elements—from the height of a progress bar to the padding within a case tag—feel organized and intentional. Grouping of related legal concepts (e.g., a Case Name and its Citation) should use tighter spacing (8px), while distinct sections of a study plan should use more generous breathing room (32px).

## Elevation & Depth

This design system uses **Tonal Layering** supplemented by **Ambient Shadows**. Because the primary background is Cream, depth is created by placing white "cards" on top of the cream surface, or by using a very subtle Navy-tinted shadow (Hex: #002147 at 8% opacity).

- **Level 0 (Surface):** The Cream (#F5F5DC) background.
- **Level 1 (Cards/Lists):** Pure White (#FFFFFF) surfaces with a 1px border (#E0E0D0) or a soft 4px blur shadow.
- **Level 2 (Modals/Active States):** Surfaces with an 8px blur shadow and 12% opacity, used for study planners and active case tags.

High-contrast outlines are avoided in favor of soft tonal shifts to maintain a premium, sophisticated feel.

## Shapes

The design system adopts a **Soft (Level 1)** shape language. While law is often associated with sharp, rigid lines, the subtle rounding of corners (4px to 8px) makes the digital experience feel modern and accessible.

- **Buttons & Inputs:** 4px radius (Soft) to maintain a professional, architectural look.
- **Cards & Modals:** 8px radius (Large) to provide a clear container for complex information.
- **Case Tags:** Fully rounded (pill-shaped) to distinguish them from actionable buttons and structured cards.

## Components

### Buttons
- **Primary:** Navy background with White text. Used for "Start Study Session" or "Submit."
- **Secondary:** Transparent with a Navy border or Gold text. Used for "Add Note" or "View Citation."
- **Ghost:** No background/border, Navy text. Used for low-priority navigation.

### Progress Bars
Progress bars use a Navy track with a 10% opacity and a solid Gold fill. The indicator should be slim (4px) to remain elegant and unobtrusive within a header or card.

### Case Tags
Used for categorizing legal topics (e.g., *Torts*, *Constitutional Law*). These are small, pill-shaped elements with a very light Navy tint (#002147 at 5% opacity) and Navy text.

### Study Planning Cards
Cards must include a Serif header (Newsreader), a Sans-Serif body (Public Sans), and a clear Gold progress indicator. They are the primary vehicle for organized study, utilizing Level 1 elevation to stand out against the Cream background.

### Input Fields
Inputs use a minimal bottom-border style or a subtle 1px frame in a neutral tone. Focus states are indicated by a 2px Navy bottom border and a subtle Cream-to-White transition.