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
