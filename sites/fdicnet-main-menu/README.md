# FDICnet Main Menu

This directory contains a working front-end implementation of the FDICnet main menu, plus a Drupal-oriented Single Directory Component wrapper.

The codebase is intentionally split into two layers:

- The static prototype runtime in `sites/fdicnet-main-menu/`
- The Drupal wrapper in `sites/fdicnet-main-menu/components/fdicnet-main-menu/`

If you are ramping up on this implementation, start with the static prototype. The Drupal wrapper reuses that runtime rather than redefining the behavior.

## What This Component Does

The menu system supports:

- A desktop top navigation bar with an attached three-column mega-menu
- A mobile drawer with drill-down navigation instead of the desktop mega-menu
- Shared desktop/mobile site search with menu-aware suggestions
- Keyboard, hover, click, and focus interactions across all navigation levels
- YAML-driven content so the menu IA can be changed without editing runtime logic

At a high level:

- `content.yaml` defines the information architecture
- `components.js` defines the custom elements that own the menu DOM
- `script.js` manages state transitions, rendering, search, and top-level orchestration
- `events.js` wires user interaction to state changes
- `mobile-drawer.js` renders the mobile drill-down view
- `init.js` bootstraps the system and loads `content.yaml`
- `styles.css` defines the visual system and responsive layout

## Directory Map

- [index.html](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/index.html)
  Static prototype entry point and DOM contract reference
- [content.yaml](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/content.yaml)
  Content model for the header, panels, columns, and links
- [styles.css](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/styles.css)
  All layout, color, animation, and responsive styling
- [components.js](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/components.js)
  `fdic-top-nav` and `fdic-mega-menu` web components
- [state.js](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/state.js)
  Shared menu state object and selectors
- [mobile-drawer.js](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/mobile-drawer.js)
  Mobile drill-down rendering logic
- [events.js](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/events.js)
  Event binding and interaction routing
- [script.js](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/script.js)
  Main runtime, rendering, search, and responsive behavior
- [init.js](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/init.js)
  Bootstrap and content loading
- [search.html](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/search.html)
  Destination page for “search all FDICnet”
- [components/fdicnet-main-menu](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/components/fdicnet-main-menu)
  Drupal SDC wrapper

## Runtime Architecture

### 1. Data-first menu model

The component is driven by `content.yaml`. The runtime does not hardcode panel labels or menu links.

The top-level structure is:

- `header.searchPlaceholder`
- `header.nav[]`
- `menu.defaultPanel`
- `menu.openByDefault`
- `menu.panels.{panelKey}`

Each `header.nav` item can be:

- a menu trigger (`kind: "menu"`)
- a normal link

Each panel contains `l1` rows. Each L1 item can contain:

- `label`
- `overviewLabel`
- `overviewHref`
- `description`
- `l2[]`

Each L2 item can contain:

- `label`
- `href`
- `description`
- `l3[]`

Each L3 item can contain:

- `label`
- `href`
- `description`

### 2. DOM contract

The runtime expects a stable set of IDs and component hosts. `init.js` explicitly validates required elements before continuing.

The critical IDs/hosts are:

- `fdicHeader`
- `fdicTopNav`
- `fdicMegaMenu`
- `fdicNavList`
- `megaMenu`
- `l1List`
- `l2List`
- `l3List`
- `l3Description`
- desktop search IDs
- mobile search IDs
- `mobileNavBackdrop`

If you rename or remove one of these, initialization will stop early.

### 3. Custom elements

[components.js](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/components.js) defines two custom elements:

- `fdic-top-nav`
- `fdic-mega-menu`

They are not “stateful application components” in the React sense. They are DOM hosts that:

- render structural HTML if it is missing
- expose convenience getters for important child nodes
- emit custom events when user interaction occurs
- let `script.js` remain the single source of truth for state

This split matters. Do not move state ownership into the web components unless you intend to rewrite the architecture.

### 4. Single shared state object

[state.js](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/state.js) exports `menuState` plus selector helpers. The major state fields are:

- `activePanelKey`
- `menuOpen`
- `selectedL1Index`
- `selectedL2Index`
- `previewL2Index`
- `previewingOverview`
- `topNavFocusIndex`
- `mobileNavOpen`
- `mobileSearchOpen`
- `mobileDrillPath`

Use the selector helpers instead of re-deriving panel/L1/L2 logic in multiple places.

### 5. Main runtime responsibilities

[script.js](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/script.js) is the main coordinator. It is responsible for:

- caching DOM references
- deriving the current panel view model
- applying top-nav state
- rendering the mega-menu
- syncing the mobile drawer
- opening/closing desktop and mobile search
- building and rendering search suggestions
- handling launcher-to-menu activation
- managing responsive transitions between desktop and mobile modes

Think of `script.js` as the controller layer.

### 6. Event layer

[events.js](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/events.js) binds pointer and keyboard behavior to runtime methods.

This includes:

- top-nav hover intent
- top-nav roving tabindex behavior
- desktop menu focus/hover transitions
- mobile drawer toggle behavior
- pointer-down close behavior
- `Escape` handling
- mobile viewport media-query change handling

If a behavior feels “input-specific,” it probably belongs in `events.js`, not `script.js`.

## Design and Interaction Model

### Desktop

Desktop uses a horizontal top-nav plus attached mega-menu:

- top-level nav item selected state is reflected in the tab surface
- the menu panel opens directly under the nav
- the mega-menu uses three equal-width columns
- L1 and L2 columns use animated blue rails to indicate the active item
- column 3 shows either descriptive text or L3 links depending on the current L2 state

Important desktop rules:

- Hovering top-nav buttons previews/open panels
- Arrow keys move across top-nav items
- `ArrowDown` from a top-nav item opens the menu and moves focus into it
- L1 and L2 hover/focus update preview state
- the menu remains open while pointer/focus stays within the active system

### Mobile

Mobile does not use the desktop mega-menu interaction model.

Instead:

- the top nav becomes a drawer trigger
- menu content is rendered as a drill-down hierarchy
- the phone-width search control is an inline masthead expansion, not a modal sheet

Current mobile search behavior:

- tapping the search icon toggles an in-flow search row inside the dark-blue masthead
- the masthead grows vertically to fit the field
- page content is pushed down by normal document flow
- search suggestions render below the field within the same masthead expansion

### Search behavior

Search is menu-aware. It is not a generic full-site search box.

The runtime builds a launcher index from `content.yaml` and supports:

- panel matches
- section matches
- link/resource matches
- alias matching from parenthetical text and derived acronyms
- keyboard suggestion navigation
- a fallback “Search all FDICnet” action that links to `search.html?q=...`

The search model is shared between desktop and mobile:

- same index
- same debounce
- same match rules
- different rendering surfaces

## Rendering Rules Worth Knowing

### Overview rows

The first L1 item often represents an overview. The runtime uses that convention in multiple places.

Examples:

- desktop rendering may show overview entries at the bottom of a column
- mobile drawer rendering inserts overview actions intentionally, not accidentally
- search index generation distinguishes panel overview, section overview, and normal links

If you change the overview-row convention, inspect:

- `buildLauncherIndex()`
- `getL2Overview()`
- desktop L1/L2 rendering
- mobile drill rendering

### Column 3 rules

Column 3 does not always show the same thing:

- if the current L2 has L3 children, column 3 shows L3 links
- if the current L2 is a leaf, column 3 shows that L2 description
- if there is no active L2 preview, column 3 can fall back to L1 context

That behavior is deliberate. It is one of the easier places for regressions when adjusting preview logic.

### Rail animation

The blue left-edge rail is not a per-row stripe for desktop L1/L2. It is a column-level pseudo-element whose position/height are updated from JavaScript.

That means:

- row markup should not reintroduce its own fixed left stripe
- the active rail depends on measured DOM geometry
- any row-height or padding change can affect rail alignment

If you change row spacing, verify the rail again.

## Accessibility Model

This implementation treats accessibility as a core requirement, not a polish pass.

Current patterns include:

- live region announcements for menu context
- roving tabindex on desktop top-nav items
- explicit `aria-expanded`, `aria-controls`, and `aria-haspopup`
- combobox/listbox/option roles for search
- hidden/inert handling for mobile background content
- visible focus states in both desktop and mobile views
- `Escape` support to close search/menu affordances

Common regression zones:

- making closed content still focusable
- losing focus after a render cycle
- restoring focus in a way that reopens the thing that was just closed
- breaking the desktop/mobile distinction in the search interaction model

## Responsive Breakpoints

The runtime and CSS share these breakpoints:

- desktop/mobile nav switch: `768px`
- phone search collapse: `640px`

These are defined in [script.js](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/script.js) and mirrored in [styles.css](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/styles.css).

If you change them, change both places together.

## File-by-File Contributor Guide

### `content.yaml`

Change this when:

- IA labels change
- destinations change
- descriptions change
- panels/L1/L2/L3 structure changes

Do not change runtime code just to add a new link if the current schema already supports it.

### `components.js`

Change this when:

- the custom-element DOM shell must change
- a component needs a new getter
- a component should emit a new interaction event

Be cautious about adding business logic here. The components should remain relatively thin.

### `script.js`

Change this when:

- state transitions need to change
- a render rule changes
- search behavior changes
- responsive interaction modes change

This is the highest-risk file because it is the integration point for almost everything.

### `events.js`

Change this when:

- keyboard shortcuts change
- pointer-close or hover-intent behavior changes
- media-query-driven interaction wiring changes

### `mobile-drawer.js`

Change this when:

- mobile drill rendering changes
- breadcrumb/back-button behavior changes
- mobile hierarchy semantics change

### `styles.css`

Change this when:

- spacing, typography, shadows, surfaces, or responsive layout change
- desktop/mobile interaction models need matching layout updates

Keep in mind that the CSS contains both shared styles and breakpoint-specific overrides. Many bugs come from fixing only one layer.

## Local Development

The prototype is static. You can serve it from the repo root with:

```bash
python3 -m http.server 4177
```

Then open:

```text
http://127.0.0.1:4177/sites/fdicnet-main-menu/index.html
```

Useful checks:

```bash
node --check sites/fdicnet-main-menu/script.js
node --check sites/fdicnet-main-menu/events.js
node --check sites/fdicnet-main-menu/init.js
node --check sites/fdicnet-main-menu/components.js
node --check sites/fdicnet-main-menu/mobile-drawer.js
node --check sites/fdicnet-main-menu/state.js
```

## Contribution Workflow

When making changes:

1. Decide whether the change is content, rendering, interaction, or styling.
2. Update the narrowest layer possible.
3. Verify both desktop and mobile if the change touches shared logic.
4. Re-test keyboard behavior if the change affects:
   - focus
   - hover/preview state
   - open/close behavior
   - search
5. Re-test the Drupal wrapper if the change affects required IDs or markup structure.

Minimum QA for most changes:

- open/close desktop mega-menu by mouse and keyboard
- move across top-nav with arrow keys
- open mobile drawer and drill into at least one L1/L2/L3 path
- open mobile search on phone width
- type into desktop and mobile search
- activate one suggestion that routes into the menu

## Drupal Single Directory Component Deployment

The Drupal wrapper lives in:

- [fdicnet-main-menu.component.yml](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/components/fdicnet-main-menu/fdicnet-main-menu.component.yml)
- [fdicnet-main-menu.twig](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/components/fdicnet-main-menu/fdicnet-main-menu.twig)
- [fdicnet-main-menu.css](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/components/fdicnet-main-menu/fdicnet-main-menu.css)
- [fdicnet-main-menu.js](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/components/fdicnet-main-menu/fdicnet-main-menu.js)

### What “single directory component” means here

This SDC is not a full rewrite of the menu runtime into Drupal-native JavaScript.

Instead, it provides:

- a Twig shell with the required DOM structure
- a component manifest
- CSS and JS entrypoints
- a JavaScript bootstrap that loads the existing prototype runtime files in dependency order

That makes deployment fast, but it also means the SDC is tightly coupled to the static prototype.

### Current deployment model

The component JS bootstrap loads:

- `js-yaml` from CDN
- `../../components.js`
- `../../state.js`
- `../../mobile-drawer.js`
- `../../events.js`
- `../../init.js`
- `../../script.js`

This is useful for proof-of-concept integration, but it has real implications:

- the SDC is not self-contained yet
- deployment still depends on the prototype runtime files existing relative to the component
- `content.yaml` must remain reachable from the rendered page

### Important implementation caveat

The static prototype and the SDC wrapper can drift.

That is already a real maintenance concern here:

- the static [index.html](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/index.html) now uses an inline mobile masthead search row
- the current SDC Twig template still reflects the older modal-overlay mobile search markup

A junior developer should treat this as a warning:

- when the prototype markup changes, update the SDC Twig in the same change set
- if the required DOM contract changes, update `init.js` validation expectations too

### Recommended Drupal deployment strategy

For production-quality Drupal use, deploy it in phases.

#### Phase 1: Land the wrapper safely

1. Place the component directory in your theme or component library.
2. Ensure the runtime files remain accessible at the relative paths assumed by `fdicnet-main-menu.js`.
3. Ensure `content.yaml` is publicly readable at the expected relative URL.
4. Render the component Twig exactly once per page unless you add namespacing.

Why “exactly once” matters:

- the runtime uses global IDs like `fdicHeader`, `fdicTopNav`, and `megaMenu`
- duplicate component instances on one page will conflict

#### Phase 2: Remove environment fragility

Move away from the CDN/bootstrap-relative loading model.

Recommended improvements:

- bundle `js-yaml` with your theme or build pipeline instead of loading it from CDN
- attach the runtime files through Drupal libraries rather than runtime script injection
- convert the SDC JS from a bootstrap loader into a Drupal behavior that assumes libraries are already attached

This produces:

- better cacheability
- fewer CSP issues
- less runtime failure risk

#### Phase 3: Replace file-fetch content loading

The current bootstrap fetches `content.yaml` at runtime.

In Drupal, the better long-term model is one of:

- preprocess YAML into Twig variables
- expose the menu data as JSON through `drupalSettings`
- server-render the menu content directly and keep JS only for interactivity

Recommended direction:

- use `drupalSettings` for the menu data payload
- keep the runtime selectors and interaction model
- stop fetching `content.yaml` in production Drupal pages

That change would:

- avoid relative-path fetch problems
- make caching and invalidation easier
- reduce client-side bootstrap work

### Concrete deployment checklist for Drupal

1. Copy or vendor the SDC into your component library.
2. Attach the component CSS and JS through a Drupal library.
3. Ensure the runtime files are available and versioned with the component.
4. Keep Twig markup in sync with the static prototype’s required IDs and hosts.
5. Confirm `content.yaml` is reachable, or replace it with `drupalSettings`.
6. Render only one instance per page unless you refactor to remove global IDs.
7. Verify:
   - desktop mega-menu open/close
   - mobile drawer
   - mobile inline header search
   - search suggestions
   - keyboard navigation

### If you want this to be a real Drupal-native component

The current SDC is a transitional wrapper. A more Drupal-native end state would:

- stop loading external runtime files from inside the component JS
- attach one Drupal library with all JS/CSS dependencies
- inject menu data from Drupal instead of fetching `content.yaml`
- namespace DOM IDs or eliminate global IDs entirely
- convert startup into a Drupal behavior scoped to the component root

That is the right direction if this component will live long-term in Drupal rather than remain a prototype handoff.

## Known Maintenance Risks

- The SDC wrapper can fall out of sync with `index.html`.
- The runtime assumes only one component instance per page.
- The runtime still relies on global DOM IDs.
- Search and menu state are global, not instance-scoped.
- Breakpoints are duplicated in JS and CSS.
- `content.yaml` fetch behavior is convenient for prototyping but fragile in CMS deployments.

## Suggested Next Improvements

- Bring the SDC Twig markup into parity with the latest static `index.html`
- Remove runtime script injection and attach libraries through Drupal
- Replace runtime YAML fetch with `drupalSettings` or preprocess output
- Introduce instance scoping if multiple menu instances might ever exist
- Add automated interaction smoke tests for desktop menu, mobile drawer, and mobile search

## Quick Ramp-up Summary

If you only remember five things, remember these:

1. `content.yaml` drives the IA.
2. `script.js` owns state and rendering.
3. `components.js` provides DOM hosts and events, not business logic.
4. Desktop and mobile are intentionally different interaction models.
5. The Drupal SDC currently wraps the prototype runtime; it does not replace it.
