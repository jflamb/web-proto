# TODO

## Current Task (FDICnet Main Menu High-Priority Accessibility Issues #1-#4)
- [x] Create a dedicated branch for issues #1, #2, #3, and #4.
- [x] Post implementation-plan comments on each GitHub issue with acceptance criteria and verification notes.
- [x] Fix issue #1 by converting L2 selection controls from links-with-preventDefault semantics to button semantics.
- [x] Fix issue #2 by setting L1 roving tabindex initial focus target to the currently selected L1 item.
- [x] Fix issue #3 by adding a clearly visible focus indicator for `.overview-link:focus-visible`.
- [x] Fix issue #4 by adding a full-element focus indicator for `.fdic-nav-item:focus-visible` (without removing existing selected/hover behavior).
- [x] Run verification checks (`node --check`, targeted source grep, and basic interaction sanity validation).
- [ ] Commit changes, push branch, and open a PR that references all four issues.

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
