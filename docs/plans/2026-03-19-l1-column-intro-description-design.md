# L1 Column Intro Description

## Summary

Add a panel-level `description` field to the mega-menu that displays below the
overview link in column 1 (L1), mirroring the existing column 2 (L2) inline
intro pattern. Applies to both desktop and mobile views.

## Data Layer — content.yaml

Add a `description` field to each panel config object, sibling to
`ariaLabel`/`overviewLabel`/`overviewHref`:

| Panel | Description |
|---|---|
| news-events | Stay current with FDIC announcements, upcoming events, and multimedia content. |
| career-development | Find training programs, job opportunities, and professional development resources to grow your career at the FDIC. |
| knowledge-base | Access policies, procedures, reference materials, and institutional knowledge across all FDIC divisions. |
| benefits | Review your compensation, health coverage, retirement options, and other employee benefit programs. |
| employee-services | Get help with IT, workplace, travel, library, and day-to-day operational support. |
| about | Learn about the FDIC's mission, organizational structure, regional offices, and workplace initiatives. |

When no `description` is provided for a panel, the column renders without an
intro block (graceful omission).

## Desktop — components.js

Mirror the L2 inline intro pattern in the L1 column rendering within
`FDICMegaMenu.updateView()`:

1. Accept `l1Description` from the view model.
2. When the overview row exists and `l1Description` is non-empty:
   - Set `data-column-intro="true"` on `this.l1Column`.
   - Add `menu-list--with-column-intro` class to `l1List`.
   - Inside the overview `<li>`, after the overview link, append a `<div>` with
     classes `menu-description menu-description--l1 menu-description--l1-inline-intro`
     containing the description text.
3. When no description: no `data-column-intro`, no intro div.

## Desktop — styles.css

Add L1-specific CSS rules paralleling the L2 ones:

- `.menu-description--l1-inline-intro` — 4px top padding, 10px bottom padding
  (matches `--l2-inline-intro`).
- `.mega-col--l1[data-column-intro="true"] .menu-description--l1` — max-width
  65ch.
- `.menu-list--with-column-intro .l1-item--overview` — reduced top padding to
  match the L2 overview style.
- `.menu-list--with-column-intro .l1-separator-item` — `display: block` with
  horizontal margin and lighter border color (matches L2 separator behavior).

## Desktop — script.js

Pass the panel's `description` through the view model:

```js
l1Description: panel?.description || "",
```

## Mobile — mobile-drawer.js

In `renderMobileDrillL1`, add an overview link and description at the top of the
drill view (before primary items), mirroring `renderMobileDrillL2`:

1. Use `appendMobileDrillLinkItem` for the panel overview link.
2. Use `appendMobileDrillDescriptionItem` for the panel description.
3. Place these before the primary L1 items.

## Files Changed

- `content.yaml` — add `description` to each panel
- `components.js` — L1 inline intro rendering in `updateView()`
- `styles.css` — L1 intro CSS rules
- `script.js` — pass `l1Description` in view model
- `mobile-drawer.js` — overview link + description in `renderMobileDrillL1`

## Files Unchanged

state.js, events.js, search.js, init.js, runtime.js
