let siteContent = null;
let activePanelKey = null;

const header = document.getElementById("fdicHeader");
const navList = document.getElementById("fdicNavList");
const megaMenu = document.getElementById("megaMenu");
const l1List = document.getElementById("l1List");
const l2List = document.getElementById("l2List");
const l3List = document.getElementById("l3List");
const l3Description = document.getElementById("l3Description");
const l3Column = document.querySelector(".mega-col--l3");
const l1OverviewLink = document.getElementById("l1OverviewLink");
const pageTitle = document.getElementById("pageTitle");
const pageIntro = document.getElementById("pageIntro");
const searchInput = document.querySelector(".search-input input");

let menuOpen = false;
let selectedL1Index = 0;
let selectedL2Index = 0;
let previewL2Index = null;
let previewingOverview = false;
let previewClearTimer = null;

async function loadContent() {
  const response = await fetch("content.yaml", { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Unable to load content.yaml (${response.status})`);
  }
  const text = await response.text();
  return window.jsyaml.load(text);
}

function getPanelConfig() {
  return siteContent?.menu?.panels?.[activePanelKey] || null;
}

function getPanelL1() {
  return getPanelConfig()?.l1 || [];
}

function applyHeaderContent() {
  if (searchInput) {
    searchInput.placeholder = siteContent.header?.searchPlaceholder || "Search";
  }
}

function renderPageContent() {
  pageTitle.textContent = siteContent.page?.title || "";
  pageIntro.innerHTML = "";
  (siteContent.page?.intro || []).forEach((line) => {
    const paragraph = document.createElement("p");
    paragraph.textContent = line;
    pageIntro.appendChild(paragraph);
  });
}

function syncTopNavState() {
  const buttons = navList.querySelectorAll(".fdic-nav-item--button");
  buttons.forEach((button) => {
    const isActive = button.dataset.panelKey === activePanelKey;
    button.classList.toggle("fdic-nav-item--selected", isActive);
    button.setAttribute("aria-expanded", isActive && menuOpen ? "true" : "false");
  });
}

function resetPanelSelection() {
  selectedL1Index = 0;
  selectedL2Index = 0;
  previewL2Index = null;
  previewingOverview = false;
}

function renderTopNav() {
  navList.innerHTML = "";
  const navItems = siteContent.header?.nav || [];

  navItems.forEach((item) => {
    const li = document.createElement("li");
    if (item.kind === "menu") {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "fdic-nav-item fdic-nav-item--button";
      button.dataset.panelKey = item.panelKey || item.id;
      button.setAttribute("aria-controls", "megaMenu");
      button.textContent = item.label;
      button.addEventListener("click", () => {
        const nextPanel = button.dataset.panelKey;
        if (activePanelKey === nextPanel) {
          if (menuOpen) {
            closeMenu();
          } else {
            openMenu();
          }
          return;
        }
        activePanelKey = nextPanel;
        resetPanelSelection();
        renderTopNav();
        renderMenuPanel();
        openMenu();
      });
      li.appendChild(button);
    } else {
      const link = document.createElement("a");
      link.className = "fdic-nav-item";
      link.href = item.href || "#";
      link.textContent = item.label;
      li.appendChild(link);
    }
    navList.appendChild(li);
  });

  syncTopNavState();
}

function openMenu() {
  if (menuOpen) return;
  menuOpen = true;
  megaMenu.hidden = false;
  header.classList.add("menu-open");
  syncTopNavState();
}

function closeMenu() {
  if (!menuOpen) return;
  menuOpen = false;
  header.classList.remove("menu-open");
  megaMenu.hidden = true;
  previewL2Index = null;
  previewingOverview = false;
  renderL2();
  renderL3();
  syncTopNavState();
}

function getSelectedL1() {
  return getPanelL1()[selectedL1Index] || null;
}

function getVisibleL2Index() {
  if (previewL2Index !== null) {
    return previewL2Index;
  }
  return selectedL2Index;
}

function getVisibleL2() {
  const selected = getSelectedL1();
  const items = selected?.l2 || [];
  return items[getVisibleL2Index()] || null;
}

function setSelectedL1(index) {
  selectedL1Index = index;
  selectedL2Index = 0;
  previewL2Index = null;
  previewingOverview = false;
  renderL1();
  renderL2();
  renderL3();
}

function setPreviewL2(index) {
  previewingOverview = false;
  previewL2Index = index;
  renderL2();
  renderL3();
}

function setPreviewOverview() {
  previewL2Index = null;
  previewingOverview = true;
  renderL2();
  renderL3();
}

function clearPreviewL2() {
  if (previewL2Index === null && !previewingOverview) {
    return;
  }
  previewL2Index = null;
  previewingOverview = false;
  renderL2();
  renderL3();
}

function cancelPreviewClear() {
  if (previewClearTimer) {
    window.clearTimeout(previewClearTimer);
    previewClearTimer = null;
  }
}

function schedulePreviewClear() {
  cancelPreviewClear();
  previewClearTimer = window.setTimeout(() => {
    previewClearTimer = null;
    clearPreviewL2();
  }, 120);
}

function renderL1() {
  const selected = getSelectedL1();
  const panel = getPanelConfig();
  l1List.innerHTML = "";

  getPanelL1().forEach((l1Item, index) => {
    const li = document.createElement("li");
    const button = document.createElement("button");
    const label = document.createElement("span");
    const caret = document.createElement("span");

    button.type = "button";
    button.className = "l1-item";
    button.dataset.column = "l1";
    button.dataset.index = String(index);
    button.setAttribute("aria-current", index === selectedL1Index ? "true" : "false");
    button.tabIndex = index === selectedL1Index ? 0 : -1;

    label.className = "l1-label";
    label.textContent = l1Item.label;

    caret.className = "l1-caret ph ph-caret-right";
    caret.setAttribute("aria-hidden", "true");

    button.append(label, caret);
    button.addEventListener("click", () => {
      setSelectedL1(index);
      openMenu();
    });

    li.appendChild(button);
    l1List.appendChild(li);
  });

  l1OverviewLink.textContent = panel?.overviewLabel || selected?.overviewLabel || "Overview";
  l1OverviewLink.href = panel?.overviewHref || selected?.overviewHref || "#";
}

function renderL2() {
  const selectedL1 = getSelectedL1();
  const l2Items = selectedL1?.l2 || [];
  const activeIndex = getVisibleL2Index();
  l2List.innerHTML = "";

  l2Items.forEach((l2Item, index) => {
    const li = document.createElement("li");
    const button = document.createElement("button");
    const isActive = index === activeIndex;

    button.type = "button";
    button.className = "l2-item";
    button.textContent = l2Item.label;
    button.dataset.column = "l2";
    button.dataset.index = String(index);
    button.dataset.active = isActive ? "true" : "false";
    button.tabIndex = index === 0 ? 0 : -1;

    button.addEventListener("mouseenter", () => setPreviewL2(index));
    button.addEventListener("focus", () => setPreviewL2(index));
    button.addEventListener("click", () => {
      selectedL2Index = index;
      previewingOverview = false;
      previewL2Index = index;
      renderL2();
      renderL3();
    });

    li.appendChild(button);
    l2List.appendChild(li);
  });

  const l2Overview = selectedL1?.l2Overview || (
    selectedL1?.overviewLabel || selectedL1?.overviewHref
      ? {
          label: selectedL1?.overviewLabel || `${selectedL1?.label || "Overview"} Overview`,
          href: selectedL1?.overviewHref || "#",
          description: selectedL1?.overviewDescription || "",
        }
      : null
  );
  if (l2Overview) {
    const separatorLi = document.createElement("li");
    separatorLi.className = "l2-separator-item";
    separatorLi.setAttribute("aria-hidden", "true");

    const separatorLine = document.createElement("span");
    separatorLine.className = "l2-separator-line";
    separatorLi.appendChild(separatorLine);
    l2List.appendChild(separatorLi);

    const overviewLi = document.createElement("li");
    const overviewLink = document.createElement("a");
    overviewLink.className = "l2-item l2-item--overview";
    overviewLink.href = l2Overview.href || "#";
    overviewLink.textContent = l2Overview.label || "Overview";
    overviewLink.tabIndex = l2Items.length === 0 ? 0 : -1;
    overviewLink.addEventListener("mouseenter", setPreviewOverview);
    overviewLink.addEventListener("focus", setPreviewOverview);
    overviewLi.appendChild(overviewLink);
    l2List.appendChild(overviewLi);
  }
}

function renderL3() {
  const showingPreview = previewL2Index !== null;
  const selectedL2 = getSelectedL1()?.l2?.[selectedL2Index] || null;
  const previewL2 = getVisibleL2();
  const selectedL1 = getSelectedL1();
  const l2Overview = selectedL1?.l2Overview || (
    selectedL1?.overviewLabel || selectedL1?.overviewHref
      ? {
          label: selectedL1?.overviewLabel || `${selectedL1?.label || "Overview"} Overview`,
          href: selectedL1?.overviewHref || "#",
          description: selectedL1?.overviewDescription || "",
        }
      : null
  );
  const descriptionText = previewingOverview
    ? l2Overview?.description || ""
    : showingPreview
      ? ""
      : selectedL2?.description || "";

  l3Description.textContent = descriptionText;
  l3Description.hidden = !descriptionText;

  l3List.innerHTML = "";
  l3List.hidden = !showingPreview || previewingOverview;

  if (!showingPreview || previewingOverview) {
    return;
  }

  (previewL2?.l3 || []).forEach((l3Item, index) => {
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.className = "l3-item";
    link.href = l3Item.href;
    link.textContent = l3Item.label;
    link.dataset.column = "l3";
    link.dataset.index = String(index);
    link.tabIndex = index === 0 ? 0 : -1;
    li.appendChild(link);
    l3List.appendChild(li);
  });
}

function renderMenuPanel() {
  const panel = getPanelConfig();
  if (!panel) {
    l1List.innerHTML = "";
    l2List.innerHTML = "";
    l3List.innerHTML = "";
    l3Description.textContent = "";
    return;
  }

  megaMenu.setAttribute("aria-label", panel.ariaLabel || "Site menu");
  renderL1();
  renderL2();
  renderL3();
}

function setupColumnArrowNav(container, selector) {
  container.addEventListener("keydown", (event) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    const items = [...container.querySelectorAll(selector)];
    const currentIndex = items.indexOf(document.activeElement);
    if (currentIndex === -1 || items.length === 0) return;

    event.preventDefault();
    let nextIndex = currentIndex;
    if (event.key === "ArrowDown") nextIndex = (currentIndex + 1) % items.length;
    if (event.key === "ArrowUp") nextIndex = (currentIndex - 1 + items.length) % items.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = items.length - 1;

    items.forEach((item) => {
      item.tabIndex = -1;
    });
    items[nextIndex].tabIndex = 0;
    items[nextIndex].focus();
  });
}

function setupEvents() {
  document.addEventListener("pointerdown", (event) => {
    if (menuOpen && !header.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closeMenu();
    const activeButton = navList.querySelector(
      `.fdic-nav-item--button[data-panel-key="${activePanelKey}"]`
    );
    if (activeButton) activeButton.focus();
  });

  l2List.addEventListener("mouseenter", cancelPreviewClear);
  l2List.addEventListener("mouseleave", (event) => {
    if (l3Column && l3Column.contains(event.relatedTarget)) {
      return;
    }
    schedulePreviewClear();
  });

  if (l3Column) {
    l3Column.addEventListener("mouseenter", cancelPreviewClear);
    l3Column.addEventListener("mouseleave", (event) => {
      if (l2List.contains(event.relatedTarget)) {
        return;
      }
      schedulePreviewClear();
    });
    l3Column.addEventListener("focusin", cancelPreviewClear);
    l3Column.addEventListener("focusout", (event) => {
      const nextFocusTarget = event.relatedTarget;
      if (
        nextFocusTarget &&
        (l3Column.contains(nextFocusTarget) || l2List.contains(nextFocusTarget))
      ) {
        return;
      }
      clearPreviewL2();
    });
  }

  l2List.addEventListener("focusout", (event) => {
    const nextFocusTarget = event.relatedTarget;
    if (
      nextFocusTarget &&
      (l2List.contains(nextFocusTarget) || (l3Column && l3Column.contains(nextFocusTarget)))
    ) {
      return;
    }
    if (!l2List.contains(nextFocusTarget)) {
      clearPreviewL2();
    }
  });

  setupColumnArrowNav(l1List, ".l1-item");
  setupColumnArrowNav(l2List, ".l2-item");
  setupColumnArrowNav(l3List, ".l3-item");
}

async function init() {
  try {
    siteContent = await loadContent();
  } catch (error) {
    console.error("Failed to load site content:", error);
    return;
  }

  const navMenuItem = (siteContent.header?.nav || []).find((item) => item.kind === "menu");
  activePanelKey = siteContent.menu?.defaultPanel || navMenuItem?.panelKey || navMenuItem?.id || null;

  applyHeaderContent();
  renderTopNav();
  renderPageContent();
  renderMenuPanel();
  setupEvents();
  megaMenu.hidden = true;

  if (siteContent.menu?.openByDefault) {
    openMenu();
  }
}

init();
