# Empty Column 2 Ghost Prompt Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove auto-selection of the first L1 item on menu open; show a ghost prompt in column 2 until the user hovers or focuses an L1 category.

**Architecture:** Change `getDefaultL1Index()` to return `null`, propagate null through the view model as `showEmptyState: true`, render a ghost prompt `<p>` in the component when empty, add one CSS class for styling.

**Tech Stack:** Vanilla JS, CSS — no build tools or test framework.

**Design doc:** `docs/plans/2026-03-19-empty-column2-ghost-prompt-design.md`

---

### Task 1: Change `getDefaultL1Index` to return `null`

**Files:**
- Modify: `sites/fdicnet-main-menu/script.js:208-211`

**Step 1: Update `getDefaultL1Index`**

Change the function at line 208 from:

```js
function getDefaultL1Index(panel = getPanelConfig()) {
  const l1Items = panel?.l1 || [];
  return l1Items.length > 1 ? 1 : 0;
}
```

to:

```js
function getDefaultL1Index(panel = getPanelConfig()) {
  const l1Items = panel?.l1 || [];
  return l1Items.length > 1 ? null : 0;
}
```

**Step 2: Verify manually**

Open the menu in a browser. The menu should open but may break visually — that's expected; we haven't updated the view model or component yet. Confirm via console that `menuState.selectedL1Index` is `null` after opening a panel.

**Step 3: Commit**

```bash
git add sites/fdicnet-main-menu/script.js
git commit -m "feat(fdicnet-menu): return null from getDefaultL1Index for multi-item panels"
```

---

### Task 2: Propagate `null` selection through the view model

**Files:**
- Modify: `sites/fdicnet-main-menu/script.js:983-1044` (getMegaMenuViewModel)

**Step 1: Add `showEmptyState` to the view model**

In `getMegaMenuViewModel()`, after the existing `const l1Items = ...` block (around line 995), the function already computes `selectedL1` from `menuState.selectedL1Index`. When `selectedL1Index` is `null`, `selectedL1` will be `null` and `l2Items` will be `[]`, `l2Overview` will be `null` — all correct by default.

Add `showEmptyState` to the return object at line 1024. Change:

```js
  return {
    panelKey: menuState.activePanelKey || "",
    panelLabel: panel?.ariaLabel || "Site menu",
    isMobile: isMobileViewport(),
```

to:

```js
  return {
    panelKey: menuState.activePanelKey || "",
    panelLabel: panel?.ariaLabel || "Site menu",
    isMobile: isMobileViewport(),
    showEmptyState: menuState.selectedL1Index === null,
```

**Step 2: Guard `selectedL1Index` in L1 item rendering**

In the same function, around line 996, the code does:
```js
const rawSelectedL1 = rawL1Items[menuState.selectedL1Index] || null;
const selectedL1 = l1Items[menuState.selectedL1Index] || null;
```

When `selectedL1Index` is `null`, `rawL1Items[null]` returns `undefined`, so `rawSelectedL1` and `selectedL1` become `null`. This is correct — no change needed here.

**Step 3: Ensure `aria-expanded` is `"false"` for all L1 buttons in null state**

In `components.js` at line 523, the existing code:
```js
control.setAttribute("aria-expanded", index === selectedL1Index ? "true" : "false");
```

When `selectedL1Index` is `null`, `index === null` is always false, so all buttons get `aria-expanded="false"`. Correct — no change needed.

**Step 4: Ensure `data-selected` is `"false"` for all L1 items in null state**

In `components.js` at line 518:
```js
control.dataset.selected = index === selectedL1Index ? "true" : "false";
```

Same logic — `index === null` is false. Correct — no change needed.

And at line 479 for the overview link:
```js
overviewLink.dataset.selected = selectedL1Index === 0 ? "true" : "false";
```

When `selectedL1Index` is `null`, `null === 0` is false. Correct — no change needed.

**Step 5: Commit**

```bash
git add sites/fdicnet-main-menu/script.js
git commit -m "feat(fdicnet-menu): add showEmptyState flag to mega-menu view model"
```

---

### Task 3: Render the ghost prompt in the component

**Files:**
- Modify: `sites/fdicnet-main-menu/components.js:404-423` (updateView signature)
- Modify: `sites/fdicnet-main-menu/components.js:548-560` (L2 rendering block)

**Step 1: Add `showEmptyState` to the `updateView` destructured parameters**

At line 404, add `showEmptyState = false` to the parameter list. Change:

```js
  updateView({
    panelKey = "",
    panelLabel = "Site menu",
    isMobile = false,
    l1Items = [],
    selectedL1Index = 0,
    l1FocusIndex = 0,
    l1Description = "",
    l2Items = [],
    activeL2Index = 0,
    l2Overview = null,
    previewingOverview = false,
    showingPreview = false,
    l3Items = [],
    l2Description = "",
    l3Description = "",
    l1HeadingLabel = "Menu sections",
    l2HeadingLabel = "Section links",
    l3HeadingLabel = "Resources",
  } = {}) {
```

to:

```js
  updateView({
    panelKey = "",
    panelLabel = "Site menu",
    isMobile = false,
    showEmptyState = false,
    l1Items = [],
    selectedL1Index = 0,
    l1FocusIndex = 0,
    l1Description = "",
    l2Items = [],
    activeL2Index = 0,
    l2Overview = null,
    previewingOverview = false,
    showingPreview = false,
    l3Items = [],
    l2Description = "",
    l3Description = "",
    l1HeadingLabel = "Menu sections",
    l2HeadingLabel = "Section links",
    l3HeadingLabel = "Resources",
  } = {}) {
```

**Step 2: Render ghost prompt when `showEmptyState` is true**

After the L2 list is cleared at line 548 (`this.l2List.innerHTML = "";`), add an early return for the empty state. Insert this block right after `this.l2List.innerHTML = "";`:

```js
    if (showEmptyState) {
      this.l2Description.textContent = "";
      this.l2Description.hidden = true;
      delete this.l2Column?.dataset.columnIntro;
      this.l2List.classList.remove("menu-list--with-column-intro");

      const hintLi = document.createElement("li");
      hintLi.setAttribute("role", "presentation");
      const hint = document.createElement("p");
      hint.className = "menu-empty-hint";
      hint.textContent = "Select a category to see its links";
      hintLi.appendChild(hint);
      this.l2List.appendChild(hintLi);

      this.l3List.innerHTML = "";
      this.l3List.hidden = true;
      this.l3Description.textContent = "";
      this.l3Description.hidden = true;
      this.updateColumnRails();
      return;
    }
```

The full block at line 548 becomes:

```js
    this.l2List.innerHTML = "";

    if (showEmptyState) {
      this.l2Description.textContent = "";
      this.l2Description.hidden = true;
      delete this.l2Column?.dataset.columnIntro;
      this.l2List.classList.remove("menu-list--with-column-intro");

      const hintLi = document.createElement("li");
      hintLi.setAttribute("role", "presentation");
      const hint = document.createElement("p");
      hint.className = "menu-empty-hint";
      hint.textContent = "Select a category to see its links";
      hintLi.appendChild(hint);
      this.l2List.appendChild(hintLi);

      this.l3List.innerHTML = "";
      this.l3List.hidden = true;
      this.l3Description.textContent = "";
      this.l3Description.hidden = true;
      this.updateColumnRails();
      return;
    }

    this.l2Description.textContent = l2Description || "";
    // ... rest of existing L2 rendering continues unchanged
```

**Step 3: Verify manually**

Open the menu. Column 2 should show "Select a category to see its links" as plain text. Column 3 should be empty. Hover an L1 category — column 2 should populate with its links.

**Step 4: Commit**

```bash
git add sites/fdicnet-main-menu/components.js
git commit -m "feat(fdicnet-menu): render ghost prompt in column 2 when no L1 is selected"
```

---

### Task 4: Style the ghost prompt

**Files:**
- Modify: `sites/fdicnet-main-menu/styles.css` (add after the `.menu-description` block, around line 1144)

**Step 1: Add the `.menu-empty-hint` CSS rule**

Add immediately after the `.menu-description` rule block (after line 1144):

```css
.menu-empty-hint {
  padding: 8px 24px;
  color: var(--ds-text-secondary);
  font-size: 15px;
  font-weight: 400;
  line-height: 1.45;
  opacity: 0.7;
  margin: 0;
}
```

**Step 2: Verify manually**

Open the menu. The ghost prompt should appear in column 2 with muted secondary text at 70% opacity. It should feel quiet and unobtrusive — clearly a hint, not content.

**Step 3: Commit**

```bash
git add sites/fdicnet-main-menu/styles.css
git commit -m "feat(fdicnet-menu): add ghost prompt styling for empty column 2 state"
```

---

### Task 5: Fix edge cases in state transitions

**Files:**
- Modify: `sites/fdicnet-main-menu/script.js:899-921` (setSelectedL1)

**Step 1: Handle transition from `null` to an index**

The existing `selectionUnchanged` check at line 900 compares `menuState.selectedL1Index === index`. When transitioning from `null` to `1`, `null === 1` is false, so the function proceeds correctly. No change needed.

**Step 2: Handle `focusSelectedL1` when index is `null`**

Check `focusSelectedL1` at line 1078 — it calls `megaMenuHost?.focusSelectedL1()`. Look at the component's `focusSelectedL1`:

```js
focusSelectedL1() {
  const target = this.l1List?.querySelector('.l1-item[data-selected="true"]');
  return this.setColumnFocus(this.l1Column, ".l1-item", target);
}
```

When no item has `data-selected="true"`, `target` is `null`. The `setColumnFocus` method should handle a null target gracefully — check it does. If not, guard:

In `script.js`, update `activateTopNavPanel` at line 691. The line:
```js
if (!focusSelectedL1()) {
```

This already handles the false return. No change needed.

**Step 3: Verify the `getVisibleL2Index` and `getVisibleL2` functions**

In `state.js:54-61`:
```js
function getVisibleL2Index(previewL2Index, selectedL2Index) {
  if (previewL2Index !== null) return previewL2Index;
  return selectedL2Index;
}

function getVisibleL2(selectedL1, visibleL2Index) {
  const items = selectedL1?.l2 || [];
  return items[visibleL2Index] || null;
}
```

When `selectedL1` is `null`, `getVisibleL2` returns `null`. When `selectedL2Index` is `0` (its initial value), `getVisibleL2Index` returns `0`. But since `selectedL1` is null, `getVisibleL2` returns `null` anyway. Correct — no change needed.

**Step 4: Verify manually — full interaction flow**

1. Open any mega-menu panel → column 2 shows ghost prompt, column 3 empty, no L1 selected
2. Hover an L1 category with children → column 2 populates, ghost prompt gone
3. Move hover to another L1 category → column 2 updates to that category's links
4. Switch to a different top-nav panel → column 2 resets to ghost prompt
5. Tab into the menu with keyboard → arrow to an L1 button, press Enter or let focus trigger selection → column 2 populates
6. Open menu on mobile → drill-down works normally, unaffected

**Step 5: Commit (only if changes were needed)**

```bash
git add sites/fdicnet-main-menu/script.js
git commit -m "fix(fdicnet-menu): guard edge cases for null selectedL1Index"
```

---

### Task 6: Final verification and cleanup

**Step 1: Cross-browser check**

Test in at least Chrome and Firefox (Safari if available):
- Desktop: all 6 verification steps from Task 5
- Tablet breakpoint (769–1049px): same behavior, narrower columns
- Mobile (≤768px): drill-down unaffected

**Step 2: Verify no console errors**

Open DevTools console. Navigate through all panels. No errors should appear.

**Step 3: Final commit if any cleanup was needed**

```bash
git add -A
git commit -m "chore(fdicnet-menu): final cleanup for empty column 2 state"
```
