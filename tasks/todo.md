# TODO

## Current Task (FDICnet Menu Consistency + A11y Staged Delivery)
- [x] Stage 1 (Priority 1): Add hover-intent delay and consistent desktop hover traversal behavior.
- [x] Stage 2 (Priority 2): Align IA cues between desktop and mobile (path context, overview placement, state continuity).
- [x] Stage 3 (Priority 3): Improve accessibility parity (ARIA semantics, mobile back key support, focus containment).
- [ ] Stage 4 (Priority 4): Visual/readability polish for dense labels and cross-mode affordance consistency.
- [ ] Validate each stage in browser before commit.
- [ ] Push branch and open pull request.

## Review / Results (Stage 1 - Priority 1)
- Updated `sites/fdicnet-main-menu/events.js`:
  - added hover-intent delay (`140ms`) for desktop top-nav panel preview.
  - added hover-intent delay (`140ms`) for desktop L1 and L2 preview switching.
  - preserved immediate focus-driven behavior for keyboard interactions (no delay on focus previews).
  - added timer cancellation guards on pointer exits and global pointerdown to prevent stale delayed previews.
- Browser validation:
  - Desktop hover traversal still works, now with intentional delay to reduce accidental fly-over panel switches.

## Review / Results (Stage 2 - Priority 2)
- Updated `sites/fdicnet-main-menu/components.js` + `script.js`:
  - added desktop mega-menu path context line (`Panel / L1 / L2`) that updates with current preview/selection.
- Updated `sites/fdicnet-main-menu/mobile-drawer.js` + `styles.css`:
  - aligned mobile L1 ordering with desktop by moving the Overview row to the bottom and adding a separator.
- Updated `sites/fdicnet-main-menu/script.js`:
  - preserved top-panel continuity for mobile open state by defaulting first open path to `[activePanelKey]` instead of resetting to root.
- Browser validation:
  - Desktop: context path renders and updates when hovering top nav.
  - Mobile: drawer opens directly into active panel L1 list and places Overview at bottom with separator.

## Review / Results (Stage 3 - Priority 3)
- Updated `sites/fdicnet-main-menu/components.js`:
  - added `aria-haspopup=\"true\"` to top-nav menu buttons.
- Updated `sites/fdicnet-main-menu/mobile-drawer.js`:
  - added `id=\"fdicMobileDrawerPanel\"` to drawer panel container.
  - added mobile drill trigger semantics: `aria-haspopup`, `aria-controls`, `aria-expanded`, and clearer `aria-label`.
- Updated `sites/fdicnet-main-menu/events.js`:
  - added `ArrowLeft` back-navigation for mobile drill depth.
  - added mobile drawer focus trap for `Tab`/`Shift+Tab` to keep focus in drawer/toggle while open.
- Browser validation:
  - `ArrowLeft` reduces drill depth by one level and keeps focus in drawer.
  - repeated `Tab` navigation stays trapped inside drawer/toggle while open.
  - ARIA attribute checks pass for desktop top-nav and mobile drill triggers.

## Current Task (FDICnet Open-State Nav/Mega-Menu Gap Removal)
- [x] Remove residual spacing between top nav and mega-menu in open state.

## Review / Results (FDICnet Open-State Nav/Mega-Menu Gap Removal)
- Updated `sites/fdicnet-main-menu/styles.css`:
  - changed open-state top-nav accent handling to collapse border height:
    - `.fdic-header.menu-open .fdic-nav { border-bottom-width: 0; border-bottom-color: transparent; }`
- Result: no visible gap remains between the top nav and the open mega-menu panel.

## Current Task (FDICnet Closed-State Main Menu Accent Line)
- [x] Add light-blue accent line directly below top nav when mega-menu is closed.
- [x] Suppress that line while mega-menu is open to avoid double accents.
- [x] Scope behavior to desktop/tablet menu mode.

## Review / Results (FDICnet Closed-State Main Menu Accent Line)
- Updated `sites/fdicnet-main-menu/styles.css`:
  - added desktop/tablet (`min-width: 769px`) `border-bottom: 6px solid var(--menu-bottom-accent)` on `.fdic-nav`.
  - added `.fdic-header.menu-open .fdic-nav { border-bottom-color: transparent; }` so open mega-menu state uses only the panel accent treatment.

## Current Task (FDICnet Mega-Menu Header Overlap Fix)
- [x] Align desktop/tablet mega-menu top offset to actual header height.

## Review / Results (FDICnet Mega-Menu Header Overlap Fix)
- Updated `sites/fdicnet-main-menu/styles.css`:
  - changed desktop/tablet `.mega-menu` top anchor from fixed token calc to `top: 100%` relative to `.fdic-header`.
- Result: mega-menu now opens directly below the top-level header/nav stack without overlapping it.

## Current Task (FDICnet Always-Visible Child Chevrons)
- [x] Keep chevrons visible at rest for items that render a chevron (items with children).
- [x] Remove hover/selected-only chevron opacity gating in desktop menu styles.

## Review / Results (FDICnet Always-Visible Child Chevrons)
- Updated `sites/fdicnet-main-menu/styles.css`:
  - `.l1-caret` now has default `opacity: 1`.
  - removed hover/focus/selected opacity toggles for `.l1-caret` and `.l2-caret`.
- Result: chevrons are visible in normal state for all items that have children; childless items still render no chevron.

## Current Task (FDICnet Mobile Chevron Child-Only Rendering)
- [x] Show mobile drill chevron only when the next level has content.
- [x] Render no-child mobile drill rows as direct links instead of drill triggers.
- [x] Run syntax sanity check.

## Review / Results (FDICnet Mobile Chevron Child-Only Rendering)
- Updated `sites/fdicnet-main-menu/mobile-drawer.js`:
  - `appendMobileDrillItem(...)` now conditionally renders:
    - drill button with right chevron when child content exists
    - direct link (no chevron) when no child content exists
  - applied child-content checks at root, L1, and L2 mobile drill render levels.
- Verification:
  - `node --check sites/fdicnet-main-menu/mobile-drawer.js` passed.

## Current Task (FDICnet Conditional Right Chevron Rendering)
- [x] Show L1 chevron only when L2 content exists.
- [x] Show L2 chevron only when L3 content exists.
- [x] Run syntax sanity check.

## Review / Results (FDICnet Conditional Right Chevron Rendering)
- Updated `sites/fdicnet-main-menu/components.js` render logic:
  - L1 rows now append right chevron only when `item.l2` has entries.
  - L2 rows now append right chevron only when `item.l3` has entries.
- Verification:
  - `node --check sites/fdicnet-main-menu/components.js` passed.

## Current Task (FDICnet Content YAML Full Hierarchy Alignment)
- [x] Translate provided IA outline into menu YAML schema.
- [x] Update `sites/fdicnet-main-menu/content.yaml` to match provided labels and hierarchy.
- [x] Run YAML parse/sanity checks for structure compatibility.
- [x] Add review/results summary.

## Review / Results (FDICnet Content YAML Full Hierarchy Alignment)
- Updated `sites/fdicnet-main-menu/content.yaml` with the provided full hierarchy:
  - top-level panels preserved as `News & Events`, `Career Development & Training`, `Knowledge Base`, `Benefits`, `Employee Services`, and `About`.
  - mapped provided nested entries into renderer schema keys: `l1`, `l2`, and `l3`.
  - retained schema compatibility fields (`overviewLabel`, `overviewHref`, `href`, `description`, `id`).
- Validation:
  - YAML parse check: `ruby -ryaml -e 'YAML.load_file(...)'` passed.
  - structural sanity: `menu.panels` count is `6`; `header.nav` count is `6`.
  - deep-content spot checks passed for representative entries, including:
    - `Global Digest FAQ`
    - `Career Management Program Series`
    - `Regulations.gov (Federal Rule-making Portal)`
    - `Policy on FDIC Foreign Technical Assistance Program`
    - `CWT Sato Travel’s Get There`
    - `FDIC Employee Viewpoint Survey FAQ`

## Current Task (FDICnet L1 Overview Row Placement)
- [x] Move first L1 item to bottom of first-column list.
- [x] Render bottom overview row without chevron.
- [x] Add divider between standard L1 items and bottom overview row.
- [x] Keep default panel selection on first non-overview L1 item.
- [x] Run syntax + runtime regression checks.

## Review / Results (FDICnet L1 Overview Row Placement)
- Updated `sites/fdicnet-main-menu/components.js`:
  - renders primary L1 items first (`l1[1..n]`), then appends a divider and `l1[0]` as a bottom overview row.
  - overview row uses `.l1-item--overview` and no chevron.
  - overview row is excluded from `fdic-mega-l1-preview` hover/focus preview events.
- Updated `sites/fdicnet-main-menu/script.js` + `sites/fdicnet-main-menu/init.js`:
  - default L1 selection/focus now starts at first non-overview item when available (`index 1`).
- Updated `sites/fdicnet-main-menu/styles.css`:
  - added `.l1-separator-item` / `.l1-separator-line` divider styling.
  - added `.l1-item--overview` layout rule.

## Current Task (FDICnet Remove L2 Overview Row)
- [x] Remove the second-column bottom overview link and separator from mega-menu rendering.
- [x] Keep existing L2 item rendering and keyboard behavior intact.
- [x] Run runtime regression check to confirm no `.l2-item--overview` row is generated.

## Review / Results (FDICnet Remove L2 Overview Row)
- Updated `sites/fdicnet-main-menu/components.js`:
  - removed the L2 separator + synthetic bottom overview row creation in `FDICMegaMenu.updateView(...)`.
- Verification:
  - `node --check sites/fdicnet-main-menu/components.js`
  - Runtime check (cache-busted load): `#l2List` no longer contains `.l2-item--overview` or `.l2-separator-item`.
  - Runtime check on populated L1 section still shows expected direct L2 links only.

## Current Task (FDICnet Menu Content IA Refresh)
- [x] Replace `sites/fdicnet-main-menu/content.yaml` menu taxonomy to match the provided IA outline.
- [x] Keep YAML schema compatible with existing menu renderer.
- [x] Run runtime load sanity checks and verify no content-load regressions.

## Review / Results (FDICnet Menu Content IA Refresh)
- Updated `sites/fdicnet-main-menu/content.yaml` to align panel/L1/L2 labels with the provided IA:
  - `News & Events`
  - `Career Development & Training`
  - `Knowledge Base`
  - `Benefits`
  - `Employee Services`
  - `About`
- Preserved existing schema keys used by the renderer (`header.nav`, `menu.panels`, `l1`, `l2`, `overviewHref`, `href`, `description`).
- Runtime verification:
  - content loaded successfully (no console errors on reload).
  - state inspection confirmed updated panel/L1 label sets are present in `window.FDICMenuState.menuState.siteContent`.

## Current Task (FDICnet Mega-Menu Scrim Overlay)
- [x] Add a subtle content scrim behind the open desktop/tablet mega-menu.
- [x] Keep mobile drawer/backdrop behavior unchanged.
- [x] Verify click-off close and runtime layering behavior.

## Review / Results (FDICnet Mega-Menu Scrim Overlay)
- Updated `sites/fdicnet-main-menu/index.html`:
  - added `<div id="megaMenuScrim" class="mega-menu-scrim" aria-hidden="true"></div>` directly after header.
- Updated `sites/fdicnet-main-menu/styles.css`:
  - added `.mega-menu-scrim` fixed overlay styling with subtle darkening (`rgba(0, 0, 0, 0.2)`).
  - tied visibility to desktop/tablet open state via `.fdic-header.menu-open + .mega-menu-scrim`.
  - set scrim layer below mega-menu but above page content.
  - disabled scrim on mobile (`display: none`) so mobile drawer backdrop remains the only dim layer.
- Verification:
  - Desktop runtime: when menu is open, scrim is visible (`opacity: 1`, `pointer-events: auto`).
  - Desktop click-off: pointer interaction on scrim closes the mega-menu.
  - Mobile runtime: scrim is not rendered (`display: none`), mega-menu remains `position: static`, drawer flow remains active.

## Current Task (FDICnet Mega-Menu Overlay Layout)
- [x] Change desktop/tablet mega-menu to overlay page content instead of affecting document flow.
- [x] Preserve mobile drawer behavior and existing menu open/close interactions.
- [x] Run runtime regression checks (desktop overlap + mobile sanity).

## Review / Results (FDICnet Mega-Menu Overlay Layout)
- Updated `sites/fdicnet-main-menu/styles.css`:
  - set `.fdic-header` to `position: relative` with stacking context.
  - changed desktop/tablet `.mega-menu` to absolute positioning below masthead + top-nav:
    - `position: absolute`
    - `top: calc(var(--layout-masthead-height) + var(--layout-top-nav-item-height))`
    - `left: 0`
    - raised z-index so panel overlays page content.
  - added mobile reset under `@media (max-width: 768px)` so mega-menu remains non-overlay (`position: static`) while the existing drawer model remains authoritative.
- Verification:
  - Desktop runtime: `main.page-content` top position remains unchanged when menu opens; computed mega-menu rect overlaps main content region.
  - Mobile runtime: drawer opens/closes normally; `#megaMenu` computes to `position: static`.

## Current Task (FDICnet L1 Link-Style Navigation)
- [x] Render desktop first-column (L1) rows as links to each L1 overview URL.
- [x] Preserve L1 hover/focus preview behavior for column 2/3 content.
- [x] Align L1 visual styling with L2/L3 link treatment.
- [x] Run syntax + desktop/mobile runtime regression checks.

## Review / Results (FDICnet L1 Link-Style Navigation)
- Updated `sites/fdicnet-main-menu/components.js`:
  - desktop L1 rows now render as `<a class="l1-item">` with per-item `href` sourced from `item.overviewHref`.
  - removed standalone L1 bottom overview row from mega-menu markup.
  - preserved L1 hover/focus preview event emission (`fdic-mega-l1-preview`) for column 2/3 updates.
  - removed obsolete L1 click-select event handling.
- Updated `sites/fdicnet-main-menu/events.js`:
  - removed listener for obsolete `fdic-mega-l1-select` event.
- Updated `sites/fdicnet-main-menu/script.js` + `sites/fdicnet-main-menu/init.js`:
  - removed stale `l1OverviewLink` DOM dependency from orchestration and bootstrap required-element checks.
  - updated focus fallback target set to `.l1-item, .l2-item, .l3-item`.
- Updated `sites/fdicnet-main-menu/styles.css`:
  - L1 visual treatment now matches link-style rows (underline, link color, lighter weight).
  - removed unused `.overview-link` and `.overview-link-wrap` desktop styles.
- Verification:
  - `node --check sites/fdicnet-main-menu/components.js`
  - `node --check sites/fdicnet-main-menu/events.js`
  - `node --check sites/fdicnet-main-menu/script.js`
  - `node --check sites/fdicnet-main-menu/init.js`
  - runtime QA: desktop hover/focus preview + L1 click navigation + mobile drawer/escape sanity.

## Current Task (FDICnet Hover-Driven Top Nav + L1 Preview)
- [x] Make desktop top-level menu items open/switch panels on hover preview.
- [x] Make desktop first-column (L1) items preview L2/L3 on hover/focus, matching existing L2/L3 behavior.
- [x] Keep click and keyboard activation paths intact.
- [x] Run syntax checks and desktop/mobile runtime regression checks.

## Review / Results (FDICnet Hover-Driven Top Nav + L1 Preview)
- Updated `sites/fdicnet-main-menu/components.js`:
  - `fdic-top-nav` now emits `fdic-top-nav-preview` on desktop pointer hover over top-level buttons.
  - `fdic-mega-menu` now emits `fdic-mega-l1-preview` on L1 `mouseover` and `focusin`.
- Updated `sites/fdicnet-main-menu/events.js`:
  - bound `fdic-top-nav-preview` to orchestration callback `previewTopNavPanel(...)`.
  - bound `fdic-mega-l1-preview` to `setSelectedL1(index, { restoreFocus })`.
- Updated `sites/fdicnet-main-menu/script.js`:
  - added `previewTopNavPanel(panelKey, navIndex)` to switch/open panel on hover without forcing menu focus movement.
  - injected `previewTopNavPanel` into `bindFDICMenuEvents(...)`.
- Verification:
  - `node --check sites/fdicnet-main-menu/components.js`
  - `node --check sites/fdicnet-main-menu/events.js`
  - `node --check sites/fdicnet-main-menu/script.js`
  - Runtime QA (Chrome DevTools MCP):
    - desktop: top-nav hover switches open panel; L1 hover switches L2/L3 content.
    - desktop keyboard: `ArrowRight` roving across top nav still functions.
    - mobile: drawer open/drill/escape close path still restores focus to `#fdicNavToggle`.

## Current Task (Phase 4: Init/Bootstrap Module Extraction)
- [x] Extract bootstrap + content-loading flow into `sites/fdicnet-main-menu/init.js`.
- [x] Replace script-local `init()` with module-driven initializer.
- [x] Keep orchestration callbacks injected from `script.js`.
- [x] Run syntax + desktop/mobile runtime regression checks.

## Review / Results (Phase 4: Init/Bootstrap Module Extraction)
- Added `sites/fdicnet-main-menu/init.js`:
  - exported `createFDICMenuInitializer(deps)` on `window`
  - moved bootstrap concerns:
    - `loadContent()` fetch + YAML parse
    - required DOM presence validation
    - content-load fallback rendering
    - primary init sequence (`state`, render, controller init, event wiring, open-by-default)
- Updated `sites/fdicnet-main-menu/script.js`:
  - removed monolithic local init/bootstrap implementation.
  - added `getDom()` helper for injected bootstrap dependencies.
  - now creates initializer via `createFDICMenuInitializer(...)` and calls `menuInitializer.init()`.
- Updated `sites/fdicnet-main-menu/index.html`:
  - load `init.js` before `script.js`.
- Regression checks:
  - `node --check sites/fdicnet-main-menu/init.js`
  - `node --check sites/fdicnet-main-menu/script.js`
  - Playwright smoke (`desktop + mobile`): `3/3` pass
  - Playwright full mobile keyboard matrix (`390x844`): `12/12` pass.

## Current Task (Phase 3: Events Module Extraction)
- [x] Extract event wiring into `sites/fdicnet-main-menu/events.js`.
- [x] Replace in-file `setupEvents()` implementation with delegated module binder call.
- [x] Keep orchestration callbacks injected from `script.js`.
- [x] Run syntax + desktop/mobile runtime regression smoke.

## Review / Results (Phase 3: Events Module Extraction)
- Added `sites/fdicnet-main-menu/events.js`:
  - exported `bindFDICMenuEvents(deps)` on `window`
  - moved event wiring concerns:
    - nav toggle/search toggle handlers
    - media-query change handlers
    - top-nav + mega-menu custom event listeners
    - mobile nav key/click handling
    - global pointerdown/escape handling
    - preview-clear pointer/focus wiring
- Updated `sites/fdicnet-main-menu/script.js`:
  - `setupEvents()` now delegates to `bindFDICMenuEvents(...)` with injected dependencies/callbacks.
  - removed in-file monolithic event wiring body.
- Updated `sites/fdicnet-main-menu/index.html`:
  - load `events.js` before `script.js`.
- Regression checks:
  - `node --check sites/fdicnet-main-menu/events.js`
  - `node --check sites/fdicnet-main-menu/script.js`
  - Playwright smoke (`desktop + mobile`): `3/3` pass.

## Current Task (Phase 2: Mobile Drawer Module Extraction)
- [x] Extract mobile drawer rendering/drill logic into `sites/fdicnet-main-menu/mobile-drawer.js`.
- [x] Replace script-local mobile drill render stack with controller wrappers.
- [x] Route delegated mobile drill click handling through module API.
- [x] Run syntax + full mobile keyboard runtime regression.

## Review / Results (Phase 2: Mobile Drawer Module Extraction)
- Added `sites/fdicnet-main-menu/mobile-drawer.js`:
  - controller factory: `createFDICMobileDrawerController(...)`
  - moved mobile drawer concerns:
    - drill path encode/decode
    - panel creation/removal
    - L1/L2/L3 mobile drill rendering
    - stagger reveal animation
    - delegated drill-action click handling
    - drawer panel render coordinator
- Updated `sites/fdicnet-main-menu/script.js`:
  - added `initializeMobileDrawerController()` with explicit dependency injection.
  - replaced in-file mobile drill function stack with wrappers:
    - `renderMobileDrawerPanel()`
    - `removeMobileDrawerPanel()`
  - delegated `navList` click handling now calls `mobileDrawerController.handleDelegatedMobileDrillClick(...)`.
- Updated `sites/fdicnet-main-menu/index.html`:
  - load `mobile-drawer.js` before `script.js`.
- Regression checks:
  - `node --check sites/fdicnet-main-menu/mobile-drawer.js`
  - `node --check sites/fdicnet-main-menu/script.js`
  - Playwright full mobile keyboard matrix (`390x844`): `12/12` pass.

## Current Task (Phase 1: State Module Extraction)
- [x] Extract menu state and derived selectors into `sites/fdicnet-main-menu/state.js`.
- [x] Wire `script.js` to consume state module APIs instead of local state/derived implementations.
- [x] Load `state.js` before `script.js` in `index.html`.
- [x] Run syntax + runtime regression smoke checks.

## Review / Results (Phase 1: State Module Extraction)
- Added `sites/fdicnet-main-menu/state.js` with:
  - `menuState` single source of truth
  - derived selectors/getters (`getPanelConfig`, `getPanelConfigByKey`, `getMobilePanelKeys`, `getPanelL1`, `getSelectedL1`, `getVisibleL2Index`, `getVisibleL2`, `getL2Overview`)
  - exported on `window.FDICMenuState`
- Updated `sites/fdicnet-main-menu/script.js` to consume state module functions via local adapter bindings.
- Updated `sites/fdicnet-main-menu/index.html` to include `state.js` before `script.js`.
- Regression checks:
  - `node --check sites/fdicnet-main-menu/state.js`
  - `node --check sites/fdicnet-main-menu/script.js`
  - Playwright smoke (`desktop + mobile`): `3/3` pass.

## Current Task (FDICnet Mobile Drill Event Delegation)
- [x] Remove per-render inline click listeners from mobile drill render helpers.
- [x] Encode mobile drill navigation intent as data attributes on controls.
- [x] Add single delegated click handler for mobile drill actions.
- [x] Re-run full mobile keyboard runtime QA matrix.

## Review / Results (FDICnet Mobile Drill Event Delegation)
- Updated `sites/fdicnet-main-menu/script.js`:
  - added path serialization helpers:
    - `encodeMobilePath(...)`
    - `decodeMobilePath(...)`
  - updated mobile drill rendering helpers to emit action metadata instead of closure-bound listeners:
    - `renderMobileDrillHeader(...)` now sets `data-mobile-drill-action="set-path"` + `data-mobile-drill-path`.
    - `appendMobileDrillItem(...)` now sets `data-mobile-drill-action="set-path"` + `data-mobile-drill-path`.
  - removed inline `addEventListener("click", ...)` from mobile drill item/back render paths.
  - added one delegated `navList` click handler (mobile-only) that:
    - resolves nearest `[data-mobile-drill-action='set-path']`
    - decodes target drill path
    - updates `menuState.mobileDrillPath` and active panel
    - triggers `renderMobileDrawerPanel()`.
- Verification:
  - `node --check sites/fdicnet-main-menu/script.js`
  - Playwright full mobile keyboard runtime matrix (`390x844`): `12/12` passed.

## Current Task (FDICnet DOM Reference Refresh Hardening)
- [x] Replace one-time cached DOM references in `script.js` with refreshable `let` bindings.
- [x] Add `refreshDomRefs()` resolver for component-backed and fallback selectors.
- [x] Invoke ref refresh at key entry points to prevent stale references after component re-render/reconnect.
- [x] Re-run syntax and runtime smoke checks.

## Review / Results (FDICnet DOM Reference Refresh Hardening)
- Updated `sites/fdicnet-main-menu/script.js`:
  - converted startup `const` DOM references to mutable `let` bindings.
  - added `refreshDomRefs()` to re-resolve:
    - custom element hosts (`#fdicTopNav`, `#fdicMegaMenu`)
    - component-exposed internals (`navList`, `megaMenuElement`, `l1List`, `l2List`, `l3List`, etc.)
    - fallback direct selectors.
  - added `refreshDomRefs()` calls at core entry points (`getMissingRequiredElements`, render/sync/open/close/event setup/init flows) so operations run against current DOM nodes instead of module-load snapshots.
- Verification:
  - `node --check sites/fdicnet-main-menu/script.js`
  - `node --check sites/fdicnet-main-menu/components.js`
  - Playwright smoke checks (desktop + mobile): `3/3` passed.

## Current Task (FDICnet Mega-Menu Behavior Componentization)
- [x] Replace structural mega-menu shell with behavior-owning `fdic-mega-menu`.
- [x] Move desktop mega-menu rendering (L1/L2/L3) into component API.
- [x] Move mega-menu keyboard interactions (column roving + cross-column arrows) into component behavior.
- [x] Wire component custom events back into `script.js` state orchestration.
- [x] Run syntax checks and desktop/mobile runtime keyboard smoke verification.

## Review / Results (FDICnet Mega-Menu Behavior Componentization)
- Updated `sites/fdicnet-main-menu/components.js`:
  - replaced `fdic-mega-menu-shell` with `fdic-mega-menu`.
  - `fdic-mega-menu` now owns:
    - mega-menu markup + internal element getters
    - desktop L1/L2/L3 rendering via `updateView(...)`
    - focus helpers (`focusSelectedL1`, `focusActiveL2`, `focusActiveL3`, targeted focus helpers)
    - keyboard behavior for column roving (`ArrowUp/Down`, `Home`, `End`) and cross-column movement (`ArrowLeft/Right`)
    - interaction event emission:
      - `fdic-mega-l1-select`
      - `fdic-mega-l1-roving`
      - `fdic-mega-l2-preview`
      - `fdic-mega-l2-overview-preview`
- Updated `sites/fdicnet-main-menu/index.html`:
  - replaced `<fdic-mega-menu-shell>` with `<fdic-mega-menu id="fdicMegaMenu">`.
- Updated `sites/fdicnet-main-menu/script.js`:
  - switched mega-menu element references to component host/getters.
  - replaced direct L1/L2/L3 DOM rendering with view-model handoff (`getMegaMenuViewModel()` -> `megaMenuHost.updateView(...)`).
  - removed script-owned desktop mega-menu keyboard handlers (`setupColumnArrowNav`, `setupColumnCrossNav`) now handled by component.
  - added component event listeners in orchestration:
    - select L1
    - persist L1 roving index
    - apply L2 preview / overview preview state.
- Verification:
  - `node --check sites/fdicnet-main-menu/components.js`
  - `node --check sites/fdicnet-main-menu/script.js`
  - Playwright runtime smoke:
    - desktop (`1280x900`): top-nav open/focus, mega-menu L1->L2->L3 arrow flows, L2 preview behavior
    - mobile (`390x844`): escape-close focus restore regression check
    - result: `8/8` checks passed

## Current Task (FDICnet Mobile Keyboard Runtime QA)
- [x] Run Playwright mobile keyboard path checks for drawer open/close, drill navigation, and Escape behavior.
- [x] Validate close-control persistence across drill depths.
- [x] Confirm focus behavior after keyboard close actions.
- [x] Record findings and regressions.

## Review / Results (FDICnet Mobile Keyboard Runtime QA)
- Runtime environment:
  - viewport `390x844`
  - URL `http://127.0.0.1:4173/index.html` served from `sites/fdicnet-main-menu`
- Passes:
  - keyboard open from menu toggle moves focus into drawer.
  - root list keyboard navigation works (`ArrowUp/Down`, `Home`, `End`).
  - drill navigation works via keyboard (`Space` and `Enter`) from root -> L1 -> L2.
  - `Escape` unwinds drill depth one level at a time (L2 -> L1 -> root).
  - close toggle remains visible and labeled `Close menu` at drill depths.
  - drawer model remains single-panel (`.mobile-drawer-panel-item` count `1`).
- Finding:
  - when closing mobile drawer from root using `Escape`, focus falls back to `BODY` instead of returning to a stable header control (expected: `#fdicNavToggle`).
  - closing via toggle button (`Enter` on focused `#fdicNavToggle`) returns focus correctly to the toggle.

## Current Task (FDICnet Mobile Escape Focus Restore Fix)
- [x] Patch mobile `Escape` close path to restore focus to `#fdicNavToggle`.
- [x] Keep desktop escape-focus restore behavior unchanged.
- [x] Re-run full Playwright mobile keyboard QA matrix.

## Review / Results (FDICnet Mobile Escape Focus Restore Fix)
- Updated `sites/fdicnet-main-menu/script.js`:
  - in global `Escape` handling, after `closeMenu(); closeMobileNav();`:
    - mobile path now explicitly focuses `#fdicNavToggle` and returns.
    - desktop path keeps existing active-panel button restore, with `#fdicNavToggle` as fallback if no active button exists.
- Verification:
  - `node --check sites/fdicnet-main-menu/script.js`
  - Playwright mobile matrix (`390x844`) rerun: `12/12` checks passed.
  - Confirmed regression fixed: `Escape` close at mobile root now leaves focus on `#fdicNavToggle`.

## Current Task (FDICnet Top-Nav Behavior Componentization)
- [x] Replace structural top-nav shell with a behavior-owning `fdic-top-nav` component.
- [x] Move desktop top-nav rendering and key/click activation behavior behind component custom events.
- [x] Keep menu state orchestration in `script.js` and sync component state via explicit update calls.
- [x] Re-run syntax + event-hook verification and record results.

## Review / Results (FDICnet Top-Nav Behavior Componentization)
- Updated `sites/fdicnet-main-menu/components.js`:
  - replaced `fdic-top-nav-shell` with `fdic-top-nav`.
  - `fdic-top-nav` now owns:
    - primary nav markup rendering
    - top-nav item rendering (`renderItems`)
    - selected/expanded/tabindex sync (`updateState`)
    - desktop top-nav event emission (`fdic-top-nav-activate`, `fdic-top-nav-roving-request`, `fdic-top-nav-link-activate`)
- Updated `sites/fdicnet-main-menu/index.html`:
  - replaced `<fdic-top-nav-shell>` with `<fdic-top-nav id="fdicTopNav">`.
- Updated `sites/fdicnet-main-menu/script.js`:
  - switched top-nav queries to the component instance (`#fdicTopNav`) and component-provided nav host.
  - replaced inline top-nav rendering logic with `topNav.renderItems(...)`.
  - replaced desktop top-nav key/click handlers with component event listeners.
  - added centralized handlers:
    - `activateTopNavPanel(...)`
    - `handleTopNavRovingRequest(...)`
  - removed obsolete `moveFocusIntoMenuOnOpen` state flag.
- Verification:
  - `node --check sites/fdicnet-main-menu/components.js`
  - `node --check sites/fdicnet-main-menu/script.js`
  - `rg -n "fdic-top-nav|fdic-top-nav-activate|fdic-top-nav-roving-request|activateTopNavPanel|handleTopNavRovingRequest" sites/fdicnet-main-menu -S`

## Current Task (FDICnet Menu Componentization)
- [x] Create reusable web components for FDICnet menu structure (top nav shell + mega menu shell).
- [x] Replace inline menu markup in `sites/fdicnet-main-menu/index.html` with custom elements.
- [x] Keep existing menu behavior by preserving required IDs/hooks used by `script.js`.
- [x] Run syntax and selector-presence verification; document outcomes.

## Review / Results (FDICnet Menu Componentization)
- Added `sites/fdicnet-main-menu/components.js` with reusable structural web components:
  - `fdic-top-nav` renders the primary nav shell and `#fdicNavList` host.
  - `fdic-mega-menu-shell` renders the mega-menu shell and existing L1/L2/L3 hook IDs.
- Updated `sites/fdicnet-main-menu/index.html`:
  - replaced inline top-nav markup with `<fdic-top-nav>`.
  - replaced inline mega-menu markup with `<fdic-mega-menu-shell>`.
  - loaded `components.js` before `script.js` to guarantee element upgrade before runtime DOM queries.
- Verification:
  - `node --check sites/fdicnet-main-menu/components.js`
  - `node --check sites/fdicnet-main-menu/script.js`
  - selector/ID checks via `rg` for new custom tags and required script hook IDs.

## Current Task (fdicnet-main-menu Micro-Interactions Pass, Skip #2)
- [x] Add subtle mobile press feedback on drill rows.
- [x] Add mobile back-caret nudge on hover/focus.
- [x] Add focus-ring fade-in transitions while preserving existing ring styles.
- [x] Add reduced-motion-safe staggered reveal on mobile drill panel changes.
- [x] Smooth desktop row hover ink transitions.
- [x] Refine mobile backdrop opacity easing.
- [x] Add optional lightweight haptic feedback on mobile drill-in/back actions.
- [x] Run syntax/selector verification and record results.

## Review / Results (fdicnet-main-menu Micro-Interactions Pass, Skip #2)
- Updated `sites/fdicnet-main-menu/script.js`:
  - added optional light haptics (`navigator.vibrate(10)`) for mobile drill-in and back actions via `triggerLightHaptic()`.
  - added `animateMobileDrillReveal()` with per-row stagger delay (15ms step, capped at 6 items) for mobile drill panel transitions.
  - applied reveal animation calls across all mobile drill render branches (root/L1/L2/L3).
- Updated `sites/fdicnet-main-menu/styles.css`:
  - added subtle transition smoothing for desktop row hover ink (`.l1-item`, `.l2-item`, `.l3-item`, `.overview-link`).
  - added mobile press feedback (`transform: translateY(1px)`) for drill/back/current-link active states.
  - added mobile back-caret nudge (`translateX(-2px)`) on hover/focus.
  - added transition polish for mobile focusable controls and mobile stagger reveal classes.
  - refined mobile backdrop easing to `opacity 200ms cubic-bezier(0.2, 0.7, 0.2, 1)`.
  - expanded reduced-motion fallback to disable new transitions/stagger effects.
- Verification:
  - `node --check sites/fdicnet-main-menu/script.js`
  - `rg -n "triggerLightHaptic|animateMobileDrillReveal|MOBILE_STAGGER_MAX_ITEMS|MOBILE_STAGGER_STEP_MS|ensureMobileMenuFocus\\(|mobile-drill-back-icon|mobile-drill-trigger:active|mobile-drill-current-link:active|mobile-drawer-panel\\.is-entering|transition: opacity 200ms cubic-bezier|@media \\(prefers-reduced-motion: reduce\\)" sites/fdicnet-main-menu/script.js sites/fdicnet-main-menu/styles.css`

## Current Task (fdicnet-main-menu Mobile Keyboard Navigation + Focus-On-Open)
- [x] Move keyboard focus into the mobile menu when it opens.
- [x] Add ArrowUp/ArrowDown keyboard navigation between visible mobile drawer items.
- [x] Keep existing desktop roving behavior unchanged.
- [x] Run syntax + targeted selector checks and record results.

## Review / Results (fdicnet-main-menu Mobile Keyboard Navigation + Focus-On-Open)
- Updated `sites/fdicnet-main-menu/script.js`:
  - added `getMobileDrawerFocusableItems()` to resolve keyboard-focusable items in the open mobile drawer (prefers drill controls, falls back to top-level nav items).
  - added `focusFirstMobileMenuItem()` and invoked it after mobile drawer open render.
  - extended `navList` `keydown` handling for mobile only to support:
    - `ArrowDown`
    - `ArrowUp`
    - `Home`
    - `End`
  - desktop behavior remains unchanged and still uses existing roving/cross-nav logic.
- Follow-up correction:
  - replaced `focusFirstMobileMenuItem()` with resilient `ensureMobileMenuFocus()` to force focus into the drawer on open and after drill-panel rerenders if focus escapes to background content.
- Verification:
  - `node --check sites/fdicnet-main-menu/script.js`
  - `rg -n "function getMobileDrawerFocusableItems|function ensureMobileMenuFocus|ensureMobileMenuFocus\\(|ArrowDown|ArrowUp|Home|End" sites/fdicnet-main-menu/script.js`

## Current Task (fdicnet-main-menu Mobile Caret Size + Consistency Review)
- [x] Match mobile drill/back caret icon sizing to desktop caret sizing.
- [x] Keep mobile caret icon glyph style aligned with desktop icon set.
- [x] Review mobile vs desktop interaction styling for remaining inconsistencies and document recommendations.
- [x] Run targeted verification checks and record results.

## Review / Results (fdicnet-main-menu Mobile Caret Size + Consistency Review)
- Updated `sites/fdicnet-main-menu/script.js`:
  - mobile back and drill row carets now use the same Phosphor caret classes used in desktop menu rows:
    - `mobile-drill-back-icon ph ph-caret-left`
    - `mobile-drill-caret ph ph-caret-right`
- Updated `sites/fdicnet-main-menu/styles.css`:
  - set mobile drill/back caret icon geometry to match desktop caret size:
    - `width: 20px;`
    - `height: 20px;`
    - `min-width: 20px;`
    - `font-size: 20px;`
- Verification:
  - `node --check sites/fdicnet-main-menu/script.js`
  - `rg -n "mobile-drill-back-icon|mobile-drill-caret|ph-caret-left|ph-caret-right|font-size: 20px|width: 20px|height: 20px" sites/fdicnet-main-menu/script.js sites/fdicnet-main-menu/styles.css`

## Current Task (fdicnet-main-menu Code Simplification Pass)
- [x] Remove unused/empty mobile menu container path (`mobileMenu` / `.mega-mobile`) and related JS checks.
- [x] Remove dead JS class toggling for `fdic-nav-list--mobile-accordion`.
- [x] Remove unused CSS custom properties and duplicate `.mega-col` rule block.
- [x] Extract repeated desktop render calls into a helper function.
- [x] Extract repeated focusout + `requestAnimationFrame` preview-clear wiring into a helper function.
- [x] Re-run syntax and targeted grep checks to verify simplification scope and no behavior change.

## Review / Results (fdicnet-main-menu Code Simplification Pass)
- Updated `sites/fdicnet-main-menu/index.html`:
  - removed unused `<nav id="mobileMenu" class="mega-mobile">` container.
- Updated `sites/fdicnet-main-menu/script.js`:
  - removed `mobileMenu` DOM dependency from required-element checks and panel rendering branches.
  - removed dead `fdic-nav-list--mobile-accordion` class toggling.
  - removed unused `narrowHeaderMediaQuery` listener and breakpoint constant.
  - added `renderDesktopColumns()` and replaced repeated `renderL1(); renderL2(); renderL3();` sequences.
  - added `wirePreviewClearOnFocusOut()` to replace duplicated `focusout` + `requestAnimationFrame` preview-clear logic for L2/L3.
- Updated `sites/fdicnet-main-menu/styles.css`:
  - removed unused custom properties:
    - `--ds-spacing-xs`
    - `--ds-font-size-h3`
    - `--ds-corner-radius-sm`
    - `--fdic-blue-100`
    - `--fdic-border`
    - `--fdic-divider`
  - removed `.mega-mobile` rules and consolidated duplicate `.mega-col` blocks.
- Verification:
  - `node --check sites/fdicnet-main-menu/script.js`
  - `rg -n "mobileMenu|mega-mobile|fdic-nav-list--mobile-accordion" sites/fdicnet-main-menu/index.html sites/fdicnet-main-menu/script.js sites/fdicnet-main-menu/styles.css` (no matches)
  - `rg -n -e "--ds-spacing-xs" -e "--ds-font-size-h3" -e "--ds-corner-radius-sm" -e "--fdic-blue-100" -e "--fdic-border" -e "--fdic-divider" sites/fdicnet-main-menu/styles.css` (no matches)
  - `rg -n "function renderDesktopColumns|renderDesktopColumns\\(\\);|function wirePreviewClearOnFocusOut|wirePreviewClearOnFocusOut\\(" sites/fdicnet-main-menu/script.js`

## Current Task (Hover Highlight Visibility Retune)
- [x] Increase hover highlight visibility after over-lightening.
- [x] Keep treatment subtle and consistent across menu columns.
- [x] Record updated token for quick follow-up tuning.

## Review / Results (Hover Highlight Visibility Retune)
- Updated `sites/fdicnet-main-menu/styles.css`:
  - `--menu-hover-overlay: rgba(0, 110, 190, 0.09);`
  - previous value: `rgba(248, 253, 255, 0.40)`.
- Result: hover highlight is visibly present again while remaining translucent.
- Verification:
  - `rg -n -e "--menu-hover-overlay" sites/fdicnet-main-menu/styles.css -S`
  - `git diff -- sites/fdicnet-main-menu/styles.css tasks/todo.md`

## Current Task (Accessible Hover Overlay Retune Without Link-Color Change)
- [x] Retune hover overlay color to improve contrast while keeping link color unchanged.
- [x] Keep overlay subtle and lightly tinted.
- [x] Validate contrast target against normal-size link text on hover background.

## Review / Results (Accessible Hover Overlay Retune Without Link-Color Change)
- Constraint: link color remains `#1278b0`.
- Updated `sites/fdicnet-main-menu/styles.css`:
  - `--menu-hover-overlay: rgba(248, 253, 255, 0.40);`
  - previous value: `rgba(0, 110, 190, 0.12)`.
- Contrast check (computed):
  - link text `#1278b0` vs hover background produced by the new token: ~`4.55:1` (meets WCAG AA 4.5:1 for normal text).
- Verification:
  - `rg -n -e "--menu-hover-overlay" sites/fdicnet-main-menu/styles.css -S`
  - `git diff -- sites/fdicnet-main-menu/styles.css tasks/todo.md`

## Current Task (Hover Color Retune: Brighter + Softer)
- [x] Increase hover hue vibrancy further.
- [x] Reduce alpha so overlay remains subtle.
- [x] Verify updated token value in stylesheet.

## Review / Results (Hover Color Retune: Brighter + Softer)
- Updated `sites/fdicnet-main-menu/styles.css`:
  - `--menu-hover-overlay: rgba(0, 110, 190, 0.12);`
  - previous value: `rgba(0, 94, 162, 0.14)`.
- Result: hover tone is more vivid blue, but with slightly lower opacity for a subtler wash.
- Verification:
  - `rg -n -e "--menu-hover-overlay" sites/fdicnet-main-menu/styles.css -S`
  - `git diff -- sites/fdicnet-main-menu/styles.css tasks/todo.md`

## Current Task (Hover Color Vibrancy Tuning)
- [x] Increase hover fill vibrancy while keeping translucent treatment.
- [x] Keep hover token centralized so all menu columns stay visually consistent.
- [x] Record exact token change for future tuning.

## Review / Results (Hover Color Vibrancy Tuning)
- Updated `sites/fdicnet-main-menu/styles.css` hover token:
  - `--menu-hover-overlay: rgba(0, 94, 162, 0.14);`
  - previous value: `rgba(0, 50, 86, 0.08)`.
- Result: hover/focus backgrounds are more blue/vibrant but remain translucent.
- Verification:
  - `rg -n "--menu-hover-overlay" sites/fdicnet-main-menu/styles.css -S`
  - `git diff -- sites/fdicnet-main-menu/styles.css tasks/todo.md`

## Current Task (L1 Overview Hover Left Extension)
- [x] Change bottom column-1 overview-link hover fill to extend only 16px left of text.
- [x] Remove viewport-edge hover bleed behavior for overview-link.
- [x] Verify selector-level diff scope and document result.

## Review / Results (L1 Overview Hover Left Extension)
- Updated `sites/fdicnet-main-menu/styles.css`:
  - changed `.overview-link:hover::before` from viewport-width bleed (`left: 0; width: 100vw; transform`) to local extension (`left: -16px; width: 16px`).
- Result: bottom column-1 link hover treatment now matches the 16px left-extension pattern used in L1 items.
- Verification:
  - `rg -n "\\.overview-link:hover::before|left: -16px;|width: 16px;" sites/fdicnet-main-menu/styles.css -S`
  - `git diff -- sites/fdicnet-main-menu/styles.css tasks/todo.md`

## Current Task (L1 Focus Ring 16px Left Extension)
- [x] Extend column-1 focus rectangle 16px left of label baseline.
- [x] Keep hover/selected/focus left extension geometry consistent in L1.
- [x] Verify selector-level diff scope and document result.

## Review / Results (L1 Focus Ring 16px Left Extension)
- Updated `sites/fdicnet-main-menu/styles.css`:
  - changed `.l1-item:focus-visible::after` geometry from `inset: 0` to explicit edges with `left: -16px` (`top/right/bottom: 0`).
- Result: L1 focus ring now extends 16px left of the text label, matching L1 hover/selected inset extension.
- Verification:
  - `rg -n "\\.l1-item:focus-visible::after|left: -16px;" sites/fdicnet-main-menu/styles.css -S`
  - `git diff -- sites/fdicnet-main-menu/styles.css tasks/todo.md`

## Current Task (L1 Selected Fill Inset + Text Alignment Baseline)
- [x] Change selected L1 white fill to extend only 16px left of text label (not viewport edge).
- [x] Align column-1 item text start with top-nav first-item text and FDICnet wordmark baseline.
- [x] Verify focused/hovered/selected left-extension behavior and diff scope.

## Review / Results (L1 Selected Fill Inset + Text Alignment Baseline)
- Updated `sites/fdicnet-main-menu/styles.css`:
  - changed `.l1-item` left padding from `16px` to `0` so L1 labels align with the shell baseline used by the wordmark/top-nav first item.
  - replaced selected/hover/focus left-bleed behavior with local 16px extensions:
    - `.l1-item:hover::before, .l1-item:focus-visible::before` now render `left: -16px; width: 16px`.
    - `.l1-item[data-selected="true"]::before` now renders `left: -16px; width: 16px; background: #fff`.
  - changed `.overview-link` left padding from `16px` to `0` to keep column-1 text alignment consistent.
- Result:
  - Selected L1 white background extends only 16px left of label.
  - L1 and overview link text now share the same left baseline as the first top-nav item and wordmark.
- Verification:
  - `rg -n "^\\.l1-item \\{|^\\.l1-item:hover::before|^\\.l1-item:focus-visible::before|^\\.l1-item\\[data-selected=\"true\"\\]::before|^\\.overview-link \\{|padding: 8px 24px 8px 0;" sites/fdicnet-main-menu/styles.css -S`
  - `git diff -- sites/fdicnet-main-menu/styles.css tasks/todo.md`

## Current Task (L1 Active Focus Ring Left-Edge Obscuring)
- [x] Prevent selected-item left bleed layer from obscuring L1 focus ring left edge.
- [x] Keep active L1 item focusable in roving keyboard model.
- [x] Verify CSS selector-level diff and document result.

## Review / Results (L1 Active Focus Ring Left-Edge Obscuring)
- Root cause: selected L1 left-bleed pseudo-element (`.l1-item[data-selected="true"]::before`) could visually overlap the row-level focus ring, making the left edge appear clipped.
- Updated `sites/fdicnet-main-menu/styles.css`:
  - moved L1 focus ring painting from `.l1-item:focus-visible` box-shadow to a top-layer `.l1-item:focus-visible::after` overlay (`position: absolute; inset: 0; z-index: 2;`).
- Result: active L1 focus ring now renders fully, including the left edge.
- Verification:
  - `rg -n "\\.l1-item:focus-visible \\{|\\.l1-item:focus-visible::after|data-selected=\"true\"::before" sites/fdicnet-main-menu/styles.css -S`
  - `git diff -- sites/fdicnet-main-menu/styles.css tasks/todo.md`

## Current Task (L1 Overview Link Left Alignment)
- [x] Add left padding to bottom overview link in column 1.
- [x] Match overview-link left inset with L1 row label alignment.
- [x] Verify CSS-only diff scope and document result.

## Review / Results (L1 Overview Link Left Alignment)
- Updated `sites/fdicnet-main-menu/styles.css`:
  - changed `.overview-link` padding from `8px 24px 8px 0` to `8px 24px 8px 16px` (with existing right padding retained).
- Result: bottom column-1 overview link text/focus box aligns with other column-1 row content.
- Verification:
  - `rg -n "^\\.overview-link \\{|padding: 8px 24px 8px 16px;" sites/fdicnet-main-menu/styles.css -S`
  - `git diff -- sites/fdicnet-main-menu/styles.css tasks/todo.md`

## Current Task (L1 Hover/Focus Fill Inset Alignment)
- [x] Stop L1 hover/focus background from bleeding to viewport-left edge.
- [x] Keep hover/focus fill aligned to row box with 16px label inset context.
- [x] Verify selector-level CSS diff and document result.

## Review / Results (L1 Hover/Focus Fill Inset Alignment)
- Updated `sites/fdicnet-main-menu/styles.css`:
  - removed `.l1-item:hover::before, .l1-item:focus-visible::before` full-bleed pseudo-element rule.
- Result:
  - L1 hover/focus fill now renders on `.l1-item` only (same geometry as focus ring), so it extends 16px left of the text label instead of to viewport edge.
  - selected-item behavior remains unchanged.
- Verification:
  - `rg -n "\\.l1-item:hover::before|\\.l1-item:focus-visible::before|\\.l1-item:hover \\{|\\.l1-item:focus-visible \\{" sites/fdicnet-main-menu/styles.css -S`
  - `git diff -- sites/fdicnet-main-menu/styles.css tasks/todo.md`

## Current Task (L1 Focus Ring Inset to Label Padding)
- [x] Stop extending column-1 focus rectangle to viewport-left edge.
- [x] Set L1 label inset so focus ring sits 16px left of text.
- [x] Verify CSS-only diff scope and document result.

## Review / Results (L1 Focus Ring Inset to Label Padding)
- Updated `sites/fdicnet-main-menu/styles.css`:
  - changed `.l1-item` left padding to `16px` so text and focus geometry match requested inset.
  - moved L1 focus ring back onto `.l1-item:focus-visible` with the standard outset double-ring.
  - removed full-bleed focus overlay rule `.l1-item:focus-visible::after` that previously extended to viewport-left edge.
- Result: L1 focus rectangle now renders around the row with 16px space left of the label text instead of bleeding to the viewport edge.
- Verification:
  - `rg -n "^\\.l1-item \\{|padding-left: 16px;|\\.l1-item:focus-visible \\{|\\.l1-item:focus-visible::after" sites/fdicnet-main-menu/styles.css -S`
  - `git diff -- sites/fdicnet-main-menu/styles.css tasks/todo.md`

## Current Task (Selected L1 Focus Fill Consistency)
- [x] Remove partial gray fill when the selected L1 item receives keyboard focus.
- [x] Preserve focus visibility via ring while keeping selected item fill stable.
- [x] Verify CSS-only diff scope and record outcome.

## Review / Results (Selected L1 Focus Fill Consistency)
- Decision: the active/selected L1 item remains focusable for keyboard users (roving focus model), but focus styling should not change its selected fill color.
- Root cause: `.l1-item:focus-visible` applied hover-style gray background to all L1 items, including the selected one, while selected left-bleed remained white; this produced a split/partial gray appearance.
- Updated `sites/fdicnet-main-menu/styles.css`:
  - added `.l1-item[data-selected="true"]:focus-visible { background: #fff; }`.
- Verification:
  - `rg -n "l1-item:focus-visible|data-selected=\"true\":focus-visible" sites/fdicnet-main-menu/styles.css -S`
  - `git diff -- sites/fdicnet-main-menu/styles.css tasks/todo.md`

## Current Task (L1 Focus Height Parity + No Hover on Selected L1)
- [x] Make column-1 focus rectangle height treatment match columns 2 and 3.
- [x] Remove hover-state visual override on selected/active column-1 item.
- [x] Verify CSS-only diff scope and capture result.

## Review / Results (L1 Focus Height Parity + No Hover on Selected L1)
- Root cause:
  - Column-1 focus ring was drawn with an inset shadow while columns 2/3 use outset rings, making L1 focus appear shorter.
  - Selected L1 hover override forced hover fill onto active item, conflicting with desired stable selected styling.
- Updated `sites/fdicnet-main-menu/styles.css`:
  - changed `.l1-item:focus-visible::after` from inset to outset double-ring shadow:
    - `box-shadow: 0 0 0 2px var(--menu-focus-inner), 0 0 0 4px var(--menu-focus-ring);`
  - removed selected hover/focus override block for `.l1-item[data-selected="true"]::before` background.
- Verification:
  - `rg -n "\\.l1-item:focus-visible::after|box-shadow: 0 0 0 2px var\\(--menu-focus-inner\\), 0 0 0 4px var\\(--menu-focus-ring\\);|data-selected=\"true\":hover::before" sites/fdicnet-main-menu/styles.css -S`
  - `git diff -- sites/fdicnet-main-menu/styles.css tasks/todo.md`

## Current Task (L1 Height + Selected Hover Left-Bleed)
- [x] Match column-1 item row height geometry to column-2 rows.
- [x] Ensure selected column-1 row hover/focus fill extends to viewport-left edge.
- [x] Verify CSS-only diff scope and record the result.

## Review / Results (L1 Height + Selected Hover Left-Bleed)
- Root cause:
  - L1 rows used a slightly different line-height than L2 rows, creating visible height mismatch.
  - `.l1-item[data-selected="true"]::before` (white left-bleed layer) overrode hover/focus left-bleed fill on selected items.
- Updated `sites/fdicnet-main-menu/styles.css`:
  - set `.l1-item { line-height: 1.4; }` to match L2 row geometry.
  - added `.l1-item[data-selected="true"]:hover::before, .l1-item[data-selected="true"]:focus-visible::before { background: var(--menu-hover-overlay); }`.
- Verification:
  - `rg -n "\\.l1-item \\{|line-height: 1\\.4;|data-selected=\"true\"\\]:hover::before|data-selected=\"true\"\\]:focus-visible::before" sites/fdicnet-main-menu/styles.css -S`
  - `git diff -- sites/fdicnet-main-menu/styles.css tasks/todo.md`

## Current Task (Column 1 Focus + Left-Bleed Background)
- [x] Fix column-1 focus rectangle left-edge clipping.
- [x] Restore first-column gray panel background bleed to viewport left edge.
- [x] Verify CSS-only diff scope and document outcome.

## Review / Results (Column 1 Focus + Left-Bleed Background)
- Root cause: `.mega-menu-inner` clipping constrained first-column left-bleed paint to the shell boundary, which made column-1 background/focus treatments appear clipped on the left.
- Updated `sites/fdicnet-main-menu/styles.css`:
  - widened left paint allowance on `.mega-menu-inner` with `clip-path: inset(-6px -6px -6px -100vw)` so first-column gray background can extend to the viewport edge.
  - changed `.l1-item:focus-visible` to render focus via a single full-bleed overlay (`::after`) from `left: -100vw` through the row, eliminating clipped/split left focus edges.
  - kept existing left-bleed background logic (`.l1-item:focus-visible::before`) intact for hover/focus fill behavior.
- Verification:
  - `rg -n "mega-menu-inner|clip-path|\\.l1-item:focus-visible|\\.l1-item:focus-visible::after" sites/fdicnet-main-menu/styles.css -S`
  - `git diff -- sites/fdicnet-main-menu/styles.css tasks/todo.md`

## Current Task (L2 Focus Ring Left-Edge Clipping)
- [x] Confirm root cause of left-edge clipping for column-2 focus ring.
- [x] Apply minimal CSS fix to keep full focus rectangle visible.
- [x] Verify diff scope and document result.

## Review / Results (L2 Focus Ring Left-Edge Clipping)
- Root cause: focused L2 row ring rendered underneath adjacent column content due to stacking order, so the ring's left edge appeared clipped at the column boundary.
- Updated `sites/fdicnet-main-menu/styles.css`:
  - in `.l2-item:focus-visible, .l3-item:focus-visible`, added `position: relative;` and `z-index: 2;` so focused row rings paint above neighboring column layers.
- Verification:
  - `rg -n "\\.l2-item:focus-visible|\\.l3-item:focus-visible|z-index: 2;" sites/fdicnet-main-menu/styles.css -S`
  - `git diff -- sites/fdicnet-main-menu/styles.css tasks/todo.md`

## Current Task (Implement Issues #59 #62 #63 per PR Plan)
- [x] Implement `#59` by aligning L2 anchor behavior with true link navigation semantics.
- [x] Implement `#62` by consolidating duplicate `769px-1049px` media-query rules and removing redundant/dead rules.
- [x] Implement `#63` by renaming local shadowing variable in `renderMobileDrillHeader()`.
- [x] Run targeted verification and record any validation gaps.

## Review / Results (Implement Issues #59 #62 #63 per PR Plan)
- Updated `sites/fdicnet-main-menu/script.js`:
  - `#59`: removed L2 click interception logic in `renderL2()` so standard anchor activation navigates by `href` (pointer + keyboard `Enter` follow native link behavior).
  - `#63`: renamed local `header` variable to `drillHeader` in `renderMobileDrillHeader()` to remove global-shadowing risk.
- Updated `sites/fdicnet-main-menu/styles.css`:
  - `#62`: removed redundant `@media (min-width: 1050px)` `.fdic-shell` block (duplicated base rule).
  - `#62`: consolidated effective `769px-1049px` `.mega-menu-inner` declaration into the existing mid-file media block.
  - `#62`: removed duplicate late-file `769px-1049px` media block for `.fdic-shell`/`.mega-menu-inner`.
- Verification:
  - `node --check sites/fdicnet-main-menu/script.js` (pass)
  - `rg -n "renderMobileDrillHeader\\(|const drillHeader|const header = document.createElement\\(" sites/fdicnet-main-menu/script.js -S`
  - `rg -n "@media \\(min-width: 769px\\) and \\(max-width: 1049px\\)|@media \\(min-width: 1050px\\)|\\.mega-menu-inner \\{" sites/fdicnet-main-menu/styles.css -S`
  - `git diff -- sites/fdicnet-main-menu/script.js sites/fdicnet-main-menu/styles.css`
- Validation gaps:
  - Screen-reader live pass was not executed in this environment; semantic alignment for `#59` was validated by code path (`<a href>` with no click `preventDefault` interception).

## Current Task (Issue Bundle #59 #62 #63 Branch + PR Plan)
- [x] Review issue scopes and acceptance criteria for `#59`, `#62`, and `#63`.
- [x] Create a dedicated branch for this bundled work from `main`.
- [x] Publish branch to GitHub and open a draft PR that links all three issues.
- [x] Include a clear implementation + verification plan in the PR description before coding starts.

## Review / Results (Issue Bundle #59 #62 #63 Branch + PR Plan)
- Created branch `issues/59-62-63-main-menu-followups` from updated `main`.
- Reviewed issue acceptance criteria for `#59`, `#62`, `#63` via `gh issue view`.
- Opened draft PR with implementation and verification plan:
  - `https://github.com/jflamb/pens-github-test/pull/66`

## Current Task (L2 Caret Underline Follow-up)
- [x] Move L2 underline styling from the anchor wrapper to text label only.
- [x] Ensure hover/focus underline emphasis still applies to the L2 label text.
- [x] Verify caret glyph no longer receives underline decoration.

## Review / Results (L2 Caret Underline Follow-up)
- Root cause: L2 underline was applied on `.l2-item` (the anchor wrapper), so text decoration also rendered under the caret glyph.
- Updated `sites/fdicnet-main-menu/styles.css`:
  - moved base underline styling to `.l2-label` only.
  - set `.l2-item { text-decoration: none; }`.
  - moved hover/focus underline emphasis to `.l2-item:hover .l2-label` and `.l2-item:focus-visible .l2-label`.
- Verification:
  - `rg -n "^\\.l2-item \\{|^\\.l2-label \\{|l2-item:hover \\.l2-label|l2-item:focus-visible \\.l2-label|\\.l2-caret" sites/fdicnet-main-menu/styles.css -S`
  - `git diff -- sites/fdicnet-main-menu/styles.css`

## Current Task (Hover Carets in First + Second Columns)
- [x] Show first-column caret on hover using the same size/position as the active-state caret.
- [x] Add matching right-caret affordance to second-column items on hover.
- [x] Verify caret behavior remains desktop-only and does not affect mobile drill navigation.

## Review / Results (Hover Carets in First + Second Columns)
- Updated `sites/fdicnet-main-menu/script.js`:
  - L2 links now render structured content (`.l2-label` + right-caret span) using the same caret classes as L1 (`.l1-caret ph ph-caret-right`).
  - L2 overview link uses the same structure and caret element.
- Updated `sites/fdicnet-main-menu/styles.css`:
  - first-column carets now appear on hover/focus (`.l1-item:hover .l1-caret`, `.l1-item:focus-visible .l1-caret`) in addition to existing selected-state behavior.
  - added `.l2-label` flex sizing so text wraps without overlapping the caret.
  - added `.l2-caret` alignment and hover/focus visibility rules (`.l2-item:hover .l2-caret`, `.l2-item:focus-visible .l2-caret`).
- Verification:
  - `node --check sites/fdicnet-main-menu/script.js`
  - `rg -n "l2-label|l2-caret|l1-item:hover \\.l1-caret|l2-item:hover \\.l2-caret|ph-caret-right" sites/fdicnet-main-menu/script.js sites/fdicnet-main-menu/styles.css -S`
  - `git diff -- sites/fdicnet-main-menu/script.js sites/fdicnet-main-menu/styles.css`

## Current Task (Third-Column Highlight Extension to Viewport Edge)
- [x] Extend third-column item hover/focus highlight fill to the right viewport edge.
- [x] Preserve existing third-column underline/focus-ring styling while adding edge extension.
- [x] Verify the change is scoped to L3 items only.

## Review / Results (Third-Column Highlight Extension to Viewport Edge)
- Updated `sites/fdicnet-main-menu/styles.css` for L3-only highlight extension:
  - set `.menu-list--l3 .l3-item { position: relative; }`.
  - replaced shadow extension with a dedicated edge-extension layer:
    - `.menu-list--l3 .l3-item:hover::after`
    - `.menu-list--l3 .l3-item:focus-visible::after`
    - both draw an absolutely positioned `100vw` overlay from `left: 100%` to carry fill from the L3 column edge to the right viewport edge.
- Existing L3 underline emphasis (`text-decoration-color` and thickness) remains intact.
- Verification:
  - `rg -n "menu-list--l3 \\.l3-item|::after|100vw" sites/fdicnet-main-menu/styles.css -S`
  - `git diff -- sites/fdicnet-main-menu/styles.css`

## Current Task (First-Column Divider Padding Balance)
- [x] Add matching post-divider spacing in first-column overview-link wrapper.
- [x] Keep first-column overview link row sizing/hover/focus behavior unchanged.
- [x] Verify the CSS change scope is limited to the first-column divider block.

## Review / Results (First-Column Divider Padding Balance)
- Updated `sites/fdicnet-main-menu/styles.css`:
  - added `padding-top: 8px` to `.overview-link-wrap`, preserving existing `margin-top: 8px` above the divider so spacing is balanced around the divider line.
- Verification:
  - `rg -n "overview-link-wrap" sites/fdicnet-main-menu/styles.css -A3 -B2`
  - `git diff -- sites/fdicnet-main-menu/styles.css` (confirming first-column divider wrapper change)

## Current Task (Desktop Link Row Full-Width Highlight Fill)
- [x] Extend desktop L2/L3 hyperlink hover/focus background fill to full column row width.
- [x] Preserve link text inset alignment while removing inset-only highlight clipping.
- [x] Verify final selector cascade and changed CSS rules.

## Review / Results (Desktop Link Row Full-Width Highlight Fill)
- Updated `sites/fdicnet-main-menu/styles.css` so desktop link-row highlight fills the full row width:
  - removed horizontal `margin`/`max-width` constraints on `.l2-item` and `.menu-list--l3 .l3-item`.
  - moved horizontal insets into row `padding` (`L2: 24px left / 16px right`, `L3: 24px left / 8px right`) so text alignment remains unchanged while highlight extends edge-to-edge.
- Existing row-level hover/focus fill (`background: var(--menu-hover-overlay)`) now renders across the full column row width for L2/L3 links.
- Verification:
  - `rg -n "^\\.l2-item \\{|^\\.menu-list--l3 \\.l3-item \\{|\\.l2-item:hover|\\.l3-item:hover|\\.l2-item:focus-visible|\\.l3-item:focus-visible" sites/fdicnet-main-menu/styles.css -S`
  - `git diff -- sites/fdicnet-main-menu/styles.css`

## Current Task (Desktop Menu Link Hit-Area + Row Highlight Consistency)
- [x] Increase desktop L2/L3 hyperlink row padding/height to better match non-link menu row targets.
- [x] Apply row-level hover/focus background highlight to desktop L2/L3 hyperlinks for consistent interaction feedback.
- [x] Verify updated selectors and changed rules via diff/scan.

## Review / Results (Desktop Menu Link Hit-Area + Row Highlight Consistency)
- Updated `sites/fdicnet-main-menu/styles.css` desktop menu link row geometry:
  - `.l2-item` / `.l3-item` now use `min-height: 41px`, `padding: 8px 0`, and `align-items: center` for larger, button-like targets.
  - compact link-row spacing is preserved by switching L2/L3 horizontal row margins to `margin-top/bottom: 0`.
- Applied consistent row highlight treatment for link rows:
  - `.l2-item:hover`, `.l3-item:hover`, and `.l2-item:focus-visible`, `.l3-item:focus-visible` now use `background: var(--menu-hover-overlay)`.
  - existing underline emphasis on hover/focus remains intact.
- Verification:
  - `rg -n "\\.l2-item,|\\.l3-item,|\\.l2-item:hover|\\.l3-item:hover|\\.l2-item:focus-visible|\\.menu-list--l3 \\.l3-item" sites/fdicnet-main-menu/styles.css -S`
  - `git diff -- sites/fdicnet-main-menu/styles.css`

## Current Task (Desktop L3 Link Hover Styling Parity)
- [x] Restore third-column (`.l3-item`) hover styling parity with other desktop menu links.
- [x] Ensure keyboard focus-visible styling for `.l3-item` is not regressed by the same specificity/cascade issue.
- [x] Verify selector behavior with a targeted CSS scan.

## Review / Results (Desktop L3 Link Hover Styling Parity)
- Root cause: `.menu-list--l3 .l3-item` (later in file) reset `text-decoration-thickness: 1px`, overriding earlier `.l3-item:hover`/`.l3-item:focus-visible` thickness styles by equal specificity + later cascade.
- Updated `sites/fdicnet-main-menu/styles.css`:
  - added `.menu-list--l3 .l3-item:hover, .menu-list--l3 .l3-item:focus-visible` override to apply hover/focus underline emphasis (`text-decoration-thickness: 2px`, hover underline color token).
- Verification:
  - `rg -n "\\.l3-item:hover|\\.menu-list--l3 \\.l3-item|\\.l3-item:focus-visible" sites/fdicnet-main-menu/styles.css -S`
  - `git diff -- sites/fdicnet-main-menu/styles.css`

## Current Task (Mobile Drawer Close Button Regression on Drill-In)
- [x] Remove mobile drill-depth toggle hiding so close control stays visible at all levels.
- [x] Remove obsolete CSS class used only for drill-depth toggle hiding.
- [x] Verify mobile drawer open/close + drill navigation still works and close is always available.

## Review / Results (Mobile Drawer Close Button Regression on Drill-In)
- Root cause: `syncMobileToggleButton()` on `main` still toggled `.fdic-nav-toggle--drill-hidden` when `mobileDrillPath.length > 0`, hiding the global close control after drill-in.
- Updated `sites/fdicnet-main-menu/script.js`:
  - removed drill-depth hide calculation from `syncMobileToggleButton()`.
  - retained label/icon/ARIA updates tied to open/closed state only.
- Updated `sites/fdicnet-main-menu/styles.css`:
  - removed `.fdic-nav-toggle--drill-hidden` rule (no longer referenced).
- Verification:
  - `node --check sites/fdicnet-main-menu/script.js`
  - `rg -n "fdic-nav-toggle--drill-hidden|hideInDrill|mobileDrillPath.length > 0 && isMobileViewport" sites/fdicnet-main-menu/script.js sites/fdicnet-main-menu/styles.css -S` (no matches)
  - Playwright mobile pass at `390x844`:
    - open menu -> drill `News & Events` -> drill `News`.
    - evaluated `.fdic-nav-toggle` state: `aria-label=Close menu`, `opacity=1`, `visibility=visible`, `pointer-events=auto`.

## Current Task (Mobile Drawer Close Control Persistence)
- [x] Remove drill-depth-based hiding of the mobile nav toggle so close remains visible at all drill layers.
- [x] Verify mobile drawer state transitions still update menu toggle label/icon/ARIA correctly.
- [x] Run targeted checks and document results.

## Review / Results (Mobile Drawer Close Control Persistence)
- Root cause: `syncMobileToggleButton()` hid the toggle when `mobileDrillPath.length > 0`, which removed the visible close affordance once users drilled deeper than the top layer.
- Updated `sites/fdicnet-main-menu/script.js`:
  - removed drill-depth conditional hide logic from `syncMobileToggleButton()`.
  - kept icon/label/`aria-label` updates tied only to open/closed state.
- Updated `sites/fdicnet-main-menu/styles.css`:
  - removed `.fdic-nav-toggle--drill-hidden` utility rule (no longer used).
- Verification:
  - `node --check sites/fdicnet-main-menu/script.js`
  - `rg -n "fdic-nav-toggle--drill-hidden|mobileDrillPath.length > 0" sites/fdicnet-main-menu/script.js sites/fdicnet-main-menu/styles.css -S`

## Current Task (Issue #40: Mega Menu ARIA Role/State Fix)
- [x] Remove invalid `listbox` roles from L1/L2 mega menu list containers.
- [x] Remove invalid `role="option"` usage from dynamically rendered L1/L2 controls.
- [x] Replace `aria-selected`-driven state with neutral data attributes while preserving visual selected state and keyboard behavior.
- [x] Run targeted verification scans and syntax checks.
- [x] Update GitHub issue `#40` with implementation details and validation notes.

## Review / Results (Issue #40: Mega Menu ARIA Role/State Fix)
- Updated `sites/fdicnet-main-menu/index.html` to remove `role="listbox"` from `#l1List` and `#l2List`.
- Updated `sites/fdicnet-main-menu/script.js` to remove invalid `role="option"` and `aria-selected` assignments from L1/L2 rendered controls.
- Replaced ARIA-selected styling/state hooks with data attributes:
  - L1 selected state now uses `data-selected`.
  - L2 active/preview state now uses `data-active`.
- Updated `sites/fdicnet-main-menu/styles.css` selectors from `[aria-selected="true"]` to `[data-selected="true"]` for first-column selected styling.
- Verification:
  - `rg -n "role=\"listbox\"|role=\"option\"|aria-selected" sites/fdicnet-main-menu -S` returns no matches.
  - `node --check sites/fdicnet-main-menu/script.js` passes.
## Current Task (First-Column Focus Seam Removal)
- [x] Replace split focus-ring rendering with one continuous ring spanning left extension + row body.
- [x] Preserve existing hover/selected background behavior while fixing focus seam artifact.
- [x] Verify and commit.

## Review / Results (First-Column Focus Seam Removal)
- Updated `sites/fdicnet-main-menu/styles.css` to use a unified `:focus-visible::after` ring layer for `.l1-item` and `.overview-link`.
- Removed dual-ring rendering from element box and `::before` extension that created the visible seam between two outlined regions.
- Result: focus now renders as one continuous rectangle from viewport-left extension through row right edge.

## Current Task (First-Column Focus Ring Coverage Fix)
- [x] Ensure first-column focus rectangle covers the full item area (left viewport edge through right edge of the row item).
- [x] Keep hover/selected visual behavior unchanged while correcting focus-ring geometry.
- [x] Verify and commit the focused CSS fix.

## Review / Results (First-Column Focus Ring Coverage Fix)
- Updated `sites/fdicnet-main-menu/styles.css`:
  - added inset focus ring on `.l1-item:focus-visible` so the item portion of the row is outlined.
  - added inset focus ring on `.overview-link:focus-visible` for the same full-row coverage behavior.
  - retained full-bleed pseudo-element focus ring for left-of-column extension.
- Result: focus rectangle now spans from the viewport-left extension through the visible row item.

## Current Task (First-Column Focus Ring Full-Bleed Alignment)
- [x] Update first-column focus indicators so ring extent matches full-bleed background highlight area.
- [x] Apply same focus-ring extent behavior to first-column overview link row for consistency.
- [x] Verify CSS changes and commit.

## Review / Results (First-Column Focus Ring Full-Bleed Alignment)
- Updated `sites/fdicnet-main-menu/styles.css`:
  - removed element-box outline for `.l1-item:focus-visible` and `.overview-link:focus-visible`.
  - added inset focus ring on full-bleed `::before` layer for both selectors.
- Result: keyboard focus rectangle now follows the same full-width/edge-aligned area as first-column highlight treatment.

## Current Task (Menu Keyboard Navigation Regression Recovery)
- [x] Diagnose why arrow-key navigation within/across mega-menu columns is failing.
- [x] Restore focus-preserving keyboard navigation for L1/L2/L3 (up/down, left/right).
- [x] Verify keyboard movement and focus visibility behavior, then commit.

## Review / Results (Menu Keyboard Navigation Regression Recovery)
- Root cause: L2 focus handlers invoked preview updates that could re-render the column during focus transitions, causing focused elements to be replaced and focus to fall back to `body`.
- Updated `sites/fdicnet-main-menu/script.js`:
  - L2 item `focus` handler now calls `setPreviewL2(index, { fromFocus: true, restoreFocus: true })`.
  - L2 overview-link `focus` handler now calls `setPreviewOverview({ fromFocus: true, restoreFocus: true })`.
- Effect: keyboard arrow navigation now preserves focus identity while updating preview state.

## Current Task (L2/L3 Link Background Cleanup)
- [x] Remove gray background hover treatment from second/third-column hyperlinks.
- [x] Preserve hyperlink color/underline hover styling without row background fill.
- [x] Commit focused style update.

## Review / Results (L2/L3 Link Background Cleanup)
- Updated `sites/fdicnet-main-menu/styles.css` to remove inset gray hover fill from `.l2-item:hover` and `.l3-item:hover`.
- Kept existing link color and underline hover emphasis so interactivity remains clear without background shading.

## Current Task (First-Column Overview Link Hit Target + States)
- [x] Match first-column overview link row padding and target size to L1 row geometry.
- [x] Apply first-column-equivalent hover/focus row styling while preserving hyperlink text treatment.
- [x] Verify CSS diff scope and commit.

## Review / Results (First-Column Overview Link Hit Target + States)
- Updated `sites/fdicnet-main-menu/styles.css`:
  - removed `overview-link` from L2/L3 compact-row sizing rule.
  - removed `overview-link` from L2/L3 overlay-hover rule.
  - made `.overview-link` full-width, L1-sized row (`min-height: 41px`, row padding aligned to first column controls).
  - added dedicated full-row hover/focus visuals for `.overview-link` to match first-column item affordance while keeping link underline/text styling.
- Verification:
  - `git diff -- sites/fdicnet-main-menu/styles.css`

## Current Task (Header Apps Button + Desktop Search Gap Alignment)
- [x] Reduce wide-viewport spacing between header action icons and search to match smaller viewport spacing.
- [x] Add new `Apps` icon button immediately left of the profile icon button with no extra inter-button gap.
- [x] Verify responsive header behavior in `fdicnet-main-menu` and commit.

## Review / Results (Header Apps Button + Desktop Search Gap Alignment)
- Updated header controls markup in `sites/fdicnet-main-menu/index.html`:
  - inserted new `Apps` icon button (`ph-squares-four`) immediately left of `Profile`.
  - grouped `Apps` + `Profile` buttons in a dedicated icon cluster.
- Updated `sites/fdicnet-main-menu/styles.css`:
  - changed `.fdic-controls` gap from `32px` to `12px` (matching smaller viewport spacing intent).
  - added `.fdic-control-icons` with `gap: 0` so no extra spacing exists between `Apps` and `Profile`.
- Verification:
  - `node --check sites/fdicnet-main-menu/script.js`
  - diff review confirmed only targeted header markup and spacing rules changed.

## Current Task (Mobile Drill Link Placement)
- [x] Move previous-layer link rows from top header to bottom of L2 and L3 drill lists.
- [x] Keep back control at top and preserve drill navigation behavior.
- [x] Verify mobile drill path rendering after repositioning.

## Current Task (Mobile Drawer Drill-In Navigation Model)
- [x] Replace nested mobile accordion content with a drill-in interaction model.
- [x] Render non-link drill targets for hierarchical steps (with right-caret affordance and DS hover/focus states).
- [x] Render level header links in drill-in views (`L1` link at L2 step, `L2` link at L3 step).
- [x] Ensure final L3 step renders link-only rows.
- [x] Validate mobile drill path navigation + Escape-back behavior and desktop regression.

## Review / Results (Mobile Drawer Drill-In Navigation Model)
- Replaced mobile nested accordion rendering with a path-based drill-in system:
  - root: top-level menu sections,
  - step 1: L1 list,
  - step 2: L2 list,
  - step 3: L3 links.
- Drill targets are now buttons (not hyperlinks) with DS-consistent hover/focus/pressed styling and right-caret affordances.
- Each drilled view includes context navigation:
  - back control to previous level,
  - current-level link at top (`L1` on L2 view, `L2` on L3 view).
- Escape behavior on mobile now steps back one drill level before closing menu.
- Verification:
  - `node --check sites/fdicnet-main-menu/script.js`
  - Playwright at `768x1366`: open menu, drill to `News & Events -> News -> FDICNews`, confirm L3 links render and `Escape` steps back.
  - Playwright at `1280x900`: desktop mega-menu layout/behavior still renders.

## Current Task (Mobile Drawer Full-Menu Accordion Layout)
- [x] Render full top-level menu in mobile drawer as accordion sections (not a single active panel).
- [x] Remove mobile accordion-group heading and `Expand all` control.
- [x] Keep nested L1/L2/L3 interactions functional under each top-level section.
- [x] Make mobile accordion layout full-width within drawer (remove side gutters around accordion stack).
- [x] Run mobile/desktop regression checks and commit.

## Review / Results (Mobile Drawer Full-Menu Accordion Layout)
- Mobile drawer now renders all top-level menu sections (`News & Events`, `Career Development & Training`, etc.) as accordion triggers.
- Removed the mobile section heading + `Expand all` controls from the drawer.
- Nested panel behavior preserved:
  - top-level section expands to show panel L1 items,
  - L1 expands to show L2 split rows,
  - L2 split toggle expands/collapses L3 lists.
- Drawer accordion stack is now edge-to-edge (removed left/right drawer padding around accordion rows).
- Verification:
  - `node --check sites/fdicnet-main-menu/script.js`
  - Playwright at `768x1366`: full top-level accordion list visible, `News & Events` expands, `News` expands, nested split-toggle controls remain functional.

## Current Task (Mobile Drawer Accordion Regression Follow-up)
- [x] Reproduce the reported local mobile issues (vertical tab list, non-working accordion toggles, split-button L2 behavior, drawer width/color mismatch).
- [x] Remove any remaining legacy mobile top-nav rendering from the off-canvas drawer path.
- [x] Fix mobile accordion interactions so top-level and nested split toggles collapse/expand reliably.
- [x] Ensure L2 rows with L3 children render as true split controls (link action + independent expand/collapse button).
- [x] Make drawer and accordion stack full-width with neutral design-system-aligned styling.
- [x] Run regression checks (mobile + desktop behavior, syntax) and commit with clear message.

## Review / Results (Mobile Drawer Accordion Regression Follow-up)
- Removed the redundant mobile top-level selector stack so the drawer renders a single accordion system for the active panel.
- Changed mobile accordion defaults to collapsed (`News` no longer auto-expands when menu opens).
- Kept L2 split-button behavior and corrected nested collapse/expand state rendering for L3 lists.
- Switched mobile accordion iconography to explicit `+ / −` glyphs for deterministic DS-style affordance.
- Confirmed neutral drawer styling and full-width accordion rows in the off-canvas panel.
- Verification:
  - `node --check sites/fdicnet-main-menu/script.js`
  - Playwright checks:
    - mobile `768x1366`: menu closed on load, drawer opens, L1 expands/collapses, L2 split toggles show/hide L3.
    - desktop `1280x900`: top-nav and 3-column menu render remains functional.

## Current Task (Mobile Menu Accordion Alignment to Design System)
- [x] Audit current mobile accordion implementation in `sites/fdicnet-main-menu` against design-system Accordion + Accordion Group specs.
- [x] Open a GitHub issue documenting gap analysis, implementation plan, and acceptance criteria.
- [x] Create and switch to a feature branch for implementation work.
- [x] Refactor mobile accordion UI to a single DS-aligned pattern and remove legacy duplicate style path.
- [x] Align mobile accordion/group styles to DS tokens and state treatments (default/hover/pressed/focus).
- [x] Run regression checks for mobile/desktop menu interactions and script syntax.

## Review / Results (Mobile Menu Accordion Alignment to Design System)
- Scope expanded: include site style/token alignment to design-system tokens and interaction states (tracked in issue #54).
- Opened issue: `#54`  
  - `https://github.com/jflamb/pens-github-test/issues/54`
- Issue includes:
  - implementation-focused gap analysis (architecture, token fidelity, behavior, visual parity, accessibility alignment).
  - detailed stepwise implementation plan.
  - explicit acceptance criteria and verification matrix.
- Created and switched branch:
  - `feat/issue-54-mobile-accordion-ds-alignment`
- Implemented:
  - removed dead `mobileTopAccordion`/legacy state references in `script.js`.
  - added mobile accordion-group heading + `Expand all` / `Collapse all` control and plus/minus glyph behavior.
  - replaced duplicate mobile-top CSS path with one canonical mobile accordion style path.
  - introduced DS token aliases in `:root` and applied them to mobile accordion/group styles.
- Verification:
  - `node --check sites/fdicnet-main-menu/script.js`
  - Playwright interaction pass on local server:
    - mobile `375x900`: expand/collapse single section, expand all, collapse all, drawer open/close.
    - desktop `1280x900`: top-nav/mega-menu baseline behavior intact.
  - Console/network check: only non-blocking `favicon.ico` 404 from local static server.

## Current Task (Narrow Header Menu + Phone Search Toggle)
- [x] Move narrow-width menu entry to icon-only masthead hamburger (left of FDIC wordmark).
- [x] Hide `Menu` label in narrow mode while preserving accessible label.
- [x] Collapse phone search input to icon button; toggle a full-width search row below masthead.
- [x] Wire search toggle interactions (open/close, focus management, Escape/outside click behavior).
- [x] Verify mobile/tablet/desktop menu and search interactions end-to-end.

## Current Task (Mobile Drawer Toggle Rendering Fix)
- [x] Fix mobile drawer toggle placement so `Close` does not overlap accordion rows.
- [x] Add drawer top spacing/header treatment for stable button-to-content separation.
- [x] Verify mobile open/close rendering and interaction remain correct.

## Current Task (Mobile Interaction Regression Pass)
- [x] Reproduce report that accordion interactions dismiss menu unexpectedly.
- [x] Validate interaction matrix: open/close toggle, top-level accordion expand, L2 split toggle, outside click dismiss, Escape dismiss.
- [x] Fix click-layer/stacking issue so accordion controls remain interactive while drawer is open.

## Current Task (Mobile Off-Canvas Menu Entry Point)
- [x] Convert mobile nav list to off-canvas drawer behavior controlled by the Menu button.
- [x] Update Menu button to switch between Menu and Close states (icon/text/ARIA) while drawer is open.
- [x] Add backdrop and dismiss behavior (button, backdrop click, Escape).
- [x] Ensure drawer remains hidden by default on mobile and desktop behavior is unchanged.
- [x] Verify narrow viewport interactions and run `node --check sites/fdicnet-main-menu/script.js`.

## Current Task (Mobile L2 Split Button Accordion Follow-up)
- [x] Refactor mobile top accordion content so each L2 row is a split control: L2 link + caret toggle button.
- [x] Collapse L3 lists by default and expand/collapse per-L2 only.
- [x] Reduce excess whitespace in mobile L3 list presentation.
- [x] Verify narrow viewport interaction and accessibility attributes (`aria-expanded`, `aria-controls`, hidden panels).
- [x] Run `node --check sites/fdicnet-main-menu/script.js`.

## Current Task (Issue #28: Fully Responsive FDICnet Main Menu, #30 Deferred)
- [x] Create/update issue #28 notes on GitHub to defer "L2 must render as <a>" acceptance criterion to issue #30 while keeping all other #28 criteria in scope.
- [x] Implement responsive shell and overflow fixes in `sites/fdicnet-main-menu/styles.css`:
- [x] Add tablet breakpoint (`769px-1049px`) with `.fdic-shell` width `calc(100% - 64px)`.
- [x] Keep desktop shell width `calc(100% - 128px)` for `>=1050px` and mobile width `calc(100% - 32px)` for `<=768px`.
- [x] Make `.mega-menu-inner` tablet columns fluid to avoid horizontal scrolling at 769/900/1024 widths.
- [x] Remove `white-space: nowrap` from `.l2-item`, `.overview-link`, `.l3-item` and add robust wrapping/readability styles.
- [x] Preserve L1 full-bleed background behavior without introducing horizontal overflow.
- [x] Implement mobile accordion behavior in `sites/fdicnet-main-menu/script.js`:
- [x] Add separate mobile accordion state with single-open semantics.
- [x] Default expanded mobile panel to `selectedL1Index` when menu opens on mobile.
- [x] Render L1 accordion controls with `aria-expanded`/`aria-controls` and stable panel IDs.
- [x] Render expanded mobile panel hierarchy as L2 rows + immediate L3 rows (always visible) + overview link at panel bottom.
- [x] Add mobile `Escape` behavior: close expanded panel and return focus to trigger when focus is inside that panel; otherwise preserve global close behavior.
- [x] Keep desktop (`>=769px`) three-column preview/roving interaction unchanged.
- [x] Implement mobile hierarchy and target-size styling in `sites/fdicnet-main-menu/styles.css`:
- [x] Add visual hierarchy/indentation for L1/L2/L3 content inside accordion panels.
- [x] Add chevron indicator with expanded rotation state.
- [x] Respect `prefers-reduced-motion` for accordion/menu transitions and chevron animation.
- [x] Enforce minimum 44px interactive target height and >=8px separation between adjacent controls.
- [x] Verification:
- [x] Run `node --check sites/fdicnet-main-menu/script.js`.
- [x] Confirm nowrap removal and new breakpoint blocks with selector/text checks.
- [x] Validate no horizontal overflow at widths 375, 768, 769, 900, 1024, 1280, 1440 (document root and `.mega-menu-inner`).
- [x] Verify desktop parity (`>=1050`) and tablet usability (`769-1049`) with no clipping.
- [x] Verify mobile accordion behavior (`<=768`): one-open logic, default-open panel, visible L3 rows, overview placement, unchanged hamburger behavior.
- [x] Verify accessibility/keyboard contract: `aria-expanded`/`aria-controls`, collapsed panel hidden, visual tab order parity, `Enter`/`Space` toggles, panel-level `Escape`, reduced-motion animation suppression.
- [x] Commit, push branch, and open PR documenting implementation and verification details.

## Review / Results (Issue #28: Fully Responsive FDICnet Main Menu, #30 Deferred)
- Branch: `fix/issue-28-responsive-accordion-menu`.
- GitHub issue updates completed before code changes:
  - Updated issue `#28` acceptance criteria body to defer L2-as-`<a>` requirement to issue `#30`.
  - Added scope-adjustment comment: `https://github.com/jflamb/pens-github-test/issues/28#issuecomment-4020663698`.
- Updated `sites/fdicnet-main-menu/script.js`:
  - added explicit `mobileAccordionOpenIndex` state separate from desktop preview state.
  - added single-open mobile accordion rendering (L1 buttons with `aria-expanded`/`aria-controls` and stable panel IDs).
  - default-open mobile accordion synced to current `selectedL1Index` whenever menu opens in mobile viewport.
  - mobile panel now renders full hierarchy in one panel: L2 row labels, immediate L3 links, and bottom overview link.
  - added panel-level mobile Escape handling that collapses current panel and restores focus to its L1 trigger.
  - retained desktop interaction model and addressed L2 focus-preview stability.
- Updated `sites/fdicnet-main-menu/styles.css`:
  - added explicit shell widths for mobile/tablet/desktop breakpoints.
  - added tablet fluid `grid-template-columns` for `.mega-menu-inner`.
  - removed nowrap constraints and added wrapping safety/readability tuning.
  - preserved full-bleed L1 background behavior with transform-based pseudo-element positioning to avoid overflow.
  - added mobile accordion hierarchy, chevron rotation, and touch-target spacing/min-height styles.
  - extended reduced-motion rules to suppress chevron animation.
- Verification evidence:
  - `node --check sites/fdicnet-main-menu/script.js` passed.
  - selector checks confirmed target breakpoint blocks and nowrap removal.
  - Playwright viewport matrix passed at `375, 768, 769, 900, 1024, 1280, 1440`: `documentElement.scrollWidth <= clientWidth` and `.mega-menu-inner.scrollWidth <= clientWidth` at each width.
  - mobile keyboard/accessibility checks passed for `aria-expanded`/`aria-controls`, hidden collapsed panels, one-open accordion behavior, Enter/Space toggles, panel-level Escape focus return, and reduced-motion transition suppression.


## Current Task (FDICnet Fit & Finish: Link States + L1 Weight)
- [x] Align menu link default/hover/focus styles to requested Figma interaction states.
- [x] Reduce first-column item text heaviness to Source Sans 3, 18px, semibold treatment.
- [x] Run quick verification (CSS state grep + script syntax check) and update PR.

## Review / Results (FDICnet Fit & Finish: Link States + L1 Weight)
- Updated `sites/fdicnet-main-menu/styles.css`:
  - normalized link states for `.l2-item`, `.l3-item`, and `.overview-link`:
    - default: underlined link styling with consistent underline offset/thickness.
    - hover: darker link color and emphasized underline color/thickness.
    - focus-visible: consistent focus ring treatment with transparent background.
  - reduced L1 text heaviness by removing variable-font weight override while keeping semibold (`font-weight: 600`) at 18px.
- Verification:
  - `node --check sites/fdicnet-main-menu/script.js`
  - style grep checks for new link-state tokens/selectors and removal of L1 variable-weight override.

## Current Task (FDICnet Main Menu Low-Priority Issues #11-#17, #19, #20)
- [x] Create a dedicated branch for low-priority issues #11-#17, #19, and #20 (excluding #18).
- [x] Review each low-priority issue in scope and post an implementation-plan comment on each open issue (#11, #12, #13, #14, #15, #16, #17, #19, #20).
- [x] Implement responsive/mobile nav behavior for issue #11 with a compact hamburger toggle pattern and keyboard-accessible expanded/collapsed state.
- [x] Implement security/robustness/documentation fixes:
- [x] Issue #12: add SRI + `crossorigin` to CDN script/style resources where practical.
- [x] Issue #13: add `<noscript>` fallback content for JS-disabled scenarios.
- [x] Issue #19: replace hardcoded panel-specific `aria-label` in static HTML with a generic initialization-safe label.
- [x] Implement interaction/layout and maintainability fixes:
- [x] Issue #14: replace `max-height` transition hack with predictable open/close animation behavior.
- [x] Issue #15: remove potential horizontal overflow from L1 full-bleed background treatment.
- [x] Issue #16: encapsulate module-level mutable menu state in a dedicated state object.
- [x] Issue #17: simplify overlapping selected-nav CSS selectors and remove redundant border override patterns.
- [x] Issue #20: remove dead L2 active-state font-weight CSS rule (or make active state intentional and distinct).
- [x] Verify behavior with syntax checks and targeted regression checks (top-nav keyboard roving, mega-menu open/close, column keyboard navigation, responsive menu interaction).
- [x] Commit, push, and open a PR documenting issue-by-issue implementation and verification.

## Review / Results (FDICnet Main Menu Low-Priority Issues #11-#17, #19, #20)
- Branch created: `fix/fdicnet-main-menu-low-issues-11-17-19-20`.
- Posted issue plan comments on:
  - `#11`: `issuecomment-4020219280`
  - `#12`: `issuecomment-4020219302`
  - `#13`: `issuecomment-4020219318`
  - `#14`: `issuecomment-4020219341`
  - `#15`: `issuecomment-4020219365`
  - `#16`: `issuecomment-4020219381`
  - `#17`: `issuecomment-4020219403`
  - `#19`: `issuecomment-4020219430`
  - `#20`: `issuecomment-4020219453`
- Updated `sites/fdicnet-main-menu/index.html`:
  - added mobile menu toggle button scaffold.
  - added `<noscript>` fallback notice.
  - replaced static mega-menu label with neutral `aria-label="Main menu"`.
  - added SRI and `crossorigin="anonymous"` for Phosphor Icons and `js-yaml` CDNs.
- Updated `sites/fdicnet-main-menu/script.js`:
  - consolidated mutable state into centralized `menuState`.
  - added mobile menu state/behavior (`mobileNavOpen`, toggle sync, click-off and `Escape` close).
  - replaced immediate hide-on-close with transition-aware close flow while preserving `hidden` semantics.
- Updated `sites/fdicnet-main-menu/styles.css`:
  - replaced mega-menu `max-height` hack with predictable `grid-template-rows` + opacity/transform transition.
  - added responsive mobile nav layout/styling for breakpoint behavior.
  - removed redundant selected-nav and border override patterns.
  - removed dead `.l2-item[data-active="true"]` rule.
  - added horizontal overflow clipping guard on header container.
- Verification:
  - `node --check sites/fdicnet-main-menu/script.js`
  - targeted grep checks for SRI/noscript/mobile-toggle wiring and removed stale CSS/ARIA patterns.
- PR: `https://github.com/jflamb/pens-github-test/pull/23`

## Current Task (FDICnet Header Click-Off Menu Close Behavior)
- [x] Reproduce click-off behavior where header clicks outside top-level menu items fail to close open mega menu.
- [x] Update pointer handler to close menu for non-menu-button header clicks while preserving menu-button and mega-panel interactions.
- [x] Run syntax validation and record verification.

## Review / Results (FDICnet Header Click-Off Menu Close Behavior)
- Updated `sites/fdicnet-main-menu/script.js`:
  - refined document `pointerdown` close logic:
    - keep menu open for clicks inside `#megaMenu`
    - keep menu open for clicks on `.fdic-nav-item--button`
    - close menu for all other clicks, including header clicks off top-level menu items
- Verification:
  - `node --check sites/fdicnet-main-menu/script.js`

## Current Task (FDICnet L1 Space Activation Focus Persistence)
- [x] Reproduce and isolate focus-loss path when activating L1 item via keyboard (`Space`).
- [x] Preserve focus on the selected L1 control after L1/L2/L3 re-render on activation.
- [x] Run syntax validation and capture the verification result.

## Review / Results (FDICnet L1 Space Activation Focus Persistence)
- Updated `sites/fdicnet-main-menu/script.js`:
  - added optional focus restoration in `setSelectedL1(index, { restoreFocus })`.
  - wired L1 click activation to request focus restoration on the selected L1 item after re-render.
- Verification:
  - `node --check sites/fdicnet-main-menu/script.js`

## Current Task (FDICnet Main Menu Medium-Priority Issues #5-#10)
- [x] Create a dedicated branch for medium-priority issues #5 through #10.
- [x] Review each issue and post an implementation-plan comment on each open issue (#5, #6, #7, #8, #9, #10).
- [x] Implement accessibility fixes:
- [x] Issue #5: expose L2 active state via ARIA semantics.
- [x] Issue #6: remove noisy `aria-current="false"` from non-current L1 items.
- [x] Implement maintainability/runtime fixes:
- [x] Issue #7: extract shared L2 overview construction helper used by both `renderL2` and `renderL3`.
- [x] Issue #8: avoid full `renderTopNav()` re-render on panel switch; sync state/update roving without rebuilding nav.
- [x] Issue #9: add initialization guard for required DOM elements with actionable error reporting.
- [x] Issue #10: remove dead `overviewDescription` fallback or wire schema intentionally (choose one consistent direction).
- [x] Verify with syntax checks and targeted regression checks for nav/menu keyboard behavior.
- [x] Commit, push, and open a PR documenting issue-by-issue implementation and verification.

## Review / Results (FDICnet Main Menu Medium-Priority Issues #5-#10)
- Branch created: `fix/fdicnet-main-menu-medium-issues-5-10`.
- Posted issue plan comments on:
  - `#5`: `issuecomment-4020170132`
  - `#6`: `issuecomment-4020170154`
  - `#7`: `issuecomment-4020170182`
  - `#8`: `issuecomment-4020170203`
  - `#9`: `issuecomment-4020170220`
  - `#10`: `issuecomment-4020170237`
- Updated `sites/fdicnet-main-menu/script.js`:
  - added required-DOM initialization guard with explicit missing-element error reporting.
  - removed top-nav full re-render on panel switch; now syncs nav state and roving focus without rebuilding nodes.
  - removed `aria-current="false"` from non-selected L1 items.
  - added ARIA current-state exposure for active L2 item and updated focus-target logic to use it.
  - extracted shared `getL2Overview()` helper and removed duplicated L2 overview construction blocks.
  - removed dead `overviewDescription` fallback path and aligned fallback description to current YAML schema.
- Verification:
  - `node --check sites/fdicnet-main-menu/script.js`
  - grep checks for helper extraction, removed `overviewDescription` usage, and ARIA/current-state selectors
- PR: `https://github.com/jflamb/pens-github-test/pull/22`

## Current Task (FDICnet Header Top-Nav Roving Keyboard Behavior)
- [x] Convert header top-level nav items to a single-tab-stop roving tabindex pattern.
- [x] Add left/right arrow navigation across top-level nav items.
- [x] Ensure keyboard key activation toggles menu visibility for menu-backed nav button.
- [x] Verify script syntax and key handler wiring.

## Review / Results (FDICnet Header Top-Nav Roving Keyboard Behavior)
- Updated `sites/fdicnet-main-menu/script.js`:
  - added top-nav roving state (`topNavFocusIndex`) and `applyTopNavRoving()` so only one `.fdic-nav-item` is tabbable (`tabIndex=0`) at a time.
  - added `navList` keyboard handler for `ArrowLeft`, `ArrowRight`, `Home`, and `End` to move focus across top-level nav items.
  - added keyboard activation for menu-backed nav items: `Enter`/`Space` on `.fdic-nav-item--button` now triggers toggle behavior via click.
  - preserved existing click behavior and panel-selection logic.
- Verification:
  - `node --check sites/fdicnet-main-menu/script.js`
  - grep checks for roving helpers and top-nav key handler wiring

## Current Task (FDICnet Menu Keyboard Follow-up Fixes)
- [x] Fix first-column arrow-key navigation so `ArrowDown` can reach the first-column Overview link.
- [x] Fix cross-column focus visibility by preserving L2 focus when focus-triggered preview rendering occurs.
- [x] Re-run script syntax check and targeted diff validation.

## Review / Results (FDICnet Menu Keyboard Follow-up Fixes)
- Updated `sites/fdicnet-main-menu/script.js`:
  - first-column arrow-nav now includes both `.l1-item` controls and `#l1OverviewLink`.
  - first-column overview link now participates in keyboard metadata/roving (`data-column`, `data-index`, `tabIndex`).
  - added focus-preserving logic for L2 preview updates to prevent focus loss when entering L2 by keyboard.
  - added no-op guards in preview setters to avoid unnecessary re-renders and focus churn.
- Verification:
  - `node --check sites/fdicnet-main-menu/script.js`
  - targeted grep/diff checks for updated first-column selector and focus-preservation paths.

## Current Task (FDICnet Main Menu Cross-Column Keyboard Navigation)
- [x] Add left/right arrow-key navigation across L1, L2, and L3 columns while preserving existing up/down roving behavior.
- [x] Ensure target focus selection is predictable (selected/active item first, then sensible fallback).
- [x] Strengthen focus-visible styling so focused menu items are clearly visible during keyboard navigation.
- [x] Run syntax/selector verification and record results.

## Review / Results (FDICnet Main Menu Cross-Column Keyboard Navigation)
- Updated `sites/fdicnet-main-menu/script.js`:
  - added cross-column navigation via `ArrowLeft` / `ArrowRight` inside `.mega-menu`.
  - added focus-target helpers so cross-column moves land on selected/active items first:
    - L1 target: selected item (`aria-current="true"`)
    - L2 target: active item (`data-active="true"`) then roving focus item fallback
    - L3 target: current roving focus item (when L3 list is visible)
  - added `data-column="l2"` metadata to L2 overview link so left/right navigation works consistently from all L2 options.
- Updated `sites/fdicnet-main-menu/styles.css`:
  - added visible focus ring to `.l1-item:focus-visible` (`2px #005ea2`) so keyboard focus is obvious in L1.
- Verification:
  - `node --check sites/fdicnet-main-menu/script.js`
  - grep checks for cross-column key handlers and focus-visible selectors

## Current Task (FDICnet Main Menu High-Priority Accessibility Issues #1-#4)
- [x] Create a dedicated branch for issues #1, #2, #3, and #4.
- [x] Post implementation-plan comments on each GitHub issue with acceptance criteria and verification notes.
- [x] Fix issue #1 by converting L2 selection controls from links-with-preventDefault semantics to button semantics.
- [x] Fix issue #2 by setting L1 roving tabindex initial focus target to the currently selected L1 item.
- [x] Fix issue #3 by adding a clearly visible focus indicator for `.overview-link:focus-visible`.
- [x] Fix issue #4 by adding a full-element focus indicator for `.fdic-nav-item:focus-visible` (without removing existing selected/hover behavior).
- [x] Run verification checks (`node --check`, targeted source grep, and basic interaction sanity validation).
- [x] Commit changes, push branch, and open a PR that references all four issues.

## Review / Results (FDICnet Main Menu High-Priority Accessibility Issues #1-#4)
- Branch created: `fix/fdicnet-main-menu-a11y-issues-1-4`.
- Posted issue plan comments on:
  - `#1`: `issuecomment-4020102598`
  - `#2`: `issuecomment-4020102597`
  - `#3`: `issuecomment-4020102600`
  - `#4`: `issuecomment-4020102599`
- Updated `sites/fdicnet-main-menu/script.js`:
  - L2 interactive items now render as `<button type="button">` controls.
  - L1 roving tabindex now gives `tabIndex=0` to the selected L1 item.
- Updated `sites/fdicnet-main-menu/styles.css`:
  - `.fdic-nav-item:focus-visible` now has a full-element 2px focus ring.
  - `.fdic-nav-item--selected:focus-visible` keeps ring visibility on selected state.
  - `.overview-link:focus-visible` now has a clear 2px focus ring.
- Verification:
  - `node --check sites/fdicnet-main-menu/script.js`
  - grep checks for L2 button rendering and focus selector presence in CSS
- PR: `https://github.com/jflamb/pens-github-test/pull/21`

## Current Task (FDICnet Main Menu Accessibility Fixes)
- [x] Ensure mega menu is removed from accessibility tree and tab order when closed.
- [x] Preserve L3 preview when keyboard focus moves from L2 into the L3 column.
- [x] Add visible focus indicators for L2 and L3 links that meet focus visibility expectations.
- [x] Add a visible focus indicator for the profile icon button in the masthead.
- [x] Verify script syntax and confirm selector wiring for updated behavior/styles.

## Review / Results (FDICnet Main Menu Accessibility Fixes)
- Updated `sites/fdicnet-main-menu/script.js`:
  - `openMenu()` now sets `megaMenu.hidden = false`.
  - `closeMenu()` now sets `megaMenu.hidden = true`.
  - removed init behavior that force-exposed mega-menu to assistive tech on load.
  - added L3-column keyboard focus guards (`focusin`/`focusout`) to preserve L2 preview when focus moves into L3.
  - updated L2 `focusout` logic to retain preview when `relatedTarget` is in L3.
- Updated `sites/fdicnet-main-menu/styles.css`:
  - added visible focus ring for `.icon-button:focus-visible` in masthead.
  - replaced no-op focus styling on `.l2-item` / `.l3-item` with visible focus treatment (`outline` + white background).
  - retained transparent hover treatment without suppressing focus visibility.
- Verification:
  - `node --check sites/fdicnet-main-menu/script.js`
  - selector/behavior grep checks for updated focus and menu-hidden logic

## Current Task (Overview Hover + Expanded Test Content)
- [x] Update L2 overview hover behavior so L3 shows overview description (not L3 links).
- [x] Add plausible page descriptions for L2 items across menu panels.
- [x] Add plausible L1/L2/L3 test content for `Benefits`, `Employee Services`, and `About`.
- [x] Verify script syntax and content wiring for new panels.

## Review / Results (Overview Hover + Expanded Test Content)
- Added `previewingOverview` state in `sites/fdicnet-main-menu/script.js` so hovering/focusing the L2 overview link shows description-only content in L3.
- Expanded `sites/fdicnet-main-menu/content.yaml` with:
  - L2 descriptions across existing panels
  - new menu-backed panels for `Benefits`, `Employee Services`, and `About`
  - plausible L1/L2/L3 test content for each new panel
- Kept existing Figma-aligned menu structure and interaction model intact while broadening content coverage for QA.
- Verification:
  - `node --check sites/fdicnet-main-menu/script.js`
  - content sanity checks for new panel keys and description fields in `content.yaml`

## Current Task (FDICnet Multi-Panel Figma Content + Header Fixes)
- [x] Fix selected L1 chevron size/alignment to match Figma.
- [x] Fix selected top-nav label visibility for `News & Events`.
- [x] Update `News & Events` panel content to Figma node `12724:12704`.
- [x] Update `Events` L2/L3 content to Figma node `12724:13156`.
- [x] Update `Career Development & Training` panel content to Figma node `12724:11825`.
- [x] Verify runtime rendering and interaction behavior after YAML/content updates.

## Review / Results (FDICnet Multi-Panel Figma Content + Header Fixes)
- Pulled and applied content updates from Figma nodes:
  - `12724:12704` (`News` tab content and L3 headlines)
  - `12724:13156` (`Events` L2/L3 content)
  - `12724:11825` (`Career Development & Training` panel content)
- Refactored `sites/fdicnet-main-menu/script.js` to support multiple menu-backed top-nav tabs using YAML panel keys:
  - `News & Events` panel
  - `Career Development & Training` panel
- Updated `sites/fdicnet-main-menu/content.yaml` to store tab-specific L1/L2/L3 content with Figma-aligned labels and ordering.
- Fixed selected top-nav visibility bug by adding explicit selected-open-state styling and preserving selected tab color/background when menu is open.
- Replaced L1 caret pseudo-content with a dedicated icon element (`.l1-caret`) sized and centered at `20px` to match Figma alignment.
- Verification:
  - `node --check sites/fdicnet-main-menu/script.js`
  - selector/content checks for updated style hooks and Figma labels in `styles.css` and `content.yaml`

## Current Task (FDICnet Content YAML + Menu Alignment)
- [x] Move site content text into a YAML file under `sites/fdicnet-main-menu`.
- [x] Update `fdicnet-main-menu` to fetch YAML and render header/menu/page copy at runtime.
- [x] Align top-nav and mega-menu content with the Figma mock-up content (remove `Home`).
- [x] Update L1 panel styling so background extends to viewport left edge and text aligns with top-nav text.
- [x] Verify behavior and record results.

## Review / Results (FDICnet Content YAML + Menu Alignment)
- Added `sites/fdicnet-main-menu/content.yaml` as the source of truth for:
  - top navigation labels
  - L1/L2/L3 menu content
  - search placeholder text
  - page title and intro paragraphs
- Refactored `sites/fdicnet-main-menu/script.js` to:
  - fetch and parse YAML at runtime using `js-yaml`
  - render nav/menu/main page copy from YAML
  - keep existing keyboard and open/close interactions
- Updated `sites/fdicnet-main-menu/index.html` to:
  - render nav and page-copy placeholders for runtime injection
  - load `js-yaml` in-browser
  - remove static menu content that was out of sync with mock-up
- Updated `sites/fdicnet-main-menu/styles.css` to:
  - extend L1 panel background to viewport left edge (`.mega-col--l1::before`)
  - align L1 and overview text start with top-nav item text (`padding-left: 16px`)
  - support selected top-nav tab styling via class (`.fdic-nav-item--selected`)
- Verification:
  - `node --check sites/fdicnet-main-menu/script.js`
  - grep checks confirm old static nav labels removed and YAML runtime wiring in place

## Current Task (FDICnet Header Figma Alignment)
- [x] Capture FDICnet header design context and SVG asset from the target Figma node.
- [x] Add Phosphor icon dependency scoped only to `sites/fdicnet-main-menu`.
- [x] Align `fdicnet-main-menu` header structure and spacing to Figma spec values.
- [x] Verify behavior/visual parity and record results.

## Review / Results (FDICnet Header Figma Alignment)
- Pulled Figma design context and variables for node `12724:12595` from file `ts65AKlW3gRREgr2dD4ZtB` and aligned key tokens:
  - `Brand/Core/Darker`: `#003256`
  - `Body/Normal`: Source Sans 3, 18px, 400, 1.375 line-height
  - `Brand/Core/Light`: `#38b6ff`
  - `Background/Input`: `#ffffff`, `Border/Input/Rest`: `#bdbdbf`
- Updated `sites/fdicnet-main-menu` only:
  - integrated provided `FDICnet.svg` logo asset
  - switched header controls to Phosphor icons matching the Figma composition (user icon + search icon)
  - applied consistent 18px / 400 typography across header menu and mega-menu text states
  - corrected header/nav background blue and active-tab styling
- Verification:
  - `node --check sites/fdicnet-main-menu/script.js`
  - selector/token grep checks across `sites/fdicnet-main-menu/index.html` and `styles.css`

## Current Task (FDICNet Main Menu Interaction Prototype)
- [x] Replace starter `fdicnet-main-menu` page with header + expanding menu layout matching the tabbed menu concept.
- [x] Implement L1/L2/L3 interaction model (L1 click select, L2 hover/focus preview, default selections, last L1 overview link behavior).
- [x] Implement keyboard and accessibility behavior (Tab between columns, Arrow Up/Down within columns, outside-click and Escape to close).
- [x] Verify behavior and record implementation results.

## Review / Results (FDICNet Main Menu Interaction Prototype)
- Replaced the initial scaffold page with a full desktop header and tabbed mega-menu prototype in `sites/fdicnet-main-menu/`.
- Implemented requested interaction model:
  - header menu item toggles expanded/collapsed state and styling
  - menu is in normal document flow and pushes page content down
  - L1 items in column 1 are click-select, with first item selected by default
  - final item in column 1 is a dynamic L1 overview link for the selected L1 section
  - L2 items for selected L1 render in column 2
  - column 3 shows selected L2 description by default, and updates L3 links on L2 hover/focus
  - column 3 is configured as flexible (`1fr`) to fill remaining menu width
- Added keyboard and close behaviors:
  - Arrow Up/Down + Home/End navigate items within each column (roving tabindex pattern)
  - standard Tab order moves between controls/columns
  - outside click and Escape close the menu
- Verification:
  - `node --check sites/fdicnet-main-menu/script.js`
  - selector presence checks for key IDs/classes in `index.html` and `styles.css`

## Current Task (Create fdicnet-main-menu Site)
- [x] Add a task log entry for the new micro-site request.
- [x] Scaffold `sites/fdicnet-main-menu` using the repository micro-site workflow.
- [x] Confirm `sites.json` includes the new site and that required starter files exist.
- [x] Record verification and results for this task.

## Review / Results (Create fdicnet-main-menu Site)
- Created new micro-site directory: `sites/fdicnet-main-menu`.
- Added starter files:
  - `index.html`
  - `styles.css`
  - `script.js`
- Updated `sites.json` with a new registry entry:
  - `name`: `FDICNet Main Menu`
  - `path`: `sites/fdicnet-main-menu/`
  - `description`: `Main menu micro-site for FDICNet prototype navigation.`
- Verification:
  - Confirmed folder/file presence with `Get-ChildItem sites/fdicnet-main-menu -Name`.
  - Confirmed `sites.json` includes the new site entry.

## Current Task (VS Code Live Preview Workspace Defaults)
- [x] Configure workspace-level Live Preview defaults for the support site root and default page.
- [x] Add a one-click VS Code task to run Live Preview for the support site folder.
- [x] Add extension recommendations so workspace collaborators get prompted for Live Preview.
- [x] Verify JSON syntax for new workspace config files.

## Review / Results (VS Code Live Preview Workspace Defaults)
- Added workspace settings in `.vscode/settings.json`:
  - `livePreview.serverRoot: "sites/fdic-public-information-faq"`
  - `livePreview.defaultPreviewPath: "/index.html"`
  - `livePreview.openPreviewTarget: "External Browser"`
  - `livePreview.tasks.runTaskWithExternalPreview: true`
  - `livePreview.portNumber: 4173`
  - `livePreview.hostIP: "127.0.0.1"`
- Added `.vscode/tasks.json` with task label `Live Preview: Info & Support Center` using task `type: "Live Preview"` and `workspacePath: "sites/fdic-public-information-faq"`.
- Added `.vscode/extensions.json` recommending `ms-vscode.live-server`.
- Validation:
  - `node -e "JSON.parse(require('fs').readFileSync('.vscode/settings.json','utf8')); JSON.parse(require('fs').readFileSync('.vscode/tasks.json','utf8')); JSON.parse(require('fs').readFileSync('.vscode/extensions.json','utf8')); console.log('vscode config json ok')"`

## Current Task (FAQ JSON Deep Cleanup: Links then Structure)
- [x] Inventory malformed-link patterns in `data.json` (`</a><a`, anchor text spanning sentence bodies, broken href/text pairs, trailing `website*` style labels).
- [x] Repair highest-risk malformed links directly in `data.json` without renderer-side fallback transforms.
- [x] Normalize `<br>`-driven pseudo-structure into semantic `<p>`, `<ul>`, and `<ol>` where implied by content.
- [x] Run validation checks (JSON parse + pattern counts) and spot-check representative FAQ anchors by `urlName`.
- [x] Log results and residuals in this file.

## Review / Results (FAQ JSON Deep Cleanup: Links then Structure)
- Source cleanup was applied directly in `sites/fdic-public-information-faq/data.json` for all FAQ `answerHtml` entries.
- High-risk malformed-link patterns were repaired:
  - adjacent/split anchor fragments
  - malformed or whitespace-corrupted hrefs
  - over-extended anchor text swallowing sentence content
- Structural normalization was applied in-source:
  - removed `<br>`-based pseudo-formatting from answers
  - promoted bullet-style content into semantic lists
  - split multi-block answers into semantic paragraphs
- Targeted manual rewrites were applied to remaining outliers where automatic repair risked content loss.
- Validation:
  - `JSON.parse(...)` passes for `data.json`
- pattern checks on `answerHtml` now report:
  - `split_anchor: 0`
  - `br: 0`
  - `leading_A: 0`
  - `href_space: 0`

## Current Task (FAQ Link Rehydration From Source Summary)
- [x] Fix the reported missing-link entry for `Q-What-are-some-banking-services-that-may-not-require-me-to-go-into-a-bank-branch`.
- [x] Identify answers where `summary` includes URLs but `answerHtml` has no anchors.
- [x] Rehydrate missing links in `answerHtml` using source URLs from `summary` with descriptive labels.
- [x] Validate JSON and spot-check key questions in the browser-targeted set.

## Review / Results (FAQ Link Rehydration From Source Summary)
- Restored the missing link in the reported answer (`FDIC Consumer News September 2022` now anchors to `https://www.fdic.gov/resources/consumers/consumer-news/2022-09.html`).
- Added a deterministic source cleanup rule across `answerHtml` entries:
  - plain `FDIC Consumer News <Month> <Year>` strings are converted to anchors using `https://www.fdic.gov/resources/consumers/consumer-news/YYYY-MM.html`.
- Global checks after update:
  - `data.json` parses successfully.
  - No broken structural regressions reintroduced (`<br>` and split-anchor checks remain clean).

## Current Task (FAQ Answers Proofreading Pass)
- [x] Run a full-lint scan across all FAQ `answerHtml` entries for structural and copy defects.
- [x] Fix malformed links and broken anchors (run-away links, adjacent split anchors, missing hrefs).
- [x] Correct punctuation/grammar defects that are objective and non-substantive.
- [x] Repair incomplete \"To learn more\" endings and unescaped non-breaking-space artifacts.
- [x] Re-run validation checks and targeted residual scan.

## Review / Results (FAQ Answers Proofreading Pass)
- Completed a source-level proofreading pass on all FAQ answers in `sites/fdic-public-information-faq/data.json`.
- Applied non-substantive corrections only:
  - link and anchor integrity fixes
  - punctuation and spacing normalization
  - cleanup of malformed \"To learn more\" follow-ons
  - replacement of escaped `&amp;nbsp;` artifacts
- Validation checks after pass:
  - `data.json` parse check passes
  - no residual split anchors (`</a><a`)
  - no anchors missing `href`
  - no embedded `<br>` line-break formatting artifacts

## Current Task (Global Semantic Normalization Pass)
- [x] Add renderer-level sanitization to strip non-semantic attributes (`class`, `id`) from answer content.
- [x] Flatten generic wrapper `<div>` elements that only provide presentational grouping.
- [x] Remove/unwrap empty anchors left behind by legacy source HTML.

## Review / Results (Global Semantic Normalization Pass)
- Added a global semantic normalization layer in FAQ rendering before text/link structure passes.
- Legacy presentational wrappers/attributes are removed at render time so answers consistently normalize to semantic paragraph/list/link structures.
- Verification:
  - `node --check sites/fdic-public-information-faq/script.js`

## Current Task (Label+Link List Normalization)
- [x] Convert `label paragraph + link paragraph` pairs into semantic bullet lists.
- [x] Run conversion before trailing-link merge so intended list items are preserved.
- [x] Apply globally for repeated FAQ article-link patterns.

## Review / Results (Label+Link List Normalization)
- Added renderer pass that detects repeated `P(label)` followed by `P(link-only)` patterns and converts them into `<ul><li><a>Label</a></li></ul>`.
- Placed this pass before trailing-link merge so list-style recommendations are not collapsed into inline sentence links.
- Verification:
  - `node --check sites/fdic-public-information-faq/script.js`

## Current Task (Trailing Link Block Merge)
- [x] Detect link-only trailing blocks rendered as standalone `<div>/<p>` elements.
- [x] Merge those links into the preceding paragraph text and remove wrapper blocks.
- [x] Apply globally across FAQ answers to eliminate embedded layout wrappers in answer bodies.

## Review / Results (Trailing Link Block Merge)
- Added renderer logic to merge standalone link-only blocks into the immediately preceding paragraph.
- This removes patterns like `<div><p><a ...></a></p></div>` in answer bodies and keeps the link inline with sentence flow.
- Added punctuation/spacing guardrails so merged links end with a complete sentence when needed.
- Verification:
  - `node --check sites/fdic-public-information-faq/script.js`

## Current Task (Parenthetical Link Label Cleanup)
- [x] Normalize list/sentence patterns where plain label wraps a generic link in parentheses.
- [x] Move descriptive entity names into the anchor text for better readability and accessibility.
- [x] Preserve external-link annotation while removing redundant `(...website...)` constructions.

## Review / Results (Parenthetical Link Label Cleanup)
- Added renderer logic to transform patterns like `Label (<a>Generic Website</a>)` into `<a>Label</a> (external)`.
- Scoped the rule to generic link labels (`website`, `webpage`, `resource`) to avoid changing already descriptive anchors.
- Verification:
  - `node --check sites/fdic-public-information-faq/script.js`

## Current Task (Remove Inline Answer Styles)
- [x] Strip all inline `style` attributes from rendered FAQ answer HTML.
- [x] Keep structural cleanup intact so removing styles does not regress readability.
- [x] Validate renderer syntax after sanitization change.

## Review / Results (Remove Inline Answer Styles)
- Added a renderer-level sanitization step that removes all inline `style` attributes from FAQ answer content before other normalization passes.
- This eliminates inline styling on links and other answer elements across the full FAQ corpus.
- Verification:
  - `node --check sites/fdic-public-information-faq/script.js`

## Current Task (FAQ Asterisk + Paragraph Edge Cases)
- [x] Remove trailing asterisk markers that remain after external-link annotation.
- [x] Apply BR-paragraph splitting to root/div content, not only existing `<p>` tags.
- [x] Verify ABLE-account answer pattern and similar answers normalize cleanly.

## Review / Results (FAQ Asterisk + Paragraph Edge Cases)
- Expanded footnote-marker cleanup to remove inline `*` tokens adjacent to punctuation (for example `*.`) after links.
- Updated paragraph splitting so double-break patterns are converted to `<p>` blocks even when source text is not already wrapped in paragraphs.
- Verification:
  - `node --check sites/fdic-public-information-faq/script.js`

## Current Task (External Link Annotation Cleanup)
- [x] Remove standalone external-link footnote lines from FAQ answers.
- [x] Annotate external anchors inline so context stays with each link.
- [x] Keep accessibility context on external links without trailing boilerplate blocks.

## Review / Results (External Link Annotation Cleanup)
- Updated FAQ rendering cleanup to remove standalone external-footnote lines instead of converting them to visible boilerplate.
- Added inline external-link annotation directly on each non-`fdic.gov` anchor (`(external)` suffix + `aria-label` context).
- Kept security attributes for opened links (`target="_blank"` with `rel="noopener noreferrer"`).
- Verification:
  - `node --check sites/fdic-public-information-faq/script.js`

## Current Task (FAQ Paragraph Break Normalization)
- [x] Convert BR-based paragraph breaks to semantic `<p>` elements across answer rendering.
- [x] Keep `<br>` only for intentional inline line breaks after structural normalization.
- [x] Validate that list and callout content still renders correctly.

## Review / Results (FAQ Paragraph Break Normalization)
- Added paragraph split logic that converts `<br><br>` paragraph separators into separate `<p>` elements.
- Kept subsequent paragraph/line-break normalization so stray boundary `<br>` tags are removed.
- Preserved list semantics and existing callout/link normalization passes in the render pipeline.
- Verification:
  - `node --check sites/fdic-public-information-faq/script.js`

## Current Task (Targeted FAQ Cleanup Pass)
- [x] Unwrap legacy presentational span/font wrappers in answer HTML.
- [x] Normalize external-link footnote markers and remove stray asterisk artifacts.
- [x] Repair known split-word/link artifacts and improve descriptive labels for frequent resource URLs.

## Review / Results (Targeted FAQ Cleanup Pass)
- Added wrapper cleanup to strip non-semantic `font` and presentational `span` elements before further normalization.
- Normalized external footnote markers (`*website external to the FDIC`) into clean text and removed stray inline asterisks.
- Added targeted split-word repair for malformed anchor boundaries (for example `h<a>ow...` -> `how...`).
- Expanded curated URL-to-label mapping for frequent FTC/CFPB credit-report resources to produce clearer link labels.
- Verification:
  - `node --check sites/fdic-public-information-faq/script.js`

## Current Task (FAQ Paragraph + Line Break Cleanup)
- [x] Remove extraneous `<br>` tags used as spacing around block elements.
- [x] Wrap loose inline/text answer content in semantic `<p>` tags.
- [x] Preserve intentional list and paragraph structure while normalizing layout.

## Review / Results (FAQ Paragraph + Line Break Cleanup)
- Added paragraph-markup normalization pass after structural cleanup in FAQ answer rendering.
- Loose inline/text runs are now wrapped in semantic `<p>` elements (without disturbing lists/tables).
- Removed boundary/adjacent `<br>` elements that were only being used as vertical spacing around block content.
- Verification:
  - `node --check sites/fdic-public-information-faq/script.js`

## Current Task (FAQ Typography + Accessible Link Text)
- [x] Normalize punctuation/spacing artifacts in rendered FAQ answers (extra spaces before punctuation, double spaces after periods).
- [x] Replace generic link text (for example, "website") with descriptive accessible labels.
- [x] Ensure link targets are clickable even when source content has malformed/empty href values.
- [x] Promote multi-line alert definitions to ordered lists where structure implies sequence.

## Review / Results (FAQ Typography + Accessible Link Text)
- Added typography cleanup for rendered answer text nodes to remove space-before-punctuation errors and collapse double spacing after sentence-ending punctuation.
- Replaced generic anchor text like `website`/`webpage` with descriptive labels using context/domain mapping (for example, `FTC website`, `CFPB website`).
- Added fallback href generation so malformed links with URL text but empty href are made clickable.
- Added structural cleanup that promotes grouped `...Alert is...` lines into ordered lists for clearer scanning.
- Refined link-label resolution to prioritize destination-based labels, preventing wrong labels in mixed-sentence references.
- Added curated descriptive labels for high-visibility FTC/CFPB servicemember fraud resources.
- Verification:
  - `node --check sites/fdic-public-information-faq/script.js`

## Current Task (FAQ Linking + Formatting Consistency)
- [x] Ensure embedded URLs render as clickable links (including bare `www`/domain patterns).
- [x] Apply sparse emphasis to key lead phrases in bullet content when safe.
- [x] Normalize answer formatting artifacts for more consistent structure.

## Review / Results (FAQ Linking + Formatting Consistency)
- Expanded URL parsing/linkification to cover `http(s)`, `www.*`, and common bare domains in answer text.
- Added conservative lead-phrase emphasis for bullet items that start with a short `Label:` pattern.
- Normalized paragraph break spacing (`3+` line breaks collapsed to `2`) for cleaner structure.
- Verification:
  - `node --check sites/fdic-public-information-faq/script.js`

## Current Task (FAQ Answer Formatting Cleanup)
- [x] Replace image-only "learn more" answer links with concise text links.
- [x] Convert raw URL text in answers to inline links with readable labels.
- [x] Remove legacy layout artifacts (empty positioned divs/leftover thumbnails) from answer rendering.

## Review / Results (FAQ Answer Formatting Cleanup)
- Added answer-content normalization in FAQ rendering (`semanticizeAnswerHtml`) so legacy HTML is cleaned up at display time.
- Image-only anchors now render as concise text links; large inline thumbnails are removed.
- Plain-text URLs in answers are linkified and relabeled to readable resource text.
- Removed empty positioned div/p blocks that were source-system artifacts.
- Verification:
  - `node --check sites/fdic-public-information-faq/script.js`

## Current Task (FAQ Help Topic Content + Naming)
- [x] Rename the empty "Help Using Ask FDIC Page" topic to align with Information and Support Center language.
- [x] Add starter FAQs for common navigation and form-usage questions under that topic.
- [x] Keep FAQ content plain-language and user-task oriented.

## Review / Results (FAQ Help Topic Content + Naming)
- Renamed topic to `Using the Information and Support Center`.
- Added five new FAQs covering option selection, edit-before-submit, case tracking, and sensitive-data guidance.
- Verification:
  - JSON parse check via Node on `sites/fdic-public-information-faq/data.json`.

## Current Task (FAQ Topic Branch Collapse)
- [x] Collapse topic tree by default to top-level topics only.
- [x] Reveal sub-topics only for the currently selected parent topic.
- [x] Keep zero-count subtopic filtering and listbox keyboard behavior intact.

## Review / Results (FAQ Topic Branch Collapse)
- Updated FAQ topic rendering to treat the sidebar as collapsed-by-default.
- Subtopics now render only for the currently selected top-level branch.
- Preserved zero-count subtopic suppression (unless currently selected) and existing listbox keyboard navigation.
- Verification:
  - `node --check sites/fdic-public-information-faq/script.js`

## Current Task (FAQ Rail Scroll and Zero-Count Topics)
- [x] Prevent FAQ left-rail clipping by making topic navigation independently scrollable.
- [x] Keep support nav usable while topic list can scroll within viewport height.
- [x] Hide subtopics with zero matching questions in the topic tree.

## Review / Results (FAQ Rail Scroll and Zero-Count Topics)
- Added FAQ-specific side-rail behavior with sticky container + internal scroll on topic section.
- Updated topic-tree rendering to omit zero-count subtopics unless currently selected.
- Verification:
  - Reviewed FAQ HTML/CSS/JS diffs for scoped behavior (`report-side-rail--faq`, topic tree render rules).

## Current Task (Header Spacing Consistency)
- [x] Normalize hero/header spacing between breadcrumb, subtitle, title, and intro text.
- [x] Apply shared spacing rules across all pages via `.ds-region-abovecontent`.
- [x] Eliminate margin-driven layout shifts when navigating between sidebar pages.

## Review / Results (Header Spacing Consistency)
- Added scoped spacing rules for hero elements in `.ds-region-abovecontent`:
  - breadcrumb
  - gold subtitle
  - page `h1`
  - optional intro copy
- Removed reliance on mixed default margins for these elements in header context.
- Verification:
  - Reviewed selector coverage against all page templates using `ds-region-abovecontent`.

## Current Task (Intake Heading Rhythm and Subcopy Placement)
- [x] Move intake helper sentence into the form area above `* Required fields`.
- [x] Apply heading spacing rule in form content (`1.5em` above / `0.5em` below).
- [x] Increase form vertical spacing cadence to reduce visual tightness.

## Review / Results (Intake Heading Rhythm and Subcopy Placement)
- Moved `#intake-subcopy` from hero region into `.report-main`, directly above the required-fields note.
- Applied `1.5em` top and `0.5em` bottom spacing for report-area headings.
- Increased required-note, section, and option-grid spacing for a looser vertical rhythm.
- Verification:
  - Reviewed HTML/CSS diff for updated placement and spacing selectors.

## Current Task (Step Actions Consistency)
- [x] Standardize `fdic-step-actions` button sizing in shared component styles.
- [x] Remove page-specific height override now covered by shared rules.
- [x] Ensure "My cases" action buttons align with form-page button sizing.

## Review / Results (Step Actions Consistency)
- Moved large-control sizing to `.report-actions .step-btn` so component actions render consistently across pages.
- Removed redundant `.review-actions .step-btn` min-height override.
- Verification:
  - Reviewed selector scope to ensure changes affect web-component action rows (`fdic-step-actions`) and not unrelated controls.

## Current Task (FDIC Hero Heading Pattern)
- [x] Apply gold section subtitle (`Information and Support Center`) in page hero regions.
- [x] Set page/task title as `h1` in hero area on task pages.
- [x] Remove duplicate in-content `h1` headings where hero already carries the page title.

## Review / Results (FDIC Hero Heading Pattern)
- Updated intake, review, cases, confirmation, and legacy step page templates to use:
  - hero subtitle: `Information and Support Center`
  - hero `h1`: page/task title
- Kept existing `support-intro` copy under hero titles where applicable.
- Preserved JS bindings by keeping `#intake-heading` and `#intake-subcopy` IDs on the intake page after moving them to the hero region.
- Verification:
  - Reviewed resulting heading structure and duplicates across HTML templates.

## Current Task (Task-First Page Headings)
- [x] Make each page's `h1` the primary task/action heading.
- [x] Remove redundant section-level `h1` headings where a task heading exists in content.
- [x] Preserve existing visual scale by applying task-heading styles to `h1` in report-main areas.

## Review / Results (Task-First Page Headings)
- Updated intake, review, cases, confirmation, and legacy step pages to use task-first `h1` headings.
- Removed redundant top-of-page `Information and Support Center` headings on task pages.
- Updated CSS selector scope so `.report-main h1` receives the same spacing as prior `.report-main h2`.
- Verification:
  - Reviewed heading hierarchy across page templates with grep (`<h1`, `<h2`).

## Current Task (FAQ Relevance Narrowing)
- [x] Add context narrowing by selected intent/topic before lexical FAQ ranking.
- [x] Keep lexical scoring in place as a secondary ranking signal.
- [x] Preserve graceful fallback when context filters are too narrow.

## Review / Results (FAQ Relevance Narrowing)
- Added intent/topic-to-FAQ-topic context mapping in review scoring.
- Candidate pool now narrows to context-matching FAQ topics when enough matches exist, then applies lexical scoring.
- Added context-match score boost so aligned topics are preferred even when fallback to full pool occurs.
- Verification:
  - `node --check sites/fdic-public-information-faq/support-review.js`

## Current Task (Review Page Callout Cleanup)
- [x] Replace duplicate "Before you submit" framing with concise, non-repetitive copy.
- [x] Reuse intake-page inset callout styling for the review FAQ and notice blocks.
- [x] Keep FAQ deflection and legal links intact while simplifying language.

## Review / Results (Review Page Callout Cleanup)
- Updated review FAQ callout to use the same inset left-rule treatment as the intake page.
- Rewrote FAQ and legal notice copy to be shorter and less repetitive.
- Preserved FAQ suggestion list IDs and all legal-policy links.
- Verification:
  - Reviewed rendered-structure diff for class/ID continuity.

## Current Task (DIR Intent Split)
- [x] Add a dedicated fourth top-level intent for DIR-directed requests.
- [x] Restore general wording for `Ask a question or get guidance`.
- [x] Move DIR-specific topics under the new intent while keeping routing and review hints coherent.

## Review / Results (DIR Intent Split)
- Added new `dir` workflow and intent option in intake flow.
- Restored general ask intent detail copy and removed DIR-heavy phrasing from that option.
- Added DIR-specific topic options under the new workflow, all routed to `fdicdirform`.
- Updated review-page fallback FAQ hints for new `dir` intent and DIR topic keys.
- Verification:
  - `node --check sites/fdic-public-information-faq/support-intake.js`
  - `node --check sites/fdic-public-information-faq/support-review.js`

## Current Task (CTA Typography Alignment)
- [x] Match `Review your submission` button height to footer button sizing.
- [x] Increase CTA button font weight while keeping existing blue background.
- [x] Normalize completion-helper typography so it does not appear undersized.

## Review / Results (CTA Typography Alignment)
- Updated `.step-btn.next` to use large control height and heavier button typography consistent with footer buttons.
- Kept primary CTA blue fill (`var(--fdic-blue-800)`) unchanged.
- Updated `.report-submit-helper` to body-size text for stronger visual consistency.
- Verification:
  - Reviewed CSS diff and selector scope.

## Current Task (Form Rhythm Pass 2)
- [x] Rebalance intake spacing between headings, legends, and option groups.
- [x] Increase radio-card internal spacing and row gaps for readability.
- [x] Improve separation between helper text and CTA actions.

## Review / Results (Form Rhythm Pass 2)
- Increased spacing cadence across form sections and fieldset legends.
- Increased option-grid row/column gap and option-card padding for less visual crowding.
- Increased helper-to-actions separation so the CTA row does not feel cramped.
- Verification:
  - Reviewed exact CSS diff for selector scope and consistency.

## Current Task (DIR Discoverability Copy)
- [x] Make DIR discoverable in the top-level "Ask a question or get guidance" intent description.
- [x] Rename the ask-flow data topic to explicitly reference FDIC Bank Data and Research (DIR).
- [x] Keep phrasing concise while adding key examples (QBP, Call Reports, industry analysis).

## Review / Results (DIR Discoverability Copy)
- Updated intent option detail copy so users see DIR terms at first decision point.
- Updated ask-flow topic copy to a clearly named DIR option with concise examples.
- Verification:
  - `node --check sites/fdic-public-information-faq/support-intake.js`

## Current Task (Progressive Guidance Copy)
- [x] Replace section-count helper copy with progressive-disclosure helper guidance.
- [x] Show `Make a selection to continue.` when the current required step is radio-based.
- [x] Remove redundant static submit-note copy near the CTA.

## Review / Results (Progressive Guidance Copy)
- Updated helper messaging logic in intake step-state handling to be current-step aware.
- Radio steps now use: `Make a selection to continue.`
- Text entry steps now use concise guidance (`Enter details to continue.` / `Complete this section to continue.`).
- Removed static line: `You can review and edit your answers before final submission.`
- Verification:
  - `node --check sites/fdic-public-information-faq/support-intake.js`

## Current Task (Form Rhythm Tuning)
- [x] Audit intake-page vertical spacing tokens after intro content.
- [x] Adjust intake CSS spacing to keep consistent rhythm from intro through form sections.
- [x] Verify updated spacing in desktop and mobile breakpoints.

## Review / Results (Form Rhythm Tuning)
- Aligned intake-page rhythm with the intro section by increasing:
  - top spacing into the intake layout (`.report-layout` `padding-top`)
  - heading-to-body separation in the intake panel (`.report-main h2`)
  - spacing before first form block (`.report-required-note`)
  - subcopy breathing room and readability (`.report-subcopy` margin + line-height)
- Verification:
  - Checked for CSS syntax regressions by reviewing exact diff.
  - Confirmed these selectors are not overridden in responsive media queries, so the rhythm update applies consistently on desktop and mobile breakpoints.

## Current Task
- [x] Define Phase 1 implementation scope from gap-closure plan.
- [x] Add Phase 1 baseline fields to intake UI (identity, contact verification, mailing block, desired resolution).
- [x] Update intake state, validation, and progressive gating for new required fields.
- [x] Update review and confirmation pages/scripts to display new fields.
- [x] Keep case-history storage non-sensitive while preserving submission summary.
- [x] Run JS syntax checks and verify no broken references.

## Review / Results
- Replaced prior state/contact-method sections with Phase 1 baseline fields:
  - First/last name
  - Email + confirm email
  - Mailing street/city/state/postal/country
  - Desired resolution free-text
  - Business phone (required for failed-bank intent)
- Updated validation/progress gating to 7 required sections.
- Updated review and confirmation summaries to include new baseline fields.
- Preserved non-sensitive case-history storage in `localStorage` summary records.
- Verification:
  - `node --check` passed for all support/FAQ scripts.
  - Reference grep confirmed old removed field IDs are no longer referenced.

## Current Task (FAQ Answer Consistency Sweep)
- [x] Audit remaining FAQ answer patterns for malformed paragraph/list/link structure.
- [x] Expand renderer normalization to repair repeated legacy patterns without per-answer one-offs.
- [x] Patch any remaining outlier answers directly in `data.json` when source text is malformed.
- [x] Re-validate FAQ script syntax and `data.json` parse integrity.

## Review / Results (FAQ Answer Consistency Sweep)
- Added a new semantic pass (`promoteResourceLabelLinkRuns`) to convert repeated label+link line runs into proper unordered lists.
- Hardened parenthetical-link normalization so URL-in-parentheses patterns are normalized to descriptive agency-name links.
- Ran a second list-promotion pass after trailing-link merge to catch list candidates created during merge.
- Directly repaired two high-noise outlier answers in `data.json`:
  - `Q-Are-there-other-federal-banking-regulatory-agencies-besides-the-FDIC`
  - `Q-FDIC-insured-banks-have-identified-an-increase-in-unemployment-insurance-fraud...`
- Verification:
  - `node --check sites/fdic-public-information-faq/script.js`
  - `node -e "JSON.parse(require('fs').readFileSync('sites/fdic-public-information-faq/data.json','utf8')); console.log('data.json ok')"`

## Current Task (Plain URL Link-Text Cleanup)
- [x] Identify remaining answer bodies with plain parenthetical URLs or raw URL text.
- [x] Replace obvious high-value occurrences with clickable links and descriptive link text.
- [x] Extend URL label mapping for recurring BankFind/SOD help destinations.
- [x] Re-validate script syntax and `data.json` integrity.

## Review / Results (Plain URL Link-Text Cleanup)
- Added explicit label mapping in renderer for:
  - `banks.data.fdic.gov/bankfind-suite/help` -> `BankFind Suite Help`
  - `www7.fdic.gov/sod/dynaDownload.asp` -> `Summary of Deposits (SOD) Download`
- Updated in-source FAQ answers with title-style links for recurring plain URL patterns, including:
  - EDIE help article link
  - Homebuyer resource and game links
  - Failed-bank acquisitions resource
  - FDIC-insured account article link
  - `You Can Bank On It` game link
- Verification:
  - `node --check sites/fdic-public-information-faq/script.js`
  - `node -e "JSON.parse(require('fs').readFileSync('sites/fdic-public-information-faq/data.json','utf8')); console.log('data.json ok')"`

## Current Task (Source-First URL Normalization)
- [x] Normalize remaining plain URL patterns directly in `data.json` answer content.
- [x] Replace raw URL anchor text with descriptive labels in source content.
- [x] Keep render-time transformations as fallback only.
- [x] Validate JSON/script integrity after bulk source updates.

## Review / Results (Source-First URL Normalization)
- Applied a bulk source cleanup pass across `answerHtml` entries to convert:
  - parenthetical plain URLs into explicit anchors
  - raw URL anchor text into descriptive link labels
  - remaining plain URL text nodes into clickable anchors
- Updated 52 FAQ answer entries in `data.json` during this pass.
- Verification:
  - `node -e "JSON.parse(require('fs').readFileSync('sites/fdic-public-information-faq/data.json','utf8')); console.log('data.json ok')"`
  - `node --check sites/fdic-public-information-faq/script.js`

## Current Task (Full JSON Hygiene Pass)
- [x] Audit `data.json` for malformed or low-quality answer HTML patterns at corpus level.
- [x] Apply source-level normalization for recurring structural artifacts (empty links, footnote remnants, presentational wrappers, embedded media artifacts).
- [x] Preserve semantic meaning while simplifying answer markup.
- [x] Re-run integrity checks and summarize residual exceptions, if any.

## Review / Results (Full JSON Hygiene Pass)
- Ran a corpus-wide cleanup directly in `data.json` `answerHtml` fields (source-first) to remove legacy presentational and malformed markup:
  - removed embedded media tags (`img`, `iframe`) and stale wrapper artifacts
  - removed inline presentational attributes (`style`, `class`, `id`) and wrapper tags (`font`, `span`, generic `div`)
  - normalized malformed link structures (empty anchors, split anchors, orphan `</a>` artifacts)
  - normalized external-footnote remnants and duplicate `A: A:` prefix artifacts
  - collapsed excessive `<br>` runs and removed trailing break-only endings
- Ran follow-up repairs for link integrity after the bulk pass:
  - rebuilt anchor closure consistency
  - filled all previously empty `<a ...></a>` nodes with meaningful link text
- Final validation checks:
  - `node -e "JSON.parse(require('fs').readFileSync('sites/fdic-public-information-faq/data.json','utf8')); console.log('data.json ok')"`
  - corpus audit reports zero remaining `answerHtml` instances of:
    - `<img>`, `<iframe>`, inline `style`, `<span>`, `<div>`
    - empty `href` / empty anchors
    - raw unlinked `http(s)` text
    - anchor open/close imbalance

## Current Task (EDIE Link Boundary Repairs)
- [x] Identify EDIE FAQ answers where entire prose blocks were wrapped by a single anchor.
- [x] Rewrite affected `answerHtml` entries so only meaningful phrases are linked.
- [x] Validate JSON parse and spot-check updated EDIE entries.

## Review / Results (EDIE Link Boundary Repairs)
- Repaired 8 EDIE-related answers with malformed over-wrapped links.
- Updated copy so:
  - `EDIE` is linked as a short in-sentence term
  - “To learn more” links point to the intended resource with descriptive text
- Verification:
  - `node -e "JSON.parse(require('fs').readFileSync('sites/fdic-public-information-faq/data.json','utf8')); console.log('data.json ok')"`

## Current Task (Source-Only FAQ Answer Reformat)
- [x] Confirm `script.js` render path has no runtime answer transforms in use.
- [x] Reformat all FAQ `answerHtml` entries in `data.json` to consistent semantic HTML (`<p>`, `<ul>/<ol>`, clean anchors) without changing substantive language.
- [x] Remove structural artifacts in source content (`<br>` paragraph hacks, `&nbsp;`/`&amp;nbsp;`, split/runaway anchors, empty wrappers, malformed link labels).
- [x] Run thorough corpus checks and spot-check known-problem FAQ anchors for structural integrity.
- [x] Record results and any residual manual-review items.

## Review / Results (Source-Only FAQ Answer Reformat)
- Removed all residual render-time FAQ answer transform code from `script.js`; FAQ answers now render directly from `data.json` source markup.
- Performed a source-only normalization pass plus targeted manual rewrites for known malformed outliers in `data.json`:
  - converted image/iframe-based answer artifacts into text-link content
  - repaired missing/empty anchors and malformed “To learn more” stubs
  - normalized problematic list/link structures in high-noise answers (regulatory agencies, servicemember alerts, unemployment fraud, EDIE, prepaid card, scam guidance)
  - removed remaining external footnote boilerplate and plain-text URL remnants
- Validation:
  - `JSON.parse(...)` passes for `sites/fdic-public-information-faq/data.json`
  - `node --check sites/fdic-public-information-faq/script.js`
  - corpus checks now report zero instances of:
    - `<br>`, `&nbsp;`, `<img>`, `<iframe>`, `<div>`, `<span>`, `<font>`
    - empty/missing `href` anchors
    - split-anchor adjacency
    - bare “To learn more, visit:” stubs
    - external-footnote leftovers
    - plain unlinked URL text in answer content

## Current Task (Hyperlink Spacing + Full Link Verification)
- [x] Detect and fix missing spaces immediately before `<a>` tags in FAQ `answerHtml`.
- [x] Validate every answer hyperlink for markup integrity and URL format correctness.
- [x] Run live URL reachability checks for all unique answer links and patch obvious broken URL typos.
- [x] Re-run corpus validation and log residual manual review items.

## Review / Results (Hyperlink Spacing + Full Link Verification)
- Fixed all detected missing-space-before-link issues in `answerHtml`.
- Repaired malformed hyperlink outliers:
  - nested anchor wrappers
  - invalid placeholder URLs (`https://www`, `https://www.SSA.gov.*`)
  - truncated PDF URL suffix (`.pd` -> `.pdf`)
  - truncated FDIC path (`/consumers/consumer`)
- Verification summary:
  - total links scanned: `298` (`154` unique)
  - structural validation: `0` missing spaces, `0` nested anchors, `0` empty/missing `href`, `0` target/rel mismatches
  - local relative-link check: `0` issues
  - live external checks: `30` URLs return `404/403` or network `ERR` (legacy/retired resources and a few hosts not reachable from runtime)

## Current Task (Website Reference Hyperlinking)
- [x] Add explicit hyperlinks where answers referenced named websites/webpages but provided plain text.
- [x] Patch the reported credit-report-dispute answer and similar FTC/CFPB website reference patterns.
- [x] Fix remaining named-site references (FDIC BankFind, ask.fdic.gov, IRS, EDD, CFPB) with anchored links.
- [x] Re-scan for unresolved named website/webpage references without anchors.

## Review / Results (Website Reference Hyperlinking)
- Updated website/webpage references to linked anchors in 36 FAQ answers, including the reported dispute-information question.
- Added/normalized links for:
  - FTC and CFPB website/webpage references
  - FDIC BankFind / FDIC website / ask.fdic.gov mentions
  - IRS webpage references for QTP content
  - EDD debit card website reference
- Validation:
  - `data.json` parse check passes
  - zero remaining high-confidence named-site website/webpage references without anchors

## Current Task (Replace FDIC Resource Link Text)
- [x] Find all FAQ answer links labeled `FDIC resource`.
- [x] Replace each with the title of its target page.
- [x] Ensure sentence-ending links end with a period when they close a sentence.
- [x] Re-validate JSON and scan for replacement/punctuation regressions.

## Review / Results (Replace FDIC Resource Link Text)
- Replaced all `FDIC resource` link labels in `data.json` (`42` occurrences across `23` unique URLs) with target-page titles.
- Applied sentence-end punctuation normalization where a link closes a paragraph/list-item sentence.
- Validation:
  - `data.json` parse check passes
  - `0` remaining `FDIC resource` link labels
  - no obvious double/invalid punctuation patterns after link replacement

## Current Task (Split-Bullet Sweep)
- [x] Detect high-confidence split-bullet pairs (`<li>label</li><li><a...`) across all FAQ answers.
- [x] Apply safe list-item merges in-source for those pairs only.
- [x] Remove any empty list-item artifacts introduced or exposed by merges.
- [x] Run sanity checks on changed answers (JSON parse + residual split-pattern scan + output spot checks).

## Review / Results (Split-Bullet Sweep)
- Applied targeted split-bullet merges to `11` FAQ answers in `data.json`.
- Removed one empty bullet artifact found during sanity review.
- Validation:
  - `data.json` parse check passes
  - `0` remaining split-bullet pairs matching the target pattern
  - `0` remaining empty `<li>` artifacts

## Current Task (Footer Visual Alignment)
- [x] Update `FDICSiteFooter` markup to better match FDIC.gov footer structure.
- [x] Revise footer styles for column layout, typography, CTA controls, social icons, and responsive behavior.
- [x] Validate component syntax and class/style wiring.

## Review / Results (Footer Visual Alignment)
- Updated footer component to mirror the FDIC.gov three-column pattern:
  - `Contact the FDIC` CTA column
  - `Stay informed` email subscribe + social icons column
  - `How can we help you?` stacked selection controls + `Get Started` CTA column
- Refined footer CSS to match screenshot style cues:
  - stronger heading scale and vertical rhythm
  - gold pill-like action controls
  - center-column divider lines
  - stacked faux-select controls with gold caret blocks
  - responsive single-column collapse under tablet width
- Validation:
  - `node --check sites/fdic-public-information-faq/components.js`
  - class reference checks for new footer selectors in component and stylesheet

## Current Task (FAQ Parent Distinct Counts)
- [x] Update topic count logic so parent topics display distinct totals across all descendant questions.
- [x] Align selected-topic filtering to include descendant topics for parent selections.
- [x] Sanity-check topic totals against FAQ data and verify JS syntax.

## Review / Results (FAQ Parent Distinct Counts)
- Implemented branch-aware topic counting in `script.js` using distinct article-id sets, so parent topic counts now represent unique questions across the full branch.
- Updated topic filtering so selecting a parent topic includes questions tagged to descendant subtopics.
- Verification:
  - `node --check sites/fdic-public-information-faq/script.js`
  - data sanity script run against `data.json` for parent/subtopic totals.

## Current Task (FAQ Expanded Q/A Unified Highlight)
- [x] Update FAQ expanded-state styling so question and answer render as one visual unit.
- [x] Extend the left stripe/bar across both summary and answer when open.
- [x] Remove the divider between question and answer in expanded state and tune paragraph spacing for natural flow.
- [x] Verify CSS syntax and confirm selector scope is FAQ-only.

## Review / Results (FAQ Expanded Q/A Unified Highlight)
- Updated FAQ item open-state styling in `styles.css` so highlight treatment is applied on `details[open]`, not just `summary`.
- Extended the left stripe across the full expanded block by moving the open-state accent border to `.faq-item details[open]`.
- Removed the answer top divider and reduced answer top padding to create tighter, natural question-to-answer paragraph flow.
- Verification:
  - reviewed `git diff -- sites/fdic-public-information-faq/styles.css`
  - confirmed selector scope is FAQ-only (`.faq-item details`, `.faq-item details[open]`, `.answer`)

## Current Task (FAQ Spacing and Motion Polish)
- [x] Tighten spacing between FAQ question and answer in expanded state.
- [x] Balance bottom spacing so expanded item padding feels symmetrical.
- [x] Add subtle expanded/collapsed motion treatment with reduced-motion fallback.
- [x] Verify scoped selector impact in FAQ styles only.

## Review / Results (FAQ Spacing and Motion Polish)
- Tightened question/answer proximity by reducing summary bottom padding and answer top padding in expanded items.
- Rebalanced expanded block vertical rhythm by reducing answer bottom padding to align with top spacing.
- Added subtle answer reveal motion (`opacity` + slight `translateY`) in expanded state.
- Added reduced-motion fallback to disable FAQ motion and keep content fully visible.
- Verification:
  - reviewed `git diff -- sites/fdic-public-information-faq/styles.css`
  - confirmed changes are scoped to FAQ selectors (`.faq-item summary`, `.answer`, `.faq-item details[open] > .answer`, FAQ reduced-motion block)

## Current Task (FAQ Focus Ring Container Scope)
- [x] Move FAQ keyboard focus ring from summary-only to the full FAQ details container.
- [x] Keep existing hover/open visual styling intact.
- [x] Verify selector scope remains limited to FAQ question blocks.

## Review / Results (FAQ Focus Ring Container Scope)
- Updated FAQ focus styles so `summary:focus-visible` no longer draws its own inset ring.
- Added container-level ring on `.faq-item details:has(> summary:focus-visible)` so focus wraps both question and answer area.
- Verification:
  - reviewed CSS diff for FAQ selectors only in `styles.css`

## Current Task (FAQ List Web Component Refactor)
- [x] Create a reusable `fdic-faq-list` web component for rendering and interaction of FAQ question/answer items.
- [x] Move FAQ list behaviors (copy link, keyboard navigation, active summary management, hash deep-link expansion) into the component.
- [x] Update `faq.html` to use the new custom element for the FAQ list container.
- [x] Refactor `script.js` to pass filtered articles into the component and remove duplicate list-behavior logic.
- [x] Run JS syntax checks for `components.js` and `script.js`.

## Review / Results (FAQ List Web Component Refactor)
- Added new web component `FDICFAQList` (`fdic-faq-list`) in `components.js` that owns FAQ list rendering and item interactions.
- Moved FAQ item behavior into the component:
  - copy-link button behavior with clipboard fallback
  - roving-tabindex keyboard navigation (`ArrowUp/Down`, `Home`, `End`, `Enter`/`Space`)
  - active summary tracking
  - hash deep-link expansion and scroll-to-target
- Replaced FAQ list container in `faq.html` with `<fdic-faq-list id="faq-list" class="faq-list"></fdic-faq-list>`.
- Simplified `script.js` FAQ-list responsibilities to data filtering + `renderArticles(...)` calls into the component.
- Verification:
  - `node --check sites/fdic-public-information-faq/components.js`
  - `node --check sites/fdic-public-information-faq/script.js`

## Current Task (FDICnet Main Menu Remaining Open Issues #18, #24-#34)
- [x] Create a dedicated branch for remaining open issues (#18, #24-#34).
- [x] Post implementation-plan comments on each open issue before code changes.
- [x] Implement and verify issue #24; post implementation/verification comment.
- [x] Implement and verify issue #25; post implementation/verification comment.
- [x] Implement and verify issue #26; post implementation/verification comment.
- [x] Implement and verify issue #27; post implementation/verification comment.
- [x] Implement and verify issue #28; post implementation/verification comment.
- [x] Implement and verify issue #29; post implementation/verification comment.
- [x] Implement and verify issue #30; post implementation/verification comment.
- [x] Implement and verify issue #31; post implementation/verification comment.
- [x] Implement and verify issue #32; post implementation/verification comment.
- [x] Implement and verify issue #33; post implementation/verification comment.
- [x] Implement and verify issue #34; post implementation/verification comment.
- [x] Implement and verify issue #18; post implementation/verification comment.
- [x] Run full regression checks (syntax + keyboard navigation + open/close + responsive + overflow).

## Review / Results (FDICnet Main Menu Remaining Open Issues #18, #24-#34)
- Branch created: `fix/fdicnet-main-menu-remaining-issues-18-24-34`.
- Posted implementation-plan comments on all in-scope issues:
  - `#18`: `issuecomment-4020888704`
  - `#24`: `issuecomment-4020888737`
  - `#25`: `issuecomment-4020888760`
  - `#26`: `issuecomment-4020888789`
  - `#27`: `issuecomment-4020888815`
  - `#28`: `issuecomment-4020888843`
  - `#29`: `issuecomment-4020888874`
  - `#30`: `issuecomment-4020888905`
  - `#31`: `issuecomment-4020888954`
  - `#32`: `issuecomment-4020889012`
  - `#33`: `issuecomment-4020889061`
  - `#34`: `issuecomment-4020889114`
- Posted per-issue implementation + verification updates:
  - `#24`: `issuecomment-4020892854`
  - `#25`: `issuecomment-4020895025`
  - `#26`: `issuecomment-4020896761`
  - `#27`: `issuecomment-4020897819`
  - `#29`: `issuecomment-4020898645`
  - `#34`: `issuecomment-4020900350`
  - `#30`: `issuecomment-4020908258`
  - `#31`: `issuecomment-4020912158`
  - `#32`: `issuecomment-4020914033`
  - `#33`: `issuecomment-4020916397`
  - `#28`: `issuecomment-4020932328`
  - `#18`: `issuecomment-4020932999`
- Updated files:
  - `sites/fdicnet-main-menu/index.html`
  - `sites/fdicnet-main-menu/script.js`
  - `sites/fdicnet-main-menu/styles.css`
  - `sites/fdicnet-main-menu/content.yaml`
  - `tasks/todo.md`
- Verification:
  - `node --check sites/fdicnet-main-menu/script.js`
  - Playwright behavior checks for:
    - issue-specific acceptance paths (#18, #24-#34)
    - keyboard open/focus return on Escape
    - responsive overflow across `375, 768, 769, 900, 1024, 1280, 1440`
    - mobile accordion open-state, single-open behavior, touch-target sizing, and Escape handling

## Current Task (A11y Issues #57, #58, #60)
- [x] Create branch `fix/a11y-57-58-60-mega-menu` from `main`.
- [x] Fix issue #57 by removing `aria-hidden` on mega-menu open while preserving `aria-hidden="true"` on close/init/fallback.
- [x] Fix issue #58 by exposing intended labels via valid semantics (`role="group"` on header controls and `nav` landmark for mobile menu).
- [x] Fix issue #60 by closing mega menu when keyboard focus leaves the menu system (top nav + mega menu) using `requestAnimationFrame` focus checks.
- [x] Run syntax/source checks and document any environment-specific verification gaps.
- [x] Open PR with implementation plan and validation matrix; include `Closes #57`, `Closes #58`, `Closes #60`.

## Review / Results (A11y Issues #57, #58, #60)
- Updated `sites/fdicnet-main-menu/script.js`:
  - `openMenu()` now uses `megaMenu.removeAttribute("aria-hidden")`.
  - Added `scheduleMenuSystemFocusExitCheck()` and wired `focusout` listeners on `#megaMenu` and `#fdicNavList`.
  - Menu now closes when focus leaves both mega menu and top-nav controls; column-to-column and nav<->menu transitions stay open.
- Updated `sites/fdicnet-main-menu/index.html`:
  - `.fdic-controls` now has `role="group"` with existing `aria-label="Header controls"`.
  - `#mobileMenu` changed from `<div>` to `<nav aria-label="Mobile menu">`.
- Verification:
  - `node --check sites/fdicnet-main-menu/script.js`
  - `rg -n "aria-hidden\", \"false\"|removeAttribute\(\"aria-hidden\"\)|setAttribute\(\"aria-hidden\", \"true\"\)|scheduleMenuSystemFocusExitCheck|addEventListener\(\"focusout\"" sites/fdicnet-main-menu/script.js -S`
  - `rg -n "fdic-controls|mobileMenu" sites/fdicnet-main-menu/index.html -S`
- Environment gap:
  - Attempted Playwright MCP browser validation against local static server, but MCP browser could not connect to `127.0.0.1` in this environment (`ERR_CONNECTION_REFUSED`), so VoiceOver/NVDA and cross-browser keyboard checks are documented for follow-up in PR.
- PR:
  - `https://github.com/jflamb/pens-github-test/pull/64`

## Current Task (Default Delivery Process Documentation)
- [x] Create a reusable default workflow doc for bug fixes and feature development.
- [x] Cover branch creation, implementation, verification, PR standards, and post-merge cleanup.
- [x] Link the workflow doc from `AGENTS.md` so it is discoverable at session start.

## Review / Results (Default Delivery Process Documentation)
- Added `docs/delivery-workflow.md` with a standard 8-step process:
  - intake/scope
  - branching
  - implementation standards
  - required verification
  - task-log updates
  - PR standards
  - post-merge cleanup
  - corrections/lessons loop
- Updated `AGENTS.md` Key Docs to include:
  - `docs/delivery-workflow.md`
- This establishes a standing default workflow so future requests do not need to restate these process expectations.

## Current Task (FDICnet Label/Chevron Spacing)
- [x] Increase minimum spacing between row labels and chevrons in mega-menu columns.

## Review / Results (FDICnet Label/Chevron Spacing)
- Updated `sites/fdicnet-main-menu/styles.css`:
  - `.l1-caret` now has `margin-left: 12px`.
  - `.l2-caret` now has `margin-left: 12px` (replacing `auto`).
- Result: wrapped or long labels keep a clearer visual gap before the chevron.
