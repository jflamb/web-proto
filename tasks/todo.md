# TODO

## Current Task (FDIC Typography Site Import)
- [x] Capture the supplied standalone typography demo into a new `sites/fdic-typography/` micro-site using repo-standard file names.
- [x] Refactor the supplied assets so the site uses `index.html`, `styles.css`, and `script.js`, preserving the source behavior and content.
- [x] Register the new site in `sites.json` and run targeted syntax/integrity verification.

## Review / Results (FDIC Typography Site Import)
- Added [index.html](/Users/jlamb/Projects/pens-github-test/sites/fdic-typography/index.html):
  - imported the supplied typography demo content into a new `fdic-typography` site.
  - updated the stylesheet reference to `styles.css` and replaced the inline script block with a `script.js` include.
- Added [styles.css](/Users/jlamb/Projects/pens-github-test/sites/fdic-typography/styles.css):
  - copied the supplied standalone prose stylesheet into the repo-standard site asset name without changing its content.
- Added [script.js](/Users/jlamb/Projects/pens-github-test/sites/fdic-typography/script.js):
  - extracted the source page’s inline JavaScript for TOC highlighting, link glow behavior, and code-copy buttons.
- Updated [sites.json](/Users/jlamb/Projects/pens-github-test/sites.json):
  - registered the new `FDIC Typography` micro-site so it appears alongside the existing site entries.
- Validation:
  - `node --check sites/fdic-typography/script.js`
  - loaded `http://127.0.0.1:8042/sites/fdic-typography/index.html` in Chrome DevTools and confirmed the page renders, the TOC/content are present, and copy buttons are injected by `script.js`.
  - noted one non-blocking browser request for missing `/favicon.ico`; no imported site asset failed to load.

## Current Task (FDICnet Search Web Component Refactor)
- [x] Replace the duplicated desktop/mobile search markup with a reusable search web component while preserving the existing DOM contract and wrapper parity.
- [x] Refactor the shared search controller to expose clean extension points for suggestion population and search-results-view hand-off without changing current default behavior.
- [x] Add automated verification for the new component markup and search extension hooks, then run targeted runtime/browser checks and record results.

## Review / Results (FDICnet Search Web Component Refactor)
- Updated [components.js](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/components.js):
  - added a reusable `fdic-site-search` custom element that renders either the desktop or mobile search markup from one shared builder while preserving the required IDs used by the runtime.
  - registered the shared markup builder through the runtime so it can be verified independently in Node.
- Updated [index.html](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/index.html) and [fdicnet-main-menu.twig](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/components/fdicnet-main-menu/fdicnet-main-menu.twig):
  - replaced the duplicated inline search markup with `fdic-site-search` hosts for the desktop masthead field and the mobile inline search row.
- Updated [search.js](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/search.js):
  - moved suggestion generation behind `suggestionsProvider`, with the existing launcher behavior preserved by the default menu suggestion provider.
  - added `querySubmissionHandler` / `resultsViewHandler` seams so submit can hand off cleanly to a future search-results view without rewriting the controller.
  - kept default behavior aligned with the current prototype by activating the selected or first matching menu destination when no results-view handler intercepts submission.
- Added [verify-search-component.mjs](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/verify-search-component.mjs):
  - verifies `fdic-site-search` registration and generated desktop/mobile markup in plain Node.
  - verifies the default menu suggestion provider and the submit-hand-off hook behavior, including delegated results-view handling.
- Updated [styles.css](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/styles.css):
  - added explicit host display for `fdic-site-search` so the new custom element participates cleanly in the existing layout.
- Validation:
  - `node --check sites/fdicnet-main-menu/components.js`
  - `node --check sites/fdicnet-main-menu/search.js`
  - `node sites/fdicnet-main-menu/verify-search-component.mjs`
  - `node sites/fdicnet-main-menu/verify-sync.mjs`
  - browser verification at `http://127.0.0.1:4173/sites/fdicnet-main-menu/index.html` confirmed:
    - the standalone page initializes successfully with the custom search element rendering the required desktop/mobile IDs.
    - dispatching `/` on desktop focuses `#desktopSearchInput` and swaps the idle `/` hint for the submit arrow.
    - dispatching `/` at phone width opens the inline search row, focuses `#mobileSearchInput`, and preserves the mobile helper copy and submit control.

## Current Task (FDICnet Search Shortcut Affordance)
- [x] Add a low-noise visual affordance for the `/` shortcut in the shared search markup.
- [x] Style the desktop hint badge and inline mobile helper copy to fit the existing masthead/search patterns without adding interaction noise.
- [x] Run targeted syntax, parity, and browser verification, then record results.

## Review / Results (FDICnet Search Shortcut Affordance)
- Updated [sites/fdicnet-main-menu/index.html](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/index.html) and [fdicnet-main-menu.twig](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/components/fdicnet-main-menu/fdicnet-main-menu.twig):
  - added a quiet desktop `.search-shortcut-hint` badge with `/` inside the shared search label.
  - added a short inline mobile helper line, `Press / to jump to search.`, inside the expanded masthead search row.
- Updated [styles.css](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/styles.css):
  - styled the desktop `/` badge as a small muted keycap that occupies the right-side action slot when the search field is idle.
  - swapped the desktop right-side affordance by focus state: idle shows `/` and hides the submit arrow; focused hides `/` and shows the submit arrow.
  - kept the mobile row free of the desktop badge and instead surfaced the helper line only at phone width, with a matching inline keycap treatment.
- Validation:
  - `node sites/fdicnet-main-menu/verify-sync.mjs`
  - browser verification at `http://127.0.0.1:4173/sites/fdicnet-main-menu/index.html` confirmed:
    - on desktop, the `/` badge is visible in the idle search field, and focusing the field swaps it out for the submit arrow without clipping the placeholder text.
    - at phone width (`390x844`), opening the inline search row shows the helper copy `Press / to jump to search.` beneath the field while keeping the desktop badge hidden.

## Current Task (FDICnet Slash-To-Search Shortcut)
- [x] Add a focused plan for the `/` keyboard shortcut using the existing shared search controller path.
- [x] Implement guarded `/` shortcut behavior so it focuses desktop search or opens phone search only outside editable contexts.
- [x] Run targeted syntax and interaction verification, then record results.

## Review / Results (FDICnet Slash-To-Search Shortcut)
- Updated [sites/fdicnet-main-menu/search.js](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/search.js):
  - added `isEditableSearchShortcutTarget()` so the global search shortcut does not hijack typing inside inputs, textareas, selects, combobox/textbox/searchbox roles, or contenteditable regions.
  - extended the existing document-level shortcut handler to treat plain `/` as a search-focus shortcut only when no modifier keys are pressed, the event is not composing, and the target is not editable.
  - preserved the existing shared search behavior: desktop `/` focuses/selects `desktopSearchInput`, and phone-width `/` opens the inline masthead search and focuses `mobileSearchInput`.
- Validation:
  - `node --check sites/fdicnet-main-menu/search.js`
  - `node sites/fdicnet-main-menu/verify-sync.mjs`
  - Playwright verification at `http://127.0.0.1:4173/sites/fdicnet-main-menu/index.html` confirmed:
    - on desktop, pressing `/` from the page body focuses `#desktopSearchInput` without inserting `/`.
    - on desktop, pressing `/` while `#desktopSearchInput` is already focused types `/` normally instead of re-triggering the shortcut.
    - at phone width (`390x844`), pressing `/` opens the inline masthead search, sets `aria-expanded="true"` on the mobile toggle, and focuses `#mobileSearchInput`.
    - at phone width, pressing `/` while `#mobileSearchInput` is focused types `/` normally instead of re-triggering the shortcut.

## Current Task (FDICnet Column 2 Overview Gap Tightening)
- [x] Tighten the spacing below the column-2 overview link in the grouped intro layout.
- [x] Keep the grouped overview/introduction block readable without affecting other L2 row spacing.
- [x] Run targeted verification and record results.

## Review / Results (FDICnet Column 2 Overview Gap Tightening)
- Updated [styles.css](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/styles.css):
  - reduced the grouped intro block’s top padding from `8px` to `4px` so the overview link and follow-on intro copy read as a tighter pair.
- Validation:
  - `node sites/fdicnet-main-menu/verify-sync.mjs`
  - browser DOM verification at `http://127.0.0.1:5500/sites/fdicnet-main-menu/index.html` confirmed:
    - the grouped `Column 2 intro` layout still renders the overview row before the intro copy.
    - the inline intro block now computes to `padding-top: 4px`.

## Current Task (FDICnet Column 2 Overview Before Intro Copy)
- [x] Move the column-2 overview link above the intro description text in the desktop grouped-intro layout.
- [x] Preserve the existing grouped-intro styling and fallback behavior when no overview link is present.
- [x] Run targeted verification and record results.

## Review / Results (FDICnet Column 2 Overview Before Intro Copy)
- Updated [components.js](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/components.js):
  - kept the persistent `#l2Description` element in place for fallback rendering, but in `Column 2 intro` mode now renders a dedicated inline intro-description block directly beneath the overview row inside the grouped L2 overview item.
- Updated [styles.css](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/styles.css):
  - added a specific spacing variant for the inline intro-description block so the overview-first grouped treatment remains compact and aligned.
- Validation:
  - `node --check sites/fdicnet-main-menu/components.js`
  - `node sites/fdicnet-main-menu/verify-sync.mjs`
  - browser DOM verification at `http://127.0.0.1:5500/sites/fdicnet-main-menu/index.html` confirmed:
    - in `Column 2 intro`, the first L2 list item now contains the overview link followed by the intro copy (`overviewThenDescription = true`).
    - the standalone column-level `#l2Description` block stays hidden when the inline grouped-intro version is present (`directColumnDescriptionChild = false`).

## Current Task (FDICnet Inline Notes L2 Secondary Text)
- [x] Extend `Inline notes` so column-2 rows render their descriptions as secondary text.
- [x] Keep the existing desktop menu layout and caret alignment stable for both described and undescribed L2 rows.
- [x] Run targeted verification and record results.

## Review / Results (FDICnet Inline Notes L2 Secondary Text)
- Updated [components.js](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/components.js):
  - extended the existing `descriptionMode === "inline"` render path so L2 overview rows and standard L2 rows append `.l2-description` secondary text when description content exists.
- Updated [styles.css](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/styles.css):
  - changed L2 rows to the same two-column grid treatment used by L1 so labels, secondary text, and carets stay aligned.
  - added `.l2-description` styling to match the existing inline-note secondary text treatment.
  - kept overview rows on a single content column so they do not reserve empty caret space.
- Validation:
  - `node --check sites/fdicnet-main-menu/components.js`
  - `node sites/fdicnet-main-menu/verify-sync.mjs`
  - headless Chrome DOM verification against `http://127.0.0.1:5500/sites/fdicnet-main-menu/index.html` confirmed:
    - with `Inline notes` active, `Knowledge Base > Legal References & Resources` renders L2 secondary text for described rows (`l2DescriptionCount = 2` in the verified state).
    - the verified sample rows `Directives` and `FDIC Forms` both rendered `.l2-description`, while the overview row remained label-only because it has no description content.

## Current Task (FDICnet Mega-Menu Bottom Overflow And Page Fill)
- [x] Diagnose the desktop bottom overflow and document-background gap shown in the latest mega-menu screenshot.
- [x] Adjust the menu/page layout CSS with the smallest root-cause fix that preserves current desktop behavior.
- [x] Run targeted verification and record results.

## Review / Results (FDICnet Mega-Menu Bottom Overflow And Page Fill)
- Updated [styles.css](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/styles.css):
  - changed the desktop open-state mega-menu container from the grid-row animation state to normal block flow so the panel height follows the full column content instead of staying pinned to the old `237px` minimum.
  - removed the desktop L1 list `max-height` cap so the first column is no longer artificially constrained while the open panel is sizing itself.
  - changed the root `html, body` background to white so the underlying page fill continues through the full document when the menu extends below the initial viewport.
- Validation:
  - `node --check sites/fdicnet-main-menu/script.js`
  - `node sites/fdicnet-main-menu/verify-sync.mjs`
  - headless Chrome DOM verification against `http://127.0.0.1:5500/sites/fdicnet-main-menu/index.html` confirmed:
    - the open mega-menu frame now extends to the full menu height (`megaMenuRect.bottom = 653`) instead of stopping at the prior short frame (`371` in the pre-fix measurement).
    - the last L1 row now stays inside the panel (`l1OverflowPastPanel = -8`) instead of spilling below it (`274` before the fix).
    - `html`, `body`, and `.page-content` all resolve to `rgb(255, 255, 255)`, eliminating the gray document background showing below the viewport-sized page section.

## Current Task (FDICnet Column 3 Active-L2 Intro)
- [x] Add active L2 description support at the top of column 3 using the existing description block pattern.
- [x] Keep the behavior aligned with the current description-mode model so default behavior does not change unexpectedly.
- [x] Run targeted verification and record results.

## Review / Results (FDICnet Column 3 Active-L2 Intro)
- Updated [script.js](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/script.js):
  - preserved the existing column-3 description behavior for `Standard` and `Inline notes`.
  - in `Column 2 intro` mode only, active L2 items with L3 children now pass their own description into the existing column-3 description block instead of blanking it out.
- Validation:
  - `node --check sites/fdicnet-main-menu/script.js`
  - `node sites/fdicnet-main-menu/verify-sync.mjs`
  - browser verification at `http://127.0.0.1:4173/sites/fdicnet-main-menu/index.html` confirmed:
    - with `Column 2 intro` enabled, focusing `Directives` under `Knowledge Base > Forms & Directives` shows `Review guidance, requirements, and reference materials for Directives in Forms & Directives.` at the top of column 3 while leaving the L3 resource list visible below it.
    - `Standard` and `Inline notes` mode behavior remains unchanged because the new description handoff is gated to `descriptionMode === "column"`.

## Current Task (FDICnet Inline Notes L1 Overflow)
- [x] Diagnose the desktop column-1 overflow introduced by `Inline notes`.
- [x] Adjust the L1 column sizing so inline descriptions do not spill past the panel on tall desktop viewports.
- [x] Run targeted verification and record results.

## Review / Results (FDICnet Inline Notes L1 Overflow)
- Updated [sites/fdicnet-main-menu/styles.css](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/styles.css):
  - increased the desktop L1 list cap from `min(640px, calc(100vh - 220px))` to `min(760px, calc(100vh - 160px))` so inline-note rows can fit within the open mega-menu on taller desktop viewports before any clipping occurs.
- Validation:
  - browser verification at `http://127.0.0.1:4173/sites/fdicnet-main-menu/index.html` confirmed the `About` panel with `Inline notes` enabled stays within the mega-menu frame instead of letting the selected bottom-row treatment spill below the panel.
  - numeric DOM check confirmed the L1 list now resolves to a taller computed cap (`650px` in the verification viewport), matching the intended sizing increase.

## Current Task (FDICnet Column 2 Intro Copy Refinement)
- [x] Replace the generic L1 fallback description pattern with more natural prototype copy.
- [x] Refine the `Column 2 intro` rendering so the intro text and overview link read as one grouped block with clearer separation from the remaining L2 items.
- [x] Run targeted syntax and browser verification, then record results.

## Review / Results (FDICnet Column 2 Intro Copy Refinement)
- Updated [sites/fdicnet-main-menu/script.js](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/script.js):
  - replaced the generic `Browse links, updates, and resources in ...` fallback with more natural prototype copy for both overview and non-overview L1 descriptions.
- Updated [sites/fdicnet-main-menu/components.js](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/components.js):
  - added a column-intro state hook on the L2 column/list so `Column 2 intro` can style the description, overview link, and following links as a single grouped treatment.
  - widened L2 keyboard focus scoping from the list alone to the full L2 column so the grouped intro treatment remains navigable if the overview row presentation shifts within the column.
- Updated [sites/fdicnet-main-menu/styles.css](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/styles.css):
  - tightened the description block, capped its measure, and added a specific intro-overview treatment plus separator spacing before the remaining L2 links.
- Validation:
  - `node --check sites/fdicnet-main-menu/script.js`
  - `node --check sites/fdicnet-main-menu/components.js`
  - `node sites/fdicnet-main-menu/verify-sync.mjs`
  - browser verification at `http://127.0.0.1:4173/sites/fdicnet-main-menu/index.html` confirmed:
    - `Column 2 intro` now renders the fallback text as `Explore News services, guidance, and related resources.` rather than the old `Browse links...` pattern.
    - the overview link sits visually with the intro copy, and a subtle divider plus added whitespace separates it from the remaining column-2 items.
    - the L2 column reports the expected grouped-intro state (`data-column-intro="true"` with `.menu-list--with-column-intro` active).

## Current Task (FDICnet Mega-Menu Description Modes)
- [x] Add prototype controls for selecting the mega-menu description presentation mode.
- [x] Update desktop mega-menu state/rendering to support the three requested modes without changing the existing default behavior.
- [x] Style the selector and any new descriptive text so it fits the current prototype visual language.
- [x] Run syntax and browser verification for desktop menu behavior and record results.

## Review / Results (FDICnet Mega-Menu Description Modes)
- Updated `sites/fdicnet-main-menu/index.html` and `sites/fdicnet-main-menu/components/fdicnet-main-menu/fdicnet-main-menu.twig`:
  - added a prototype-only segmented radio control below the page intro so testers can switch between `Standard`, `Column 2 intro`, and `Inline notes`.
- Updated `sites/fdicnet-main-menu/state.js`, `sites/fdicnet-main-menu/script.js`, and `sites/fdicnet-main-menu/init.js`:
  - added `descriptionMode` to menu state and persisted the selected option in `localStorage` under `fdicnetMenuDescriptionMode`.
  - kept `Standard` mode faithful to the current behavior with no added descriptive text.
  - added a column-2 description mode that shows the active first-column item description at the top of column 2.
  - added neutral L1 fallback descriptions for the two new modes only when explicit L1 description content is absent.
- Updated `sites/fdicnet-main-menu/components.js` and `sites/fdicnet-main-menu/styles.css`:
  - rendered optional L1 secondary text inline beneath first-column labels.
  - added the new column-2 description block and segmented-control styling aligned to the prototype’s current palette and panel treatment.
- Validation:
  - `node --check sites/fdicnet-main-menu/script.js`
  - `node --check sites/fdicnet-main-menu/components.js`
  - `node --check sites/fdicnet-main-menu/state.js`
  - `node --check sites/fdicnet-main-menu/init.js`
  - `node sites/fdicnet-main-menu/verify-sync.mjs`
  - browser verification at `http://127.0.0.1:4173/sites/fdicnet-main-menu/index.html` confirmed:
    - `Standard` mode keeps `#l2Description` hidden, renders no inline L1 descriptions, and leaves the existing column-3 description behavior unchanged.
    - `Column 2 intro` mode shows the active L1 description above column 2 and hides inline L1 descriptions.
    - `Inline notes` mode shows secondary descriptions under first-column items, hides the new column-2 description block, and persists the selected mode across reloads.

## Current Task (FDICnet Architecture Cleanup Follow-up)
- [x] Add a guardrail so standalone `index.html` and the Twig component shell stay in sync.
- [x] Extract launcher search behavior out of `script.js` into a dedicated module with a cleaner integration boundary.
- [x] Centralize responsive breakpoint values and reduce ad hoc window-global module wiring.
- [x] Remove brittle generated menu-description fallback behavior and rely on explicit content data or neutral fallback copy.
- [x] Run syntax and parity verification, then record results.

## Review / Results (FDICnet Architecture Cleanup Follow-up)
- Added `sites/fdicnet-main-menu/runtime.js`:
  - centralizes breakpoint values and reduced-motion query configuration for the JS runtime.
  - provides a single `window.FDICMenuRuntime` registry instead of multiple ad hoc window globals.
- Added `sites/fdicnet-main-menu/search.js`:
  - moved launcher search indexing, search state, combobox ARIA syncing, keyboard handling, submit behavior, and mobile-search open/close coordination out of `script.js`.
  - keeps the existing search behavior but gives `script.js` a smaller integration surface (`applyHeaderContent`, `initializeSiteSearch`, `openMobileSearch`, `closeMobileSearch`).
- Updated `sites/fdicnet-main-menu/script.js`:
  - switched module lookup from separate window globals to the shared runtime registry.
  - removed the brittle `getGeneratedMenuDescription()` keyword matcher and now uses explicit content descriptions or empty fallback copy.
  - removed the in-file launcher search implementation in favor of the new search module.
- Updated `sites/fdicnet-main-menu/state.js`, `sites/fdicnet-main-menu/mobile-drawer.js`, `sites/fdicnet-main-menu/events.js`, and `sites/fdicnet-main-menu/init.js`:
  - register their public APIs with `FDICMenuRuntime` instead of publishing separate globals.
- Updated `sites/fdicnet-main-menu/index.html` and `sites/fdicnet-main-menu/components/fdicnet-main-menu/fdicnet-main-menu.js`:
  - load the new `runtime.js` and `search.js` files in the correct order.
  - updated the SDC bootstrap to detect/load the shared runtime registry rather than the old global module names.
- Updated `sites/fdicnet-main-menu/components/fdicnet-main-menu/fdicnet-main-menu.twig`:
  - fixed the remaining structural drift by moving `mobileSearchRow` back inside the masthead shell to match `index.html`.
- Added `sites/fdicnet-main-menu/verify-sync.mjs`:
  - compares normalized standalone-body markup and Twig shell markup to catch future structural drift.
  - checks that the CSS media-query values still match the shared runtime breakpoint config.
- Validation:
  - `node --check` passed for `runtime.js`, `search.js`, `state.js`, `mobile-drawer.js`, `events.js`, `init.js`, `script.js`, and `components/fdicnet-main-menu/fdicnet-main-menu.js`.
  - `node sites/fdicnet-main-menu/verify-sync.mjs` passed.
  - browser smoke verification confirmed the runtime registry modules load, desktop search still opens and routes to the first matching destination, and mobile search still opens inline in the masthead.

## Current Task (FDICnet Review Findings Remediation)
- [x] Capture baseline screenshots for desktop and mobile menu/search states before changes.
- [x] Audit the reported accessibility and UX findings across the standalone prototype and shared menu runtime.
- [x] Fix the confirmed ARIA, mobile search, search-submit, hover-intent, and drawer-state issues with minimal structural changes.
- [x] Run targeted verification, compare against baseline screenshots, and record results.

## Review / Results (FDICnet Review Findings Remediation)
- Created branch `fix/fdicnet-a11y-review-findings`.
- Captured baseline screenshots before editing in `tmp/review-baseline/`:
  - `desktop-initial.png`
  - `desktop-menu-open.png`
  - `desktop-search-open.png`
  - `mobile-initial.png`
  - `mobile-drawer-open.png`
  - `mobile-search-open.png`
- Updated `sites/fdicnet-main-menu/index.html` and `sites/fdicnet-main-menu/components/fdicnet-main-menu/fdicnet-main-menu.twig`:
  - added the missing static combobox ARIA contract for desktop and mobile search inputs on initial render.
  - changed the search submit button label from full-site search wording to launcher behavior (`Open first matching result`).
  - aligned the Twig shell with the current inline mobile-search architecture by removing the stale modal/backdrop/close markup instead of adding modal semantics back to the standalone prototype.
  - marked `#megaMenuScrim` as presentational with `role="presentation"`.
- Updated `sites/fdicnet-main-menu/script.js`:
  - removed the dead-end `search.html` fallback from search suggestions and submit behavior.
  - made Enter / submit activate the first matching menu destination instead of routing to the stub search page.
  - synchronized combobox ARIA state for both desktop and mobile inputs, including close/reset paths.
  - removed obsolete mobile-search backdrop/close element references and listeners.
- Updated `sites/fdicnet-main-menu/components.js`:
  - rendered desktop L1 items with children as real `button` elements that control the next column, while keeping overview rows as links.
  - switched hover-preview event dispatch to `pointerover` and carried `pointerType` through the custom events.
- Updated `sites/fdicnet-main-menu/events.js`:
  - kept the existing hover-intent delay for mouse hover, but skip that delay for non-mouse pointer types.
- Updated `sites/fdicnet-main-menu/mobile-drawer.js` and `sites/fdicnet-main-menu/state.js`:
  - persisted mobile drawer scroll positions by drill path and restored them when navigating back.
- Updated `sites/fdicnet-main-menu/styles.css`:
  - added `overscroll-behavior: contain` to the shared search results list.
- Validation:
  - `node --check` passed for `script.js`, `events.js`, `components.js`, `mobile-drawer.js`, `init.js`, and `state.js`.
  - browser verification confirmed both search inputs expose `aria-expanded="false"`, `aria-controls`, `aria-autocomplete="list"`, and `aria-haspopup="listbox"` before interaction.
  - browser verification confirmed the desktop L1 primary rows now render as `BUTTON` elements with `aria-controls="l2List"` and per-row `aria-expanded`, while the overview row remains an anchor.
  - browser verification confirmed desktop search submit stays on `index.html`, closes the suggestion panel, and activates a matching menu destination instead of navigating to `search.html`.
  - browser verification confirmed the current mobile search UI opens inline in the masthead with no `mobileSearchBackdrop` or `mobileSearchClose` elements, matching the intended interaction model.
  - browser verification confirmed mobile drawer scroll position is restored after drilling into `Knowledge Base > International Affairs` and backing out (`scrollTop` restored to `15`).
  - captured post-change comparison screenshots in `tmp/review-after/`:
    - `desktop-initial.png`
    - `desktop-menu-open.png`
    - `desktop-search-open.png`
    - `mobile-initial.png`
    - `mobile-drawer-open.png`
    - `mobile-search-open.png`

## Current Task (FDICnet Manager Feedback Layout Follow-up)
- [x] Remove the detached whitespace and stripe treatment between the desktop top nav and mega-menu.
- [x] Make the desktop mega-menu columns equal width and keep the panel visually anchored to the active top-level item.
- [x] Run browser verification against the reported screenshot issues and record results.
- [x] Rebalance the desktop mega-menu frame so left/right outer margins are symmetrical without breaking shell alignment.
- [x] Extend the first-column background to the left frame edge so the panel surface matches the L1 area.

## Review / Results (FDICnet Manager Feedback Layout Follow-up)
- Updated `sites/fdicnet-main-menu/styles.css`:
  - removed the extra top/bottom padding on `.mega-menu`, which eliminates the detached white gap between the top nav and the panel.
  - removed the open-state bottom accent-bar treatment and kept the panel anchored directly beneath the primary nav.
  - changed `.mega-menu-inner` to `grid-template-columns: repeat(3, minmax(0, 1fr))` for equal desktop column widths.
  - changed the panel border to side/bottom only so the white active tab can visually connect to the panel instead of feeling separated by an extra top edge.
- Validation:
  - browser verification with a cache-busted stylesheet confirmed `.mega-menu` now computes to `padding-top: 0px` and `padding-bottom: 0px`.
  - browser verification confirmed the desktop panel now renders three equal-width columns (`309.664px / 309.664px / 309.664px` at the verified viewport).
  - browser screenshot review confirmed the detached whitespace is gone and the bottom blue stripe is removed from the desktop mega-menu presentation.
  - follow-up browser verification confirmed the open panel frame is once again shell-aligned and symmetrical at the viewport edges (`megaLeft = 64`, `megaRight = 995`, matching the shell bounds on both sides) after removing the full-viewport left-bleed column background and narrowing the clip-path allowance to the local L1 accent overflow.
  - follow-up browser verification confirmed the panel now gets its extra balancing width from a frame-only pseudo-element (`::before left/right = -16px`) while the content grid remains shell-aligned (`contentLeftDelta = 0`, `contentRightDelta = 0`), which accommodates the selected L1 state without shifting the menu content.
  - follow-up browser verification confirmed the frame extension now keys off the same offset as the active first top-nav item (`activeTabLeft = 52`, `actualFrameLeft = 52`), so the panel edge aligns with the active main-menu item while preserving text alignment inside the panel.
  - updated the column surface colors to a more harmonious neutral progression: L1 `rgb(245, 245, 247)`, L2 `rgb(247, 247, 243)`, L3 `rgb(255, 255, 255)`.
  - follow-up browser verification confirmed the L1 active stripe now extends flush to the panel frame edge (`stripeLeft = -12px`, `stripeWidth = 12px`) and no longer stops short of the mega-menu edge.
  - removed the divider rows before overview links in both columns (`.l1-separator-item` and `.l2-separator-item` now `display: none`), reducing the false grouping cue.
  - unified the L1 selected row background with the same active overlay family used by L2 (`selectedL1Bg = rgba(0, 110, 190, 0.14)` and hovered L2 `bg = rgba(0, 110, 190, 0.14)`), eliminating the prior gray-blue to white background flip.
  - reduced desktop column top padding to `10px` and shifted the column surfaces to a clearer cool-neutral progression: L1 `rgb(237, 243, 247)`, L2 `rgb(247, 250, 252)`, L3 `rgb(255, 255, 255)`.
  - final follow-up browser verification confirmed the first-column surface now extends to the left frame edge via `.mega-col--l1::before` with the same offset and width as the frame bleed (`left = -12px`, `width = 12px`) and the same background color as the L1 column (`rgb(237, 243, 247)`), eliminating the remaining exposed frame strip on the far left.
  - final desktop-geometry verification confirmed:
    - the active top-nav item no longer shows the bottom blue stripe (`topNavAfterOpacity = 0`).
    - L1, L2, and L3 item rows now render at `36px` height on desktop.
    - the selected L1 stripe now uses the same `4px` thickness family as L2 (`l1StripeShadow = 4px inset accent`).
    - the first row in columns 1 and 2 aligns with the third-column content start (`l1Top = 139`, `l2Top = 139`, `menuDescriptionTop = 140`) and desktop column top padding is now `0px`.

## Current Task (FDICnet Manager Feedback Implementation 1 2 6)
- [x] Strengthen desktop top-nav tab active state, active cue, and spacing.
- [x] Add a more defined mega-menu panel container treatment aligned to the shell/header.
- [x] Increase hover/focus/active clarity while preserving stable open-menu behavior.
- [x] Run browser verification and record results.

## Review / Results (FDICnet Manager Feedback Implementation 1 2 6)
- Updated `sites/fdicnet-main-menu/styles.css`:
  - increased desktop top-nav tab horizontal padding and made the active tab more explicit with heavier weight plus a persistent bottom cue while selected.
  - added a neutral framed panel treatment to `.mega-menu-inner` with a subtle surface color, border, shadow, and more consistent vertical panel spacing.
  - strengthened desktop hover/active affordances by increasing the shared overlay intensity, widening the L2 active stripe, enlarging row padding, and toning the third-column support copy down so it reads as context rather than primary nav.
- Updated `sites/fdicnet-main-menu/script.js`:
  - increased the desktop preview-clear delay from `120ms` to `180ms` so the menu is less likely to collapse preview state while users move between columns.
- Validation:
  - `node --check sites/fdicnet-main-menu/script.js` passed.
  - browser verification at `1440x900` confirmed the active tab now renders with `font-weight: 600`, `padding-left/right: 20px`, and an active underline cue (`::after opacity: 1`) after forcing a cache-busted stylesheet reload.
  - browser verification confirmed `.mega-menu-inner` now renders with `background: rgb(248, 248, 245)`, `1px` border, and panel shadow, producing the requested boxed/anchored panel treatment.
  - browser verification confirmed hovered L2 rows render the stronger `rgba(0, 110, 190, 0.14)` background overlay and the menu remains open while traversing the panel.
  - keyboard verification confirmed the top-nav still exposes a visible focus ring on `News & Events`.

## Review / Results (FDICnet Manager Feedback Review)
- Created branch `chore/fdicnet-manager-feedback-review`.
- Reviewed the live desktop mega-menu implementation in `sites/fdicnet-main-menu` against the six manager feedback themes.
- Recommendation summary:
  - support items 1, 2, and 6 as valid improvements to visual hierarchy and interaction clarity.
  - treat item 5 as mostly already satisfied by the current fixed grid columns unless the request is for equal-width L1/L2/L3 columns, which would need explicit design confirmation.
  - push back for clarification on items 3 and 4 because both are ambiguous against the current component model:
    - item 3 does not define whether the supporting sentence belongs under each visible L2 link, under each column heading, or in the existing third-column description area; adding helper copy under every L2 row would materially increase menu height and scanning cost.
    - item 4 refers to swapping L2/L3 background colors, but the current desktop menu does not use two clearly distinct persistent L2/L3 background fills; the implementation uses a gray L1 column, white panel body, and state overlays/accents.
- Validation:
  - inspected live rendered menu states via browser automation at `http://127.0.0.1:4173/sites/fdicnet-main-menu/index.html`.
  - confirmed current selected top-nav button uses a white active tab treatment with no active underline, L1 uses an accent stripe, L2/L3 use hover/focus overlays, and the panel grid currently renders as `320px 320px minmax(280px, 1fr)`.

## Current Task (FDICnet Manager Feedback Review)
- [x] Create a dedicated branch for the feedback review.
- [x] Inspect the current desktop mega-menu implementation against the six feedback items.
- [x] Identify any feedback that is ambiguous, conflicts with existing interaction/a11y requirements, or should be pushed back on.
- [x] Summarize recommendations and next-step guidance.

## Review / Results (FDICnet Manager Feedback Review)
- Created branch `chore/fdicnet-manager-feedback-review`.
- Reviewed the live desktop mega-menu implementation in `sites/fdicnet-main-menu` against the six manager feedback themes.
- Recommendation summary:
  - support items 1, 2, and 6 as valid improvements to visual hierarchy and interaction clarity.
  - treat item 5 as mostly already satisfied by the current fixed grid columns unless the request is for equal-width L1/L2/L3 columns, which would need explicit design confirmation.
  - push back for clarification on items 3 and 4 because both are ambiguous against the current component model:
    - item 3 does not define whether the supporting sentence belongs under each visible L2 link, under each column heading, or in the existing third-column description area; adding helper copy under every L2 row would materially increase menu height and scanning cost.
    - item 4 refers to swapping L2/L3 background colors, but the current desktop menu does not use two clearly distinct persistent L2/L3 background fills; the implementation uses a gray L1 column, white panel body, and state overlays/accents.
- Validation:
  - inspected live rendered menu states via browser automation at `http://127.0.0.1:4173/sites/fdicnet-main-menu/index.html`.
  - confirmed current selected top-nav button uses a white active tab treatment with no active underline, L1 uses an accent stripe, L2/L3 use hover/focus overlays, and the panel grid currently renders as `320px 320px minmax(280px, 1fr)`.

## Current Task (FDICnet Desktop Overview Hover Parity)
- [x] Diagnose why the first-column overview row does not match the second-column overview row on hover.
- [x] Update the desktop mega-menu CSS so the first-column overview row gets the same hover/focus label treatment.
- [x] Run targeted verification and record results.

## Review / Results (FDICnet Desktop Overview Hover Parity)
- Updated `sites/fdicnet-main-menu/styles.css`:
  - added an explicit `.l1-item--overview` label-decoration rule for hover, focus-visible, and selected states so the first-column overview row now uses the same underline treatment pattern as the second-column overview row.
- Validation:
  - selector audit confirms the first-column overview variant now has its own explicit interaction-state label styling instead of relying only on the generic `.l1-item` rule.
  - browser verification was not available in-session, so this fix is statically verified only.

## Current Task (FDICnet Menu Single Directory Component Accommodation)
- [x] Audit the existing menu prototype boundaries and choose a non-breaking SDC accommodation approach.
- [x] Add a collocated single-directory-component package for the FDICnet menu that Drupal teammates can map into their workflow.
- [x] Keep the current HTML/CSS/JS prototype behavior intact or limit changes to safe compatibility wiring only.
- [x] Run targeted verification and record results.

## Review / Results (FDICnet Menu Single Directory Component Accommodation)
- Added `sites/fdicnet-main-menu/components/fdicnet-main-menu/` as an additive Drupal-oriented package with:
  - `fdicnet-main-menu.component.yml` for component metadata/props
  - `fdicnet-main-menu.twig` preserving the current runtime DOM contract
  - `fdicnet-main-menu.css` as a collocated stylesheet entrypoint
  - `fdicnet-main-menu.js` as a defensive bootstrap that reuses the existing prototype runtime only when it is not already present
  - `README.md` documenting the intended handoff and current constraints
- Kept the working prototype runtime untouched:
  - no behavior changes to `index.html`, `styles.css`, `components.js`, `state.js`, `mobile-drawer.js`, `events.js`, `init.js`, or `script.js`
- Validation:
  - `node --check` passed for the new SDC JS entrypoint and the existing runtime JS files
  - a DOM-contract check confirmed the Twig shell contains the required runtime IDs used by the current initializer
  - `curl -I http://127.0.0.1:4173/sites/fdicnet-main-menu/index.html` returned `200 OK` from a local static server
  - browser automation smoke testing was attempted but blocked by the local browser-tool state in this session, so verification here is static rather than interactive

## Current Task (FDICnet Mobile Overview Hover Underline)
- [x] Diagnose why the bottom overview link in second- and third-level mobile drill views does not gain underline on hover.
- [x] Fix the selector/state mismatch so overview links share the same hover/focus underline treatment as other mobile drawer links.
- [x] Run targeted mobile browser verification and record results.

## Review / Results (FDICnet Mobile Overview Hover Underline)
- Updated `sites/fdicnet-main-menu/styles.css`:
  - added `.mobile-drill-current-link:hover` to the shared mobile underline-interaction selector so the overview row at the bottom of deeper drill views now behaves like the other mobile drawer link variants.
- Validation:
  - browser verification at `390x844` confirmed the second-level `News` overview row and third-level `Global Messages` overview row now gain `text-decoration-line: underline` on hover.

## Current Task (FDICnet Mobile Drawer Underline Treatment)
- [x] Remove default underlines from mobile drawer links and crumbs to match the desktop mega-menu navigation pattern.
- [x] Preserve clear interaction affordances by showing underline only during hover, focus, and pressed states where applicable.
- [x] Run targeted mobile browser verification and record results.

## Review / Results (FDICnet Mobile Drawer Underline Treatment)
- Updated `sites/fdicnet-main-menu/styles.css`:
  - removed default underlines from `.mobile-drill-crumb`, `.mobile-drill-current-link`, and `.mobile-drill-link` so the mobile drawer now matches the desktop mega-menu’s resting navigation treatment.
  - added underline back only for hover, focus-visible, and active states on crumb and link-style rows to preserve a clear interactive cue during user interaction.
- Validation:
  - browser verification at `390x844` confirmed the mobile drawer still opens and drills correctly.
  - computed-style checks confirmed crumb/current/link rows render with `text-decoration-line: none` at rest and gain `underline` during interaction states.

## Current Task (FDICnet Mobile Drawer Link Color)
- [x] Align mobile drawer navigation/link resting color with the desktop mega-menu primary-text treatment.
- [x] Preserve underline, hover, focus, and current-item affordances after the mobile color shift.
- [x] Run targeted mobile browser verification and record results.

## Review / Results (FDICnet Mobile Drawer Link Color)
- Updated `sites/fdicnet-main-menu/styles.css`:
  - changed the mobile drill breadcrumb button, current-link row, and leaf-link resting color from `var(--menu-link)` to `var(--ds-text-primary)` so the mobile drawer now matches the desktop mega-menu color model.
  - kept underline affordances intact for crumb and link states, so interactive rows still read as actionable even with the new resting color.
- Validation:
  - browser verification at `390x844` confirmed the mobile drawer still opens and renders drill items correctly.
  - computed-style checks confirmed `.mobile-drill-crumb`, `.mobile-drill-current-link`, and `.mobile-drill-link` now render as `rgb(33, 33, 35)` with underline affordances preserved where expected.

## Current Task (FDICnet PR Merge Conflict Resolution)
- [x] Merge the latest `origin/main` into `feat/fdicnet-menu-launcher` and surface conflicting files.
- [x] Resolve conflicts while preserving the current FDICnet menu/search behavior on this branch.
- [x] Run targeted verification and push the resolved branch.

## Review / Results (FDICnet PR Merge Conflict Resolution)
- Resolved merge conflicts in the FDICnet menu prototype files by preserving the current branch implementation of:
  - unified search-to-navigate behavior
  - mobile drawer and desktop mega-menu interaction fixes
  - accessibility and layout refinements made on `feat/fdicnet-menu-launcher`
- Restored the task log entry after the merge so the resolution work remained tracked.
- Validation:
  - `node --check` passed for `script.js`, `events.js`, `init.js`, `mobile-drawer.js`, `components.js`, and `state.js`.
  - conflict-marker scan confirmed no remaining merge markers in `sites/fdicnet-main-menu` or `tasks/todo.md`.
  - browser verification confirmed desktop hover still opens `Career Development & Training` and mobile menu open still renders drill items at 390px width.

## Current Task (FDICnet Mega-Menu Link Color)
- [x] Shift desktop mega-menu item resting color from hyperlink blue to primary text color.
- [x] Preserve clear hover, focus, underline, and active affordances after the color change.
- [x] Run targeted browser verification for desktop mega-menu readability and interaction states.

## Review / Results (FDICnet Mega-Menu Link Color)
- Updated `sites/fdicnet-main-menu/styles.css`:
  - changed desktop mega-menu row text and caret color from link blue to the primary text token for L1, L2, and L3 items.
  - kept hover, focus, selected, and active affordances intact by preserving background states, underline behavior, focus rings, and accent stripes.
  - moved underline decoration color to `currentColor` so the interactive cue stays visible with the new primary-text resting color.
- Validation:
  - `node --check` passed for `sites/fdicnet-main-menu/script.js`.
  - browser verification confirmed the open desktop mega-menu now renders L1/L2 items in primary text color while preserving hover/open behavior and visible interaction affordances.

## Current Task (FDICnet DOM Ref Refresh Reduction)
- [x] Audit hot-path `refreshDomRefs()` usage in the main menu runtime.
- [x] Remove redundant runtime refreshes and keep ref refresh at startup plus breakpoint changes.
- [x] Run targeted syntax and static verification for the ref-caching change.

## Review / Results (FDICnet DOM Ref Refresh Reduction)
- Updated `sites/fdicnet-main-menu/script.js`:
  - removed redundant `refreshDomRefs()` calls from stable render, search, top-nav, and mobile-drawer runtime paths so those functions now rely on the cached refs established at startup.
  - simplified the event binder contract to pass the shared `getDom()` accessor directly instead of re-refreshing refs on every event lookup.
  - stopped the mobile drawer controller from re-refreshing refs just to return `navList`.
  - restored the event-binder contract fields for `mobileNavMediaQuery` and `phoneSearchMediaQuery` inside `getDom()`, which fixed the `bindFDICMenuEvents(...)` startup crash that had broken desktop hover opening.
- Updated `sites/fdicnet-main-menu/mobile-drawer.js`:
  - removed the stale in-controller `refreshDomRefs()` call that was left behind after the controller injection contract was pruned.
  - this fixed the mobile drawer render crash that had been leaving the off-canvas menu visually blank.
- Updated `sites/fdicnet-main-menu/events.js`:
  - added explicit `refreshDomRefs()` calls only on mobile-nav and phone-search media-query breakpoint changes before rerendering state.
- Validation:
  - `node --check` passed for `sites/fdicnet-main-menu/script.js` and `sites/fdicnet-main-menu/events.js`.
  - `node --check` passed for `sites/fdicnet-main-menu/mobile-drawer.js`.
  - `rg -n "refreshDomRefs\\(" sites/fdicnet-main-menu/script.js sites/fdicnet-main-menu/events.js sites/fdicnet-main-menu/init.js` now shows only the intentional refreshes: startup/init-time wiring, `setupEvents()` initialization, and breakpoint-change handlers.
  - browser validation confirmed hovering `Career Development & Training` opens the mega-menu, updates the top-nav button to `aria-expanded="true"`, and renders the `Career Development & Training menu` region.
  - browser validation at 390px width confirmed tapping `Open menu` renders the mobile drill view with `News`, `Events`, `Podcasts & Media`, and `News & Events Overview` instead of a blank drawer.

## Current Task (FDICnet Mobile Drawer Close Timeout)
- [x] Add a fallback hide timeout for the animated mobile drawer close path when `transitionend` does not fire.
- [x] Clear stale mobile drawer close listeners and timers on reopen or viewport changes.
- [x] Run targeted syntax and code-path verification for the guarded close behavior.

## Review / Results (FDICnet Mobile Drawer Close Timeout)
- Updated [state.js](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/state.js):
  - added `mobileNavCloseHideTimer` to track the fallback hide timeout for the mobile drawer close animation.
- Updated [script.js](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/script.js):
  - mobile drawer close now mirrors the desktop mega-menu safeguard with a `240ms` timeout that hides the drawer and removes the drawer panel if `transitionend` is skipped.
  - mobile reopen, viewport exit, and repeated close attempts now clear any stale close listener/timer before continuing, preventing a visible-but-inert drawer state during rapid toggles.
- Validation:
  - `node --check` passed for `sites/fdicnet-main-menu/script.js` and `sites/fdicnet-main-menu/state.js`.
  - static path review confirmed the fallback timer is cleared on reopen and non-mobile reset, and forcibly hides the drawer if the transition callback never arrives.

## Current Task (FDICnet Mobile Modal Focus and Backdrop Semantics)
- [x] Add a real Tab trap for the mobile search dialog so `aria-modal="true"` is accurate.
- [x] Remove fake button semantics from the mobile nav backdrop and keep it click-only.
- [x] Run targeted syntax and browser verification for mobile search focus cycling and backdrop semantics.

## Review / Results (FDICnet Mobile Modal Focus and Backdrop Semantics)
- Updated [events.js](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/events.js):
  - added a dedicated mobile-search focusables helper and Tab-wrapping logic for the mobile search sheet.
  - removed the obsolete keyboard handler that existed only because the mobile nav backdrop was incorrectly modeled as a button.
- Updated [index.html](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/index.html) and [script.js](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/script.js):
  - stripped `role="button"`, `tabindex`, and `aria-label` from the mobile nav backdrop.
  - removed now-unneeded backdrop `tabIndex` state management from the mobile nav sync logic.
- Validation:
  - `node --check` passed for `sites/fdicnet-main-menu/events.js` and `sites/fdicnet-main-menu/script.js`.
  - browser verification confirmed the mobile search dialog keeps focus cycling inside the sheet on `Tab` / `Shift+Tab`.
  - browser verification confirmed the mobile nav backdrop no longer exposes interactive button semantics.

## Current Task (FDICnet Search Combobox ARIA Roles)
- [x] Complete the ARIA combobox pattern for desktop and mobile search inputs.
- [x] Expose the suggestions as a listbox with option roles that match `aria-activedescendant`.
- [x] Run targeted syntax and browser verification for the live combobox/listbox/option role wiring.

## Review / Results (FDICnet Search Combobox ARIA Roles)
- Updated [index.html](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/index.html):
  - added `role="combobox"` to both search inputs.
  - changed both suggestion result lists to `role="listbox"`.
- Updated [script.js](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/script.js) and [styles.css](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/styles.css):
  - reinforced combobox state with `aria-haspopup="listbox"`.
  - changed each rendered suggestion row to a real `role="option"` node with `aria-selected`.
  - moved `aria-activedescendant` targeting to the option node so the active descendant belongs to the owning listbox pattern.
  - flattened each suggestion so the `option` itself is the clickable node, removing nested buttons inside listbox options.
- Validation:
  - `node --check` passed for `sites/fdicnet-main-menu/script.js`.
  - browser verification confirmed the live search DOM now exposes `role="combobox"` on the input, `role="listbox"` on the results list, and `role="option"` / `aria-selected` on suggestions.

## Current Task (FDICnet L1 Hover Description Fallback)
- [x] Diagnose why hovering a column-1 item with no active column-2 item leaves column 3 blank.
- [x] Add a generated L1 description fallback so column 1 can populate column 3 without requiring explicit L1 descriptions in `content.yaml`.
- [x] Run targeted syntax and browser verification for desktop column-1 hover behavior.

## Review / Results (FDICnet L1 Hover Description Fallback)
- Updated [script.js](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/script.js):
  - added a menu-description fallback generator for labels that do not have explicit description text in the content model.
  - the default desktop column-3 fallback now uses generated copy for the selected L1 item, so hovering or selecting a first-column section can show matching context before any L2 item is previewed.
- Validation:
  - `node --check` passed for `sites/fdicnet-main-menu/script.js`.
  - browser verification confirmed hovering `Training & Onboarding` shows a matching third-column description for that L1 section instead of leaving column 3 blank.

## Current Task (FDICnet Default Column 3 Context)
- [x] Diagnose why column 3 shows the first L2 description even when only the L1 section is selected.
- [x] Change the default desktop column-3 fallback to use the selected L1 context instead of `selectedL2Index = 0`.
- [x] Run targeted syntax and browser verification for initial/open desktop description state.

## Review / Results (FDICnet Default Column 3 Context)
- Updated [script.js](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/script.js):
  - when no L2 item is being previewed, column 3 no longer borrows the first L2 item's description by default.
  - the non-preview fallback now uses the selected L1 context (`selectedL1.description` or overview description when present), which avoids mismatched copy on initial open.
- Validation:
  - `node --check` passed for `sites/fdicnet-main-menu/script.js`.
  - browser verification confirmed the desktop menu opens without showing an unrelated first-L2 description when only the L1 section is selected.

## Current Task (FDICnet Default L2 Active State)
- [x] Diagnose why the first L2 item appears active immediately when the desktop mega-menu opens.
- [x] Restrict L2 active styling to real L2 preview/focus states instead of the default `selectedL2Index`.
- [x] Run targeted syntax and browser verification for initial-open desktop menu state.

## Review / Results (FDICnet Default L2 Active State)
- Updated [components.js](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/components.js):
  - L2 items now render with active styling only when the user is actually previewing an L2 row.
  - the initial desktop open state no longer highlights the first L2 item just because `selectedL2Index` defaults to `0`.
- Validation:
  - `node --check` passed for `sites/fdicnet-main-menu/components.js`.
  - browser verification confirmed the desktop menu opens with no L2 item visually active until the user focuses or hovers a row in column 2.

## Current Task (FDICnet Column Alignment and L3 Description Rules)
- [x] Fix the first-row alignment mismatch between desktop columns 1 and 2.
- [x] Hide the column-3 description whenever actual L3 items are present, while preserving leaf-L2 description fallback.
- [x] Run targeted syntax and browser verification for row alignment and column-3 behavior.

## Review / Results (FDICnet Column Alignment and L3 Description Rules)
- Updated [styles.css](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/styles.css):
  - nudged the desktop column-2 list up by 1px so its first row aligns with the first row in column 1.
- Updated [script.js](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/script.js):
  - restored the original rule that column-3 descriptions stay hidden when the active L2 item has real L3 children.
  - kept the new leaf fallback so L2 items without L3 children still show their own description in column 3.
- Validation:
  - `node --check` passed for `sites/fdicnet-main-menu/script.js`.
  - browser verification confirmed the L1/L2 first-row top positions now match and `Global Messages` shows only its L3 list while `FDICNews` still shows its description with no L3 list.

## Current Task (FDICnet Leaf L2 Description Fallback)
- [x] Inspect the desktop mega-menu column-3 rendering logic for L2 items without child links.
- [x] Show the active leaf L2 item's description in column 3 when there are no L3 child items to render.
- [x] Run targeted syntax and browser verification for leaf-L2 preview behavior.

## Review / Results (FDICnet Leaf L2 Description Fallback)
- Updated [script.js](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/script.js):
  - changed the mega-menu view model so a previewed L2 leaf item contributes its own description text to column 3 instead of blanking the description whenever preview mode is active.
- Updated [components.js](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/components.js):
  - column 3 now hides the L3 list only when there are no actual L3 child items, allowing the description-only state for leaf L2 entries.
- Validation:
  - `node --check` passed for `sites/fdicnet-main-menu/script.js` and `sites/fdicnet-main-menu/components.js`.
  - browser verification confirmed a leaf L2 item such as `FDICNews` keeps the third-column description visible even though there are no L3 child links to render.

## Current Task (FDICnet Menu Description Refresh)
- [x] Audit the `fdicnet-main-menu` content source for third-column descriptions that are missing or placeholder-quality.
- [x] Generate plausible replacement descriptions for every menu item that can surface description text in the third column.
- [x] Run targeted validation for YAML integrity, placeholder removal, and live rendering in the mega menu.

## Review / Results (FDICnet Menu Description Refresh)
- Updated [content.yaml](/Users/jlamb/Projects/pens-github-test/sites/fdicnet-main-menu/content.yaml):
  - replaced all 921 placeholder third-column descriptions with generated one-sentence descriptions tied to each item label and parent menu context.
  - used category-sensitive phrasing for common content types such as FAQs, training, policies, forms, calendars/events, benefits, support, and tools.
  - removed the remaining `"... resources."` / `View all resources.` filler copy across the menu corpus.
- Validation:
  - `ruby -e 'require "yaml"; YAML.load_file(...)'` passed for `sites/fdicnet-main-menu/content.yaml`.
  - static scan confirmed `remaining_placeholders 0` across all 921 description fields.
  - browser smoke test confirmed the menu still loads and the third column now renders the updated copy, e.g. `FDICNews` shows `View updates, schedules, and related materials for FDICNews in News.`

## Current Task (FDICnet Search Acronym Ranking)
- [x] Diagnose why `pla` fails to surface `Professional Learning Account (PLA)` in the search suggestions.
- [x] Update title-only ranking so explicit acronym aliases and exact title tokens outrank incidental substring matches.
- [x] Run targeted verification for `pla` result ordering and syntax.

## Review / Results (FDICnet Search Acronym Ranking)
- Updated `sites/fdicnet-main-menu/script.js`:
  - added title alias extraction for parenthetical acronyms like `(PLA)` and a normalized acronym derived from the visible title words.
  - adjusted title-only ranking so exact title matches still win first, followed by explicit acronym aliases, then title-prefix matches, exact title-token matches, and finally generic substring matches.
  - this prevents entries like `Professional Learning Account (PLA)` from being crowded out by unrelated `pla` substrings inside words such as `workplace` or `templates`.
- Validation:
  - `node --check sites/fdicnet-main-menu/script.js` passed.
  - browser verification confirmed typing `pla` now surfaces `Professional Learning Account (PLA)` as the first menu suggestion.

## Current Task (FDICnet Search Clear Button)
- [x] Replace the browser-native search clear affordance with explicit Phosphor `X` buttons on desktop and mobile.
- [x] Match the clear button interaction styling to the existing go button and hide it when the search query is empty.
- [x] Run targeted verification for DOM requirements, syntax, and native cancel suppression.

## Review / Results (FDICnet Search Clear Button)
- Updated `sites/fdicnet-main-menu/index.html` and `sites/fdicnet-main-menu/styles.css`:
  - added explicit desktop/mobile clear buttons using the Phosphor `ph-x` icon beside the existing submit control.
  - matched the clear button hover/focus treatment to the go button and disabled the native WebKit search cancel affordance.
- Updated `sites/fdicnet-main-menu/script.js` and `sites/fdicnet-main-menu/init.js`:
  - wired the clear buttons into the shared search state so they only appear when the query is non-empty.
  - clearing now resets suggestions/status, preserves the appropriate desktop/mobile surface, and returns focus to the active search input.
- Validation:
  - `node --check` passed for `sites/fdicnet-main-menu/script.js` and `sites/fdicnet-main-menu/init.js`.
  - static scan confirms `desktopSearchClear` and `mobileSearchClear` are required init elements and the native `::-webkit-search-cancel-button` is suppressed.

## Current Task (FDICnet Unified Search-to-Navigate)
- [x] Replace the standalone launcher with desktop anchored suggestions and a mobile search overlay.
- [x] Reuse the menu-content index for title-only debounced suggestion matching plus a final full-site search action.
- [x] Route menu suggestions into the existing menu state and full-site submits into a canonical prototype search results page.
- [x] Run targeted syntax and browser verification for desktop debounce, search submit, and mobile overlay activation.

## Review / Results (FDICnet Unified Search-to-Navigate)
- Updated `sites/fdicnet-main-menu/index.html`, `sites/fdicnet-main-menu/script.js`, `sites/fdicnet-main-menu/styles.css`, `sites/fdicnet-main-menu/init.js`, and `sites/fdicnet-main-menu/state.js`:
  - removed the standalone launcher modal.
  - turned the masthead search into a desktop autocomplete with debounced menu suggestions and a final `Search all FDICnet for "..."` action row.
  - replaced the phone-only inline search row with a full mobile search overlay that uses the same suggestion model.
  - kept menu suggestion activation wired into the existing desktop/mobile menu path logic.
- Added `sites/fdicnet-main-menu/search.html`:
  - canonical prototype destination for full-site search submits, preserving the raw query in `?q=`.
- Updated `sites/fdicnet-main-menu/events.js`:
  - removed obsolete launcher guard logic so global pointer/escape handlers work with the new search model.
- Validation:
  - `node --check` passed for `script.js`, `events.js`, `init.js`, `state.js`, `mobile-drawer.js`, and `components.js`.
  - desktop browser verification confirmed debouncing (`rto` shows no immediate results, then resolves to `Return to Office (RTO)` plus the full-site action after the delay).
  - desktop browser verification confirmed raw-query submit navigates to `search.html?q=budget+guidance`.
  - desktop browser verification confirmed selecting `Global Digest FAQ` still opens the correct menu path and focuses the matching L3 row.
  - mobile browser verification confirmed the search icon opens the overlay, `Global Messages` resolves after the debounce delay, and activating the first suggestion closes the overlay, opens the mobile menu, and focuses the matched row.

## Current Task (FDICnet Menu Launcher Refinement)
- [x] Tighten launcher matching to visible-title substring behavior with stable ordering.
- [x] Simplify launcher result rows by removing type chips and hiding path text for top-level items.
- [x] Fix launcher results scrolling so keyboard movement only scrolls when the active row leaves the viewport.
- [x] Run targeted syntax and browser verification for `rto`, top-level rows, and launcher scrolling.

## Review / Results (FDICnet Menu Launcher Refinement)
- Updated `sites/fdicnet-main-menu/script.js`:
  - replaced fuzzy weighted launcher scoring with strict normalized title-only substring matching.
  - result ordering is now exact title match, then title prefix match, then other title substring matches, with alphabetical tie-breaks.
  - removed unconditional `scrollIntoView()` on active-row changes and added explicit overflow checks so the list only scrolls when the active option leaves the visible area.
  - launcher rows now omit path text for top-level items and no longer render type chips.
- Updated `sites/fdicnet-main-menu/styles.css`:
  - removed the launcher kind-chip styling.
  - capped the results pane with a stable `max-height` so the dialog stays fixed while only the list scrolls.
- Validation:
  - `node --check sites/fdicnet-main-menu/script.js` passed.
  - browser verification confirmed typing `rto` now returns only `Return to Office (RTO)`.
  - browser verification confirmed top-level `About` renders without a path line, while deeper `About` results still show their path.
  - browser verification confirmed launcher result chips are gone and the results list stays at `scrollTop = 0` for nearby moves, then scrolls only after arrowing far enough to move the active row past the visible list bounds.

## Current Task (FDICnet Menu Launcher)
- [x] Create a feature branch for the launcher exploration and capture the implementation plan.
- [x] Add a keyboard-invoked launcher UI for `fdicnet-main-menu` with accessible open/close and focus handling.
- [x] Build a searchable index from all menu content and render ranked suggestions as the user types.
- [x] Route launcher selections into the existing menu state so matching content opens in context.
- [x] Run targeted syntax/browser verification and record results.

## Review / Results (FDICnet Menu Launcher)
- Created branch `feat/fdicnet-menu-launcher`.
- Updated `sites/fdicnet-main-menu/index.html` and `sites/fdicnet-main-menu/styles.css`:
  - added a modal launcher overlay with search input, results list, status text, backdrop, and responsive styling.
- Updated `sites/fdicnet-main-menu/script.js`, `sites/fdicnet-main-menu/init.js`, and `sites/fdicnet-main-menu/state.js`:
  - added launcher open/close state, keyboard shortcuts (`Ctrl+/`, `Cmd+G`), one-time menu-content indexing from `content.yaml`, ranked suggestion rendering, focus restoration, and launcher selection routing into existing desktop/mobile menu state.
- Updated `sites/fdicnet-main-menu/components.js` and `sites/fdicnet-main-menu/mobile-drawer.js`:
  - added stable launcher target ids to desktop and mobile menu items so launcher selections can focus the matched row after opening the correct path.
- Updated `sites/fdicnet-main-menu/events.js`:
  - guarded the existing global pointer/keyboard handlers so the launcher modal owns `Escape` and click behavior while open.
- Validation:
  - `node --check` passed for `script.js`, `init.js`, `events.js`, `components.js`, `mobile-drawer.js`, and `state.js`.
  - Desktop browser check: `Ctrl+/` opens the launcher, searching `Global Digest FAQ` ranks the deep resource first, and `Enter` opens `News & Events > News > Global Messages` with focus on the `Global Digest FAQ` L3 row.
  - Mobile browser check: `Ctrl+/` opens the launcher at 390px width, searching `Global Messages` returns the direct match first, and `Enter` opens the mobile drawer at the `News` drill view with focus on the matched `Global Messages` trigger.

## Current Task (FDICnet Main Menu Review Fixes)
- [x] Restore correct hidden/inactive behavior for the mobile backdrop.
- [x] Rewire `mobileNavBackdrop` into the event binder contract.
- [x] Render desktop L2 overview entries so existing overview state/keyboard paths work.
- [x] Run targeted syntax and browser verification for the repaired flows.

## Review / Results (FDICnet Main Menu Review Fixes)
- Updated `sites/fdicnet-main-menu/script.js`:
  - restored `mobileNavBackdrop` in the `getDom()` contract passed to `bindFDICMenuEvents(...)`, so the backdrop close handlers bind to the real node again.
- Updated `sites/fdicnet-main-menu/components.js`:
  - rendered the configured L2 overview row (and separator) in the desktop mega-menu, using the existing `l2Overview`/`.l2-item--overview` state and keyboard paths.
- Updated `sites/fdicnet-main-menu/styles.css`:
  - added `.mobile-nav-backdrop[hidden] { display: none !important; }` inside the mobile breakpoint so the author rule no longer overrides the hidden state.
- Validation:
  - `node --check sites/fdicnet-main-menu/*.js` passed.
  - uncached browser evaluation confirms desktop `#l2List` now includes `News Overview`.
  - uncached mobile snapshot no longer exposes a closed backdrop control, and `document.getElementById('mobileNavBackdrop').click()` closes the drawer (`aria-expanded="false"`, backdrop hidden).

## Current Task (FDICnet Main Menu Code Review)
- [x] Read repo guidance, project notes, and lessons relevant to `fdicnet-main-menu`.
- [x] Inspect the site’s HTML, CSS, JS, and content wiring for defects and regressions.
- [x] Run targeted verification (`node --check`, browser snapshot/evaluation) to confirm findings.

## Review / Results (FDICnet Main Menu Code Review)
- Findings identified:
  - mobile backdrop hidden-state regression: author CSS overrides the `hidden` attribute, leaving the closed "Close menu" control exposed to the accessibility tree.
  - mobile backdrop close handlers are not wired because `script.js` does not pass `mobileNavBackdrop` into the event module’s `getDom()` contract.
  - desktop L2 overview support is partially implemented in state/events code but never rendered, so configured overview links are unreachable on desktop.
- Validation:
  - `node --check sites/fdicnet-main-menu/*.js` passed.
  - Playwright mobile snapshot/evaluation confirmed the closed backdrop is still exposed as a "Close menu" button while `hidden === true`.
  - Desktop browser snapshot confirmed `News Overview` is not rendered in the L2 column even though `content.yaml` defines it.

## Current Task (FDICnet Missing Small Font Token)
- [x] Confirm `--ds-font-size-sm` is used in `styles.css` without a matching `:root` definition.
- [x] Add the missing small font token to the shared design-token block.
- [x] Run targeted verification for token definition and usage coverage.

## Review / Results (FDICnet Missing Small Font Token)
- Updated `sites/fdicnet-main-menu/styles.css`:
  - added `--ds-font-size-sm: 14px;` to the shared `:root` design-token block.
  - this resolves `.mobile-drill-context { font-size: var(--ds-font-size-sm); }` against an explicit token instead of inherited fallback.
- Validation:
  - static scan confirms `--ds-font-size-sm` is now defined once in `:root` and consumed by `.mobile-drill-context`.

## Current Task (FDICnet Mobile Drill Back Focus Restoration)
- [x] Confirm `ArrowLeft` and drill-back focus currently fall back to the first mobile item.
- [x] Restore focus to the opener trigger that matches the previously active drill path after backing out.
- [x] Run targeted verification for syntax and focus-target selection.

## Review / Results (FDICnet Mobile Drill Back Focus Restoration)
- Updated `sites/fdicnet-main-menu/events.js`:
  - added `focusMobileDrillReturnTarget(previousPath)` to match parent-view triggers by `data-mobile-drill-path`.
  - `ArrowLeft` drill-back now restores focus to the trigger that originally opened the current view, with the existing first-focusable fallback retained if no matching trigger exists.
  - aligned the `Escape` drill-back path with the same return-focus behavior so both keyboard back paths behave consistently.
- Validation:
  - `node --check sites/fdicnet-main-menu/events.js` passed.
  - code inspection confirms both back-navigation branches capture the pre-back path and use it to restore the matching opener trigger when available.

## Current Task (FDICnet Mobile Drill List Semantics)
- [x] Confirm which mobile drawer list creation paths omit `role="list"`.
- [x] Add explicit list semantics to all mobile drill `<ul>` containers affected by `list-style: none`.
- [x] Run targeted verification for syntax and attribute coverage.

## Review / Results (FDICnet Mobile Drill List Semantics)
- Updated `sites/fdicnet-main-menu/mobile-drawer.js`:
  - added `role="list"` to the shared `.mobile-drill-list` factory used for root, L1, and L2 drill views.
  - added `role="list"` to the explicit `.mobile-drill-link-list` used for L3 link views.
- Validation:
  - `node --check sites/fdicnet-main-menu/mobile-drawer.js` passed.
  - static scan confirms both mobile drill list creation paths now set `role="list"`.

## Current Task (FDICnet Duplicate Desktop Min-Height Media Query)
- [x] Confirm whether the duplicated `@media (min-width: 769px)` block in `styles.css` is identical and redundant.
- [x] Remove the redundant duplicate block while preserving the existing desktop row sizing cascade.
- [x] Run targeted verification for selector coverage and syntax.

## Review / Results (FDICnet Duplicate Desktop Min-Height Media Query)
- Updated `sites/fdicnet-main-menu/styles.css`:
  - removed the second, identical `@media (min-width: 769px)` block that repeated desktop `min-height` and vertical padding rules for `.l1-item`, `.l2-item`, and `.menu-list--l3 .l3-item`.
  - kept the earlier matching block in place as the single source of truth for desktop menu row sizing.
- Validation:
  - static scan confirms only one copy of that desktop row-sizing media query remains.
  - spot check of the surviving block confirms the selectors and values are unchanged.

## Current Task (FDICnet Breadcrumb aria-current Semantics)
- [x] Confirm the current breadcrumb node uses `aria-current="page"` in the mobile drawer.
- [x] Change the current breadcrumb node to use `aria-current="location"` for section context.
- [x] Run targeted verification for syntax and rendered attribute usage.

## Review / Results (FDICnet Breadcrumb aria-current Semantics)
- Updated `sites/fdicnet-main-menu/mobile-drawer.js`:
  - changed the current breadcrumb node from `aria-current="page"` to `aria-current="location"` to better reflect drill-in section context within the mobile menu.
- Validation:
  - `node --check sites/fdicnet-main-menu/mobile-drawer.js` passed.
  - static scan confirms the breadcrumb renderer now sets `aria-current="location"`.

## Current Task (FDICnet Mobile Breadcrumb Separator Accessibility)
- [x] Inspect breadcrumb separator rendering in `mobile-drawer.js` and `styles.css`.
- [x] Replace CSS text-content separator with explicit markup that is hidden from assistive tech.
- [x] Run targeted verification for syntax and separator usage.

## Review / Results (FDICnet Mobile Breadcrumb Separator Accessibility)
- Updated `sites/fdicnet-main-menu/mobile-drawer.js`:
  - breadcrumb rendering now inserts an explicit separator list item between crumbs.
  - separator markup is marked `aria-hidden="true"` and uses an icon glyph instead of spoken text.
- Updated `sites/fdicnet-main-menu/styles.css`:
  - removed the `content: ">"` pseudo-element separator.
  - added styles for `.mobile-drill-context-separator` and `.mobile-drill-context-separator-icon`.
- Validation:
  - `node --check sites/fdicnet-main-menu/mobile-drawer.js` passed.
  - static scan confirms the old `.mobile-drill-context-item + .mobile-drill-context-item::before` rule is gone and the new separator classes are in use.

## Current Task (FDICnet Mobile Backdrop Scope Guard)
- [x] Confirm whether `events.js` references `mobileNavBackdrop` without binding it from `getDom()`.
- [x] Patch the `getDom()` destructure so mobile backdrop handlers use an in-scope DOM reference.
- [x] Run targeted verification for syntax and reference consistency.

## Review / Results (FDICnet Mobile Backdrop Scope Guard)
- Updated `sites/fdicnet-main-menu/events.js`:
  - added `mobileNavBackdrop` to the local `getDom()` destructure used by `bindFDICMenuEvents(...)`.
  - this fixes the runtime `ReferenceError` path in the mobile backdrop `click` and `keydown` handlers.
- Validation:
  - `node --check sites/fdicnet-main-menu/events.js` passed.
  - static reference check confirms `mobileNavBackdrop` is now both destructured and used within the same scope.

## Current Task (FDICnet Menu Density Compromise)
- [x] Set desktop/tablet mega-menu row minimum height to 36px.
- [x] Keep mobile primary drill rows at 44px.
- [x] Reduce mobile secondary rows to 40px.
- [x] Validate computed min-heights across desktop and mobile.

## Review / Results (FDICnet Menu Density Compromise)
- Updated `sites/fdicnet-main-menu/styles.css`:
  - desktop/tablet (`min-width: 769px`): mega-menu row controls (`.l1-item`, `.l2-item`, `.l3-item`) now use `min-height: 36px` with tighter top/bottom padding.
  - mobile (`max-width: 768px`):
    - primary drill controls remain `44px` (`.mobile-drill-trigger`, `.mobile-drill-back`).
    - secondary rows reduced to `40px` (`.mobile-drill-link`, `.mobile-drill-current-link`).
- Validation (computed styles):
  - desktop: L1/L2 rows = `36px` min-height.
  - mobile: root/L2 triggers and back = `44px`; root leaf/current-link rows = `40px`.

## Current Task (FDICnet Standardize Mega/Mobile Menu Text to 16px)
- [x] Set desktop mega-menu link label text to 16px.
- [x] Set mobile drawer menu row text to 16px.
- [x] Verify readability and target sizing remain acceptable.

## Review / Results (FDICnet Standardize Mega/Mobile Menu Text to 16px)
- Updated `sites/fdicnet-main-menu/styles.css`:
  - set `--ds-font-size-md` to `16px` (mobile drawer row typography token).
  - set mega-menu row typography (`.l1-item`, `.l2-item`, `.l3-item`) to `16px`.
  - set third-column description text (`.menu-description`) to `16px` for consistency with menu content.
- Validation:
  - desktop computed styles: L1/L2/description render at `16px`.
  - mobile computed styles: drill trigger/back/crumb text render at `16px` and row min-heights remain unchanged.

## Current Task (FDICnet Close Button Outside Column Hit Targets)
- [x] Move desktop close button into a top-right mega-menu toolbar above columns.
- [x] Remove column-level spacing workaround used to avoid overlap.
- [x] Validate geometry: no close-button intersection with first L3 link target.

## Current Task (FDICnet Remove Desktop Mega-Menu Close Button)
- [x] Remove close button markup and desktop toolbar row.
- [x] Remove close-button event handling and related styles.
- [x] Validate mega-menu layout returns to prior alignment (no extra top push-down).

## Review / Results (FDICnet Remove Desktop Mega-Menu Close Button)
- Updated `sites/fdicnet-main-menu/components.js`:
  - removed `.mega-menu-toolbar` and `.mega-menu-close` markup from desktop mega-menu.
- Updated `sites/fdicnet-main-menu/events.js`:
  - removed click handler branch for `.mega-menu-close`.
- Updated `sites/fdicnet-main-menu/styles.css`:
  - removed `.mega-menu-toolbar` and `.mega-menu-close` styles.
  - removed related column spacing adjustments tied to close-button placement.
- Validation:
  - syntax checks passed for `components.js`, `events.js`, and `script.js`.
  - browser check confirms no close button or toolbar remains and mega-menu top alignment is restored (no added push-down row).

## Review / Results (FDICnet Close Button Outside Column Hit Targets)
- Updated `sites/fdicnet-main-menu/components.js`:
  - moved `.mega-menu-close` into a new `.mega-menu-toolbar` above the three-column grid.
- Updated `sites/fdicnet-main-menu/styles.css`:
  - added `.mega-menu-toolbar` as a dedicated top row with right-aligned close control.
  - removed prior close-button overlap workarounds from column content (`.menu-list--l3` right gutter and extra description padding).
  - keeps toolbar hidden in mobile.
- Validation:
  - desktop geometry check confirms close button remains inside toolbar row and does not intersect first L3 link hitbox (`overlapArea: 0`).
  - close button still closes mega-menu and returns focus to active top-nav button.

## Current Task (FDICnet Reposition Desktop Mega-Menu Close Button)
- [x] Move close button to the upper-right corner of the overall mega-menu container.
- [x] Remove L3 vertical-offset workaround that caused column alignment drift.
- [x] Validate close button no longer overlaps L3 click targets.

## Review / Results (FDICnet Reposition Desktop Mega-Menu Close Button)
- Updated `sites/fdicnet-main-menu/components.js`:
  - moved `.mega-menu-close` out of the L3 column into `.mega-menu-inner` so it sits in the mega-menu corner instead of inside column content.
  - removed temporary `l3-no-description` class toggling.
- Updated `sites/fdicnet-main-menu/styles.css`:
  - made `.mega-menu-inner` positioning context for the close button.
  - removed L3 top-padding workaround.
  - added right-side gutter on L3 list (`.menu-list--l3 { padding-right: 52px; }`) so close button corner space does not overlap link hit targets.
- Validation:
  - desktop geometry check confirmed no overlap between close button and first L3 item (`overlapArea: 0`) while keeping top-right placement.

## Current Task (FDICnet Desktop Close Button Overlap Fix)
- [x] Prevent desktop mega-menu close button from overlapping L3 link hit targets.
- [x] Preserve close button visibility and accessibility.
- [x] Validate no overlap in browser with representative panel state.

## Review / Results (FDICnet Desktop Close Button Overlap Fix)
- Updated `sites/fdicnet-main-menu/components.js`:
  - toggles `l3-no-description` on `.mega-col--l3` when the L3 description is hidden.
  - removes `l3-no-description` in mobile view cleanup path.
- Updated `sites/fdicnet-main-menu/styles.css`:
  - added `z-index` on `.mega-menu-close` and reserved top list space when description is hidden:
    - `.mega-col--l3.l3-no-description .menu-list--l3 { padding-top: 40px; }`
- Validation:
  - desktop browser check on `Benefits > Retirement > Saving for Retirement` confirmed no intersection between close button and first L3 link hitbox (`overlapArea: 0`).

## Current Task (FDICnet Desktop Mega-Menu Close Affordance)
- [x] Add an explicit close button in the desktop mega-menu panel.
- [x] Wire close-button activation to existing menu close behavior with sensible focus return.
- [x] Validate click and keyboard activation of the close control in browser.

## Review / Results (FDICnet Desktop Mega-Menu Close Affordance)
- Updated `sites/fdicnet-main-menu/components.js`:
  - added a `button.mega-menu-close` (aria-label: `Close menu`) inside the desktop L3 panel header area.
- Updated `sites/fdicnet-main-menu/events.js`:
  - added click handling for `.mega-menu-close` to call `closeMenu()` and return focus to the active top-level nav button.
- Updated `sites/fdicnet-main-menu/styles.css`:
  - styled `.mega-menu-close` with hover/focus affordance using shared focus token.
  - increased right padding for `.menu-description` to avoid overlap with the close button.
  - hid `.mega-menu-close` in mobile breakpoint.
- Validation:
  - `node --check` passed for `components.js`, `events.js`, and `script.js`.
  - browser checks confirmed close button is present and visible in desktop mega-menu.
  - scripted activation of close control closes menu and restores focus to active top-nav button.

## Current Task (FDICnet Preserve Mobile Drill Position Across Close/Reopen)
- [x] Persist last mobile drill path on drawer close.
- [x] Restore preserved drill path on reopen when still valid.
- [x] Keep fallback behavior to active panel/root when no valid preserved path exists.
- [x] Validate close/reopen from L2/L3 restores prior location.

## Review / Results (FDICnet Preserve Mobile Drill Position Across Close/Reopen)
- Updated `sites/fdicnet-main-menu/state.js`:
  - added `menuState.lastMobileDrillPath` to persist last closed drawer location.
- Updated `sites/fdicnet-main-menu/script.js`:
  - added `getValidMobileDrillPath(...)` to sanitize/trim drill paths against current content.
  - `setMobileNavOpen(true)` now restores the current valid path, then saved path, then active-panel fallback.
  - `setMobileNavOpen(false)` now snapshots `lastMobileDrillPath` before close transition.
  - `resetPanelSelection()` now clears saved mobile drill path to avoid stale cross-panel restores after desktop panel resets.
- Validation (Chrome DevTools MCP, mobile viewport):
  - close/reopen from L3 path `["news-events",1,1]` restores to `["news-events",1,1]`.
  - close/reopen via backdrop from L2 path `["news-events",2]` restores to `["news-events",2]`.

## Current Task (FDICnet Unified Focus Ring Strategy)
- [x] Define a single tokenized focus ring strategy with standard and contained variants.
- [x] Apply tokens across desktop mega-menu and mobile drawer interactive controls.
- [x] Validate mobile clipping is resolved and desktop focus visibility remains clear.

## Review / Results (FDICnet Unified Focus Ring Strategy)
- Updated `sites/fdicnet-main-menu/styles.css`:
  - introduced shared focus tokens:
    - `--focus-ring-standard-shadow` (desktop/outset)
    - `--focus-ring-contained-shadow` (mobile/inset)
    - `--menu-focus-ring-shadow` (single consumption token)
  - switched menu focus styles to consume `--menu-focus-ring-shadow` across:
    - top-level header controls (`.icon-button`, `.fdic-nav-item`, `.fdic-nav-toggle`)
    - desktop mega-menu rows (`.l1-item`, `.l2-item`, `.l3-item`)
    - mobile drawer rows/crumbs (`.mobile-drill-*`, `.mobile-drill-crumb`)
  - on mobile breakpoint (`max-width: 768px`), set `--menu-focus-ring-shadow` to contained/inset variant to avoid clipping in drawer contexts.
- Validation:
  - syntax checks passed for related JS modules.
  - browser validation via Chrome DevTools MCP confirmed:
    - mobile focused drawer trigger uses inset ring shadow (`inset ...`) from contained token
    - desktop focused L2 item uses standard outset ring shadow (`0 0 0 ...`) from standard token

## Current Task (FDICnet Mobile Breadcrumb Best-Practice Upgrade)
- [x] Replace visible `You are here:` text with semantic breadcrumb UI.
- [x] Make parent breadcrumb nodes clickable to drill up.
- [x] Keep current breadcrumb node non-clickable and SR-friendly.
- [x] Validate breadcrumb navigation behavior in mobile drawer.

## Review / Results (FDICnet Mobile Breadcrumb Best-Practice Upgrade)
- Updated `sites/fdicnet-main-menu/mobile-drawer.js`:
  - replaced plain context text with a semantic breadcrumb nav (`<nav aria-label="Current location"><ol>...</ol></nav>`).
  - parent crumbs now render as buttons wired to `data-mobile-drill-action="set-path"` for direct drill-up.
  - current crumb renders as non-clickable text with `aria-current="page"`.
  - retained orientation phrase as screen-reader-only text (`sr-only`) rather than visible label.
- Updated `sites/fdicnet-main-menu/styles.css`:
  - added breadcrumb styling for list layout, separators, clickable crumb links, and current crumb emphasis.
  - added focus-visible styling for crumb buttons consistent with menu focus tokens.
- Validation:
  - `node --check sites/fdicnet-main-menu/mobile-drawer.js` passed.
  - Mobile browser checks confirmed:
    - deeper path exposes clickable parent crumbs (`News & Events`, `News`) and non-clickable current crumb (`Global Messages`).
    - clicking `News` updates drill path from `[panel, l1, l2]` -> `[panel, l1]`.
    - clicking `News & Events` updates drill path from `[panel, l1]` -> `[panel]`.

## Current Task (FDICnet Mobile Current-Context Indicator)
- [x] Add visible current-context breadcrumb text to the mobile drawer drill views.
- [x] Place context indicator above the list content (not below it).
- [x] Verify context updates across L1/L2/L3 drill levels.

## Review / Results (FDICnet Mobile Current-Context Indicator)
- Updated `sites/fdicnet-main-menu/mobile-drawer.js`:
  - added `renderMobileDrillContext(...)` that renders a lightweight path line (`You are here: ...`) from the active drill path.
  - added `getMobileContextLabels(...)` to derive labels from panel/L1/L2 state.
  - integrated context rendering for panel-level, L1-level, and L2-level drill screens.
  - positioned the context row before the drill list.
- Updated `sites/fdicnet-main-menu/styles.css`:
  - added `.mobile-drill-context` styling (compact secondary text with divider) to visually separate context from list rows.
- Validation:
  - `node --check sites/fdicnet-main-menu/mobile-drawer.js` passed.
  - Browser validation at mobile viewport confirmed:
    - L1: `You are here: News & Events`
    - L2: `You are here: News & Events > News`
    - L3: `You are here: News & Events > News > Global Messages`

## Current Task (FDICnet ArrowUp Exit to Active Top Nav)
- [x] Update desktop mega-menu ArrowUp behavior at column start to focus the active top-level nav button.
- [x] Verify no regressions for ArrowDown/ArrowRight/ArrowLeft/Escape paths.

## Review / Results (FDICnet ArrowUp Exit to Active Top Nav)
- Updated `sites/fdicnet-main-menu/components.js`:
  - when `ArrowUp` is pressed on the first item in an L1/L2/L3 column, the mega-menu now emits `fdic-mega-focus-active-top-nav` instead of wrapping to the last item.
- Updated `sites/fdicnet-main-menu/events.js` + `sites/fdicnet-main-menu/script.js`:
  - added handling to focus the currently active top-level nav button while leaving the mega-menu open.
- Validation:
  - `node --check` passed for `components.js`, `events.js`, `script.js`.
  - Browser checks confirmed:
    - top-of-L1 `ArrowUp` moves focus to active top nav button and keeps menu open
    - top-of-L2 `ArrowUp` does the same
    - re-entry (`ArrowDown`) and column traversal (`ArrowRight`, `ArrowDown`) still work

## Current Task (FDICnet Mega-Menu ArrowDown Second-Press Close Regression)
- [x] Reproduce: Tab to top-nav button, `ArrowDown` to open, `ArrowDown` again closes unexpectedly.
- [x] Fix focus/rerender behavior so in-menu arrow navigation does not trigger close.
- [x] Validate keyboard sequence and no-regression paths in browser.

## Review / Results (FDICnet Mega-Menu ArrowDown Second-Press Close Regression)
- Updated `sites/fdicnet-main-menu/events.js`:
  - focus-driven L1/L2 preview handlers now request focus restoration (`restoreFocus: true`) so keyboard navigation survives render updates.
- Updated `sites/fdicnet-main-menu/script.js`:
  - `setSelectedL1`, `setPreviewL2`, and `setPreviewOverview` now short-circuit unchanged-state calls while still restoring focus when requested.
  - prevents rerender loops and avoids transient focus loss that triggered menu close checks.
- Validation:
  - `node --check` passed for `events.js` and `script.js`.
  - Browser sequence confirmed stable:
    - top-nav focused `ArrowDown` opens/focuses mega-menu
    - second `ArrowDown` advances within L1 and keeps menu open
    - `ArrowRight` to L2 + `ArrowDown` keeps menu open with visible focus ring

## Current Task (FDICnet Top-Nav ArrowDown Open Regression)
- [x] Reproduce desktop ArrowDown open failure from focused top-nav item.
- [x] Fix menu open/close focus race so ArrowDown reliably opens and keeps mega-menu visible.
- [x] Validate keyboard path in browser (`ArrowDown`, `ArrowUp`, `ArrowLeft/Right`, `Escape`) and ensure no regressions.

## Review / Results (FDICnet Top-Nav ArrowDown Open Regression)
- Updated `sites/fdicnet-main-menu/components.js`:
  - ArrowDown activation now sets `forceOpenOnActivate` in addition to `focusMenuOnActivate`.
  - activation event detail now includes `forceOpen`.
- Updated `sites/fdicnet-main-menu/events.js`:
  - forwarded `forceOpen` from `fdic-top-nav-activate` to orchestration.
- Updated `sites/fdicnet-main-menu/script.js`:
  - `activateTopNavPanel(...)` now treats `forceOpen` as a non-toggle intent when the active panel is already open, keeping menu open and moving focus into L1.
- Validation:
  - `node --check` passed for `components.js`, `events.js`, `script.js`.
  - Browser checks confirmed:
    - closed top-nav + `ArrowDown` opens mega-menu and focuses L1
    - open active panel + `ArrowDown` keeps mega-menu open and focuses L1
    - click on active top-nav button still closes the menu (toggle behavior preserved)

## Current Task (FDICnet Mobile Drill aria-expanded Transition Feedback)
- [x] Set active mobile drill trigger `aria-expanded=\"true\"` before drill re-render.
- [x] Add immediate live-region transition announcement for drill trigger activation.
- [ ] Run browser + SR behavior validation.

## Review / Results (FDICnet Mobile Drill aria-expanded Transition Feedback)
- Updated `sites/fdicnet-main-menu/mobile-drawer.js`:
  - when a `.mobile-drill-trigger` is activated, it now sets `aria-expanded=\"true\"` before the panel re-renders.
  - emits immediate live-region text (`Opening {label}.`) prior to render transition.
- Result: screen reader users get deterministic expansion feedback even though the next panel is rebuilt.
- Validation note:
  - JS syntax checks pending in this commit step.

## Current Task (FDICnet Mobile Drawer Landmark/Heading Parity)
- [x] Add named landmark/heading structure per mobile drill level.
- [ ] Run browser validation for screen-reader landmark orientation.

## Review / Results (FDICnet Mobile Drawer Landmark/Heading Parity)
- Updated `sites/fdicnet-main-menu/mobile-drawer.js`:
  - each mobile drill render now creates a named `<section>` region with an `sr-only` `<h2>` and `aria-labelledby`.
  - heading text is context-specific by level (e.g., main sections, panel sections, L1/L2 links).
- Validation note:
  - JS syntax checks pass.
  - Browser/SR runtime validation pending due local Playwright launcher profile conflict.

## Current Task (FDICnet Live Region Announcements)
- [x] Add a visually hidden polite live region for menu context announcements.
- [x] Announce desktop top-level panel switches with item counts.
- [x] Announce mobile drill-level transitions with context + item counts.
- [ ] Run browser validation for SR announcements.

## Review / Results (FDICnet Live Region Announcements)
- Updated `sites/fdicnet-main-menu/index.html`:
  - added `#menuLiveRegion` (`aria-live=\"polite\"`, `aria-atomic=\"true\"`) using existing `.sr-only` treatment.
- Updated `sites/fdicnet-main-menu/script.js`:
  - added `announceMenuContext(...)` utility with dedupe + delayed text swap for reliable SR announcements.
  - added desktop switch announcements in top-level panel activation/preview flows.
  - passed announcement callback into mobile drawer controller.
- Updated `sites/fdicnet-main-menu/mobile-drawer.js`:
  - added mobile drill context announcement helper for root/L1/L2/L3 states, including item counts and back-target context.
- Validation note:
  - JS syntax checks pass.
  - Browser/SR runtime validation still pending due local Playwright launcher profile conflict.

## Current Task (FDICnet Menu Consistency + A11y Staged Delivery)
- [x] Stage 1 (Priority 1): Add hover-intent delay and consistent desktop hover traversal behavior.
- [x] Stage 2 (Priority 2): Align IA cues between desktop and mobile (path context, overview placement, state continuity).
- [x] Stage 3 (Priority 3): Improve accessibility parity (ARIA semantics, mobile back key support, focus containment).
- [x] Stage 4 (Priority 4): Visual/readability polish for dense labels and cross-mode affordance consistency.
- [x] Validate each stage in browser before commit.
- [x] Push branch and open pull request.

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

## Review / Results (Stage 4 - Priority 4)
- Updated `sites/fdicnet-main-menu/components.js` + `styles.css`:
  - added fixed chevron-column spacing for childless desktop L1/L2 rows via `.menu-caret-spacer`.
  - increased desktop menu row rhythm (`line-height: 1.45`, `min-height: 44px`).
- Updated `sites/fdicnet-main-menu/styles.css` (mobile):
  - increased mobile drill row rhythm (`line-height: 1.45`, `min-height: 46px`).
  - reserved right-side spacing for no-child mobile link rows with `::after` spacer.
- Browser validation:
  - Desktop no-child rows retain consistent right-column spacing.
  - Mobile no-child rows maintain consistent trailing spacing and touch-target height.

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

## Current Task (FDICnet Desktop Column Heading Semantics)
- [x] Replace generic desktop column headings with dynamic content-based labels.

## Review / Results (FDICnet Desktop Column Heading Semantics)
- Updated `sites/fdicnet-main-menu/components.js`:
  - desktop `#l1Heading`, `#l2Heading`, `#l3Heading` are now set dynamically in `updateView(...)`.
- Updated `sites/fdicnet-main-menu/script.js`:
  - added content-aware heading labels in the view model:
    - `"{Panel} sections"`
    - `"{Selected L1} links"`
    - `"{Active L2} resources"`
- Result: screen reader column context is meaningful and reflects current content.

## Current Task (FDICnet Active L2 Visual State)
- [x] Add explicit visual styling for the active desktop L2 item (`data-active="true"`).

## Review / Results (FDICnet Active L2 Visual State)
- Updated `sites/fdicnet-main-menu/styles.css`:
  - `.l2-item[data-active="true"]` now has a subtle active background tint and accent left inset border.
  - active L2 label text is underlined to match navigation affordance patterns.
- Result: users can identify the current non-hover baseline L2 item at a glance, and see where L3 will revert after hover preview clears.

## Current Task (FDICnet Top Nav ArrowDown Entry)
- [x] Support `ArrowDown` on desktop top-nav buttons to open/focus into mega-menu.

## Review / Results (FDICnet Top Nav ArrowDown Entry)
- Updated `sites/fdicnet-main-menu/components.js`:
  - `ArrowDown` on a top-nav menu button now triggers activation with `focusMenuOnActivate=true`.
- Result: keyboard users can enter the mega-menu directly from top-nav with ArrowDown (without requiring Enter/Space first).

## Current Task (FDICnet Focus Style Consistency Verification/Update)
- [x] Verify desktop L2 focus visibility behavior in browser automation.
- [x] Remove active-state/focus-style conflict for desktop L2 items.
- [x] Normalize focus ring treatment across desktop mega-menu items and mobile drawer controls.

## Review / Results (FDICnet Focus Style Consistency Verification/Update)
- Root cause identified: `.l2-item[data-active="true"]` used `box-shadow`, which overrode `.l2-item:focus-visible` ring rendering.
- Updated `sites/fdicnet-main-menu/styles.css`:
  - moved active indicator to a pseudo-element rail (`::before`) so it no longer overrides focus ring.
  - introduced shared focus tokens (`--menu-focus-inset`, `--menu-focus-shadow`) and applied them consistently to desktop (`.l2-item`, `.l3-item`) and mobile drawer focus states.
- Updated `sites/fdicnet-main-menu/events.js`:
  - removed recursive refocus on focus-driven preview updates (`restoreFocus: false` on `fromFocus` paths).
- Updated `sites/fdicnet-main-menu/script.js`:
  - expanded transient focus-exit retries before closing mega-menu (3 frames) to reduce accidental close during keyboard rerenders.
- Browser validation:
  - mobile drawer focused controls show the expected shared focus ring.
  - desktop issue fix verified by CSS rule precedence and computed-style path; keyboard handoff behavior remains under active tuning in automation.

## Current Task (FDICnet Manager Feedback Desktop Follow-up 2)
- [ ] Fix desktop active L1 stripe overflow into the top nav.
- [ ] Restore a modest gap between the main nav and mega-menu without breaking row alignment.
- [ ] Extend the L3 surface to the right frame edge and soften the panel shadow.
- [ ] Run browser verification and record results.

## Review / Results (FDICnet Manager Feedback Desktop Follow-up 2)
- Updated `sites/fdicnet-main-menu/styles.css`:
  - moved the desktop mega-menu down by `8px` (`top: calc(100% + 8px)`) so the panel no longer sits flush against the top nav and the L1 accent stripe no longer appears to intrude upward into the main menu.
  - softened the desktop panel shadow to a wider, lower-opacity treatment (`0 18px 44px rgba(0, 18, 32, 0.08)`) so the panel feels less hard-edged.
  - retained the earlier right-edge L3 surface extension and restored the internal top padding so the third-column content has breathing room below the main nav.
- Validation:
  - browser verification after a cache-busted stylesheet reload confirmed the panel gap is now `8px` between the active top-nav item and `.mega-menu-inner`.
  - browser verification confirmed the selected L1 stripe remains constrained to the row (`selectedStripeTop = 0px`, `selectedStripeHeight = 36px`) and no longer visually collides with the top nav once the panel offset is restored.
  - browser verification confirmed the L3 surface still reaches the frame edge (`l3BackgroundGap = 0`, `l3AfterWidth = 20px`).
  - browser verification confirmed the desktop panel now uses the softer shadow `rgba(0, 18, 32, 0.08) 0px 18px 44px 0px`.

## Current Task (FDICnet Manager Feedback Desktop Follow-up 3)
- [x] Restore the active top-nav blue stripe while the mega-menu is open.
- [x] Reattach the desktop mega-menu to the main nav so the panel overlaps the stripe.
- [x] Run browser verification and record results.

## Review / Results (FDICnet Manager Feedback Desktop Follow-up 3)
- Updated `sites/fdicnet-main-menu/styles.css`:
  - restored the active top-nav blue underline for selected/open tabs by setting the selected-state `::after` cue back to visible.
  - moved the underline itself below the tab (`bottom: -4px`) so it reads as a stripe under the main menu instead of a stripe inside the tab.
  - reset the desktop mega-menu to `top: 100%` so the panel sits flush against the bottom edge of the main-menu items and overlaps only the underline area.
- Validation:
  - browser verification after a cache-busted stylesheet reload confirmed the selected/open top-nav item now renders the active underline (`tabAfterOpacity = 1`, `tabAfterHeight = 4px`, `tabAfterBottom = -4px`).
  - browser verification confirmed the mega-menu now starts exactly at the tab bottom edge (`panelTopDelta = 0`) while still overlapping the `4px` underline area (`overlap = 4`).

## Review / Results (FDICnet Manager Feedback Desktop Follow-up 2)
- Updated `sites/fdicnet-main-menu/styles.css`:
  - moved the desktop mega-menu down by `8px` (`top: calc(100

## Review / Results (FDICnet Manager Feedback Desktop Follow-up 4)
- Updated `sites/fdicnet-main-menu/styles.css`:
  - restored the desktop `.fdic-nav` bottom accent stripe while the mega-menu is open instead of zeroing it out.
  - moved the mega-menu to `top: calc(100% - 6px)` so the panel overlaps the nav stripe, not the menu items themselves.
- Validation:
  - browser verification after a cache-busted stylesheet reload confirmed the nav stripe remains present while open (`border-bottom: 6px rgb(132, 219, 255)`).
  - browser verification confirmed the panel still starts at the item bottom edge (`panelVsTabBottom = 0`) while overlapping exactly the `6px` nav stripe (`panelVsNavBottom = -6`, `overlapStripe = 6`).

## Review / Results (FDICnet Manager Feedback Desktop Follow-up 5)
- Updated `sites/fdicnet-main-menu/styles.css`:
  - removed the selected/open tab-specific `::after` underline again so the active main-menu item no longer renders its own blue stripe.
- Validation:
  - browser verification after a cache-busted stylesheet reload confirmed the selected/open tab underline is effectively hidden (`selectedUnderlineOpacity ~= 0`) while the nav-level stripe remains present (`border-bottom-width = 6px`, `border-bottom-color = rgb(132, 219, 255)`).

## Current Task (FDICnet Mega-Menu Row Height Clarification)
- [x] Change desktop mega-menu rows from fixed `36px` height to `36px` minimum height with consistent padding.
- [x] Preserve growth for wrapped row labels while keeping single-line rows at the intended compact height.
- [x] Run browser verification against both single-line and wrapped desktop rows and record results.

## Review / Results (FDICnet Mega-Menu Row Height Clarification)
- Updated `sites/fdicnet-main-menu/styles.css`:
  - removed the fixed desktop `height: 36px` constraint from mega-menu rows and kept `min-height: 36px`.
  - restored stable desktop vertical padding and an explicit `22px` line-height so single-line rows still resolve to `36px` while wrapped rows grow naturally.
- Validation:
  - browser verification confirmed a single-line L1 row (`Forms & Directives`) renders at `36px` with `7px` top/bottom padding.
  - browser verification confirmed a single-line L2 row (`Open Data Plan`) renders at `36px`.
  - browser verification confirmed the wrapped L2 row (`Offshore Outsourcing of Data Services by Insured Institutions & Associated Consumer Privacy Risks`) now grows to `78px` instead of being forced to `36px`.

## Current Task (FDICnet Mega-Menu Scrim and Shadow Tuning)
- [x] Lighten the desktop mega-menu scrim.
- [x] Darken the desktop mega-menu drop shadow.
- [x] Run browser verification and record results.

## Review / Results (FDICnet Mega-Menu Scrim and Shadow Tuning)
- Updated `sites/fdicnet-main-menu/styles.css`:
  - lightened the desktop mega-menu scrim from `rgba(0, 0, 0, 0.2)` to `rgba(0, 0, 0, 0.08)`.
  - changed the desktop panel shadow token to `0 8px 16px rgba(0, 0, 0, 0.25)` to match the tighter, darker shadow direction.
- Validation:
  - browser verification confirmed the open-state scrim now computes to `rgba(0, 0, 0, 0.08)`.
  - browser verification confirmed the panel shadow now computes to `rgba(0, 0, 0, 0.25) 0px 8px 16px 0px`.

## Current Task (FDICnet Mega-Menu Shadow and L3 Hover Fill Fix)
- [x] Allow the desktop mega-menu shadow blur to render fully instead of being clipped.
- [x] Make the L3 hover/focus fill extend to the right frame edge with the same background color as the row.
- [x] Run browser verification and record results.

## Review / Results (FDICnet Mega-Menu Shadow and L3 Hover Fill Fix)
- Updated `sites/fdicnet-main-menu/styles.css`:
  - expanded the desktop mega-menu paint bounds from `clip-path: inset(-6px ...)` to `clip-path: inset(-24px ...)` so the configured shadow blur can render instead of being visibly clipped.
  - changed the L3 hover/focus right-edge extension from an oversized viewport spill to a local `var(--layout-mega-frame-bleed)` extension using the exact same `rgba(0, 110, 190, 0.1)` fill as the hovered row.
- Validation:
  - browser verification confirmed the panel now uses the configured shadow with the expanded paint bounds (`clipPath = inset(-24px -12px)`, `boxShadow = rgba(0, 0, 0, 0.25) 0px 8px 16px 0px`).
  - browser verification confirmed the hovered L3 row and its right-edge extension now match exactly (`l3HoverBg = rgba(0, 110, 190, 0.1)`, `l3HoverAfterBg = rgba(0, 110, 190, 0.1)`, `l3HoverAfterWidth = 12px`).

## Current Task (FDICnet Mega-Menu Left Shadow Clip Fix)
- [x] Expand the desktop mega-menu horizontal paint bounds so the left edge shadow is not clipped.
- [x] Run browser verification against the open desktop menu and record results.

## Review / Results (FDICnet Mega-Menu Left Shadow Clip Fix)
- Updated `sites/fdicnet-main-menu/styles.css`:
  - expanded the desktop mega-menu horizontal paint bounds to `clip-path: inset(-24px)` so the panel shadow can render fully on the left edge instead of being limited by the old `-12px` side insets.
- Validation:
  - browser verification confirmed the panel now computes with `clipPath = inset(-24px)` while preserving the configured `rgba(0, 0, 0, 0.25) 0px 8px 16px 0px` shadow.

## Current Task (FDICnet Mobile Search Sheet Layout Fix)
- [x] Convert the mobile search field to a stable inline row layout instead of reusing desktop absolute button positioning.
- [x] Verify the mobile search sheet at phone width with the search overlay open.
- [x] Record the result and prevention note.

## Review / Results (FDICnet Mobile Search Sheet Layout Fix)
- Updated `sites/fdicnet-main-menu/styles.css`:
  - changed `.site-search-field--mobile` to a three-column inline grid so the input, clear button, and submit button align on one row in the mobile search sheet.
  - made the mobile clear/submit controls use static positioning instead of the desktop absolute-positioned treatment.
  - removed the desktop-only right padding from the mobile search input so the field width is used for the input itself rather than reserving space for overlaid buttons.
- Validation:
  - browser verification at `390x844` with the mobile search overlay open confirmed the field now computes as `display: grid` with columns `306px 36px 0px`.
  - browser verification confirmed the mobile submit button now uses `position: static`, `transform: none`, and sits aligned to the input row instead of dropping down the sheet.

## Current Task (FDICnet Mobile Search Field Consolidation)
- [ ] Move the mobile search clear/submit controls back inside the field container so the sheet presents a single search control.
- [ ] Verify the mobile search overlay at phone width and record results.

## Current Task (FDICnet Mega-Menu Wide Viewport Shadow Clip Fix)
- [x] Expand the desktop mega-menu paint bounds to cover the frame bleed plus shadow blur on wide viewports.
- [x] Verify the open desktop menu in-browser and record results.

## Review / Results (FDICnet Mega-Menu Wide Viewport Shadow Clip Fix)
- Updated `sites/fdicnet-main-menu/styles.css`:
  - expanded the desktop mega-menu paint bounds to `clip-path: inset(-40px)` so the shadow can render beyond both the `20px` frame bleed and the `16px` blur radius on wide viewports.
- Validation:
  - browser verification at `1440x900` confirmed the panel now computes with `clipPath = inset(-40px)`, `frameBleed = 20px`, and the configured shadow `rgba(0, 0, 0, 0.25) 0px 8px 16px 0px`.

## Current Task (FDICnet Mega-Menu Animated Active Rail)
- [ ] Replace the per-row active stripe with a column-level animated rail for desktop L1/L2.
- [ ] Keep existing hover/focus/active row fills while animating the rail on mouse preview and keyboard focus.
- [ ] Run targeted browser verification and record results.

## Review / Results (FDICnet Mega-Menu Animated Active Rail)
- Updated `sites/fdicnet-main-menu/styles.css`:
  - replaced the fixed per-row L1/L2 accent stripes with column-level `::after` rails on `.mega-col--l1` and `.mega-col--l2`.
  - kept the existing row background and underline affordances while moving the blue rail itself onto a transitionable element that animates `transform`, `height`, and `opacity`.
  - removed the old per-row L1/L2 accent stripe rendering so the rail is the single source of truth for the left-edge indicator.
- Updated `sites/fdicnet-main-menu/components.js`:
  - added rail-sync helpers that measure the selected/active row and write the column rail CSS custom properties.
  - updated desktop mouseover and focus-in handlers so the rail follows the currently hovered/focused L1/L2 item immediately, then continues to track render-state changes after preview updates.
- Validation:
  - `node --check sites/fdicnet-main-menu/components.js` passed.
  - browser verification on a fresh local origin (`http://127.0.0.1:4174`) confirmed the updated mega-menu component class is loaded and the column rail pseudo-elements expose transitions on `transform`, `height`, and `opacity`.

## Current Task (FDICnet Mobile Search Overlay Repair)
- [x] Inspect the mobile search sheet DOM/CSS at phone width to identify the layout root cause.
- [x] Patch the mobile search field so input and action controls align correctly in the sheet.
- [x] Verify the fixed mobile search layout in-browser and record the result.

## Review / Results (FDICnet Mobile Search Overlay Repair)
- Updated `sites/fdicnet-main-menu/styles.css`:
  - changed the phone-width `.mobile-search-sheet` from a full-height grid to a simple vertical flex layout so the header, field, and hint no longer stretch across the viewport.
  - hid empty mobile search results and status blocks so the overlay does not reserve dead space when no query has been entered yet.
- Validation:
  - `node --check sites/fdicnet-main-menu/script.js` passed.
  - browser verification at `390x844` confirmed the mobile search sheet now computes as `display: flex`, with the close button at `top: 16px`, the search field at `top: 70px`, and the hint at `top: 124px`.
  - browser verification confirmed the submit button remains anchored inside the input row (`submitOffsetParentClass = mobile-search-input-row`) and the empty results/status blocks are hidden (`display: none`).

## Current Task (FDICnet Inline Mobile Header Search)
- [x] Move the mobile search UI from an overlay/dialog model into an inline masthead row.
- [x] Make the phone-width header grow to fit the search field and push page content down in normal document flow.
- [x] Verify the inline mobile search behavior in-browser and record the result.

## Review / Results (FDICnet Inline Mobile Header Search)
- Updated `sites/fdicnet-main-menu/index.html`:
  - moved `#mobileSearchRow` into the masthead shell so it renders as part of the header instead of as a page-covering overlay.
  - removed the mobile search backdrop and close button markup because the search toggle now acts as the open/close control.
- Updated `sites/fdicnet-main-menu/styles.css`:
  - converted the phone-width masthead layout to a wrapped in-flow layout so the search row can sit below the wordmark and controls.
  - restyled the mobile search container as a normal full-width masthead row with no overlay background, no modal spacing, and no body-scroll lock.
  - kept the mobile suggestions list inline beneath the field and hid empty results/status blocks until they have content.
- Updated `sites/fdicnet-main-menu/events.js` and `sites/fdicnet-main-menu/init.js`:
  - removed the mobile-search modal focus-trap path and the old requirement for backdrop/close elements that no longer exist.
- Validation:
  - `node --check` passed for `sites/fdicnet-main-menu/init.js`, `sites/fdicnet-main-menu/events.js`, and `sites/fdicnet-main-menu/script.js`.
  - browser verification at `390x844` confirmed the masthead grows to `136px`, the inline mobile search row sits at `top: 76px` inside the blue header, and the main content begins immediately after the expanded masthead at `top: 136px`.
  - browser screenshot verification confirmed the mobile search field now appears directly under the wordmark and controls inside the dark blue header, with the content area pushed down rather than covered.

## Current Task (FDICnet Main Menu README)
- [x] Inspect the current fdicnet-main-menu implementation and deployment-relevant files.
- [x] Author a thorough README.md for design, implementation, behavior, and Drupal single-directory-component deployment.
- [x] Review the README against the implementation and record the result.

## Review / Results (FDICnet Main Menu README)
- Added `sites/fdicnet-main-menu/README.md` with contributor-oriented documentation covering:
  - the static prototype architecture and file responsibilities
  - the YAML content model and DOM contract
  - desktop mega-menu, mobile drawer, and shared search behavior
  - accessibility expectations and regression-prone areas
  - local development and verification guidance
  - detailed Drupal Single Directory Component deployment guidance, including the current wrapper architecture and its drift risks
- Review notes:
  - verified the README content against `index.html`, `content.yaml`, `state.js`, `components.js`, `mobile-drawer.js`, `events.js`, `script.js`, `init.js`, and the Drupal wrapper files under `components/fdicnet-main-menu`.
  - explicitly documented that the current SDC Twig wrapper still lags the latest static mobile-search markup, so contributors understand the present integration risk before deploying to Drupal.
