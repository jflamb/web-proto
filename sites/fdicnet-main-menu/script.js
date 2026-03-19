const runtime = window.FDICMenuRuntime;
if (!runtime) {
  throw new Error("FDICMenuRuntime missing. Ensure runtime.js is loaded before script.js.");
}

const stateModule = runtime.requireModule("state");
const searchModule = runtime.requireModule("search");

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
   Shared query values come from runtime.js; verify-sync.mjs checks CSS parity. */
const mobileNavMediaQuery = window.matchMedia(runtime.getMobileNavQuery());
const phoneSearchMediaQuery = window.matchMedia(runtime.getPhoneSearchQuery());
const reduceMotionMediaQuery = window.matchMedia(runtime.getReducedMotionQuery());
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
let l2Description = null;
let l3List = null;
let l3Description = null;
let l3Column = null;
let l1Column = null;
let pageTitle = null;
let pageIntro = null;
let desktopSearchInput = null;
let desktopSearchClear = null;
let desktopSearchSubmit = null;
let desktopSearchPanel = null;
let desktopSearchResults = null;
let desktopSearchStatus = null;
let mobileSearchToggle = null;
let mobileSearchRow = null;
let mobileSearchInput = null;
let mobileSearchClear = null;
let mobileSearchSubmit = null;
let mobileSearchResults = null;
let mobileSearchStatus = null;
let mobileNavBackdrop = null;
let mainContent = null;
let mastheadControls = null;
let mastheadWordmark = null;
let menuLiveRegion = null;
let mobileDrawerController = null;
let searchController = null;
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
  l2Description = megaMenuHost?.l2Description || document.getElementById("l2Description");
  l3List = megaMenuHost?.l3List || document.getElementById("l3List");
  l3Description = megaMenuHost?.l3Description || document.getElementById("l3Description");
  l3Column = megaMenuHost?.l3Column || document.querySelector(".mega-col--l3");
  l1Column = megaMenuHost?.l1Column || document.querySelector(".mega-col--l1");
  pageTitle = document.getElementById("pageTitle");
  pageIntro = document.getElementById("pageIntro");
  desktopSearchInput = document.getElementById("desktopSearchInput");
  desktopSearchClear = document.getElementById("desktopSearchClear");
  desktopSearchSubmit = document.getElementById("desktopSearchSubmit");
  desktopSearchPanel = document.getElementById("desktopSearchPanel");
  desktopSearchResults = document.getElementById("desktopSearchResults");
  desktopSearchStatus = document.getElementById("desktopSearchStatus");
  mobileSearchToggle = document.getElementById("mobileSearchToggle");
  mobileSearchRow = document.getElementById("mobileSearchRow");
  mobileSearchInput = document.getElementById("mobileSearchInput");
  mobileSearchClear = document.getElementById("mobileSearchClear");
  mobileSearchSubmit = document.getElementById("mobileSearchSubmit");
  mobileSearchResults = document.getElementById("mobileSearchResults");
  mobileSearchStatus = document.getElementById("mobileSearchStatus");
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
    mobileNavMediaQuery,
    phoneSearchMediaQuery,
    navList,
    navToggle,
    megaMenu,
    l1List,
    l2List,
    l2Description,
    l3List,
    l3Description,
    l3Column,
    l1Column,
    pageTitle,
    pageIntro,
    desktopSearchInput,
    desktopSearchClear,
    desktopSearchSubmit,
    desktopSearchPanel,
    desktopSearchResults,
    desktopSearchStatus,
    mobileSearchToggle,
    mobileSearchRow,
    mobileSearchInput,
    mobileSearchClear,
    mobileSearchSubmit,
    mobileSearchResults,
    mobileSearchStatus,
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

function getL1FallbackDescription(item, { panelLabel = "this section", isOverview = false } = {}) {
  const label = item?.label || "this section";
  if (isOverview) {
    return `Start with the full ${panelLabel} overview, then jump to the area you need.`;
  }
  return `Explore ${label} services, guidance, and related resources.`;
}

function getL1MenuDescription(item, { panelLabel = "this section", isOverview = false } = {}) {
  const explicitDescription = item?.description || selectL2Overview(item)?.description || "";
  if (explicitDescription) {
    return explicitDescription;
  }
  return getL1FallbackDescription(item, { panelLabel, isOverview });
}

function getValidMobileDrillPath(path) {
  if (!Array.isArray(path)) return null;
  if (path.length === 0) return [];

  const [panelKey, l1Index, l2Index] = path;
  if (typeof panelKey !== "string" || panelKey.length === 0) return null;

  const panelConfig = getPanelConfigByKey(panelKey);
  if (!panelConfig) return null;

  if (typeof l1Index !== "number") {
    return [panelKey];
  }

  const l1Items = panelConfig.l1 || [];
  if (l1Index < 0 || l1Index >= l1Items.length) {
    return [panelKey];
  }

  if (typeof l2Index !== "number") {
    return [panelKey, l1Index];
  }

  const l2Items = l1Items[l1Index]?.l2 || [];
  if (l2Index < 0 || l2Index >= l2Items.length) {
    return [panelKey, l1Index];
  }

  return [panelKey, l1Index, l2Index];
}

function getMobilePanelKeys() {
  return selectMobilePanelKeys(menuState.siteContent);
}

function getPanelL1() {
  return selectPanelL1(getPanelConfig());
}

function getDefaultL1Index(panel = getPanelConfig()) {
  const l1Items = panel?.l1 || [];
  return l1Items.length > 1 ? null : 0;
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

function renderPageContent() {
  pageTitle.textContent = menuState.siteContent.page?.title || "";
  pageIntro.innerHTML = "";
  (menuState.siteContent.page?.intro || []).forEach((line) => {
    const paragraph = document.createElement("p");
    paragraph.textContent = line;
    pageIntro.appendChild(paragraph);
  });
}

function getSearchController() {
  if (searchController) {
    return searchController;
  }
  searchController = searchModule.createFDICMenuSearchController({
    menuState,
    getDom,
    isMobileViewport,
    isPhoneViewport,
    closeMenu,
    closeMobileNav,
    setMobileNavOpen,
    renderMobileDrawerPanel,
    renderTopNav,
    renderMenuPanel,
    getTopNavItems,
    focusSelectedL1,
    getMobileDrawerFocusableItems,
    openMenu,
    resetPanelSelection,
    getL2Overview,
    syncMobileSearchState,
  });
  return searchController;
}

function applyHeaderContent() {
  getSearchController().applyHeaderContent();
}

function openMobileSearch(options) {
  getSearchController().openMobileSearch(options);
}

function closeMobileSearch(options) {
  getSearchController().closeMobileSearch(options);
}

function initializeSiteSearch() {
  getSearchController().initializeSiteSearch();
}

function isMobileViewport() {
  return mobileNavMediaQuery.matches;
}

function isPhoneViewport() {
  return phoneSearchMediaQuery.matches;
}

function syncMobileBackdropState() {
  if (!mobileNavBackdrop) return;
  const isOpen = isMobileViewport() && (menuState.mobileNavOpen || menuState.mobileSearchOpen);
  mobileNavBackdrop.hidden = !isOpen;
  mobileNavBackdrop.classList.toggle("is-visible", isOpen);
}

function syncMobileSearchState({ focus = false } = {}) {
  if (!mobileSearchToggle || !mobileSearchRow) return;
  const phone = isPhoneViewport();
  mobileSearchToggle.hidden = !phone;
  if (!phone) {
    menuState.mobileSearchOpen = false;
    if (menuState.mobileSearchCloseHideTimer) {
      window.clearTimeout(menuState.mobileSearchCloseHideTimer);
      menuState.mobileSearchCloseHideTimer = null;
    }
    mobileSearchRow.classList.remove("is-open");
    mobileSearchToggle.setAttribute("aria-expanded", "false");
    mobileSearchToggle.setAttribute("aria-label", "Open search");
    mobileSearchRow.hidden = true;
    document.body.classList.remove("mobile-search-open");
    syncMobileBackdropState();
    syncMobileBackgroundInertState();
    return;
  }
  mobileSearchToggle.setAttribute("aria-expanded", menuState.mobileSearchOpen ? "true" : "false");
  mobileSearchToggle.setAttribute("aria-label", menuState.mobileSearchOpen ? "Close search" : "Open search");
  document.body.classList.toggle("mobile-search-open", menuState.mobileSearchOpen);
  if (menuState.mobileSearchCloseHideTimer) {
    window.clearTimeout(menuState.mobileSearchCloseHideTimer);
    menuState.mobileSearchCloseHideTimer = null;
  }
  if (menuState.mobileSearchOpen) {
    mobileSearchRow.hidden = false;
    // Force reflow so the browser registers the initial (off-screen) state
    // before we add is-open — this preserves the slide-in CSS transition.
    void mobileSearchRow.offsetHeight;
    mobileSearchRow.classList.add("is-open");
    if (focus && menuState.mobileSearchOpen && mobileSearchInput) {
      mobileSearchInput.focus();
      mobileSearchInput.select();
    }
  } else {
    mobileSearchRow.classList.remove("is-open");
    if (reduceMotionMediaQuery.matches) {
      mobileSearchRow.hidden = true;
    } else {
      menuState.mobileSearchCloseHideTimer = window.setTimeout(() => {
        menuState.mobileSearchCloseHideTimer = null;
        if (!menuState.mobileSearchOpen) {
          mobileSearchRow.hidden = true;
        }
      }, 240);
    }
  }
  syncMobileBackdropState();
  syncMobileBackgroundInertState();
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
  const shouldInertMain = isMobileViewport() && (menuState.mobileNavOpen || menuState.mobileSearchOpen);
  setInertState(mainContent, shouldInertMain);
  setInertState(mastheadControls, isMobileViewport() && menuState.mobileNavOpen);
  setInertState(mastheadWordmark, shouldInertMain);
  setInertState(navList, isMobileViewport() && menuState.mobileSearchOpen);
  setInertState(mobileSearchRow, isMobileViewport() && menuState.mobileNavOpen);
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

function getMobileDrawerFocusableItems() {
  const drillItems = [...navList.querySelectorAll(
    ".mobile-drill-back, .mobile-drill-trigger, .mobile-drill-link, .mobile-drill-current-link"
  )];
  if (drillItems.length > 0) {
    return drillItems;
  }
  return [...navList.querySelectorAll(".fdic-nav-item")];
}

function ensureMobileMenuFocus({ force = false, attempts = 2 } = {}) {
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
  const { createFDICMobileDrawerController: createController } = runtime.requireModule("mobileDrawer");
  if (typeof createController !== "function") {
    throw new Error("FDIC mobile drawer module missing. Ensure mobile-drawer.js is loaded before script.js.");
  }
  mobileDrawerController = createController({
    menuState,
    reduceMotionMediaQuery,
    MOBILE_STAGGER_MAX_ITEMS,
    MOBILE_STAGGER_STEP_MS,
    isMobileViewport,
    getNavList: () => navList,
    getMobilePanelKeys,
    getPanelConfigByKey,
    syncMobileToggleButton,
    ensureMobileMenuFocus,
    triggerLightHaptic,
    announceMenuContext,
  });
}

function syncMobileNavState() {
  if (!navToggle) return;
  const mobile = isMobileViewport();
  navToggle.hidden = !mobile;
  if (!mobile) {
    menuState.mobileNavOpen = false;
    header.classList.remove("mobile-menu-open");
    navList.hidden = false;
    navList.classList.remove("is-mobile-open");
    if (menuState.mobileNavCloseHandler) {
      navList.removeEventListener("transitionend", menuState.mobileNavCloseHandler);
      menuState.mobileNavCloseHandler = null;
    }
    if (menuState.mobileNavCloseHideTimer) {
      window.clearTimeout(menuState.mobileNavCloseHideTimer);
      menuState.mobileNavCloseHideTimer = null;
    }
    if (mobileNavBackdrop) {
      syncMobileBackdropState();
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
  syncMobileBackdropState();
  syncMobileBackgroundInertState();

  if (menuState.mobileNavOpen) {
    if (menuState.mobileNavCloseHandler) {
      navList.removeEventListener("transitionend", menuState.mobileNavCloseHandler);
      menuState.mobileNavCloseHandler = null;
    }
    if (menuState.mobileNavCloseHideTimer) {
      window.clearTimeout(menuState.mobileNavCloseHideTimer);
      menuState.mobileNavCloseHideTimer = null;
    }
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
    if (menuState.mobileNavCloseHideTimer) {
      window.clearTimeout(menuState.mobileNavCloseHideTimer);
      menuState.mobileNavCloseHideTimer = null;
    }
    menuState.mobileNavCloseHandler = (event) => {
      if (event.target !== navList) return;
      navList.removeEventListener("transitionend", menuState.mobileNavCloseHandler);
      menuState.mobileNavCloseHandler = null;
      if (menuState.mobileNavCloseHideTimer) {
        window.clearTimeout(menuState.mobileNavCloseHideTimer);
        menuState.mobileNavCloseHideTimer = null;
      }
      if (!menuState.mobileNavOpen) {
        navList.hidden = true;
        removeMobileDrawerPanel();
      }
    };
    navList.addEventListener("transitionend", menuState.mobileNavCloseHandler);
    menuState.mobileNavCloseHideTimer = window.setTimeout(() => {
      menuState.mobileNavCloseHideTimer = null;
      if (menuState.mobileNavCloseHandler) {
        navList.removeEventListener("transitionend", menuState.mobileNavCloseHandler);
        menuState.mobileNavCloseHandler = null;
      }
      if (!menuState.mobileNavOpen) {
        navList.hidden = true;
        removeMobileDrawerPanel();
      }
    }, 240);
  }
}

function setMobileNavOpen(isOpen) {
  const nextOpen = Boolean(isOpen);
  if (nextOpen && !menuState.mobileNavOpen) {
    const currentPath = getValidMobileDrillPath(menuState.mobileDrillPath);
    const savedPath = getValidMobileDrillPath(menuState.lastMobileDrillPath);

    if (Array.isArray(currentPath) && currentPath.length > 0) {
      menuState.mobileDrillPath = currentPath;
    } else if (Array.isArray(savedPath)) {
      menuState.mobileDrillPath = savedPath;
    } else {
      menuState.mobileDrillPath = menuState.activePanelKey ? [menuState.activePanelKey] : [];
    }
  }

  if (!nextOpen) {
    menuState.lastMobileDrillPath = Array.isArray(menuState.mobileDrillPath) ? [...menuState.mobileDrillPath] : [];
  }

  menuState.mobileNavOpen = nextOpen;
  syncMobileNavState();
}

function closeMobileNav() {
  resetMenuAnnouncementState();
  setMobileNavOpen(false);
}

function updateSpotlightPosition() {
  const megaMenuInner = megaMenuHost?.querySelector(".mega-menu-inner");
  if (!megaMenuInner) return;

  const items = getTopNavItems();
  const activeIndex = getActiveTopNavIndex(items);
  const activeButton = activeIndex >= 0 ? items[activeIndex] : null;

  if (!activeButton) {
    megaMenuInner.style.removeProperty("--spotlight-x");
    return;
  }

  const buttonRect = activeButton.getBoundingClientRect();
  const innerRect = megaMenuInner.getBoundingClientRect();
  const centerX = buttonRect.left + buttonRect.width / 2 - innerRect.left;
  megaMenuInner.style.setProperty("--spotlight-x", `${centerX}px`);
}

function syncTopNavState() {
  topNav?.updateState({
    activePanelKey: menuState.activePanelKey,
    menuOpen: menuState.menuOpen,
    mobileNavOpen: menuState.mobileNavOpen,
    isMobile: isMobileViewport(),
    focusIndex: menuState.topNavFocusIndex,
  });
}

function getTopNavItems() {
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
  menuState.lastMobileDrillPath = null;
}

function renderTopNav() {
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
  updateSpotlightPosition();
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
  updateSpotlightPosition();
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
      updateSpotlightPosition();
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

/** Schedule a preview reset after a short delay (180 ms).
 *  The delay lets the pointer briefly cross column boundaries
 *  (e.g. L2 → L3) without flashing the preview on and off. */
function schedulePreviewClear() {
  cancelPreviewClear();
  menuState.previewClearTimer = window.setTimeout(() => {
    menuState.previewClearTimer = null;
    clearPreviewL2();
  }, 180);
}

function getMegaMenuViewModel() {
  const panel = getPanelConfig();
  const panelLabel = (menuState.siteContent?.header?.nav || []).find(
    (item) => item.kind === "menu" && (item.panelKey || item.id) === menuState.activePanelKey
  )?.label || panel?.overviewLabel || "Menu";
  const rawL1Items = getPanelL1();
  const l1Items = rawL1Items.map((item, index) => ({
    ...item,
    menuDescription: getL1MenuDescription(item, {
      panelLabel,
      isOverview: index === 0 && rawL1Items.length > 1,
    }),
  }));
  const rawSelectedL1 = rawL1Items[menuState.selectedL1Index] || null;
  const selectedL1 = l1Items[menuState.selectedL1Index] || null;
  const l2Overview = getL2Overview(rawSelectedL1);
  const showingPreview = menuState.previewL2Index !== null;
  const selectedL2 = selectedL1?.l2?.[menuState.selectedL2Index] || null;
  const previewL2 = getVisibleL2();
  const activeL2ForHeading = showingPreview && !menuState.previewingOverview ? previewL2 : selectedL2;
  const activeL3Items = showingPreview && !menuState.previewingOverview ? (previewL2?.l3 || []) : [];
  const l1HeadingLabel = `${panelLabel} sections`;
  const l2HeadingLabel = `${selectedL1?.label || "Section"} links`;
  const l3HeadingLabel = `${activeL2ForHeading?.label || "Section"} resources`;
  const hasActiveL3Items = activeL3Items.length > 0;
  const currentDefaultL1Description = rawSelectedL1?.description
    || l2Overview?.description
    || "";
  const modeDefaultL1Description = selectedL1?.menuDescription || currentDefaultL1Description;
  const l2Description = modeDefaultL1Description;
  const defaultL3Description = menuState.previewingOverview
    ? l2Overview?.description || ""
    : showingPreview
      ? (hasActiveL3Items ? "" : previewL2?.description || "")
      : currentDefaultL1Description;
  const l3Description = showingPreview
    && !menuState.previewingOverview
    && hasActiveL3Items
    ? (previewL2?.description || "")
    : defaultL3Description;

  return {
    panelKey: menuState.activePanelKey || "",
    panelLabel: panel?.ariaLabel || "Site menu",
    isMobile: isMobileViewport(),
    showEmptyState: menuState.selectedL1Index === null,
    l1Items,
    selectedL1Index: menuState.selectedL1Index,
    l1FocusIndex: menuState.l1FocusIndex,
    l1Description: panel?.description || "",
    l2Items: selectedL1?.l2 || [],
    activeL2Index: getVisibleL2Index(),
    l2Overview,
    previewingOverview: menuState.previewingOverview,
    showingPreview,
    l3Items: activeL3Items,
    l2Description,
    l3Description,
    l1HeadingLabel,
    l2HeadingLabel,
    l3HeadingLabel,
  };
}

function renderDesktopColumns() {
  megaMenuHost?.updateView(getMegaMenuViewModel());
}

function renderMenuPanel() {
  const panel = getPanelConfig();
  if (!panel) {
    megaMenuHost?.updateView({
      panelKey: menuState.activePanelKey || "",
      panelLabel: "Site menu",
      isMobile: isMobileViewport(),
      l1Items: [],
      l2Items: [],
      l3Items: [],
      l2Description: "",
      l3Description: "",
    });
    return;
  }

  if (isMobileViewport()) {
    megaMenuHost?.updateView({
      panelKey: menuState.activePanelKey || "",
      panelLabel: panel.ariaLabel || "Site menu",
      isMobile: true,
    });
    renderMobileDrawerPanel();
    return;
  }
  renderDesktopColumns();
}

function focusSelectedL1() {
  return megaMenuHost?.focusSelectedL1() || false;
}

function setupEvents() {
  refreshDomRefs();
  const { bindFDICMenuEvents: binder } = runtime.requireModule("events");
  if (typeof binder !== "function") {
    throw new Error("FDIC events module missing. Ensure events.js is loaded before script.js.");
  }
  binder({
    menuState,
    getDom,
    refreshDomRefs,
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

const { createFDICMenuInitializer: initializerFactory } = runtime.requireModule("init");
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
  initializeSiteSearch,
  openMenu,
});

menuInitializer.init();
