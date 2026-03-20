# L1 Column Intro Description — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a panel-level description below the overview link in the L1 column
of the mega-menu, mirroring the existing L2 inline intro pattern, on both
desktop and mobile.

**Architecture:** A new `description` field on each panel in content.yaml feeds
through the view model (`l1Description`) into the desktop mega-menu component
and the mobile drawer renderer. The desktop rendering mirrors the existing L2
inline intro pattern (description div inside the overview `<li>`, column
`data-column-intro` attribute, CSS rules). The mobile rendering adds an overview
link + description at the top of the L1 drill view.

**Tech Stack:** Vanilla JS, CSS, YAML content data

**Design doc:** `docs/plans/2026-03-19-l1-column-intro-description-design.md`

---

### Task 1: Add `description` to each panel in content.yaml

**Files:**
- Modify: `sites/fdicnet-main-menu/content.yaml:38-41, 140-143, 671-674, 2642-2645, 3153-3156, 4770-4773`

**Step 1: Add `description` field to each panel**

Insert a `description:` line after `overviewHref:` in each of the 6 panel
configs:

```yaml
# line 41 — after overviewHref in news-events
      description: "Stay current with FDIC announcements, upcoming events, and multimedia content."

# line 143 — after overviewHref in career-development
      description: "Find training programs, job opportunities, and professional development resources to grow your career at the FDIC."

# line 674 — after overviewHref in knowledge-base
      description: "Access policies, procedures, reference materials, and institutional knowledge across all FDIC divisions."

# line 2645 — after overviewHref in benefits
      description: "Review your compensation, health coverage, retirement options, and other employee benefit programs."

# line 3156 — after overviewHref in employee-services
      description: "Get help with IT, workplace, travel, library, and day-to-day operational support."

# line 4773 — after overviewHref in about
      description: "Learn about the FDIC's mission, organizational structure, regional offices, and workplace initiatives."
```

**Step 2: Verify YAML parses**

Open the page in a browser and confirm the console has no YAML parse errors.
The menu should load and behave identically to before (description is not
consumed yet).

**Step 3: Commit**

```
feat(fdicnet-menu): add panel descriptions to content.yaml
```

---

### Task 2: Pass `l1Description` through the view model in script.js

**Files:**
- Modify: `sites/fdicnet-main-menu/script.js:1024-1042`

**Step 1: Add `l1Description` to the view model return**

In `getMegaMenuViewModel()`, add `l1Description` to the returned object. Insert
it after `l1FocusIndex`:

```js
// In the return object at ~line 1024, after l1FocusIndex:
l1Description: panel?.description || "",
```

The full return becomes:

```js
return {
    panelKey: menuState.activePanelKey || "",
    panelLabel: panel?.ariaLabel || "Site menu",
    isMobile: isMobileViewport(),
    l1Items,
    selectedL1Index: menuState.selectedL1Index,
    l1FocusIndex: menuState.l1FocusIndex,
    l1Description: panel?.description || "",
    l2Items: selectedL1?.l2 || [],
    // ... rest unchanged
};
```

**Step 2: Verify no errors**

Reload the page. The menu should work identically — the new field is passed but
not consumed by the component yet.

**Step 3: Commit**

```
feat(fdicnet-menu): pass l1Description through mega-menu view model
```

---

### Task 3: Render L1 inline intro in the desktop mega-menu component

**Files:**
- Modify: `sites/fdicnet-main-menu/components.js:404-486`

**Step 1: Accept `l1Description` in `updateView()`**

Add `l1Description = ""` to the destructured parameters at line 404:

```js
updateView({
    panelKey = "",
    panelLabel = "Site menu",
    isMobile = false,
    l1Items = [],
    selectedL1Index = 0,
    l1FocusIndex = 0,
    l1Description = "",          // ← add this
    l2Items = [],
    // ... rest unchanged
```

**Step 2: Add L1 column intro logic**

After `this.l1List.innerHTML = "";` (line 451), add column-intro state
management — mirroring lines 530-541 for L2:

```js
this.l1List.innerHTML = "";
const hasL1ColumnIntro = Boolean(l1Description);
if (this.l1Column) {
  if (hasL1ColumnIntro) {
    this.l1Column.dataset.columnIntro = "true";
  } else {
    delete this.l1Column.dataset.columnIntro;
  }
}
this.l1List.classList.toggle("menu-list--with-column-intro", hasL1ColumnIntro);
```

**Step 3: Add inline intro description inside the overview `<li>`**

Inside the `if (overviewItem)` block, after `overviewLi.appendChild(overviewLink)`
(line 473) and before `this.l1List.appendChild(overviewLi)` (line 474), add:

```js
overviewLi.appendChild(overviewLink);
if (hasL1ColumnIntro && l1Description) {
  const columnIntroDescription = document.createElement("div");
  columnIntroDescription.className = "menu-description menu-description--l1 menu-description--l1-inline-intro";
  columnIntroDescription.textContent = l1Description;
  overviewLi.appendChild(columnIntroDescription);
}
this.l1List.appendChild(overviewLi);
```

**Step 4: Clear L1 column intro in mobile path**

In the `if (isMobile)` early-return block (lines 434-447), add cleanup for the
L1 column intro, after the existing L2 cleanup:

```js
// After the existing L2 column-intro cleanup (~line 440):
this.l1Column?.removeAttribute("data-column-intro");
this.l1List?.classList.remove("menu-list--with-column-intro");
```

**Step 5: Verify in browser**

Reload the page at desktop width. The L1 column should now show a description
below the overview link. Switch between panels — each should show its own
description. The text won't be styled correctly yet (that's next task).

**Step 6: Commit**

```
feat(fdicnet-menu): render L1 inline intro description in desktop mega-menu
```

---

### Task 4: Add L1 intro CSS rules

**Files:**
- Modify: `sites/fdicnet-main-menu/styles.css:1155-1173`

**Step 1: Add L1-specific CSS rules**

After the existing `.menu-description--l2-inline-intro` block (line 1155-1158),
add L1 rules that parallel the L2 ones:

```css
.menu-description--l1-inline-intro {
  padding-top: 4px;
  padding-bottom: 10px;
}

.mega-col--l1[data-column-intro="true"] .menu-description--l1 {
  max-width: 65ch;
}

.menu-list--with-column-intro .l1-item--overview {
  margin-top: 0;
  padding-top: 2px;
  padding-bottom: 8px;
}

.menu-list--with-column-intro .l1-separator-item {
  display: block;
  margin: 0 24px 10px;
}

.menu-list--with-column-intro .l1-separator-line {
  border-top-color: rgba(9, 53, 84, 0.12);
}
```

Note: The `.l1-separator-item` currently has `display: none` (line 1020-1022).
The `.menu-list--with-column-intro` rule overrides this to show the divider
when a column intro is present, matching the L2 separator behavior.

**Step 2: Verify in browser**

Reload the page at desktop width. The L1 column should now show:
- The overview link with reduced top padding
- The description text below it in secondary text color
- A subtle divider line separating the intro from the section list

Switch panels to confirm each description renders correctly. Resize to mobile
width to confirm the desktop styles don't apply (mobile rendering is next task).

**Step 3: Commit**

```
feat(fdicnet-menu): add L1 column intro CSS rules
```

---

### Task 5: Add overview link + description to mobile L1 drill view

**Files:**
- Modify: `sites/fdicnet-main-menu/mobile-drawer.js:293-328`

**Step 1: Add overview link and description before primary items**

In `renderMobileDrillL1`, after the list is created (line 296) and before the
`primaryItems.forEach` loop (line 301), add the overview link and panel
description — mirroring what `renderMobileDrillL2` does at lines 341-350:

```js
const list = createMobileDrillList();

if (hasOverviewRow) {
  const panelLabel = getPanelLabel(panelKey, panelConfig);
  appendMobileDrillLinkItem(
    list,
    panelLabel,
    panelConfig.overviewHref || "#",
    `panel:${panelKey}`
  );
  appendMobileDrillDescriptionItem(list, panelConfig.description || "");
}

primaryItems.forEach((l1Item, orderIndex) => {
```

**Step 2: Remove the now-redundant bottom overview item**

The current code (lines 311-326) appends the overview item at the bottom of the
list with a divider. Since the overview link is now at the top (with the
description), remove this entire block:

```js
// DELETE this block (lines 311-326):
if (hasOverviewRow) {
  const divider = document.createElement("li");
  // ... divider code ...
  const overviewItem = l1Items[0];
  appendMobileDrillItem(list, overviewItem.label || "Overview", [panelKey, 0], {
    // ...
  });
}
```

**Step 3: Verify in browser**

Resize to phone width (≤640px if using the nav toggle, ≤768px for mobile nav).
Open the menu, tap into a panel. The L1 drill view should now show:
- Back button to main menu
- Panel overview link at the top
- Panel description text below it
- Primary L1 items below that

Navigate between panels to confirm each shows its own description. Verify that
the old bottom overview item is gone.

**Step 4: Commit**

```
feat(fdicnet-menu): add overview link and description to mobile L1 drill view
```

---

### Task 6: Final verification

**Step 1: Desktop verification**

- Open the page at desktop width (>768px)
- Click each of the 6 nav tabs and confirm column 1 shows:
  - Overview link at top
  - Description below it
  - Divider
  - Section items
- Confirm column 2 still shows its own description (no regression)
- Confirm keyboard navigation still works (ArrowDown into L1, Tab, etc.)

**Step 2: Mobile verification**

- Resize to mobile width (≤768px)
- Open the menu drawer
- Tap into each panel and confirm the L1 drill view shows the overview link +
  description at the top
- Navigate back and forward between panels
- Use the `/` keyboard shortcut to open search, then navigate to a menu entry —
  confirm the mobile drill view still renders correctly after search navigation

**Step 3: Commit all if not already committed, and mark complete**
