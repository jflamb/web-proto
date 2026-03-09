const menuState = {
  siteContent: null,
  activePanelKey: null,
  menuOpen: false,
  selectedL1Index: 0,
  selectedL2Index: 0,
  previewL2Index: null,
  previewingOverview: false,
  previewClearTimer: null,
  topNavFocusIndex: 0,
  mobileNavOpen: false,
  mobileSearchOpen: false,
  mobileNavCloseHandler: null,
  closeTransitionHandler: null,
  l1FocusIndex: 0,
  suppressL2HoverPreview: false,
  moveFocusIntoMenuOnOpen: false,
  closeHideTimer: null,
  mobileDrillPath: [],
};

const MOBILE_NAV_BREAKPOINT = "(max-width: 768px)";
const NARROW_HEADER_BREAKPOINT = "(max-width: 1049px)";
const PHONE_SEARCH_BREAKPOINT = "(max-width: 640px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const mobileNavMediaQuery = window.matchMedia(MOBILE_NAV_BREAKPOINT);
const narrowHeaderMediaQuery = window.matchMedia(NARROW_HEADER_BREAKPOINT);
const phoneSearchMediaQuery = window.matchMedia(PHONE_SEARCH_BREAKPOINT);
const reduceMotionMediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);

const header = document.getElementById("fdicHeader");
const navList = document.getElementById("fdicNavList");
const navToggle = document.getElementById("fdicNavToggle");
const megaMenu = document.getElementById("megaMenu");
const l1List = document.getElementById("l1List");
const l2List = document.getElementById("l2List");
const l3List = document.getElementById("l3List");
const l3Description = document.getElementById("l3Description");
const l3Column = document.querySelector(".mega-col--l3");
const l1Column = document.querySelector(".mega-col--l1");
const mobileMenu = document.getElementById("mobileMenu");
const l1OverviewLink = document.getElementById("l1OverviewLink");
const pageTitle = document.getElementById("pageTitle");
const pageIntro = document.getElementById("pageIntro");
const desktopSearchInput = document.getElementById("desktopSearchInput");
const mobileSearchToggle = document.getElementById("mobileSearchToggle");
const mobileSearchRow = document.getElementById("mobileSearchRow");
const mobileSearchInput = document.getElementById("mobileSearchInput");
const mobileNavBackdrop = document.getElementById("mobileNavBackdrop");

function getMissingRequiredElements() {
  const requiredElements = [
    ["fdicHeader", header],
    ["fdicNavList", navList],
    ["fdicNavToggle", navToggle],
    ["megaMenu", megaMenu],
    ["l1List", l1List],
    ["l2List", l2List],
    ["l3List", l3List],
    ["l3Description", l3Description],
    ["mobileMenu", mobileMenu],
    ["l1OverviewLink", l1OverviewLink],
    ["pageTitle", pageTitle],
    ["pageIntro", pageIntro],
    ["desktopSearchInput", desktopSearchInput],
    ["mobileSearchToggle", mobileSearchToggle],
    ["mobileSearchRow", mobileSearchRow],
    ["mobileSearchInput", mobileSearchInput],
    ["mobileNavBackdrop", mobileNavBackdrop],
  ];
  return requiredElements
    .filter(([, element]) => !element)
    .map(([name]) => name);
}

async function loadContent() {
  const scriptEl = document.querySelector('script[src$="script.js"]');
  const scriptSrc = scriptEl?.getAttribute("src") || "script.js";
  const candidateUrls = [
    new URL("content.yaml", window.location.href).toString(),
    new URL("content.yaml", window.location.origin + window.location.pathname.replace(/\/?$/, "/")).toString(),
    new URL("content.yaml", new URL(scriptSrc, window.location.href)).toString(),
  ];
  const dedupedUrls = [...new Set(candidateUrls)];

  let lastError = null;
  for (const url of dedupedUrls) {
    try {
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) {
        lastError = new Error(`Unable to load content.yaml from ${url} (${response.status})`);
        continue;
      }
      const text = await response.text();
      return window.jsyaml.load(text);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error("Unable to load content.yaml from any known URL");
}

function renderContentLoadFallback() {
  pageTitle.textContent = "FDICnet Main Menu Prototype";
  pageIntro.innerHTML = "";
  const fallbackLines = [
    "Menu content is temporarily unavailable because the configuration file could not be loaded.",
    "Try refreshing the page. If the issue persists, verify that content.yaml is reachable from this page URL.",
  ];
  fallbackLines.forEach((line) => {
    const paragraph = document.createElement("p");
    paragraph.textContent = line;
    pageIntro.appendChild(paragraph);
  });
  megaMenu.hidden = true;
  megaMenu.setAttribute("aria-hidden", "true");
}

function getPanelConfig() {
  return menuState.siteContent?.menu?.panels?.[menuState.activePanelKey] || null;
}

function getPanelConfigByKey(panelKey) {
  return menuState.siteContent?.menu?.panels?.[panelKey] || null;
}

function getMobilePanelKeys() {
  return (menuState.siteContent?.header?.nav || [])
    .filter((item) => item.kind === "menu")
    .map((item) => item.panelKey || item.id)
    .filter(Boolean);
}

function getPanelL1() {
  return getPanelConfig()?.l1 || [];
}

function applyHeaderContent() {
  const placeholder = menuState.siteContent.header?.searchPlaceholder || "Search";
  if (desktopSearchInput) desktopSearchInput.placeholder = placeholder;
  if (mobileSearchInput) mobileSearchInput.placeholder = placeholder;
}

function renderPageContent() {
  pageTitle.textContent = menuState.siteContent.page?.title || "";
  pageIntro.innerHTML = "";
  (menuState.siteContent.page?.intro || []).forEach((line) => {
    const paragraph = document.createElement("p");
    paragraph.textContent = line;
    pageIntro.appendChild(paragraph);
  });
}

function isMobileViewport() {
  return mobileNavMediaQuery.matches;
}

function isPhoneViewport() {
  return phoneSearchMediaQuery.matches;
}

function syncMobileSearchState({ focus = false } = {}) {
  if (!mobileSearchToggle || !mobileSearchRow) return;
  const phone = isPhoneViewport();
  mobileSearchToggle.hidden = !phone;
  if (!phone) {
    menuState.mobileSearchOpen = false;
    mobileSearchToggle.setAttribute("aria-expanded", "false");
    mobileSearchToggle.setAttribute("aria-label", "Open search");
    mobileSearchRow.hidden = true;
    return;
  }
  mobileSearchToggle.setAttribute("aria-expanded", menuState.mobileSearchOpen ? "true" : "false");
  mobileSearchToggle.setAttribute("aria-label", menuState.mobileSearchOpen ? "Close search" : "Open search");
  mobileSearchRow.hidden = !menuState.mobileSearchOpen;
  if (focus && menuState.mobileSearchOpen && mobileSearchInput) {
    mobileSearchInput.focus();
  }
}

function setMobileSearchOpen(isOpen, { focus = false } = {}) {
  menuState.mobileSearchOpen = Boolean(isOpen);
  syncMobileSearchState({ focus });
}

function syncMobileToggleButton() {
  if (!navToggle) return;
  const icon = navToggle.querySelector(".ph");
  const label = navToggle.querySelector("span");
  const isOpen = menuState.mobileNavOpen;
  navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  if (label) label.textContent = isOpen ? "Close" : "Menu";
  if (icon) {
    icon.classList.remove("ph-list", "ph-x");
    icon.classList.add(isOpen ? "ph-x" : "ph-list");
  }
}

function syncMobileNavState() {
  if (!navToggle) return;
  const mobile = isMobileViewport();
  navToggle.hidden = !narrowHeaderMediaQuery.matches;
  if (!mobile) {
    menuState.mobileNavOpen = false;
    header.classList.remove("mobile-menu-open");
    navList.hidden = false;
    navList.classList.remove("is-mobile-open");
    if (mobileNavBackdrop) {
      mobileNavBackdrop.hidden = true;
      mobileNavBackdrop.classList.remove("is-visible");
    }
    navToggle.setAttribute("aria-expanded", "false");
    syncMobileToggleButton();
    return;
  }
  menuState.menuOpen = false;
  header.classList.remove("menu-open");
  megaMenu.hidden = true;
  navToggle.setAttribute("aria-expanded", menuState.mobileNavOpen ? "true" : "false");
  syncMobileToggleButton();
  header.classList.toggle("mobile-menu-open", menuState.mobileNavOpen);
  if (mobileNavBackdrop) {
    mobileNavBackdrop.hidden = !menuState.mobileNavOpen;
    mobileNavBackdrop.classList.toggle("is-visible", menuState.mobileNavOpen);
  }

  if (menuState.mobileNavOpen) {
    navList.hidden = false;
    window.requestAnimationFrame(() => {
      navList.classList.add("is-mobile-open");
      renderMobileDrawerPanel();
    });
  } else {
    const wasOpen = navList.classList.contains("is-mobile-open");
    navList.classList.remove("is-mobile-open");
    if (!wasOpen) {
      navList.hidden = true;
      removeMobileDrawerPanel();
      return;
    }
    if (reduceMotionMediaQuery.matches) {
      navList.hidden = true;
      removeMobileDrawerPanel();
      return;
    }
    if (menuState.mobileNavCloseHandler) {
      navList.removeEventListener("transitionend", menuState.mobileNavCloseHandler);
    }
    menuState.mobileNavCloseHandler = (event) => {
      if (event.target !== navList) return;
      navList.removeEventListener("transitionend", menuState.mobileNavCloseHandler);
      menuState.mobileNavCloseHandler = null;
      if (!menuState.mobileNavOpen) {
        navList.hidden = true;
        removeMobileDrawerPanel();
      }
    };
    navList.addEventListener("transitionend", menuState.mobileNavCloseHandler);
  }
}

function setMobileNavOpen(isOpen) {
  const nextOpen = Boolean(isOpen);
  if (nextOpen && !menuState.mobileNavOpen) {
    menuState.mobileDrillPath = [];
  }
  menuState.mobileNavOpen = nextOpen;
  syncMobileNavState();
}

function closeMobileNav() {
  setMobileNavOpen(false);
}

function syncTopNavState() {
  const buttons = navList.querySelectorAll(".fdic-nav-item--button");
  buttons.forEach((button) => {
    const isActive = button.dataset.panelKey === menuState.activePanelKey;
    button.classList.toggle("fdic-nav-item--selected", isActive);
    const isExpanded = isMobileViewport() ? isActive && menuState.mobileNavOpen : isActive && menuState.menuOpen;
    button.setAttribute("aria-expanded", isExpanded ? "true" : "false");
  });
}

function getTopNavItems() {
  return [...navList.querySelectorAll(".fdic-nav-item")];
}

function getActiveTopNavIndex(items = getTopNavItems()) {
  return items.findIndex(
    (item) => item.classList.contains("fdic-nav-item--button") && item.dataset.panelKey === menuState.activePanelKey
  );
}

function applyTopNavRoving({ focus = false } = {}) {
  if (isMobileViewport()) {
    getTopNavItems().forEach((item) => {
      item.tabIndex = 0;
    });
    return;
  }

  const items = getTopNavItems();
  if (items.length === 0) return;

  const activeIndex = getActiveTopNavIndex(items);
  if (menuState.topNavFocusIndex < 0 || menuState.topNavFocusIndex >= items.length) {
    menuState.topNavFocusIndex = activeIndex >= 0 ? activeIndex : 0;
  }

  items.forEach((item, index) => {
    item.tabIndex = index === menuState.topNavFocusIndex ? 0 : -1;
  });

  if (focus) {
    items[menuState.topNavFocusIndex].focus();
  }
}

function resetPanelSelection() {
  menuState.selectedL1Index = 0;
  menuState.selectedL2Index = 0;
  menuState.previewL2Index = null;
  menuState.previewingOverview = false;
  menuState.l1FocusIndex = 0;
  menuState.suppressL2HoverPreview = false;
  menuState.mobileDrillPath = [];
}

function renderTopNav() {
  navList.innerHTML = "";
  const navItems = menuState.siteContent.header?.nav || [];
  const mobile = isMobileViewport();

  if (mobile) {
    navList.classList.add("fdic-nav-list--mobile-accordion");
    syncTopNavState();
    return;
  }

  navList.classList.remove("fdic-nav-list--mobile-accordion");

  navItems.forEach((item) => {
    const li = document.createElement("li");
    if (item.kind === "menu") {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "fdic-nav-item fdic-nav-item--button";
      button.dataset.navIndex = String(navList.children.length);
      button.dataset.panelKey = item.panelKey || item.id;
      if (!mobile) {
        button.setAttribute("aria-controls", "megaMenu");
      }
      button.textContent = item.label;
      button.addEventListener("click", () => {
        const focusMenu = menuState.moveFocusIntoMenuOnOpen;
        menuState.moveFocusIntoMenuOnOpen = false;
        menuState.topNavFocusIndex = Number(button.dataset.navIndex || 0);
        const nextPanel = button.dataset.panelKey;
        if (menuState.activePanelKey === nextPanel) {
          if (menuState.menuOpen) {
            closeMenu();
          } else {
            openMenu({ focusMenu });
          }
          closeMobileNav();
          return;
        }
        menuState.activePanelKey = nextPanel;
        resetPanelSelection();
        syncTopNavState();
        applyTopNavRoving();
        renderMenuPanel();
        openMenu({ focusMenu });
        closeMobileNav();
      });
      li.appendChild(button);
    } else {
      const link = document.createElement("a");
      link.className = "fdic-nav-item";
      link.dataset.navIndex = String(navList.children.length);
      link.href = item.href || "#";
      link.textContent = item.label;
      link.addEventListener("click", closeMobileNav);
      li.appendChild(link);
    }
    navList.appendChild(li);
  });

  syncTopNavState();
  applyTopNavRoving();
}

function ensureMobileDrawerPanel() {
  const existing = navList.querySelector(".mobile-drawer-panel-item");
  if (existing) return existing;
  const li = document.createElement("li");
  li.className = "mobile-drawer-panel-item";
  const container = document.createElement("div");
  container.className = "mobile-drawer-panel";
  li.appendChild(container);
  navList.appendChild(li);
  return li;
}

function removeMobileDrawerPanel() {
  const existing = navList.querySelector(".mobile-drawer-panel-item");
  if (existing) existing.remove();
}

function renderMobileDrillHeader(targetContainer, backLabel, onBack, currentLink) {
  const header = document.createElement("div");
  header.className = "mobile-drill-header";

  if (onBack) {
    const backButton = document.createElement("button");
    backButton.type = "button";
    backButton.className = "mobile-drill-back";
    backButton.setAttribute("aria-label", `Back to ${backLabel}`);

    const icon = document.createElement("span");
    icon.className = "mobile-drill-back-icon";
    icon.textContent = "‹";
    icon.setAttribute("aria-hidden", "true");

    const text = document.createElement("span");
    text.textContent = backLabel;

    backButton.append(icon, text);
    backButton.addEventListener("click", onBack);
    header.appendChild(backButton);
  }

  if (currentLink) {
    const link = document.createElement("a");
    link.className = "mobile-drill-current-link";
    link.href = currentLink.href || "#";
    link.textContent = currentLink.label || "Overview";
    header.appendChild(link);
  }

  if (header.childElementCount > 0) {
    targetContainer.appendChild(header);
  }
}

function createMobileDrillList() {
  const list = document.createElement("ul");
  list.className = "mobile-drill-list";
  return list;
}

function appendMobileDrillItem(list, label, onClick) {
  const li = document.createElement("li");
  li.className = "mobile-drill-item";

  const button = document.createElement("button");
  button.type = "button";
  button.className = "mobile-drill-trigger";

  const text = document.createElement("span");
  text.className = "mobile-drill-label";
  text.textContent = label;

  const icon = document.createElement("span");
  icon.className = "mobile-drill-caret";
  icon.textContent = "›";
  icon.setAttribute("aria-hidden", "true");

  button.append(text, icon);
  button.addEventListener("click", onClick);
  li.appendChild(button);
  list.appendChild(li);
}

function renderMobileDrillRoot(panelContainer, panelKeys) {
  const list = createMobileDrillList();
  panelKeys.forEach((panelKey) => {
    const panelMeta = (menuState.siteContent?.header?.nav || []).find(
      (item) => item.kind === "menu" && (item.panelKey || item.id) === panelKey
    );
    appendMobileDrillItem(list, panelMeta?.label || panelKey, () => {
      menuState.activePanelKey = panelKey;
      menuState.mobileDrillPath = [panelKey];
      renderMobileDrawerPanel();
    });
  });
  panelContainer.appendChild(list);
}

function renderMobileDrillL1(panelContainer, panelKey, panelConfig) {
  renderMobileDrillHeader(panelContainer, "Main menu", () => {
    menuState.mobileDrillPath = [];
    renderMobileDrawerPanel();
  });

  const list = createMobileDrillList();
  (panelConfig.l1 || []).forEach((l1Item, l1Index) => {
    appendMobileDrillItem(list, l1Item.label || "Section", () => {
      menuState.mobileDrillPath = [panelKey, l1Index];
      renderMobileDrawerPanel();
    });
  });
  panelContainer.appendChild(list);
}

function renderMobileDrillL2(panelContainer, panelKey, panelConfig, l1Index) {
  const l1Item = (panelConfig.l1 || [])[l1Index];
  if (!l1Item) return;

  renderMobileDrillHeader(
    panelContainer,
    panelConfig?.overviewLabel || "Sections",
    () => {
      menuState.mobileDrillPath = [panelKey];
      renderMobileDrawerPanel();
    },
    { href: l1Item.href || l1Item.overviewHref || "#", label: l1Item.label || "Section" }
  );

  const list = createMobileDrillList();
  (l1Item.l2 || []).forEach((l2Item, l2Index) => {
    appendMobileDrillItem(list, l2Item.label || "Link", () => {
      menuState.mobileDrillPath = [panelKey, l1Index, l2Index];
      renderMobileDrawerPanel();
    });
  });
  panelContainer.appendChild(list);
}

function renderMobileDrillL3(panelContainer, panelKey, panelConfig, l1Index, l2Index) {
  const l1Item = (panelConfig.l1 || [])[l1Index];
  const l2Item = (l1Item?.l2 || [])[l2Index];
  if (!l1Item || !l2Item) return;

  renderMobileDrillHeader(
    panelContainer,
    l1Item.label || "Section",
    () => {
      menuState.mobileDrillPath = [panelKey, l1Index];
      renderMobileDrawerPanel();
    },
    { href: l2Item.href || "#", label: l2Item.label || "Link" }
  );

  const list = document.createElement("ul");
  list.className = "mobile-drill-link-list";

  (l2Item.l3 || []).forEach((l3Item) => {
    const li = document.createElement("li");
    li.className = "mobile-drill-link-item";

    const link = document.createElement("a");
    link.className = "mobile-drill-link";
    link.href = l3Item.href || "#";
    link.textContent = l3Item.label || "Sub-link";

    li.appendChild(link);
    list.appendChild(li);
  });

  panelContainer.appendChild(list);
}

function renderMobileDrawerPanel() {
  if (!isMobileViewport()) return;
  if (!menuState.mobileNavOpen) return;
  const panelItem = ensureMobileDrawerPanel();
  const panelContainer = panelItem.querySelector(".mobile-drawer-panel");
  if (!panelContainer) return;
  panelContainer.innerHTML = "";

  const panelKeys = getMobilePanelKeys();
  if (panelKeys.length === 0) return;

  const [panelKey, l1Index, l2Index] = menuState.mobileDrillPath;
  if (!panelKey) {
    renderMobileDrillRoot(panelContainer, panelKeys);
    return;
  }

  const panelConfig = getPanelConfigByKey(panelKey);
  if (!panelConfig) {
    menuState.mobileDrillPath = [];
    renderMobileDrillRoot(panelContainer, panelKeys);
    return;
  }

  if (typeof l1Index !== "number") {
    renderMobileDrillL1(panelContainer, panelKey, panelConfig);
    return;
  }

  if (typeof l2Index !== "number") {
    renderMobileDrillL2(panelContainer, panelKey, panelConfig, l1Index);
    return;
  }

  renderMobileDrillL3(panelContainer, panelKey, panelConfig, l1Index, l2Index);
}

function openMenu({ focusMenu = false } = {}) {
  if (menuState.menuOpen) return;
  menuState.menuOpen = true;
  megaMenu.setAttribute("aria-hidden", "false");
  if (menuState.closeTransitionHandler) {
    megaMenu.removeEventListener("transitionend", menuState.closeTransitionHandler);
    menuState.closeTransitionHandler = null;
  }
  if (menuState.closeHideTimer) {
    window.clearTimeout(menuState.closeHideTimer);
    menuState.closeHideTimer = null;
  }
  megaMenu.hidden = false;
  window.requestAnimationFrame(() => {
    if (menuState.menuOpen) {
      header.classList.add("menu-open");
      if (focusMenu) {
        if (!focusSelectedL1()) {
          const fallbackTarget = megaMenu.querySelector(".l2-item, .overview-link, .l3-item");
          if (fallbackTarget instanceof HTMLElement) {
            fallbackTarget.focus();
          }
        }
      }
    }
  });
  if (isMobileViewport()) {
    renderL1();
    renderL2();
    renderL3();
  }
  syncTopNavState();
}

function closeMenu() {
  if (isMobileViewport()) {
    menuState.menuOpen = false;
    header.classList.remove("menu-open");
    megaMenu.hidden = true;
    syncTopNavState();
    return;
  }
  if (!menuState.menuOpen) return;
  menuState.menuOpen = false;
  megaMenu.setAttribute("aria-hidden", "true");
  header.classList.remove("menu-open");
  if (reduceMotionMediaQuery.matches) {
    megaMenu.hidden = true;
  } else {
    if (menuState.closeTransitionHandler) {
      megaMenu.removeEventListener("transitionend", menuState.closeTransitionHandler);
    }
    if (menuState.closeHideTimer) {
      window.clearTimeout(menuState.closeHideTimer);
      menuState.closeHideTimer = null;
    }
    menuState.closeTransitionHandler = (event) => {
      if (event.target !== megaMenu) return;
      megaMenu.removeEventListener("transitionend", menuState.closeTransitionHandler);
      menuState.closeTransitionHandler = null;
      if (menuState.closeHideTimer) {
        window.clearTimeout(menuState.closeHideTimer);
        menuState.closeHideTimer = null;
      }
      if (!menuState.menuOpen) {
        megaMenu.hidden = true;
      }
    };
    megaMenu.addEventListener("transitionend", menuState.closeTransitionHandler);
    menuState.closeHideTimer = window.setTimeout(() => {
      menuState.closeHideTimer = null;
      if (!menuState.menuOpen) {
        megaMenu.hidden = true;
      }
    }, 240);
  }
  menuState.previewL2Index = null;
  menuState.previewingOverview = false;
  renderL2();
  renderL3();
  syncTopNavState();
}

function getSelectedL1() {
  return getPanelL1()[menuState.selectedL1Index] || null;
}

function getVisibleL2Index() {
  if (menuState.previewL2Index !== null) {
    return menuState.previewL2Index;
  }
  return menuState.selectedL2Index;
}

function getVisibleL2() {
  const selected = getSelectedL1();
  const items = selected?.l2 || [];
  return items[getVisibleL2Index()] || null;
}

function getL2Overview(selectedL1) {
  if (!selectedL1) return null;
  return selectedL1.l2Overview || (
    selectedL1.overviewLabel || selectedL1.overviewHref
      ? {
          label: selectedL1.overviewLabel || `${selectedL1.label || "Overview"} Overview`,
          href: selectedL1.overviewHref || "#",
          description: "",
        }
      : null
  );
}

function setSelectedL1(index, { restoreFocus = false } = {}) {
  menuState.selectedL1Index = index;
  menuState.l1FocusIndex = index;
  menuState.selectedL2Index = 0;
  menuState.previewL2Index = null;
  menuState.previewingOverview = false;
  renderL1();
  renderL2();
  renderL3();
  if (restoreFocus) {
    const target = l1List.querySelector(`.l1-item[data-index="${index}"]`);
    setColumnFocus(l1Column, ".l1-item, #l1OverviewLink", target);
  }
}

function syncL2ActiveState() {
  const activeIndex = getVisibleL2Index();
  const l2Items = [...l2List.querySelectorAll('.l2-item[data-index]')];
  l2Items.forEach((item) => {
    const itemIndex = Number(item.dataset.index);
    const isActive = Number.isFinite(itemIndex) && itemIndex === activeIndex;
    item.dataset.active = isActive ? "true" : "false";
    item.setAttribute("aria-selected", isActive ? "true" : "false");
  });
}

function setPreviewL2(index, { restoreFocus = false, fromFocus = false } = {}) {
  const previewChanged = menuState.previewL2Index !== index || menuState.previewingOverview;
  if (!previewChanged) return;
  const fromOverviewPreview = menuState.previewingOverview;
  menuState.previewingOverview = false;
  menuState.previewL2Index = index;
  if (fromFocus && !fromOverviewPreview) {
    syncL2ActiveState();
  } else {
    renderL2();
  }
  renderL3();
  if (restoreFocus) {
    const target = l2List.querySelector(`.l2-item[data-index="${index}"]`);
    setColumnFocus(l2List, ".l2-item", target);
  }
}

function setPreviewOverview({ restoreFocus = false, fromFocus = false } = {}) {
  if (menuState.previewL2Index === null && menuState.previewingOverview) return;
  menuState.previewL2Index = null;
  menuState.previewingOverview = true;
  if (fromFocus) {
    syncL2ActiveState();
  } else {
    renderL2();
  }
  renderL3();
  if (restoreFocus) {
    const target = l2List.querySelector(".l2-item--overview");
    setColumnFocus(l2List, ".l2-item", target);
  }
}

function clearPreviewL2() {
  if (menuState.previewL2Index === null && !menuState.previewingOverview) {
    return;
  }
  menuState.previewL2Index = null;
  menuState.previewingOverview = false;
  menuState.suppressL2HoverPreview = false;
  renderL2();
  renderL3();
}

function cancelPreviewClear() {
  if (menuState.previewClearTimer) {
    window.clearTimeout(menuState.previewClearTimer);
    menuState.previewClearTimer = null;
  }
}

function schedulePreviewClear() {
  cancelPreviewClear();
  menuState.previewClearTimer = window.setTimeout(() => {
    menuState.previewClearTimer = null;
    clearPreviewL2();
  }, 120);
}

function renderL1() {
  const selected = getSelectedL1();
  const panel = getPanelConfig();
  const l1Items = getPanelL1();
  const maxRovingIndex = l1Items.length;
  const rovingIndex = Math.max(0, Math.min(menuState.l1FocusIndex, maxRovingIndex));
  menuState.l1FocusIndex = rovingIndex;
  l1List.innerHTML = "";

  l1Items.forEach((l1Item, index) => {
    const li = document.createElement("li");
    const button = document.createElement("button");
    const label = document.createElement("span");
    const caret = document.createElement("span");

    button.type = "button";
    button.className = "l1-item";
    button.setAttribute("role", "option");
    button.dataset.column = "l1";
    button.dataset.index = String(index);
    button.setAttribute("aria-selected", index === menuState.selectedL1Index ? "true" : "false");
    button.tabIndex = index === rovingIndex ? 0 : -1;

    label.className = "l1-label";
    label.textContent = l1Item.label;

    caret.className = "l1-caret ph ph-caret-right";
    caret.setAttribute("aria-hidden", "true");

    button.append(label, caret);
    button.addEventListener("click", () => {
      setSelectedL1(index, { restoreFocus: true });
      openMenu();
    });

    li.appendChild(button);
    l1List.appendChild(li);
  });

  l1OverviewLink.textContent = panel?.overviewLabel || selected?.overviewLabel || "Overview";
  l1OverviewLink.href = panel?.overviewHref || selected?.overviewHref || "#";
  l1OverviewLink.dataset.column = "l1";
  l1OverviewLink.dataset.index = String(l1Items.length);
  l1OverviewLink.tabIndex = rovingIndex === l1Items.length ? 0 : -1;
}

function renderL2() {
  if (isMobileViewport()) {
    l2List.innerHTML = "";
    return;
  }

  const selectedL1 = getSelectedL1();
  const l2Items = selectedL1?.l2 || [];
  const activeIndex = getVisibleL2Index();
  l2List.innerHTML = "";

  l2Items.forEach((l2Item, index) => {
    const li = document.createElement("li");
    const link = document.createElement("a");
    const isActive = index === activeIndex;

    link.className = "l2-item";
    link.setAttribute("role", "option");
    link.href = l2Item.href || "#";
    link.textContent = l2Item.label;
    link.dataset.column = "l2";
    link.dataset.index = String(index);
    link.dataset.active = isActive ? "true" : "false";
    link.setAttribute("aria-selected", isActive ? "true" : "false");
    link.tabIndex = index === 0 ? 0 : -1;

    link.addEventListener("mouseenter", () => {
      if (menuState.suppressL2HoverPreview) return;
      setPreviewL2(index);
    });
    link.addEventListener("focus", () => setPreviewL2(index));
    link.addEventListener("click", (event) => {
      if (
        event.button !== 0
        || event.metaKey
        || event.ctrlKey
        || event.shiftKey
        || event.altKey
      ) {
        return;
      }
      event.preventDefault();
      menuState.selectedL2Index = index;
      menuState.previewingOverview = false;
      menuState.previewL2Index = null;
      menuState.suppressL2HoverPreview = true;
      renderL2();
      renderL3();
    });

    li.appendChild(link);
    l2List.appendChild(li);
  });

  const l2Overview = getL2Overview(selectedL1);
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
    overviewLink.setAttribute("role", "option");
    overviewLink.setAttribute("aria-selected", "false");
    overviewLink.href = l2Overview.href || "#";
    overviewLink.textContent = l2Overview.label || "Overview";
    overviewLink.dataset.column = "l2";
    overviewLink.dataset.index = String(l2Items.length);
    overviewLink.tabIndex = l2Items.length === 0 ? 0 : -1;
    overviewLink.addEventListener("mouseenter", () => {
      if (menuState.suppressL2HoverPreview) return;
      setPreviewOverview();
    });
    overviewLink.addEventListener("focus", () => setPreviewOverview());
    overviewLi.appendChild(overviewLink);
    l2List.appendChild(overviewLi);
  }
}

function renderL3() {
  if (isMobileViewport()) {
    l3Description.textContent = "";
    l3Description.hidden = true;
    l3List.innerHTML = "";
    l3List.hidden = true;
    return;
  }

  const showingPreview = menuState.previewL2Index !== null;
  const selectedL2 = getSelectedL1()?.l2?.[menuState.selectedL2Index] || null;
  const previewL2 = getVisibleL2();
  const selectedL1 = getSelectedL1();
  const l2Overview = getL2Overview(selectedL1);
  const descriptionText = menuState.previewingOverview
    ? l2Overview?.description || ""
    : showingPreview
      ? ""
      : selectedL2?.description || "";

  l3Description.textContent = descriptionText;
  l3Description.hidden = !descriptionText;

  l3List.innerHTML = "";
  l3List.hidden = !showingPreview || menuState.previewingOverview;

  if (!showingPreview || menuState.previewingOverview) {
    return;
  }

  (previewL2?.l3 || []).forEach((l3Item, index) => {
    const li = document.createElement("li");
    const link = document.createElement("a");
    if (!l3Item.href) {
      console.warn(`Missing href for L3 item "${l3Item.label || "(unnamed)"}" in panel "${menuState.activePanelKey}"`);
    }
    link.className = "l3-item";
    link.href = l3Item.href || "#";
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
    if (mobileMenu) {
      mobileMenu.innerHTML = "";
    }
    return;
  }

  megaMenu.setAttribute("aria-label", panel.ariaLabel || "Site menu");
  if (isMobileViewport()) {
    if (mobileMenu) {
      mobileMenu.innerHTML = "";
    }
    renderMobileDrawerPanel();
    return;
  }
  renderL1();
  renderL2();
  renderL3();
}

function setupColumnArrowNav(container, selector) {
  container.addEventListener("keydown", (event) => {
    if (isMobileViewport()) return;
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
    if (container === l1Column) {
      const rovingIndex = Number(items[nextIndex].dataset.index);
      if (!Number.isNaN(rovingIndex)) {
        menuState.l1FocusIndex = rovingIndex;
      }
    }
  });
}

function setColumnFocus(container, selector, target) {
  if (!target) return false;
  const items = [...container.querySelectorAll(selector)];
  if (items.length === 0) return false;
  items.forEach((item) => {
    item.tabIndex = item === target ? 0 : -1;
  });
  target.focus();
  return true;
}

function focusSelectedL1() {
  const target = l1List.querySelector('.l1-item[aria-selected="true"]') || l1List.querySelector(".l1-item");
  return setColumnFocus(l1Column, ".l1-item, #l1OverviewLink", target);
}

function focusActiveL2() {
  const target = l2List.querySelector('.l2-item[aria-selected="true"]')
    || l2List.querySelector('.l2-item[tabindex="0"]')
    || l2List.querySelector(".l2-item");
  return setColumnFocus(l2List, ".l2-item", target);
}

function focusActiveL3() {
  if (l3List.hidden) return false;
  const target = l3List.querySelector('.l3-item[tabindex="0"]') || l3List.querySelector(".l3-item");
  return setColumnFocus(l3List, ".l3-item", target);
}

function setupColumnCrossNav() {
  megaMenu.addEventListener("keydown", (event) => {
    if (isMobileViewport()) return;
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    const activeElement = document.activeElement;
    if (!(activeElement instanceof HTMLElement)) return;

    const column = activeElement.dataset.column;
    let moved = false;

    if (event.key === "ArrowRight") {
      if (column === "l1") moved = focusActiveL2();
      if (column === "l2") moved = focusActiveL3();
    }

    if (event.key === "ArrowLeft") {
      if (column === "l3") moved = focusActiveL2();
      if (column === "l2") moved = focusSelectedL1();
    }

    if (moved) {
      event.preventDefault();
    }
  });
}

function setupEvents() {
  if (navToggle) {
    navToggle.addEventListener("click", () => {
      if (isMobileViewport()) {
        if (!menuState.mobileNavOpen) {
          setMobileSearchOpen(false);
        }
        setMobileNavOpen(!menuState.mobileNavOpen);
        return;
      }
      if (menuState.menuOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (mobileSearchToggle) {
    mobileSearchToggle.addEventListener("click", () => {
      if (!isPhoneViewport()) return;
      const nextOpen = !menuState.mobileSearchOpen;
      if (nextOpen) {
        closeMobileNav();
      }
      setMobileSearchOpen(nextOpen, { focus: nextOpen });
    });
  }

  mobileNavMediaQuery.addEventListener("change", () => {
    syncMobileNavState();
    renderTopNav();
    renderMenuPanel();
  });

  narrowHeaderMediaQuery.addEventListener("change", () => {
    syncMobileNavState();
    renderMobileDrawerPanel();
  });

  phoneSearchMediaQuery.addEventListener("change", () => {
    syncMobileSearchState();
  });

  navList.addEventListener("keydown", (event) => {
    if (isMobileViewport()) {
      return;
    }

    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.classList.contains("fdic-nav-item")) {
      return;
    }

    const items = getTopNavItems();
    if (items.length === 0) return;
    const currentIndex = items.indexOf(target);
    if (currentIndex === -1) return;

    if (["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      if (event.key === "ArrowRight") menuState.topNavFocusIndex = (currentIndex + 1) % items.length;
      if (event.key === "ArrowLeft") menuState.topNavFocusIndex = (currentIndex - 1 + items.length) % items.length;
      if (event.key === "Home") menuState.topNavFocusIndex = 0;
      if (event.key === "End") menuState.topNavFocusIndex = items.length - 1;
      applyTopNavRoving({ focus: true });
      return;
    }

    if ((event.key === "Enter" || event.key === " ") && target.classList.contains("fdic-nav-item--button")) {
      event.preventDefault();
      menuState.moveFocusIntoMenuOnOpen = true;
      target.click();
    }
  });

  document.addEventListener("pointerdown", (event) => {
    if (!(event.target instanceof HTMLElement)) return;
    if (navToggle && navToggle.contains(event.target)) return;

    if (menuState.menuOpen) {
      if (megaMenu.contains(event.target)) return;

      const navButton = event.target.closest(".fdic-nav-item--button");
      if (navButton && navList.contains(navButton)) return;

      closeMenu();
    }

    if (menuState.mobileNavOpen && navToggle) {
      if (navList.contains(event.target)) return;
      closeMobileNav();
    }

    if (menuState.mobileSearchOpen && mobileSearchToggle && mobileSearchRow) {
      if (mobileSearchToggle.contains(event.target) || mobileSearchRow.contains(event.target)) return;
      setMobileSearchOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (menuState.mobileSearchOpen) {
      setMobileSearchOpen(false);
      if (mobileSearchToggle) mobileSearchToggle.focus();
      return;
    }
    if (isMobileViewport() && menuState.mobileNavOpen) {
      if (menuState.mobileDrillPath.length > 0) {
        event.preventDefault();
        menuState.mobileDrillPath = menuState.mobileDrillPath.slice(0, -1);
        renderMobileDrawerPanel();
        const button = navList.querySelector(".mobile-drill-trigger");
        if (button) button.focus();
        return;
      }
    }
    closeMenu();
    closeMobileNav();
    const activeButton = navList.querySelector(
      `.fdic-nav-item--button[data-panel-key="${menuState.activePanelKey}"]`
    );
    if (activeButton) activeButton.focus();
  });

  l2List.addEventListener("mouseenter", cancelPreviewClear);
  l2List.addEventListener("pointermove", () => {
    menuState.suppressL2HoverPreview = false;
  });
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
    l3Column.addEventListener("focusout", () => {
      window.requestAnimationFrame(() => {
        const activeElement = document.activeElement;
        if (
          activeElement &&
          (l3Column.contains(activeElement) || l2List.contains(activeElement))
        ) {
          return;
        }
        clearPreviewL2();
      });
    });
  }

  l2List.addEventListener("focusout", () => {
    window.requestAnimationFrame(() => {
      const activeElement = document.activeElement;
      if (
        activeElement &&
        (l2List.contains(activeElement) || (l3Column && l3Column.contains(activeElement)))
      ) {
        return;
      }
      clearPreviewL2();
    });
  });

  if (l1Column) {
    setupColumnArrowNav(l1Column, ".l1-item, #l1OverviewLink");
  }
  setupColumnArrowNav(l2List, ".l2-item");
  setupColumnArrowNav(l3List, ".l3-item");
  setupColumnCrossNav();
}

async function init() {
  const missingElements = getMissingRequiredElements();
  if (missingElements.length > 0) {
    console.error(
      `FDICnet menu initialization aborted: missing required DOM element(s): ${missingElements.join(", ")}`
    );
    return;
  }

  try {
    menuState.siteContent = await loadContent();
  } catch (error) {
    console.error("Failed to load site content:", error);
    renderContentLoadFallback();
    return;
  }

  const navMenuItem = (menuState.siteContent.header?.nav || []).find((item) => item.kind === "menu");
  menuState.activePanelKey = menuState.siteContent.menu?.defaultPanel || navMenuItem?.panelKey || navMenuItem?.id || null;

  applyHeaderContent();
  renderTopNav();
  syncMobileNavState();
  syncMobileSearchState();
  renderPageContent();
  renderMenuPanel();
  setupEvents();
  megaMenu.hidden = true;
  megaMenu.setAttribute("aria-hidden", "true");

  if (menuState.siteContent.menu?.openByDefault && !isMobileViewport()) {
    openMenu();
  }
}

init();
