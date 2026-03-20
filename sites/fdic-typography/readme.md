# FDIC Typography — Agent Guide

> **Version:** 1.0 (March 2026)
> **Scope:** Prose/long-form content styling only. This specification does not cover forms, navigation chrome, application UI, or layout grids.
> **Reference implementation:** `prose-standalone.css` + `index.html` in this repository.

## What This Is

A specification for the `.prose` CSS component in the FDIC Design System. Adding `class="prose"` to any HTML container applies typographic styles to its descendant content — headings, paragraphs, lists, tables, code blocks, callouts, footnotes, and more.

The system is designed to be **self-contained**: a single CSS file with embedded fonts, tokens, and all component styles. It works without any other stylesheet present and can also be embedded within a larger FDIC page layout.

## Quick Start

Minimal working example:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="prose-standalone.css" />
</head>
<body>
  <a href="#main" class="skip-link sr-only">Skip to content</a>
  <article class="prose" id="main">
    <h1>Page Title</h1>
    <p class="lead">Introductory summary paragraph.</p>
    <h2 id="section-one">Section One</h2>
    <p>Body content here.</p>
  </article>
</body>
</html>
```

## Integration Notes

- **Standalone use**: The stylesheet includes a base reset (`box-sizing`, `body` font, headings, links, media). It's designed to be the only stylesheet on the page.
- **Embedded in a larger layout**: When prose lives inside an existing FDIC page, the `.prose` container scopes all typography. The `body` rule in the standalone file includes `margin: 2.5rem` for demo purposes — **strip this in production**. The base reset (section 2 of the CSS) may conflict with your site's reset; extract only the `:root` tokens and `.prose`-scoped rules (sections 1, 3–6) if integrating into an existing stylesheet.
- **Max-width**: `.prose` sets `max-width: 65ch` (roughly 65 characters per line, optimized for reading comfort per typographic best practice). Override `--prose-max-width` if your layout requires a different measure.
- **Content model**: `.prose` expects semantic HTML — headings, paragraphs, lists, tables, figures. It does not style form elements, buttons, or application widgets.

## Design Rationale

| Decision | Why |
|----------|-----|
| Source Sans 3 | FDIC's brand typeface; successor to Source Sans Pro with variable-weight support |
| 65ch max-width | Optimal line length for sustained reading (45–75ch range per typographic research) |
| 1.5 body line-height | Accessibility baseline for comfortable reading; WCAG recommends at least 1.5 for body text |
| `rem` spacing tokens | Scale predictably with user font-size preferences; honor browser zoom |
| Inline SVG data URIs for icons | Zero external dependencies; works in CodePen, email, and air-gapped environments |
| Individual font properties (no shorthand) | Avoids parse failures in PostCSS and cross-browser edge cases with the `font` shorthand |

## What's Locked vs. Flexible

### Locked (do not change without leadership approval)

- **Font size ramp**: h1 (2.5313rem), h2 (1.6875rem), h3 (1.4063rem), h4 (1.125rem), body (1.125rem), body-small (1rem), body-big (1.25rem)
- **Heading padding pattern**: h1 gets `padding-bottom` + `border-bottom`; h2 gets `padding-bottom`
- **Brand colors**: primary (#212123), secondary (#595961), link (#1278B0), brand blue (#0d6191)
- **Font family**: Source Sans 3 for body, system monospace stack for code
- **Accessibility requirements**: Everything in the "Accessibility" section below is WCAG 2.1 AA compliance — non-negotiable

### Flexible (adapt to context)

- **Spacing scale values**: The rem values (0.25, 0.5, 0.75, 1, 1.25, 3) can be adjusted if a project needs different density, but keep them in `rem` and maintain relative proportions
- **Max-width**: Override `--prose-max-width` for wider/narrower layouts
- **Corner radii**: `sm` (3px) and `lg` (7px) can be tuned to match a project's visual language
- **Callout colors**: The transparency-based approach (8% bg, 25% border) is the pattern; specific hues can adapt if brand colors change
- **Micro-interactions**: Transition durations and easing can be tuned; the behaviors themselves (hover states, focus rings, reveal animations) should stay
- **Print styles**: Can be extended but the core rules (black text, URLs shown, interactive elements hidden) should stay

## Tech Constraints

- **Vanilla CSS only** — team uses PostCSS, no preprocessors (Sass, Less, etc.)
- **No JavaScript frameworks** — small inline `<script>` blocks for UX features (copy buttons, TOC active state, back-to-top visibility) are acceptable
- **Font shorthand is banned** — always use individual properties (`font-family`, `font-size`, `font-weight`, `line-height`) to avoid PostCSS parse failures
- **Font**: Source Sans 3 loaded via Google Fonts `@import`

## CSS Architecture

The stylesheet is organized into numbered sections:

| Section | Purpose |
|---------|---------|
| 0. Font Loading | Google Fonts `@import` for Source Sans 3 |
| 1. Design Tokens | All `--fdic-*` and `--link-*` custom properties in `:root` |
| 2. Base Reset | Minimal reset + element styles (`body`, headings, links, media, paragraphs) |
| 3. Prose Component | All `.prose`-scoped rules (the bulk of the file) |
| 4. Responsive Type Scaling | `@media (max-width: 640px)` heading size overrides |
| 5. Print Styles | `@media print` optimizations |
| 6. Forced-Colors | `@media (forced-colors: active)` for Windows High Contrast |

When adding new rules, place them in the appropriate section. New element styles go in section 3 near related elements. New media query overrides go in their corresponding section (4–6).

## Design Tokens

All tokens use the `--fdic-` prefix. **Every property that uses a token must include a hardcoded fallback value** for standalone use:

```css
/* Correct */
color: var(--fdic-text-primary, #212123);

/* Wrong — no fallback */
color: var(--fdic-text-primary);
```

### Token Reference

**Font families**
- `--fdic-font-family-sans-serif`: "Source Sans 3", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif
- `--fdic-font-family-mono`: ui-monospace, "SFMono-Regular", "SF Mono", Menlo, Consolas, "Liberation Mono", monospace

**Font sizes** (locked)
- `--fdic-font-size-h1`: 2.5313rem
- `--fdic-font-size-h2`: 1.6875rem
- `--fdic-font-size-h3`: 1.4063rem
- `--fdic-font-size-h4`: 1.125rem
- `--fdic-font-size-body`: 1.125rem
- `--fdic-font-size-body-big`: 1.25rem
- `--fdic-font-size-body-small`: 1rem

**Line heights**
- `--fdic-line-height-h1`: 1.15
- `--fdic-line-height-h2`: 1.2
- `--fdic-line-height-h3`: 1.25
- `--fdic-line-height-h4`: 1.25
- `--fdic-line-height-body`: 1.5

**Letter spacing**
- `--fdic-letter-spacing-0`: 0
- `--fdic-letter-spacing-1`: -0.01em
- `--fdic-letter-spacing-2`: -0.005em

**Spacing scale** (all `rem`, never `px`)
- `--fdic-spacing-2xs`: 0.25rem
- `--fdic-spacing-xs`: 0.5rem
- `--fdic-spacing-sm`: 0.75rem
- `--fdic-spacing-md`: 1rem
- `--fdic-spacing-xl`: 1.25rem
- `--fdic-spacing-3xl`: 3rem

**Colors — text**
- `--fdic-text-primary`: #212123
- `--fdic-text-secondary`: #595961
- `--fdic-text-inverted`: #ffffff
- `--fdic-text-link`: #1278b0
- `--fdic-text-link-visited`: #855aa5
- `--fdic-text-link-visited-hover`: #79579f

**Colors — brand**
- `--fdic-brand-core-default`: #0d6191
- `--fdic-color-brand-primary-500`: #0d6191

**Colors — backgrounds**
- `--fdic-background-base`: #ffffff
- `--fdic-background-container`: #f5f5f7

**Colors — borders**
- `--fdic-border-divider`: #bdbdbf

**Corner radii**
- `--fdic-corner-radius-sm`: 3px
- `--fdic-corner-radius-lg`: 7px

**Interactive states**
- `--fdic-overlay-emphasize-100`: rgba(0, 0, 0, 0.04)
- `--fdic-overlay-emphasize-200`: rgba(0, 0, 0, 0.08)
- `--fdic-border-input-active`: #424244
- `--fdic-border-input-focus`: #38b6ff

**Link states**
- `--link-unvisited`: #1278B0
- `--link-unvisited-hover`: #0D6191
- `--link-visited`: #855AA5
- `--link-visited-hover`: #79579F

**Callout colors** (token-derived with transparency)
- `--fdic-callout-bg` / `--fdic-callout-border`: container/divider defaults
- `--fdic-callout-info-bg`: rgba(18, 120, 176, 0.08)
- `--fdic-callout-info-border`: rgba(18, 120, 176, 0.25)
- `--fdic-callout-warning-bg`: rgba(180, 140, 20, 0.08)
- `--fdic-callout-warning-border`: rgba(180, 140, 20, 0.25)
- `--fdic-callout-success-bg`: rgba(30, 130, 50, 0.08)
- `--fdic-callout-success-border`: rgba(30, 130, 50, 0.3)
- `--fdic-callout-danger-bg`: rgba(190, 40, 40, 0.08)
- `--fdic-callout-danger-border`: rgba(190, 40, 40, 0.25)

**Layout**
- `--prose-max-width`: 65ch

## Spacing Conventions

- **Spacing tokens are in `rem`** — never use `px` for spacing tokens
- **Vertical rhythm**: All block elements (p, ul, ol, dl, blockquote, pre, figure, table, hr) share `margin-top: 0; margin-bottom: var(--fdic-spacing-xl, 1.25rem)`
- **Heading margins**: `1.5em` above, `0.5em` below; stacked headings (h2+h3, h3+h4, etc.) collapse to `0.5em` above
- **HR margins**: `--fdic-spacing-3xl` (3rem) top and bottom — larger gap for thematic breaks
- **List item spacing**: Simple items use `--fdic-spacing-2xs` (0.25rem); complex items (containing `<p>`) use `--fdic-spacing-md` (1rem) between siblings
- **Proximity grouping**: Nested lists are tight to their parent (`0.25rem` above, `0` below); sibling items containing nested lists get `1rem` between them
- **Boundary resets**: First child of `.prose` gets `margin-top: 0`; last child gets `margin-bottom: 0`

## Typography Rules

- **Body**: 1.125rem (18px), line-height 1.5, weight 400, Source Sans 3
- **Lead paragraph** (`.lead` or `.prose-lead`): 1.25rem, secondary color — used for article intros and section summaries
- **Headings**: weight 600, primary color, font-family re-declared for standalone safety
- **Blockquotes**: line-height 1.6 (slightly airier than body), secondary color, 4px brand-blue left border
- **Nested blockquotes**: lighter border (`--fdic-border-divider`) to show hierarchy
- **Code blocks** (`<pre>`): 0.875rem monospace, line-height 1.625, container background, 1px border, `border-radius-lg`
- **Inline code**: 0.8em monospace, container background, `border-radius-sm`
- **Text rendering**: body uses `-webkit-font-smoothing: antialiased`, `-moz-osx-font-smoothing: grayscale`, `text-rendering: optimizeLegibility`
- **Text wrapping**: `.prose` uses `text-wrap: pretty` and `hanging-punctuation: first allow-end last`
- **Selection color**: rgba brand-blue at 20% opacity; callout variants use their own tinted selection

## Inline Element Styles

| Element | Key Styles |
|---------|-----------|
| `abbr[title]` | Dotted underline in secondary color, `cursor: help`, `text-underline-offset: 0.15em` |
| `kbd` | Monospace 0.8em, container bg, 1px border + 2px bottom border (key cap effect), `border-radius-sm` |
| `mark` | `#fff3cd` yellow background, `color: inherit`, 2px radius |
| `small` | 0.875em, secondary color |
| `del` | `line-through` in secondary color |
| `ins` | No underline, `#e6f4ea` green background, 2px radius |
| `time[datetime][title]` | Same dotted-underline + help cursor as `abbr` |
| `samp` | Monospace 0.8em, container bg, 3px left border (output-style) |
| `q` | Curly quotes via CSS `quotes` property |
| `dfn` | Italic + weight 600 |
| `var` | Monospace italic, 0.875em |
| `output` | Monospace 0.8em, container bg, 1px border all around |
| `sup` / `sub` | 0.75em, `line-height: 0` (prevents line distortion), positioned relative to baseline |

## Link Styling

- **Base**: `--link-unvisited` (#1278B0), underline, `text-decoration-thickness: 6.25%`, `text-underline-offset: 12.5%`, `text-underline-position: from-font`
- **Hover**: `--link-unvisited-hover` (#0D6191), thickness bumps to 2px
- **Visited**: `--link-visited` (#855AA5)
- **Visited hover**: `--link-visited-hover` (#79579F), thickness 2px
- **Focus**: `outline: 2px solid var(--fdic-border-input-focus)`, `outline-offset: 2px`, `border-radius: 2px`
- **External links** (`a[href^="http"]:not([href*="fdic.gov"])`): Phosphor ArrowSquareOut icon as `background-image` with padding-right to make room; visited variant swaps icon fill color to visited purple

## Component Classes

### `.prose-callout`

Flex layout with icon + content. Five variants:

| Class | ARIA Role | Icon | Colors |
|-------|-----------|------|--------|
| `.prose-callout` (default) | `note` | Phosphor Lightbulb | Container bg, divider border |
| `.prose-callout-info` | `note` | Phosphor Info | Blue 8% bg, 25% border |
| `.prose-callout-warning` | `note` | Phosphor Warning | Yellow 8% bg, 25% border |
| `.prose-callout-success` | `note` | Phosphor CheckCircle | Green 8% bg, 30% border |
| `.prose-callout-danger` | `status` | Phosphor WarningOctagon | Red 8% bg, 25% border |

```html
<div class="prose-callout prose-callout-info" role="note" aria-label="Information">
  <span class="prose-callout-icon" aria-hidden="true"></span>
  <div class="prose-callout-content">
    <p>Content here.</p>
  </div>
</div>
```

### `.prose-toc`

Table of contents navigation box.

```html
<nav class="prose-toc" aria-label="Table of contents">
  <p class="prose-toc-title" id="toc">On this page</p>
  <ul>
    <li><a href="#section-id">Section Name</a></li>
  </ul>
</nav>
```

- Container: `background-container`, `border-divider`, `border-radius-lg`
- Title uses `.prose-toc-title` (h3 font size, weight 600) — uses `<p>` tag, not a heading, to avoid polluting document outline
- Links: no underline by default, underline on hover/focus
- Active state (`.prose-toc-active`): primary color, weight 600 (requires JS to toggle class based on scroll position)
- Hidden in print
- Smooth scroll enabled on `html` with `prefers-reduced-motion` override to `auto`

### `.prose-table-wrapper`

Required wrapper for tables to preserve native table semantics while enabling horizontal scroll:

```html
<div class="prose-table-wrapper" role="region" aria-label="Description of table content" tabindex="0">
  <table>
    <caption>Table caption (optional)</caption>
    <thead>
      <tr><th>Header</th></tr>
    </thead>
    <tbody>
      <tr><td>Data</td></tr>
    </tbody>
  </table>
</div>
```

- The wrapper gets `overflow-x: auto` — never put `display: block` on `<table>` itself (breaks screen reader table navigation)
- `tabindex="0"` makes it keyboard-scrollable
- `role="region"` + `aria-label` for screen reader context
- Focus ring on `:focus-visible`
- Table features: striped rows (`nth-child(even)`), hover highlight, rounded header corners, right-aligned numeric columns (`.prose-td-numeric`), `tfoot` for totals rows

### `.prose-footnotes`

Bidirectional footnote pattern with DPUB-ARIA roles:

```html
<!-- Inline reference (in body text) -->
<sup><a href="#fn1" id="ref1" role="doc-noteref">[1]</a></sup>

<!-- Footnote section (at end of article) -->
<section class="prose-footnotes" role="doc-endnotes" aria-label="Footnotes">
  <hr />
  <ol>
    <li id="fn1" role="doc-footnote">
      Footnote text. <a href="#ref1" role="doc-backlink" title="Back to reference">&#x21a9;</a>
    </li>
  </ol>
</section>
```

- Section: 0.875em, secondary color
- HR separator: 33% width, left-aligned
- `:target` highlight: animated yellow flash (`@keyframes footnote-flash`, 1.5s); suppressed under `prefers-reduced-motion` with static yellow background instead
- Footnote ref links: enlarged tap target via padding + negative margin

### `.prose-back-to-top`

```html
<p class="prose-back-to-top"><a href="#top">Back to top &uarr;</a></p>
```

Right-aligned, secondary color, hidden in print.

### `.prose-copy-btn`

Code block copy button. Positioned absolute inside `<pre>` (which needs `position: relative`). Fades in on hover/focus of the `<pre>`. Success state uses `.prose-copy-btn-success`.

### Details / Accordion

```html
<details>
  <summary>Question or section title</summary>
  <p>Expandable content.</p>
</details>
```

- Summary: flex layout with pill background (`background-container`), weight 600, Phosphor CaretDown chevron via `::after`
- Chevron rotates 180deg on open
- Content: reveal animation (opacity + max-height) using `interpolate-size: allow-keywords`
- Hover/active: overlay box-shadow pattern
- Focus: border + blue glow matching input focus pattern
- Print: force-expanded, backgrounds removed

### Progress & Meter

```html
<div class="prose-progress-group">
  <label for="p1">Label</label>
  <progress id="p1" value="75" max="100"></progress>
  <span class="prose-progress-value">75 / 100 (75%)</span>
</div>
```

Grid layout (label spanning full width, bar + value side by side). Styled for WebKit and Firefox. Indeterminate progress gets animated stripes.

### Aside / Pull Quote

```html
<aside>
  <p>Pulled-out supplementary content.</p>
</aside>
```

Floats right at 40% width with brand-blue left border. Linearizes to full width at 640px and in print.

## Accessibility Requirements (WCAG 2.1 AA)

These are non-negotiable:

1. **Focus rings**: All interactive elements use `:focus-visible` with `outline: 2px solid var(--fdic-border-input-focus)`, `outline-offset: 2px`, `border-radius: 2px`
2. **Skip link**: First element in `<body>` — `<a href="#target" class="skip-link sr-only">Skip to content</a>`
3. **`.sr-only` utility**: Visually hidden text for screen readers (clip rect pattern — `position: absolute; width: 1px; height: 1px; clip: rect(0,0,0,0); overflow: hidden`)
4. **ARIA on callouts**: `role="note"` (or `role="status"` for danger), `aria-label` matching variant name, `aria-hidden="true"` on icon spans
5. **Table wrapper**: `role="region"`, descriptive `aria-label`, `tabindex="0"` — never use `display: block` on `<table>` itself
6. **DPUB-ARIA on footnotes**: `doc-noteref` on inline refs, `doc-endnotes` on section, `doc-footnote` on each `<li>`, `doc-backlink` on return links
7. **First-use abbreviation expansion**: Spell out acronyms on first use in visible text: `Federal Deposit Insurance Corporation (<abbr title="...">FDIC</abbr>)`
8. **`<del>` / `<ins>` screen reader text**: Include `<span class="sr-only">deleted: </span>` / `<span class="sr-only">inserted: </span>` inside the elements
9. **`prefers-reduced-motion`**: Suppress all animations and transitions; any animated highlight should fall back to a static equivalent
10. **`forced-colors`** (Windows High Contrast): Borders use system colors (`LinkText`, `ButtonText`); elements that convey meaning via color/background use `forced-color-adjust: none`; `<ins>` falls back to underline instead of background

## Micro-Interactions

- **Link underline**: thickness transitions from thin (6.25%) to 2px on hover
- **Table rows**: `background-color` transition (0.15s ease) on hover
- **Details chevron**: Phosphor CaretDown rotates 180deg on open (0.2s ease)
- **Details content**: opacity + max-height reveal (0.25s ease) using `interpolate-size: allow-keywords`
- **Summary hover/active**: overlay box-shadow pattern (4% / 8% black)
- **TOC link active state**: color transition (0.2s ease)
- **Copy button**: opacity fade-in (0.15s) on `<pre>` hover
- **Footnote flash**: `@keyframes footnote-flash` — yellow (#fff3cd) to transparent over 1.5s

All transitions suppressed under `prefers-reduced-motion: reduce`.

## Print Styles

- Max-width removed, font forced to 12pt black
- URLs appended to external links via `::after { content: " (" attr(href) ")" }`
- Footnote back-link URLs not appended (they're internal anchors)
- TOC, back-to-top links, copy buttons, callout icons, summary chevrons: hidden
- Callout backgrounds removed, borders kept at #999
- Table decorative backgrounds (striping, hover) removed; header keeps black bg
- Details force-expanded, summary backgrounds removed
- Aside linearized (no float, full width)
- Images, figures, embedded media: `break-inside: avoid`
- Headings: `break-after: avoid`

## Responsive Behavior

At `max-width: 640px`:
- h1: 2.5313rem → 2rem
- h2: 1.6875rem → 1.5rem
- h3: 1.4063rem → 1.25rem
- h4: 1.125rem → 1.0625rem
- Lead paragraph: 1.25rem → 1.125rem
- Aside: linearized (no float, full width)

## Icon System

All icons are from **Phosphor Icons** (regular weight), embedded as inline SVG data URIs in CSS `background-image`. This avoids external dependencies and works in CodePen, email, and air-gapped environments.

Icon colors are hardcoded in the SVG `fill` attribute to match their context (brand blue for info, amber for warning, green for success, red for danger, primary for neutral). In `forced-colors` mode, icons use `forced-color-adjust: none` to remain visible.

## Naming Conventions

- **Design system tokens**: `--fdic-{category}-{name}` (e.g., `--fdic-text-primary`, `--fdic-spacing-md`)
- **Private/scoped properties**: `--_{name}` (e.g., `--_ext-icon` for external link icon)
- **Component classes**: `.prose-{component}` (e.g., `.prose-toc`, `.prose-callout`, `.prose-footnotes`)
- **Modifier classes**: `.prose-{component}-{variant}` (e.g., `.prose-callout-info`)
- **Utility classes**: `.sr-only`, `.skip-link`
- **Layout wrappers**: `.prose-{element}-wrapper` (e.g., `.prose-table-wrapper`)
- **State classes**: `.prose-{component}-{state}` (e.g., `.prose-toc-active`, `.prose-copy-btn-success`)
- **Helper classes**: `.prose-td-numeric`, `.prose-pre-wrap`

## Content Guidelines

- Use realistic domain-appropriate content (banking, regulatory, financial), not lorem ipsum
- Spell out abbreviations on first use in body text
- Use `<pre><code class="language-{lang}">` for code examples, with HTML entities for angle brackets
- Footnote references use bracketed numbers: `[1]`, `[2]`, etc.
- Back-links use the ↩ character (`&#x21a9;` or `&larrhk;`)

## Checklist: Adding a New Element Style

1. Scope to `.prose`: `.prose element { ... }`
2. Use tokens with hardcoded fallbacks for all color, spacing, and font values
3. Add a comment header: `/* --- Element name ---- */`
4. Add `forced-colors` override if the element uses color/background to convey meaning
5. Add print override if background/decoration should be removed on paper
6. Add `prefers-reduced-motion` override if the element has transitions or animations
7. Add responsive override at 640px if layout changes

## Checklist: Adding a New Component

1. Use `.prose-{name}` class naming
2. Include appropriate ARIA attributes in the HTML pattern
3. Add `forced-colors`, print, and `prefers-reduced-motion` overrides as needed
4. Add responsive overrides at 640px if layout changes
5. Hide from print if the component is interactive-only
6. Ensure all interactive elements have `:focus-visible` styles using the standard focus ring pattern

## Reference Implementation

This repository contains the reference implementation:

```
prose-standalone.css   — the deliverable; single self-contained stylesheet
index.html             — style guide / demo page showing every prose element
docs/plans/            — design documents and implementation plans (historical)
.claude/launch.json    — preview server config (python3 http.server on port 8090)
```

The `index.html` demo uses `<article class="prose" id="main">` as its container, with a skip link, table of contents, back-to-top links, and copy buttons on code blocks. It demonstrates every element and component described in this specification.
