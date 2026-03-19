# Empty Column 2 State with Ghost Prompt

**Date:** 2026-03-19
**Status:** Approved
**Branch:** feat/fdicnet-main-menu-column2-intro-mobile-followups

## Problem

With the new overview links at the top of column 1, automatically selecting the first L1 item on menu open and showing its children in column 2 is confusing. Users don't understand why content is pre-populated.

## Decision

Column 2 stays empty until the user hovers or focuses an L1 item with children. A ghost prompt softens the empty space.

## Design

### State model

- `getDefaultL1Index()` returns `null` when the panel has multiple L1 items (preserves current behavior for single-item panels).
- `selectedL1Index: null` means "no L1 selected" — the view model passes empty `l2Items`, `l3Items`, and null `l2Overview`.
- First `setSelectedL1(index)` call (hover or focus) transitions from `null` to the index. Once set, it stays set — no path back to `null`.
- `resetPanelSelection()` resets back to `null` so each panel opens fresh.
- Mobile drill-down is unaffected.

### View model & rendering

- When `selectedL1Index` is `null`, `getMegaMenuViewModel()` includes `showEmptyState: true`.
- Column 2 renders a ghost prompt `<p class="menu-empty-hint">` with text: "Select a category to see its links".
- Column 3 stays empty (background only).
- No L1 item gets `data-selected="true"` — no accent rail or highlight in column 1.

### Ghost prompt styling

- `color: var(--ds-text-secondary)`
- `font-size: 15px`
- `opacity: 0.7`
- `padding: 8px 24px` (matches `menu-description` spacing)

### Keyboard & accessibility

- Roving tabindex still works — `l1FocusIndex` starts at `0` so keyboard users can tab into column 1 and arrow through items.
- On focus of any L1 item with children, `setSelectedL1(index)` fires via the existing `fdic-mega-l1-preview` handler (`fromFocus: true`), populating column 2.
- The ghost prompt `<p>` is not focusable, has no ARIA role — purely decorative.
- Existing live region announcement on panel open still fires.

## Scope

- Desktop mega-menu only (columns 2 and 3).
- Mobile drill-down navigation is not affected.
