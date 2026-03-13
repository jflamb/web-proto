# Lessons

Use this file to record correction-driven learning.

## Template
- Date:
- Trigger / correction:
- Root cause:
- Prevention rule:
- Actionable check for future tasks:

## Entries
- (Add entries as corrections happen)

- Date: 2026-02-25
- Trigger / correction: User flagged that endpoint forms had not been fully field-audited and suspected missing critical questions.
- Root cause: I completed routing/action-code normalization before finishing field-level parity validation across all terminal forms.
- Prevention rule: Do not claim pathway completeness until field-level inventories are captured for every form-bearing endpoint in scope.
- Actionable check for future tasks: For IA/form replacement work, produce a required-field matrix and gap report before finalizing intake schema decisions.

- Date: 2026-02-26
- Trigger / correction: User flagged FAQ rendering issues where generic link text ("website") remained inaccessible and context-based label mapping mislabeled CFPB links as FTC links.
- Root cause: Link-label resolution prioritized nearby sentence context over link destination, and list structure heuristics did not convert obvious sequential definition runs into semantic lists.
- Prevention rule: Prefer destination-first link labeling and only use surrounding context as fallback; add semantic list promotion rules for repeated structured lines separated by `<br>`.
- Actionable check for future tasks: For content-normalization changes, validate at least one representative mixed-agency link sentence and one BR-delimited sequence that should become an ordered or unordered list.

- Date: 2026-02-26
- Trigger / correction: User requested source-only FAQ cleanup with no render-time transforms; a broad first-pass rewrite over-mutated links before being rolled back.
- Root cause: Overly aggressive global rewrite rules were applied before isolating high-risk malformed patterns and validating against known outlier answers.
- Prevention rule: For large corpus HTML cleanup, run constrained transforms first, keep a local backup, and gate each rule with residual scans before expanding scope.
- Actionable check for future tasks: Always run pattern-based pre/post audits (`href` integrity, bare URL text, empty anchors, broken stubs) and spot-check known-problem `urlName` entries before finalizing.

- Date: 2026-03-08
- Trigger / correction: User reported critical a11y regressions in `fdicnet-main-menu` (hidden menu still in accessibility tree, keyboard loss of L3 preview, and missing focus indicators).
- Root cause: Interaction logic prioritized visual state/hover behavior but did not enforce equivalent keyboard and assistive-technology state management.
- Prevention rule: For any expandable nav/menu work, treat `hidden` state and focus-visible styling as required acceptance criteria, not optional polish.
- Actionable check for future tasks: Before completion, run a keyboard-only pass (`Tab`, `Shift+Tab`, arrow keys, `Escape`) and verify closed content is not reachable by tab or screen-reader tree.

- Date: 2026-03-08
- Trigger / correction: User reported first-column arrow navigation did not reach Overview and right-arrow into L2 had no visible focus transition.
- Root cause: Roving arrow scope was limited to `.l1-item` and did not include the first-column overview control; focus-triggered L2 re-renders replaced the focused node without restoring focus.
- Prevention rule: For composite menu keyboard work, include all focusable controls in roving sets and preserve focus identity across any render cycle triggered by focus events.
- Actionable check for future tasks: Run a keyboard path test for each column (`Down` from first item to final control, `Right`/`Left` column hops) and verify the focused element remains visibly focused after each keypress.

- Date: 2026-03-08
- Trigger / correction: User requested top header nav items to behave as one tab stop with arrow-key navigation and keyboard toggle behavior for menu visibility.
- Root cause: Header navigation used default tab sequence across multiple items and lacked roving keyboard semantics at the top-nav level.
- Prevention rule: For horizontal header navigation, implement roving tabindex by default and wire `ArrowLeft`/`ArrowRight` plus key activation (`Enter`/`Space`) for interactive toggles.
- Actionable check for future tasks: In keyboard QA, verify only one top-nav item is tabbable at a time and that `ArrowLeft`/`ArrowRight` moves focus across all top-level items without adding extra tab stops.

- Date: 2026-03-08
- Trigger / correction: User reported that pressing `Space` on a first-column menu item caused focus to disappear.
- Root cause: L1 activation re-rendered menu columns and replaced the focused element without explicitly restoring keyboard focus.
- Prevention rule: Any keyboard-activatable control that triggers re-render must restore focus to a deterministic target immediately after render.
- Actionable check for future tasks: Add a keyboard regression step for `Enter` and `Space` activation on each roving item and verify visible focus remains on the same item (or an intentional next target).

- Date: 2026-03-08
- Trigger / correction: User reported that clicking header areas outside top-level menu items did not close the open menu.
- Root cause: Global pointer close logic only handled clicks outside the entire header, so in-header non-menu clicks were excluded.
- Prevention rule: For click-off behavior, define explicit keep-open targets and close on all other pointer targets.
- Actionable check for future tasks: Add a pointer regression pass covering four zones: top-nav button, mega-menu panel, header non-menu controls, and page body.

- Date: 2026-03-09
- Trigger / correction: User reported mobile drawer regressions: redundant vertical selector stack above accordions, non-obvious/non-working accordion interactions, and mismatch with DS off-canvas treatment.
- Root cause: Mobile implementation layered multiple navigation models (top-level panel selector + nested accordions) instead of one coherent accordion hierarchy, which increased state complexity and interaction ambiguity.
- Prevention rule: On mobile off-canvas navigation, ship one hierarchy model only (single accordion system) and reject parallel selector patterns that duplicate IA levels.
- Actionable check for future tasks: Add a mobile smoke test that validates initial closed state, single visible accordion hierarchy, default-collapsed sections, and functional L2 split-toggle expansion before sign-off.

- Date: 2026-03-09
- Trigger / correction: User reported drawer IA mismatch: missing full top-level menu, lingering `Expand all`, and inset accordion stack not filling drawer width.
- Root cause: Mobile implementation optimized around the active panel only and retained interim group-header controls/styles that conflicted with the intended full-menu accordion IA.
- Prevention rule: Validate mobile drawer information architecture against final interaction model before visual polish; do not leave transitional controls in production path.
- Actionable check for future tasks: Add a QA checklist item requiring all top-level sections to be visible as first-level drawer accordions and verify edge-to-edge row alignment at target mobile viewport.

- Date: 2026-03-09
- Trigger / correction: User requested replacing nested accordion interactions with a drill-in hierarchy model for mobile drawer navigation.
- Root cause: The previous architecture assumed accordion disclosure at each depth, which constrained link affordance and interaction clarity for multi-level navigation.
- Prevention rule: Confirm interaction paradigm (accordion vs drill-in) before implementing component-level state to avoid rework across both JS state and CSS selectors.
- Actionable check for future tasks: During first implementation pass, validate one concrete path (`Top level -> L1 -> L2 -> L3`) against UX expectation before finalizing state model.

- Date: 2026-03-09
- Trigger / correction: User reported mobile drill rows were visually equal-height even when content wrapped to multiple lines.
- Root cause: Row styles used fixed-like vertical rhythm (`min-height` with no vertical padding), so two-line content often remained at the same visual height as one-line rows.
- Prevention rule: For variable-length nav labels, use content-driven block sizing (`min-height` + vertical padding + wrapping), not fixed row heights.
- Actionable check for future tasks: In mobile QA, verify at least one one-line and one wrapped two-line item have different rendered heights while preserving minimum touch target size.

- Date: 2026-03-09
- Trigger / correction: User reported first-column focus rectangle appeared only left of the label instead of covering the entire row.
- Root cause: Focus ring was applied only to the full-bleed left extension pseudo-element and not the row element itself.
- Prevention rule: For full-bleed row treatments, ensure focus indicators are applied to both extension and in-column item regions.
- Actionable check for future tasks: In keyboard QA, verify focus ring continuity from viewport-edge extension through the full clickable row width in first-column items.

- Date: 2026-03-09
- Trigger / correction: User reported first-column focus appeared as two separately outlined regions with a seam.
- Root cause: Focus indication was rendered as two independent rings (row box + extension layer), which visually split at the join.
- Prevention rule: For split visual layers, draw focus ring via a single continuous overlay that spans the combined hit area.
- Actionable check for future tasks: In visual QA at 100% zoom, inspect focused full-bleed rows for seam artifacts at extension boundaries.
- Date: 2026-03-09
- Trigger / correction: User reported the mobile drawer close control disappeared after drilling past top-level navigation.
- Root cause: Mobile toggle sync logic hid the nav toggle whenever drill depth was greater than zero, removing the only persistent close affordance in deeper drawer states.
- Prevention rule: Off-canvas navigation must keep a persistent global close control visible at every hierarchy depth.
- Actionable check for future tasks: In mobile QA, verify `Close` remains visible and actionable at root, L1, L2, and L3 drill states.

- Date: 2026-03-11
- Trigger / correction: User reported mobile menu focus remained on background page elements after opening, despite keyboard navigation support being added.
- Root cause: Mobile keyboard updates focused on arrow-key handling but did not guarantee focus transfer/retention inside the drawer after open and drill-view rerenders.
- Prevention rule: For any off-canvas/mobile drawer keyboard work, treat focus transfer on open and focus containment after dynamic rerender as first-class acceptance criteria.
- Actionable check for future tasks: In mobile QA, open the drawer via pointer and keyboard, then confirm `document.activeElement` is inside the drawer immediately and remains inside after each drill navigation step.

- Date: 2026-03-12
- Trigger / correction: User reported `events.js` referenced `mobileNavBackdrop` inside the mobile drawer event binding block without destructuring it from `getDom()`.
- Root cause: Event wiring assumed an outer-scope DOM reference instead of using the locally destructured DOM contract for the module.
- Prevention rule: When binding events from `getDom()` results, every referenced node must be explicitly destructured in the same scope as its handlers.
- Actionable check for future tasks: After adding or moving event handlers, scan each referenced DOM identifier against the local destructure list before sign-off.

- Date: 2026-03-12
- Trigger / correction: User reported the mobile breadcrumb separator was rendered as CSS `content: ">"`, which assistive tech may announce as "greater than."
- Root cause: Visual breadcrumb styling used pseudo-element text content for separators without considering how that character can surface to screen readers.
- Prevention rule: Do not use meaningful text characters in CSS-generated breadcrumb separators; render explicit decorative markup with `aria-hidden` instead.
- Actionable check for future tasks: For breadcrumb or stepper UI, inspect separators and confirm assistive tech only receives the labels, not decorative punctuation.

- Date: 2026-03-13
- Trigger / correction: User reported the bottom overview link in second- and third-level mobile drill views did not gain underline on hover after the mobile underline treatment change.
- Root cause: The interaction selector update covered `.mobile-drill-link` and `.mobile-drill-current-link` focus/active states, but missed the hover state for the overview-row variant.
- Prevention rule: When multiple UI variants share one interaction pattern, verify every variant-specific class is covered for every intended state, not just the primary class.
- Actionable check for future tasks: After changing shared hover/focus/active styling, test one example each of the default link, current/overview link, and breadcrumb variants in the browser.

- Date: 2026-03-12
- Trigger / correction: User reported the mobile breadcrumb current item used `aria-current="page"` even though the breadcrumb represents in-menu section location, not page navigation.
- Root cause: Breadcrumb semantics were chosen from common page-navigation patterns instead of the actual drill-in menu context used by this component.
- Prevention rule: Match `aria-current` values to the real navigation model; use `location` for current position within a composite menu path and reserve `page` for actual page-level navigation.
- Actionable check for future tasks: For breadcrumbs and steppers, verify the chosen `aria-current` token against the WAI-ARIA meaning before sign-off.

- Date: 2026-03-12
- Trigger / correction: User reported duplicate desktop min-height media query blocks in `styles.css` with identical selectors and declarations.
- Root cause: Repeated layout tuning accumulated in separate passes without a final duplicate-rule cleanup.
- Prevention rule: After CSS layout refinements, scan for repeated selector blocks with identical declarations and collapse them to one authoritative rule.
- Actionable check for future tasks: Run a targeted duplicate-rule pass around recently edited selectors before sign-off, especially for repeated media-query overrides.

- Date: 2026-03-12
- Trigger / correction: User reported mobile drill `<ul>` containers lacked explicit `role="list"` even though Safari + VoiceOver can drop list semantics when `list-style: none` is applied.
- Root cause: Mobile drawer list rendering relied on native `<ul>` semantics without accounting for the Safari/VoiceOver behavior change introduced by reset styling.
- Prevention rule: For navigation lists styled with `list-style: none`, add explicit `role="list"` when cross-browser assistive-tech support is known to be fragile.
- Actionable check for future tasks: In a11y review, inspect any reset-styled `<ul>/<ol>` used for navigation or breadcrumbs and confirm list semantics remain exposed in Safari + VoiceOver fallback patterns.

- Date: 2026-03-12
- Trigger / correction: User reported mobile `ArrowLeft` drill-back always focused the first item instead of the trigger that opened the current section.
- Root cause: Back-navigation logic preserved hierarchy state but discarded opener identity, so focus restoration used a generic first-item fallback after rerender.
- Prevention rule: When drill-in navigation rerenders a parent view, restore focus by matching the control that opened the child path, not by defaulting to the first focusable item.
- Actionable check for future tasks: For every drill-in/back pattern, test entering from a non-first item and verify `ArrowLeft` and `Escape` both return focus to that exact opener.

- Date: 2026-03-12
- Trigger / correction: User reported `styles.css` consumed `--ds-font-size-sm` without defining it in the shared token block.
- Root cause: Component styling adopted a tokenized font-size reference without updating the root token inventory to include the new size.
- Prevention rule: When introducing a new CSS custom property consumer, add or verify the token definition in the nearest shared token block in the same change.
- Actionable check for future tasks: After tokenizing styles, run a repo-local scan for each new `var(--token-name)` and confirm at least one authoritative definition exists.

- Date: 2026-03-13
- Trigger / correction: User reported `fdicnet-main-menu` was calling `refreshDomRefs()` throughout hot render and interaction paths even though the DOM was stable.
- Root cause: DOM-ref caching was implemented, but follow-on features kept treating `refreshDomRefs()` as a harmless preamble instead of restricting it to actual DOM-shape changes.
- Prevention rule: When a module caches DOM references, refresh them only at known invalidation boundaries such as startup, markup replacement, or breakpoint-driven structure changes.
- Actionable check for future tasks: For any DOM-ref helper, run a post-change scan of call sites and justify each remaining refresh against a real DOM invalidation event.

- Date: 2026-03-13
- Trigger / correction: User reported the mega-menu stopped opening on hover after the DOM-ref refresh reduction refactor.
- Root cause: I replaced a tailored event-binder `getDom()` contract with the shared helper without preserving non-DOM dependencies (`mobileNavMediaQuery`, `phoneSearchMediaQuery`), causing event binding to crash before hover behavior was wired.
- Prevention rule: When consolidating dependency providers, compare the old and new contracts field-by-field and preserve every consumer-required non-DOM dependency.
- Actionable check for future tasks: After changing any dependency/binder contract, run one live browser smoke test that exercises the first interactive path relying on that contract.

- Date: 2026-03-13
- Trigger / correction: User reported the mobile drawer opened blank after the same DOM-ref refresh reduction refactor.
- Root cause: I removed `refreshDomRefs` from the mobile drawer controller injection site but left a stale `refreshDomRefs()` call inside `mobile-drawer.js`, so the drawer crashed on render in mobile viewport.
- Prevention rule: When removing a dependency from a module boundary, clear both the provider and every in-module use before considering the contract change complete.
- Actionable check for future tasks: After dependency-pruning refactors, run a symbol scan for the removed dependency name and verify no stale consumer references remain.

- Date: 2026-03-13
- Trigger / correction: User reported pressing `Escape` in the desktop search box briefly closed the suggestions and then immediately reopened them.
- Root cause: I restored focus to the search input after closing the popup but did not suppress the existing focus handler that automatically reopens suggestions when the field still has text.
- Prevention rule: When restoring focus after dismissing a combobox popup, account for any focus-triggered open behavior so dismissal does not immediately reverse itself.
- Actionable check for future tasks: For combobox keyboard changes, explicitly test `Escape` with a non-empty query and verify the popup stays closed for at least one frame after focus restoration.

- Date: 2026-03-13
- Trigger / correction: User reported the first-column and second-column desktop menu alignment still did not match after my initial padding change, and the first column was missing the requested active accent stripe.
- Root cause: I treated “same left padding” as a raw CSS padding-value change in column 2 instead of matching the full visual treatment across columns, including each column’s active-state geometry.
- Prevention rule: For cross-column alignment requests, compare the rendered inset and active affordance in-browser before changing only one column’s padding values.
- Actionable check for future tasks: When adjusting desktop mega-menu column alignment, inspect at least one live open menu state and verify both label inset and active indicator treatment for L1 and L2 together.

- Date: 2026-03-13
- Trigger / correction: User reported the bottom overview row in desktop column 1 did not show the same hover styling as the bottom overview row in column 2.
- Root cause: The first-column overview row depended on broad `.l1-item` interaction styling instead of having an explicit variant rule, so parity drifted when overview-row treatments were tuned elsewhere.
- Prevention rule: When parallel UI variants exist across menu columns, give each variant an explicit parity check and avoid assuming the base class remains sufficient after follow-on styling changes.
- Actionable check for future tasks: After hover/focus styling changes in the desktop mega-menu, test the overview row at the bottom of both column 1 and column 2, not just standard rows.

- Date: 2026-03-13
- Trigger / correction: User reported I had reintroduced a blue stripe under the active main-menu item while trying to preserve the blue stripe under the main navigation bar.
- Root cause: I conflated the selected tab's `::after` cue with the nav container's bottom border accent and restored both, even though only the nav-level stripe was desired.
- Prevention rule: When a design uses both item-level and container-level accents, treat them as separate layers and verify which one the user means before restoring or moving both.
- Actionable check for future tasks: After nav/mega-menu overlap changes, inspect one open state specifically for both the selected tab underline and the nav bottom border and confirm only the intended stripe remains visible.

- Date: 2026-03-13
- Trigger / correction: User clarified that `36px` desktop mega-menu rows should apply only to single-line items, while wrapped labels should keep the same padding and grow vertically.
- Root cause: I translated the sizing request into a fixed `height: 36px` rule instead of a `min-height` rule, which compressed wrapped content.
- Prevention rule: When a user gives a target component height, confirm whether it is a fixed height or a minimum height before enforcing it in CSS.
- Actionable check for future tasks: After row-height changes in navigation UIs, verify one single-line item and one wrapped item in-browser to confirm both compact and expanded cases render correctly.

- Date: 2026-03-13
- Trigger / correction: User reported the mega-menu shadow still looked too crisp and the hovered third-column item changed color along the last stretch at the right edge.
- Root cause: The mega-menu `clip-path` was clipping the configured shadow blur, and the L3 hover extension pseudo-element used a different overlay treatment than the hovered row itself.
- Prevention rule: When using clipped panel containers and pseudo-element bleed extensions, verify both shadow paint bounds and color parity in the actual rendered hover state.
- Actionable check for future tasks: After mega-menu visual polish changes, inspect one open desktop state for the shadow silhouette and one L3 hover state at the right frame edge to confirm there is no clipped blur or color seam.

- Date: 2026-03-13
- Trigger / correction: User reported the mega-menu shadow was still clipped along the left edge after I had only expanded the vertical blur bounds.
- Root cause: I widened the clip-path for top and bottom blur but left the horizontal insets tied to the smaller frame-bleed value, so the left-side shadow still hit a paint boundary.
- Prevention rule: When unclipping box-shadow on a panel that uses `clip-path`, check all four sides against the blur radius instead of assuming vertical fixes solve horizontal clipping too.
- Actionable check for future tasks: After any shadow/clip-path change, inspect left, right, top, and bottom shadow edges individually in the browser rather than treating the silhouette as a single condition.

- Date: 2026-03-13
- Trigger / correction: User showed that opening the search box in mobile view left the submit arrow floating far down the sheet instead of aligned with the input.
- Root cause: The mobile search sheet reused the desktop search controls, but the mobile field never overrode the desktop absolute positioning for the clear/submit buttons, so those controls positioned themselves against the growing field container instead of a compact row.
- Prevention rule: When reusing desktop control markup inside a mobile modal or sheet, explicitly reset any absolute positioning assumptions and define the mobile layout container.
- Actionable check for future tasks: After adapting shared search or form controls to mobile, open the real overlay at phone width and verify the input, clear button, and submit button align on one row before sign-off.

- Date: 2026-03-13
- Trigger / correction: User reported the mega-menu shadow was still clipped on the left and right in wider desktop viewports even after earlier clip-path expansions.
- Root cause: I expanded the paint bounds incrementally, but I initially sized them only against the shadow blur and not against the combined width of the frame bleed plus the shadow blur.
- Prevention rule: When a shadowed pseudo-element already extends beyond a container via frame bleed, size clip-path or overflow allowances against the pseudo-element edge plus blur, not just the blur radius alone.
- Actionable check for future tasks: For shadowed panels with frame bleeds, compute the required paint margin as `bleed + blur` and verify at a wide desktop viewport where side clipping is easiest to spot.

- Date: 2026-03-13
- Trigger / correction: User reported the mobile search sheet was still badly broken even after I had fixed the input-row button anchoring.
- Root cause: I focused on the button-positioning symptom and missed that the sheet itself was a full-height CSS grid, which stretched empty rows and pushed the field, hint, and status blocks far down the viewport.
- Prevention rule: When a mobile overlay shows large unexplained gaps, inspect the container layout model first before refining child positioning.
- Actionable check for future tasks: For modal or sheet regressions on mobile, measure the overlay child block positions in-browser and verify the container is not stretching empty rows or empty result/status regions.

- Date: 2026-03-13
- Trigger / correction: User clarified that the mobile search interaction should not be a modal or sheet at all; it should expand inline inside the dark-blue masthead and push the page content down.
- Root cause: I repaired the broken overlay implementation instead of stepping back to confirm whether the overlay interaction model itself matched the intended design.
- Prevention rule: When a mobile UI feels structurally wrong, verify the requested interaction model before polishing the existing implementation.
- Actionable check for future tasks: For mobile header search work, confirm whether the control should be modal, dropdown, or inline-in-header before changing only the field layout or button positioning.
