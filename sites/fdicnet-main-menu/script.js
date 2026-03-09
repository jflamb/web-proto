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
  mobileAccordionOpenIndex: 0,
  mobileTopAccordionOpenKey: null,
  mobileL2Expanded: {},
  mobileNavCloseHandler: null,
  closeTransitionHandler: null,
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
  const response = await fetch("content.yaml", { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Unable to load content.yaml (${response.status})`);
  }
  const text = await response.text();
  return window.jsyaml.load(text);
}

function getPanelConfig() {
  return menuState.siteContent?.menu?.panels?.[menuState.activePanelKey] || null;
}

function getPanelConfigByKey(panelKey) {
  return menuState.siteContent?.menu?.panels?.[panelKey] || null;
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
    });
  } else {
    const wasOpen = navList.classList.contains("is-mobile-open");
    navList.classList.remove("is-mobile-open");
    if (!wasOpen) {
      navList.hidden = true;
      return;
    }
    if (reduceMotionMediaQuery.matches) {
      navList.hidden = true;
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
      }
    };
    navList.addEventListener("transitionend", menuState.mobileNavCloseHandler);
  }
}

function setMobileNavOpen(isOpen) {
  menuState.mobileNavOpen = Boolean(isOpen);
  syncMobileNavState();
}

function closeMobileNav() {
  setMobileNavOpen(false);
}

function syncTopNavState() {
  if (isMobileViewport()) return;
  const buttons = navList.querySelectorAll(".fdic-nav-item--button");
  buttons.forEach((button) => {
    const isActive = button.dataset.panelKey === menuState.activePanelKey;
    button.classList.toggle("fdic-nav-item--selected", isActive);
    button.setAttribute("aria-expanded", isActive && menuState.menuOpen ? "true" : "false");
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
  menuState.mobileAccordionOpenIndex = 0;
}

function getMobileTopAccordionPanelId(panelKey) {
  return `mobileTopPanel-${panelKey}`.replace(/[^a-zA-Z0-9_-]/g, "-");
}

function getMobileL2Key(panelKey, l1Id, l2Id, l2Index) {
  return `${panelKey}__${l1Id || "l1"}__${l2Id || "l2"}__${l2Index}`;
}

function isMobileL2Expanded(key) {
  return menuState.mobileL2Expanded[key] === true;
}

function setMobileL2Expanded(key, expanded) {
  if (expanded) {
    menuState.mobileL2Expanded[key] = true;
  } else {
    delete menuState.mobileL2Expanded[key];
  }
}

function setMobileTopAccordionOpenKey(panelKey) {
  menuState.mobileTopAccordionOpenKey = panelKey;
  if (panelKey) {
    menuState.activePanelKey = panelKey;
  }
  renderTopNav();
}

function buildMobileTopAccordionContent(container, panelKey) {
  const panel = getPanelConfigByKey(panelKey);
  if (!panel) return;

  (panel.l1 || []).forEach((l1Item) => {
    const group = document.createElement("section");
    group.className = "mobile-top-group";

    const heading = document.createElement("h3");
    heading.className = "mobile-top-group-heading";
    heading.textContent = l1Item.label;
    group.appendChild(heading);

    (l1Item.l2 || []).forEach((l2Item, l2Index) => {
      const l2Key = getMobileL2Key(panelKey, l1Item.id, l2Item.id, l2Index);
      const l3PanelId = `mobileTopL3-${l2Key}`.replace(/[^a-zA-Z0-9_-]/g, "-");
      const l2Row = document.createElement("div");
      l2Row.className = "mobile-top-l2-row";

      const l2Link = document.createElement("a");
      l2Link.className = "l2-item mobile-top-l2-link";
      l2Link.href = l2Item.href || "#";
      l2Link.textContent = l2Item.label;
      l2Row.appendChild(l2Link);

      const l3Items = l2Item.l3 || [];
      if (l3Items.length > 0) {
        const toggle = document.createElement("button");
        const expanded = isMobileL2Expanded(l2Key);
        toggle.type = "button";
        toggle.className = "mobile-top-l2-toggle";
        toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
        toggle.setAttribute("aria-controls", l3PanelId);
        toggle.setAttribute("aria-label", `Toggle ${l2Item.label} links`);

        const icon = document.createElement("span");
        icon.className = "mobile-top-l2-toggle-icon ph ph-caret-down";
        icon.setAttribute("aria-hidden", "true");
        toggle.appendChild(icon);
        toggle.addEventListener("click", () => {
          setMobileL2Expanded(l2Key, !expanded);
          renderTopNav();
        });
        l2Row.appendChild(toggle);
      }
      group.appendChild(l2Row);

      const l3ListGroup = document.createElement("ul");
      l3ListGroup.id = l3PanelId;
      l3ListGroup.className = "menu-list mobile-top-l3-list";
      l3ListGroup.hidden = !isMobileL2Expanded(l2Key);
      l3Items.forEach((l3Item) => {
        const l3ListItem = document.createElement("li");
        const l3Link = document.createElement("a");
        l3Link.className = "l3-item mobile-top-l3-link";
        l3Link.href = l3Item.href || "#";
        l3Link.textContent = l3Item.label;
        l3ListItem.appendChild(l3Link);
        l3ListGroup.appendChild(l3ListItem);
      });
      group.appendChild(l3ListGroup);
    });

    container.appendChild(group);
  });

  if (panel.overviewLabel || panel.overviewHref) {
    const overview = document.createElement("a");
    overview.className = "overview-link mobile-top-overview-link";
    overview.href = panel.overviewHref || "#";
    overview.textContent = panel.overviewLabel || "Overview";
    container.appendChild(overview);
  }
}

function renderTopNav() {
  navList.innerHTML = "";
  const navItems = menuState.siteContent.header?.nav || [];
  const mobile = isMobileViewport();

  if (mobile) {
    navList.classList.add("fdic-nav-list--mobile-accordion");
  } else {
    navList.classList.remove("fdic-nav-list--mobile-accordion");
  }

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
      if (mobile) {
        const panelKey = button.dataset.panelKey;
        const panelId = getMobileTopAccordionPanelId(panelKey);
        const isExpanded = menuState.mobileTopAccordionOpenKey === panelKey;
        button.classList.add("fdic-nav-item--mobile-accordion");
        button.setAttribute("aria-expanded", isExpanded ? "true" : "false");
        button.setAttribute("aria-controls", panelId);

        const chevron = document.createElement("span");
        chevron.className = "mobile-top-chevron ph ph-caret-down";
        chevron.setAttribute("aria-hidden", "true");
        button.appendChild(chevron);

        button.addEventListener("click", () => {
          const nextKey = isExpanded ? null : panelKey;
          setMobileTopAccordionOpenKey(nextKey);
        });

        const panel = document.createElement("div");
        panel.id = panelId;
        panel.className = "mobile-top-accordion-panel";
        panel.setAttribute("role", "region");
        panel.setAttribute("aria-labelledby", `${panelId}-button`);
        panel.hidden = !isExpanded;
        button.id = `${panelId}-button`;
        if (isExpanded) {
          buildMobileTopAccordionContent(panel, panelKey);
        }
        li.append(button, panel);
      } else {
        button.addEventListener("click", () => {
          menuState.topNavFocusIndex = Number(button.dataset.navIndex || 0);
          const nextPanel = button.dataset.panelKey;
          if (menuState.activePanelKey === nextPanel) {
            if (menuState.menuOpen) {
              closeMenu();
            } else {
              openMenu();
            }
            closeMobileNav();
            return;
          }
          menuState.activePanelKey = nextPanel;
          resetPanelSelection();
          syncTopNavState();
          applyTopNavRoving();
          renderMenuPanel();
          openMenu();
          closeMobileNav();
        });
        li.appendChild(button);
      }
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

function openMenu() {
  if (isMobileViewport()) return;
  if (menuState.menuOpen) return;
  menuState.menuOpen = true;
  if (menuState.closeTransitionHandler) {
    megaMenu.removeEventListener("transitionend", menuState.closeTransitionHandler);
    menuState.closeTransitionHandler = null;
  }
  megaMenu.hidden = false;
  window.requestAnimationFrame(() => {
    if (menuState.menuOpen) {
      header.classList.add("menu-open");
    }
  });
  if (isMobileViewport()) {
    const l1Items = getPanelL1();
    menuState.mobileAccordionOpenIndex = l1Items.length > 0
      ? Math.min(menuState.selectedL1Index, l1Items.length - 1)
      : null;
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
  header.classList.remove("menu-open");
  if (reduceMotionMediaQuery.matches) {
    megaMenu.hidden = true;
  } else {
    if (menuState.closeTransitionHandler) {
      megaMenu.removeEventListener("transitionend", menuState.closeTransitionHandler);
    }
    menuState.closeTransitionHandler = (event) => {
      if (event.target !== megaMenu) return;
      megaMenu.removeEventListener("transitionend", menuState.closeTransitionHandler);
      menuState.closeTransitionHandler = null;
      if (!menuState.menuOpen) {
        megaMenu.hidden = true;
      }
    };
    megaMenu.addEventListener("transitionend", menuState.closeTransitionHandler);
  }
  menuState.previewL2Index = null;
  menuState.previewingOverview = false;
  renderL2();
  renderL3();
  syncTopNavState();
}

function getMobileAccordionPanelId(index) {
  const panelKey = menuState.activePanelKey || "panel";
  return `mobileAccordionPanel-${panelKey}-${index}`.replace(/[^a-zA-Z0-9_-]/g, "-");
}

function setMobileAccordionOpenIndex(nextIndex) {
  const l1Items = getPanelL1();
  if (typeof nextIndex === "number" && nextIndex >= 0 && nextIndex < l1Items.length) {
    menuState.mobileAccordionOpenIndex = nextIndex;
    menuState.selectedL1Index = nextIndex;
    menuState.selectedL2Index = 0;
  } else {
    menuState.mobileAccordionOpenIndex = null;
  }
  menuState.previewL2Index = null;
  menuState.previewingOverview = false;
  renderL1();
  renderL2();
  renderL3();
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
  menuState.selectedL2Index = 0;
  menuState.previewL2Index = null;
  menuState.previewingOverview = false;
  renderL1();
  renderL2();
  renderL3();
  if (restoreFocus) {
    const target = l1List.querySelector(`.l1-item[data-index="${index}"]`);
    setColumnFocus(l1List, ".l1-item", target);
  }
}

function syncL2ActiveState() {
  const activeIndex = getVisibleL2Index();
  const l2Items = [...l2List.querySelectorAll('.l2-item[data-index]')];
  l2Items.forEach((item) => {
    const itemIndex = Number(item.dataset.index);
    const isActive = Number.isFinite(itemIndex) && itemIndex === activeIndex;
    item.dataset.active = isActive ? "true" : "false";
    if (isActive) {
      item.setAttribute("aria-current", "true");
    } else {
      item.removeAttribute("aria-current");
    }
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
  l1List.innerHTML = "";
  const l1Items = getPanelL1();

  if (isMobileViewport()) {
    l1Items.forEach((l1Item, index) => {
      const li = document.createElement("li");
      const button = document.createElement("button");
      const label = document.createElement("span");
      const chevron = document.createElement("span");
      const panelRegion = document.createElement("div");
      const overview = getL2Overview(l1Item);
      const panelId = getMobileAccordionPanelId(index);
      const buttonId = `${panelId}-button`;
      const isExpanded = menuState.mobileAccordionOpenIndex === index;

      button.type = "button";
      button.id = buttonId;
      button.className = "l1-item l1-item--accordion";
      button.dataset.column = "l1";
      button.dataset.index = String(index);
      button.setAttribute("aria-expanded", isExpanded ? "true" : "false");
      button.setAttribute("aria-controls", panelId);
      button.tabIndex = 0;

      label.className = "l1-label";
      label.textContent = l1Item.label;
      chevron.className = "l1-accordion-chevron ph ph-caret-down";
      chevron.setAttribute("aria-hidden", "true");
      button.append(label, chevron);
      button.addEventListener("click", () => {
        const nextOpenIndex = isExpanded ? null : index;
        setMobileAccordionOpenIndex(nextOpenIndex);
      });
      li.appendChild(button);

      panelRegion.id = panelId;
      panelRegion.className = "mobile-accordion-panel";
      panelRegion.setAttribute("role", "region");
      panelRegion.setAttribute("aria-labelledby", buttonId);
      panelRegion.hidden = !isExpanded;

      (l1Item.l2 || []).forEach((l2Item) => {
        const l2Block = document.createElement("div");
        l2Block.className = "mobile-l2-block";

        const l2Label = document.createElement("p");
        l2Label.className = "mobile-l2-label";
        l2Label.textContent = l2Item.label;
        l2Block.appendChild(l2Label);

        const l3ListGroup = document.createElement("ul");
        l3ListGroup.className = "menu-list mobile-l3-list";
        (l2Item.l3 || []).forEach((l3Item) => {
          const l3ListItem = document.createElement("li");
          const l3Link = document.createElement("a");
          l3Link.className = "l3-item mobile-l3-item";
          l3Link.href = l3Item.href;
          l3Link.textContent = l3Item.label;
          l3ListItem.appendChild(l3Link);
          l3ListGroup.appendChild(l3ListItem);
        });
        l2Block.appendChild(l3ListGroup);
        panelRegion.appendChild(l2Block);
      });

      if (overview) {
        const overviewLink = document.createElement("a");
        overviewLink.className = "overview-link mobile-overview-link";
        overviewLink.href = overview.href || "#";
        overviewLink.textContent = overview.label || "Overview";
        panelRegion.appendChild(overviewLink);
      }

      li.appendChild(panelRegion);
      l1List.appendChild(li);
    });

    l1OverviewLink.textContent = panel?.overviewLabel || selected?.overviewLabel || "Overview";
    l1OverviewLink.href = panel?.overviewHref || selected?.overviewHref || "#";
    l1OverviewLink.dataset.column = "l1";
    l1OverviewLink.dataset.index = String(l1Items.length);
    l1OverviewLink.tabIndex = -1;
    return;
  }

  l1Items.forEach((l1Item, index) => {
    const li = document.createElement("li");
    const button = document.createElement("button");
    const label = document.createElement("span");
    const caret = document.createElement("span");

    button.type = "button";
    button.className = "l1-item";
    button.dataset.column = "l1";
    button.dataset.index = String(index);
    if (index === menuState.selectedL1Index) {
      button.setAttribute("aria-current", "true");
    } else {
      button.removeAttribute("aria-current");
    }
    button.tabIndex = index === menuState.selectedL1Index ? 0 : -1;

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
  l1OverviewLink.tabIndex = l1Items.length === 0 ? 0 : -1;
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
    const button = document.createElement("button");
    const isActive = index === activeIndex;

    button.type = "button";
    button.className = "l2-item";
    button.textContent = l2Item.label;
    button.dataset.column = "l2";
    button.dataset.index = String(index);
    button.dataset.active = isActive ? "true" : "false";
    if (isActive) {
      button.setAttribute("aria-current", "true");
    } else {
      button.removeAttribute("aria-current");
    }
    button.tabIndex = index === 0 ? 0 : -1;

    button.addEventListener("mouseenter", () => setPreviewL2(index));
    button.addEventListener("focus", () => setPreviewL2(index, { fromFocus: true }));
    button.addEventListener("click", () => {
      menuState.selectedL2Index = index;
      menuState.previewingOverview = false;
      menuState.previewL2Index = index;
      renderL2();
      renderL3();
    });

    li.appendChild(button);
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
    overviewLink.href = l2Overview.href || "#";
    overviewLink.textContent = l2Overview.label || "Overview";
    overviewLink.dataset.column = "l2";
    overviewLink.dataset.index = String(l2Items.length);
    overviewLink.tabIndex = l2Items.length === 0 ? 0 : -1;
    overviewLink.addEventListener("mouseenter", () => setPreviewOverview());
    overviewLink.addEventListener("focus", () => setPreviewOverview({ fromFocus: true }));
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
  const target = l1List.querySelector('.l1-item[aria-current="true"]') || l1List.querySelector(".l1-item");
  return setColumnFocus(l1List, ".l1-item", target);
}

function focusActiveL2() {
  const target = l2List.querySelector('.l2-item[aria-current="true"]')
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
    const mobile = isMobileViewport();
    if (!mobile) {
      menuState.mobileAccordionOpenIndex = null;
      menuState.mobileTopAccordionOpenKey = null;
    } else {
      menuState.mobileTopAccordionOpenKey = null;
      const l1Items = getPanelL1();
      menuState.mobileAccordionOpenIndex = l1Items.length > 0
        ? Math.min(menuState.selectedL1Index, l1Items.length - 1)
        : null;
    }
    syncMobileNavState();
    renderTopNav();
    renderMenuPanel();
  });

  narrowHeaderMediaQuery.addEventListener("change", () => {
    syncMobileNavState();
  });

  phoneSearchMediaQuery.addEventListener("change", () => {
    syncMobileSearchState();
  });

  navList.addEventListener("keydown", (event) => {
    if (isMobileViewport()) {
      if ((event.key === "Enter" || event.key === " ") && event.target instanceof HTMLElement) {
        if (event.target.classList.contains("fdic-nav-item--button")) {
          event.preventDefault();
          event.target.click();
        }
      }
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
    if (isMobileViewport() && menuState.mobileNavOpen && menuState.mobileTopAccordionOpenKey) {
      const openKey = menuState.mobileTopAccordionOpenKey;
      const openPanel = document.getElementById(getMobileTopAccordionPanelId(openKey));
      if (openPanel && openPanel.contains(document.activeElement)) {
        event.preventDefault();
        setMobileTopAccordionOpenKey(null);
        const button = navList.querySelector(`.fdic-nav-item--button[data-panel-key="${openKey}"]`);
        if (button) button.focus();
        return;
      }
    }
    if (isMobileViewport() && menuState.menuOpen && typeof menuState.mobileAccordionOpenIndex === "number") {
      const openIndex = menuState.mobileAccordionOpenIndex;
      const openPanel = document.getElementById(getMobileAccordionPanelId(openIndex));
      if (openPanel && openPanel.contains(document.activeElement)) {
        event.preventDefault();
        setMobileAccordionOpenIndex(null);
        const button = l1List.querySelector(`.l1-item[data-index="${openIndex}"]`);
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
    return;
  }

  const navMenuItem = (menuState.siteContent.header?.nav || []).find((item) => item.kind === "menu");
  menuState.activePanelKey = menuState.siteContent.menu?.defaultPanel || navMenuItem?.panelKey || navMenuItem?.id || null;
  menuState.mobileTopAccordionOpenKey = null;

  applyHeaderContent();
  renderTopNav();
  syncMobileNavState();
  syncMobileSearchState();
  renderPageContent();
  renderMenuPanel();
  setupEvents();
  megaMenu.hidden = true;

  if (menuState.siteContent.menu?.openByDefault) {
    openMenu();
  }
}

init();
