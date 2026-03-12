const stateModule = window.FDICMenuState;
if (!stateModule) {
  throw new Error("FDICMenuState module missing. Ensure state.js is loaded before script.js.");
}

const {
  menuState,
  getPanelConfig: selectPanelConfig,
  getPanelConfigByKey: selectPanelConfigByKey,
  getMobilePanelKeys: selectMobilePanelKeys,
  getPanelL1: selectPanelL1,
  getSelectedL1: selectSelectedL1,
  getVisibleL2Index: selectVisibleL2Index,
  getVisibleL2: selectVisibleL2,
  getL2Overview: selectL2Overview,
} = stateModule;

/* ── Responsive breakpoints ──────────────────────────────────────────
   These mirror the media queries in styles.css. Keep them in sync. */
const MOBILE_NAV_BREAKPOINT = "(max-width: 768px)";       // Switches to mobile drawer
const PHONE_SEARCH_BREAKPOINT = "(max-width: 640px)";     // Collapses search into toggle
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const mobileNavMediaQuery = window.matchMedia(MOBILE_NAV_BREAKPOINT);
const phoneSearchMediaQuery = window.matchMedia(PHONE_SEARCH_BREAKPOINT);
const reduceMotionMediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
const MOBILE_STAGGER_MAX_ITEMS = 6;
const MOBILE_STAGGER_STEP_MS = 15;

let topNav = null;
let megaMenuHost = null;
let header = null;
let navList = null;
let navToggle = null;
let megaMenu = null;
let l1List = null;
let l2List = null;
let l3List = null;
let l3Description = null;
let l3Column = null;
let l1Column = null;
let pageTitle = null;
let pageIntro = null;
let desktopSearchInput = null;
let mobileSearchToggle = null;
let mobileSearchRow = null;
let mobileSearchInput = null;
let mobileNavBackdrop = null;
let mainContent = null;
let mastheadControls = null;
let mastheadWordmark = null;
let menuLiveRegion = null;
let mobileDrawerController = null;
let liveAnnouncementTimer = null;
let lastLiveAnnouncement = "";

function refreshDomRefs() {
  topNav = document.getElementById("fdicTopNav");
  megaMenuHost = document.getElementById("fdicMegaMenu");
  header = document.getElementById("fdicHeader");
  navList = topNav?.navList || document.getElementById("fdicNavList");
  navToggle = document.getElementById("fdicNavToggle");
  megaMenu = megaMenuHost?.megaMenuElement || document.getElementById("megaMenu");
  l1List = megaMenuHost?.l1List || document.getElementById("l1List");
  l2List = megaMenuHost?.l2List || document.getElementById("l2List");
  l3List = megaMenuHost?.l3List || document.getElementById("l3List");
  l3Description = megaMenuHost?.l3Description || document.getElementById("l3Description");
  l3Column = megaMenuHost?.l3Column || document.querySelector(".mega-col--l3");
  l1Column = megaMenuHost?.l1Column || document.querySelector(".mega-col--l1");
  pageTitle = document.getElementById("pageTitle");
  pageIntro = document.getElementById("pageIntro");
  desktopSearchInput = document.getElementById("desktopSearchInput");
  mobileSearchToggle = document.getElementById("mobileSearchToggle");
  mobileSearchRow = document.getElementById("mobileSearchRow");
  mobileSearchInput = document.getElementById("mobileSearchInput");
  mobileNavBackdrop = document.getElementById("mobileNavBackdrop");
  mainContent = document.querySelector("main.page-content");
  mastheadControls = document.querySelector(".fdic-controls");
  mastheadWordmark = document.querySelector(".fdic-wordmark");
  menuLiveRegion = document.getElementById("menuLiveRegion");
}

refreshDomRefs();

function getDom() {
  return {
    topNav,
    megaMenuHost,
    header,
    navList,
    navToggle,
    megaMenu,
    l1List,
    l2List,
    l3List,
    l3Description,
    l3Column,
    l1Column,
    pageTitle,
    pageIntro,
    desktopSearchInput,
    mobileSearchToggle,
    mobileSearchRow,
    mobileSearchInput,
    mobileNavBackdrop,
    mainContent,
    mastheadControls,
    mastheadWordmark,
    menuLiveRegion,
  };
}

function getPanelConfig() {
  return selectPanelConfig(menuState.siteContent, menuState.activePanelKey);
}

function getPanelConfigByKey(panelKey) {
  return selectPanelConfigByKey(menuState.siteContent, panelKey);
}

function getMobilePanelKeys() {
  return selectMobilePanelKeys(menuState.siteContent);
}

function getPanelL1() {
  return selectPanelL1(getPanelConfig());
}

function getDefaultL1Index(panel = getPanelConfig()) {
  const l1Items = panel?.l1 || [];
  return l1Items.length > 1 ? 1 : 0;
}

function announceMenuContext(message) {
  const text = typeof message === "string" ? message.trim() : "";
  if (!text || !menuLiveRegion) return;
  if (text === lastLiveAnnouncement) return;
  lastLiveAnnouncement = text;
  if (liveAnnouncementTimer) {
    window.clearTimeout(liveAnnouncementTimer);
    liveAnnouncementTimer = null;
  }
  menuLiveRegion.textContent = "";
  liveAnnouncementTimer = window.setTimeout(() => {
    menuLiveRegion.textContent = text;
    liveAnnouncementTimer = null;
  }, 20);
}

function resetMenuAnnouncementState() {
  lastLiveAnnouncement = "";
  if (liveAnnouncementTimer) {
    window.clearTimeout(liveAnnouncementTimer);
    liveAnnouncementTimer = null;
  }
}

function announceDesktopPanelContext(panelKey) {
  const panelConfig = getPanelConfigByKey(panelKey);
  if (!panelConfig) return;
  const panelLabel = (menuState.siteContent?.header?.nav || []).find(
    (item) => item.kind === "menu" && (item.panelKey || item.id) === panelKey
  )?.label || panelConfig.overviewLabel || "Menu";
  const l1Items = panelConfig.l1 || [];
  const hasOverviewRow = l1Items.length > 1;
  const visibleItemCount = hasOverviewRow ? l1Items.length - 1 : l1Items.length;
  announceMenuContext(`${panelLabel}, ${visibleItemCount} item${visibleItemCount === 1 ? "" : "s"}.`);
}

function applyHeaderContent() {
  refreshDomRefs();
  const placeholder = menuState.siteContent.header?.searchPlaceholder || "Search";
  if (desktopSearchInput) desktopSearchInput.placeholder = placeholder;
  if (mobileSearchInput) mobileSearchInput.placeholder = placeholder;
}

function renderPageContent() {
  refreshDomRefs();
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
  refreshDomRefs();
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

function setInertState(element, isInert) {
  if (!element) return;
  if (isInert) {
    element.setAttribute("inert", "");
  } else {
    element.removeAttribute("inert");
  }
}

function syncMobileBackgroundInertState() {
  const shouldInert = isMobileViewport() && menuState.mobileNavOpen;
  setInertState(mainContent, shouldInert);
  setInertState(mastheadControls, shouldInert);
  setInertState(mastheadWordmark, shouldInert);
  setInertState(mobileSearchRow, shouldInert);
}

function syncMobileToggleButton() {
  refreshDomRefs();
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

function getMobileDrawerFocusableItems() {
  refreshDomRefs();
  const drillItems = [...navList.querySelectorAll(
    ".mobile-drill-back, .mobile-drill-trigger, .mobile-drill-link, .mobile-drill-current-link"
  )];
  if (drillItems.length > 0) {
    return drillItems;
  }
  return [...navList.querySelectorAll(".fdic-nav-item")];
}

function ensureMobileMenuFocus({ force = false, attempts = 2 } = {}) {
  refreshDomRefs();
  if (!menuState.mobileNavOpen || !isMobileViewport()) return;
  if (!force && navList.contains(document.activeElement)) return;

  const firstItem = getMobileDrawerFocusableItems()[0];
  if (firstItem) {
    firstItem.focus();
  } else {
    navList.tabIndex = -1;
    navList.focus();
  }

  if (!navList.contains(document.activeElement) && attempts > 0) {
    window.requestAnimationFrame(() => {
      ensureMobileMenuFocus({ force: true, attempts: attempts - 1 });
    });
  }
}

function triggerLightHaptic() {
  if (!isMobileViewport()) return;
  if (reduceMotionMediaQuery.matches) return;
  if (!("vibrate" in navigator)) return;
  navigator.vibrate(10);
}

function initializeMobileDrawerController() {
  if (mobileDrawerController) return;
  const createController = window.createFDICMobileDrawerController;
  if (typeof createController !== "function") {
    throw new Error("FDIC mobile drawer module missing. Ensure mobile-drawer.js is loaded before script.js.");
  }
  mobileDrawerController = createController({
    menuState,
    reduceMotionMediaQuery,
    MOBILE_STAGGER_MAX_ITEMS,
    MOBILE_STAGGER_STEP_MS,
    refreshDomRefs,
    isMobileViewport,
    getNavList: () => {
      refreshDomRefs();
      return navList;
    },
    getMobilePanelKeys,
    getPanelConfigByKey,
    syncMobileToggleButton,
    ensureMobileMenuFocus,
    triggerLightHaptic,
    announceMenuContext,
  });
}

function syncMobileNavState() {
  refreshDomRefs();
  if (!navToggle) return;
  const mobile = isMobileViewport();
  navToggle.hidden = !mobile;
  if (!mobile) {
    menuState.mobileNavOpen = false;
    header.classList.remove("mobile-menu-open");
    navList.hidden = false;
    navList.classList.remove("is-mobile-open");
    if (mobileNavBackdrop) {
      mobileNavBackdrop.hidden = true;
      mobileNavBackdrop.classList.remove("is-visible");
      mobileNavBackdrop.tabIndex = -1;
    }
    navToggle.setAttribute("aria-expanded", "false");
    syncMobileToggleButton();
    syncMobileBackgroundInertState();
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
    mobileNavBackdrop.tabIndex = menuState.mobileNavOpen ? 0 : -1;
  }
  syncMobileBackgroundInertState();

  if (menuState.mobileNavOpen) {
    navList.hidden = false;
    window.requestAnimationFrame(() => {
      navList.classList.add("is-mobile-open");
      renderMobileDrawerPanel();
      window.requestAnimationFrame(() => {
        if (menuState.mobileNavOpen) {
          ensureMobileMenuFocus({ force: true });
        }
      });
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
    if (!Array.isArray(menuState.mobileDrillPath) || menuState.mobileDrillPath.length === 0) {
      menuState.mobileDrillPath = menuState.activePanelKey ? [menuState.activePanelKey] : [];
    }
  }
  menuState.mobileNavOpen = nextOpen;
  syncMobileNavState();
}

function closeMobileNav() {
  resetMenuAnnouncementState();
  setMobileNavOpen(false);
}

function syncTopNavState() {
  refreshDomRefs();
  topNav?.updateState({
    activePanelKey: menuState.activePanelKey,
    menuOpen: menuState.menuOpen,
    mobileNavOpen: menuState.mobileNavOpen,
    isMobile: isMobileViewport(),
    focusIndex: menuState.topNavFocusIndex,
  });
}

function getTopNavItems() {
  refreshDomRefs();
  return topNav?.getTopNavItems() || [];
}

function getActiveTopNavIndex(items = getTopNavItems()) {
  return items.findIndex(
    (item) => item.classList.contains("fdic-nav-item--button") && item.dataset.panelKey === menuState.activePanelKey
  );
}

function applyTopNavRoving({ focus = false } = {}) {
  const items = getTopNavItems();
  if (items.length === 0) return;

  if (isMobileViewport()) {
    topNav?.updateState({
      activePanelKey: menuState.activePanelKey,
      menuOpen: menuState.menuOpen,
      mobileNavOpen: menuState.mobileNavOpen,
      isMobile: true,
      focusIndex: menuState.topNavFocusIndex,
      focus,
    });
    return;
  }

  const activeIndex = getActiveTopNavIndex(items);
  if (menuState.topNavFocusIndex < 0 || menuState.topNavFocusIndex >= items.length) {
    menuState.topNavFocusIndex = activeIndex >= 0 ? activeIndex : 0;
  }

  topNav?.updateState({
    activePanelKey: menuState.activePanelKey,
    menuOpen: menuState.menuOpen,
    mobileNavOpen: menuState.mobileNavOpen,
    isMobile: false,
    focusIndex: menuState.topNavFocusIndex,
    focus,
  });
}

function resetPanelSelection() {
  const defaultL1Index = getDefaultL1Index();
  menuState.selectedL1Index = defaultL1Index;
  menuState.selectedL2Index = 0;
  menuState.previewL2Index = null;
  menuState.previewingOverview = false;
  menuState.l1FocusIndex = defaultL1Index;
  menuState.mobileDrillPath = [];
}

function renderTopNav() {
  refreshDomRefs();
  const navItems = menuState.siteContent.header?.nav || [];
  if (isMobileViewport()) {
    topNav?.renderItems([]);
    syncTopNavState();
    return;
  }

  topNav?.renderItems(navItems);

  syncTopNavState();
  applyTopNavRoving();
}

function activateTopNavPanel(panelKey, navIndex, { focusMenu = false, forceOpen = false } = {}) {
  menuState.topNavFocusIndex = navIndex;
  if (menuState.activePanelKey === panelKey) {
    if (menuState.menuOpen && forceOpen) {
      if (!focusSelectedL1()) {
        const fallbackTarget = megaMenu?.querySelector(".l1-item, .l2-item, .l3-item");
        if (fallbackTarget instanceof HTMLElement) {
          fallbackTarget.focus();
        }
      }
      closeMobileNav();
      return;
    }

    if (menuState.menuOpen) {
      closeMenu();
    } else {
      openMenu({ focusMenu });
    }
    closeMobileNav();
    return;
  }

  menuState.activePanelKey = panelKey;
  resetPanelSelection();
  announceDesktopPanelContext(panelKey);
  syncTopNavState();
  applyTopNavRoving();
  renderMenuPanel();
  openMenu({ focusMenu });
  closeMobileNav();
}

function previewTopNavPanel(panelKey, navIndex) {
  if (!panelKey) return;
  if (menuState.activePanelKey === panelKey && menuState.menuOpen) return;
  menuState.topNavFocusIndex = navIndex;
  if (menuState.activePanelKey !== panelKey) {
    menuState.activePanelKey = panelKey;
    resetPanelSelection();
    announceDesktopPanelContext(panelKey);
    renderMenuPanel();
  }
  syncTopNavState();
  applyTopNavRoving();
  if (!menuState.menuOpen) {
    openMenu({ focusMenu: false });
  }
}

function handleTopNavRovingRequest({ key, currentIndex, itemCount }) {
  if (!itemCount) return;
  if (key === "ArrowRight") menuState.topNavFocusIndex = (currentIndex + 1) % itemCount;
  if (key === "ArrowLeft") menuState.topNavFocusIndex = (currentIndex - 1 + itemCount) % itemCount;
  if (key === "Home") menuState.topNavFocusIndex = 0;
  if (key === "End") menuState.topNavFocusIndex = itemCount - 1;
  applyTopNavRoving({ focus: true });
}

function focusActiveTopNavButton() {
  const items = getTopNavItems();
  if (items.length === 0) return;
  const activeIndex = getActiveTopNavIndex(items);
  if (activeIndex >= 0) {
    menuState.topNavFocusIndex = activeIndex;
  } else if (menuState.topNavFocusIndex < 0 || menuState.topNavFocusIndex >= items.length) {
    menuState.topNavFocusIndex = 0;
  }
  applyTopNavRoving({ focus: true });
}

function renderMobileDrawerPanel() {
  mobileDrawerController?.renderMobileDrawerPanel();
}

function removeMobileDrawerPanel() {
  mobileDrawerController?.removeMobileDrawerPanel();
}

function openMenu({ focusMenu = false } = {}) {
  refreshDomRefs();
  if (menuState.menuOpen) return;
  menuState.menuOpen = true;
  menuState.menuOpenGuardUntil = performance.now() + 320;
  megaMenu.removeAttribute("aria-hidden");
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
          const fallbackTarget = megaMenu.querySelector(".l1-item, .l2-item, .l3-item");
          if (fallbackTarget instanceof HTMLElement) {
            fallbackTarget.focus();
          }
        }
      }
    }
  });
  if (isMobileViewport()) {
    renderDesktopColumns();
  }
  syncTopNavState();
}

function scheduleMenuSystemFocusExitCheck() {
  refreshDomRefs();
  const runCheck = (attempt = 0) => {
    window.requestAnimationFrame(() => {
      if (!menuState.menuOpen || isMobileViewport()) return;
      const activeElement = document.activeElement;
      if (
        activeElement &&
        (megaMenu.contains(activeElement) || navList.contains(activeElement))
      ) {
        return;
      }

      const guardActive = Number(menuState.menuOpenGuardUntil || 0) > performance.now();
      if (guardActive && attempt < 6) {
        runCheck(attempt + 1);
        return;
      }

      // During keyboard-driven rerenders, focus can briefly fall back to body
      // for multiple frames. Retry before treating it as a real focus exit.
      if ((activeElement === document.body || activeElement === document.documentElement) && attempt < 3) {
        runCheck(attempt + 1);
        return;
      }
      closeMenu();
    });
  };

  runCheck();
}

function closeMenu() {
  resetMenuAnnouncementState();
  refreshDomRefs();
  menuState.menuOpenGuardUntil = 0;
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
  renderDesktopColumns();
  syncTopNavState();
}

function getSelectedL1() {
  return selectSelectedL1(getPanelConfig(), menuState.selectedL1Index);
}

function getVisibleL2Index() {
  return selectVisibleL2Index(menuState.previewL2Index, menuState.selectedL2Index);
}

function getVisibleL2() {
  return selectVisibleL2(getSelectedL1(), getVisibleL2Index());
}

function getL2Overview(selectedL1) {
  return selectL2Overview(selectedL1);
}

function setSelectedL1(index, { restoreFocus = false } = {}) {
  const selectionUnchanged = (
    menuState.selectedL1Index === index
    && menuState.previewL2Index === null
    && !menuState.previewingOverview
  );
  if (selectionUnchanged) {
    if (restoreFocus) {
      megaMenuHost?.focusL1Index(index);
    }
    return;
  }

  refreshDomRefs();
  menuState.selectedL1Index = index;
  menuState.l1FocusIndex = index;
  menuState.selectedL2Index = 0;
  menuState.previewL2Index = null;
  menuState.previewingOverview = false;
  renderDesktopColumns();
  if (restoreFocus) {
    megaMenuHost?.focusL1Index(index);
  }
}

function setPreviewL2(index, { restoreFocus = false, fromFocus = false } = {}) {
  const previewChanged = menuState.previewL2Index !== index || menuState.previewingOverview;
  if (!previewChanged) {
    if (restoreFocus) {
      megaMenuHost?.focusL2Index(index);
    }
    return;
  }
  menuState.previewingOverview = false;
  menuState.previewL2Index = index;
  renderDesktopColumns();
  if (restoreFocus) {
    megaMenuHost?.focusL2Index(index);
  }
}

function setPreviewOverview({ restoreFocus = false, fromFocus = false } = {}) {
  if (menuState.previewL2Index === null && menuState.previewingOverview) {
    if (restoreFocus) {
      megaMenuHost?.focusL2Overview();
    }
    return;
  }
  menuState.previewL2Index = null;
  menuState.previewingOverview = true;
  renderDesktopColumns();
  if (restoreFocus) {
    megaMenuHost?.focusL2Overview();
  }
}

function clearPreviewL2() {
  if (menuState.previewL2Index === null && !menuState.previewingOverview) {
    return;
  }
  menuState.previewL2Index = null;
  menuState.previewingOverview = false;
  renderDesktopColumns();
}

/** Cancel any pending delayed preview reset. Called when the pointer
 *  re-enters an adjacent column before the timer fires. */
function cancelPreviewClear() {
  if (menuState.previewClearTimer) {
    window.clearTimeout(menuState.previewClearTimer);
    menuState.previewClearTimer = null;
  }
}

/** Schedule a preview reset after a short delay (120 ms).
 *  The delay lets the pointer briefly cross column boundaries
 *  (e.g. L2 → L3) without flashing the preview on and off. */
function schedulePreviewClear() {
  cancelPreviewClear();
  menuState.previewClearTimer = window.setTimeout(() => {
    menuState.previewClearTimer = null;
    clearPreviewL2();
  }, 120);
}

function getMegaMenuViewModel() {
  const panel = getPanelConfig();
  const panelLabel = (menuState.siteContent?.header?.nav || []).find(
    (item) => item.kind === "menu" && (item.panelKey || item.id) === menuState.activePanelKey
  )?.label || panel?.overviewLabel || "Menu";
  const selectedL1 = getSelectedL1();
  const l2Overview = getL2Overview(selectedL1);
  const showingPreview = menuState.previewL2Index !== null;
  const selectedL2 = selectedL1?.l2?.[menuState.selectedL2Index] || null;
  const previewL2 = getVisibleL2();
  const activeL2ForHeading = showingPreview && !menuState.previewingOverview ? previewL2 : selectedL2;
  const l1HeadingLabel = `${panelLabel} sections`;
  const l2HeadingLabel = `${selectedL1?.label || "Section"} links`;
  const l3HeadingLabel = `${activeL2ForHeading?.label || "Section"} resources`;
  const descriptionText = menuState.previewingOverview
    ? l2Overview?.description || ""
    : showingPreview
      ? ""
      : selectedL2?.description || "";

  return {
    panelLabel: panel?.ariaLabel || "Site menu",
    isMobile: isMobileViewport(),
    l1Items: getPanelL1(),
    selectedL1Index: menuState.selectedL1Index,
    l1FocusIndex: menuState.l1FocusIndex,
    l2Items: selectedL1?.l2 || [],
    activeL2Index: getVisibleL2Index(),
    l2Overview,
    previewingOverview: menuState.previewingOverview,
    showingPreview,
    l3Items: showingPreview && !menuState.previewingOverview ? (previewL2?.l3 || []) : [],
    l3Description: descriptionText,
    l1HeadingLabel,
    l2HeadingLabel,
    l3HeadingLabel,
  };
}

function renderDesktopColumns() {
  refreshDomRefs();
  megaMenuHost?.updateView(getMegaMenuViewModel());
}

function renderMenuPanel() {
  refreshDomRefs();
  const panel = getPanelConfig();
  if (!panel) {
    megaMenuHost?.updateView({
      panelLabel: "Site menu",
      isMobile: isMobileViewport(),
      l1Items: [],
      l2Items: [],
      l3Items: [],
      l3Description: "",
    });
    return;
  }

  if (isMobileViewport()) {
    megaMenuHost?.updateView({ panelLabel: panel.ariaLabel || "Site menu", isMobile: true });
    renderMobileDrawerPanel();
    return;
  }
  renderDesktopColumns();
}

function focusSelectedL1() {
  refreshDomRefs();
  return megaMenuHost?.focusSelectedL1() || false;
}

function setupEvents() {
  refreshDomRefs();
  const binder = window.bindFDICMenuEvents;
  if (typeof binder !== "function") {
    throw new Error("FDIC events module missing. Ensure events.js is loaded before script.js.");
  }
  binder({
    menuState,
    getDom: () => {
      refreshDomRefs();
      return {
        navToggle,
        mobileSearchToggle,
        mobileSearchRow,
        mobileNavMediaQuery,
        phoneSearchMediaQuery,
        topNav,
        megaMenuHost,
        navList,
        megaMenu,
        l2List,
        l3Column,
        l1Column,
      };
    },
    isMobileViewport,
    isPhoneViewport,
    setMobileSearchOpen,
    closeMobileNav,
    setMobileNavOpen,
    closeMenu,
    openMenu,
    syncMobileNavState,
    renderTopNav,
    renderMenuPanel,
    syncMobileSearchState,
    activateTopNavPanel,
    previewTopNavPanel,
    handleTopNavRovingRequest,
    focusActiveTopNavButton,
    getMobileDrawerFocusableItems,
    handleMobileDelegatedClick: (target) => mobileDrawerController?.handleDelegatedMobileDrillClick(target),
    scheduleMenuSystemFocusExitCheck,
    cancelPreviewClear,
    schedulePreviewClear,
    setPreviewL2,
    setPreviewOverview,
    renderMobileDrawerPanel,
    getTopNavItems,
    setSelectedL1,
  });
}

const initializerFactory = window.createFDICMenuInitializer;
if (typeof initializerFactory !== "function") {
  throw new Error("FDIC init module missing. Ensure init.js is loaded before script.js.");
}

const menuInitializer = initializerFactory({
  menuState,
  refreshDomRefs,
  getDom,
  isMobileViewport,
  applyHeaderContent,
  renderTopNav,
  initializeMobileDrawerController,
  syncMobileNavState,
  syncMobileSearchState,
  renderPageContent,
  renderMenuPanel,
  setupEvents,
  openMenu,
});

menuInitializer.init();
