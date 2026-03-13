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
let desktopSearchClear = null;
let desktopSearchSubmit = null;
let desktopSearchPanel = null;
let desktopSearchResults = null;
let desktopSearchStatus = null;
let mobileSearchToggle = null;
let mobileSearchRow = null;
let mobileSearchInput = null;
let mobileSearchBackdrop = null;
let mobileSearchClose = null;
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
let liveAnnouncementTimer = null;
let lastLiveAnnouncement = "";
let searchIndex = [];
let searchSuggestions = [];
let searchActiveIndex = -1;
let searchDebounceTimer = null;
let searchReturnFocus = null;
let activeSearchSurface = "desktop";
let suppressDesktopSearchFocusSuggestions = false;
const SEARCH_DEBOUNCE_MS = 180;

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
  desktopSearchClear = document.getElementById("desktopSearchClear");
  desktopSearchSubmit = document.getElementById("desktopSearchSubmit");
  desktopSearchPanel = document.getElementById("desktopSearchPanel");
  desktopSearchResults = document.getElementById("desktopSearchResults");
  desktopSearchStatus = document.getElementById("desktopSearchStatus");
  mobileSearchToggle = document.getElementById("mobileSearchToggle");
  mobileSearchRow = document.getElementById("mobileSearchRow");
  mobileSearchInput = document.getElementById("mobileSearchInput");
  mobileSearchBackdrop = document.getElementById("mobileSearchBackdrop");
  mobileSearchClose = document.getElementById("mobileSearchClose");
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
    mobileSearchBackdrop,
    mobileSearchClose,
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
  return l1Items.length > 1 ? 1 : 0;
}

function normalizeLauncherText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function getGeneratedMenuDescription(label, parentLabel = "") {
  const subject = String(label || "").trim();
  if (!subject) return "";
  const normalized = subject.toLowerCase();
  const parentPhrase = parentLabel ? ` in ${parentLabel}` : "";

  if (normalized.includes("overview")) {
    const target = subject.replace(/\s+Overview$/i, "") || subject;
    return `Start here for key links, updates, and guidance related to ${target}.`;
  }
  if (normalized.includes("frequently asked questions") || normalized.endsWith(" faq") || normalized.includes("faq")) {
    return `Get answers to common questions about ${subject}${parentPhrase}.`;
  }
  if (["view all", "all"].includes(normalized)) {
    return parentLabel
      ? `Browse the full set of links and resources available in ${parentLabel}.`
      : "Browse the full set of available links and resources.";
  }
  if (["training", "learning", "onboarding", "coaching", "mentoring", "leadership", "development", "program", "programs", "course", "courses"].some((word) => normalized.includes(word))) {
    return `Find learning details, requirements, and related resources for ${subject}${parentPhrase}.`;
  }
  if (["policy", "policies", "procedure", "procedures", "manual", "directive", "directives", "guidance", "standards"].some((word) => normalized.includes(word))) {
    return `Review guidance, requirements, and reference materials for ${subject}${parentPhrase}.`;
  }
  if (["calendar", "events", "conference", "conferences", "news", "messages", "podcast", "media", "briefing"].some((word) => normalized.includes(word))) {
    return `View updates, schedules, and related materials for ${subject}${parentPhrase}.`;
  }
  if (["benefit", "benefits", "pay", "retirement", "leave", "insurance", "wellness", "compensation", "health"].some((word) => normalized.includes(word))) {
    return `Learn about options, eligibility, and related guidance for ${subject}${parentPhrase}.`;
  }
  if (["service", "services", "support", "assistance", "help", "contacts", "directory"].some((word) => normalized.includes(word))) {
    return `Find support details, contacts, and next steps for ${subject}${parentPhrase}.`;
  }
  if (["form", "forms", "template", "templates", "request", "requests", "reservation", "reservations", "codes"].some((word) => normalized.includes(word))) {
    return `Access forms, instructions, and supporting materials for ${subject}${parentPhrase}.`;
  }
  return `Access key information, related links, and supporting materials for ${subject}${parentPhrase}.`;
}

function extractLauncherAliasData(label) {
  const parentheticalAliases = new Set();
  const derivedAcronyms = new Set();
  const rawLabel = String(label || "");
  const parentheticalMatches = [...rawLabel.matchAll(/\(([^)]+)\)/g)];
  parentheticalMatches.forEach(([, match]) => {
    const normalizedMatch = normalizeLauncherText(match);
    if (!normalizedMatch) return;
    parentheticalAliases.add(normalizedMatch);
    normalizedMatch.split(" ").forEach((token) => {
      if (token.length >= 2) parentheticalAliases.add(token);
    });
  });

  const acronymSource = normalizeLauncherText(rawLabel.replace(/\([^)]*\)/g, " "));
  const acronymWords = acronymSource
    .split(" ")
    .filter((word) => word && !["a", "an", "and", "for", "of", "the", "to"].includes(word));
  if (acronymWords.length >= 2) {
    derivedAcronyms.add(acronymWords.map((word) => word[0]).join(""));
  }

  return {
    parentheticalAliases: [...parentheticalAliases],
    derivedAcronyms: [...derivedAcronyms],
  };
}

function createLauncherEntry({
  id,
  label,
  kind,
  href = "#",
  panelKey,
  panelLabel,
  l1Index = null,
  l1Label = "",
  l2Index = null,
  l2Label = "",
  l3Index = null,
  description = "",
}) {
  const crumbs = [panelLabel, l1Label, l2Label].filter(Boolean);
  const normalizedLabel = normalizeLauncherText(label);
  const normalizedCrumbs = normalizeLauncherText(crumbs.join(" "));
  const normalizedDescription = normalizeLauncherText(description);
  const labelTokens = normalizedLabel ? normalizedLabel.split(" ") : [];
  const { parentheticalAliases, derivedAcronyms } = extractLauncherAliasData(label);
  return {
    id,
    label: label || "Untitled",
    kind,
    href: href || "#",
    panelKey,
    panelLabel,
    l1Index,
    l1Label,
    l2Index,
    l2Label,
    l3Index,
    description: description || "",
    crumbs,
    normalizedLabel,
    labelTokens,
    parentheticalAliases,
    derivedAcronyms,
    searchText: [normalizedLabel, normalizedCrumbs, normalizedDescription].filter(Boolean).join(" "),
  };
}

function buildLauncherIndex(siteContent) {
  const navItems = siteContent?.header?.nav || [];
  const panels = siteContent?.menu?.panels || {};
  const entries = [];

  navItems
    .filter((item) => item.kind === "menu")
    .forEach((navItem) => {
      const panelKey = navItem.panelKey || navItem.id;
      const panel = panels[panelKey];
      if (!panel) return;
      const panelLabel = navItem.label || panel.overviewLabel || "Menu";

      entries.push(createLauncherEntry({
        id: `panel:${panelKey}`,
        label: panelLabel,
        kind: "Panel",
        href: panel.overviewHref || "#",
        panelKey,
        panelLabel,
        description: panel.ariaLabel || "",
      }));

      (panel.l1 || []).forEach((l1Item, l1Index) => {
        entries.push(createLauncherEntry({
          id: `l1:${panelKey}:${l1Index}`,
          label: l1Item.label,
          kind: l1Index === 0 ? "Panel overview" : "Section",
          href: l1Item.overviewHref || l1Item.href || "#",
          panelKey,
          panelLabel,
          l1Index,
          l1Label: l1Item.label,
          description: l1Item.description || "",
        }));

        const l2Overview = getL2Overview(l1Item);
        if (l2Overview) {
          entries.push(createLauncherEntry({
            id: `l2overview:${panelKey}:${l1Index}`,
            label: l2Overview.label,
            kind: "Section overview",
            href: l2Overview.href || "#",
            panelKey,
            panelLabel,
            l1Index,
            l1Label: l1Item.label,
            description: l2Overview.description || "",
          }));
        }

        (l1Item.l2 || []).forEach((l2Item, l2Index) => {
          entries.push(createLauncherEntry({
            id: `l2:${panelKey}:${l1Index}:${l2Index}`,
            label: l2Item.label,
            kind: "Link",
            href: l2Item.href || "#",
            panelKey,
            panelLabel,
            l1Index,
            l1Label: l1Item.label,
            l2Index,
            l2Label: l2Item.label,
            description: l2Item.description || "",
          }));

          (l2Item.l3 || []).forEach((l3Item, l3Index) => {
            entries.push(createLauncherEntry({
              id: `l3:${panelKey}:${l1Index}:${l2Index}:${l3Index}`,
              label: l3Item.label,
              kind: "Resource",
              href: l3Item.href || "#",
              panelKey,
              panelLabel,
              l1Index,
              l1Label: l1Item.label,
              l2Index,
              l2Label: l2Item.label,
              l3Index,
              description: l3Item.description || "",
            }));
          });
        });
      });
    });

  return entries;
}

function getLauncherShortcutLabel() {
  const isMac = /Mac|iPhone|iPad|iPod/.test(window.navigator.platform || "");
  return isMac ? "Cmd+G" : "Ctrl+/";
}

function getLauncherMatchRank(entry, query) {
  if (!query) return Number.POSITIVE_INFINITY;
  const label = entry.normalizedLabel || normalizeLauncherText(entry.label);
  if (label === query) return 0;
  if (entry.parentheticalAliases?.includes(query)) return 1;
  if (label.startsWith(query)) return 2;
  if (entry.derivedAcronyms?.includes(query)) return 3;
  if (entry.labelTokens?.includes(query)) return 4;
  if (label.includes(query)) return 5;
  return Number.POSITIVE_INFINITY;
}

function getLauncherMatches(query) {
  const normalizedQuery = normalizeLauncherText(query);
  if (!normalizedQuery) {
    return [];
  }

  return searchIndex
    .map((entry) => ({ entry, rank: getLauncherMatchRank(entry, normalizedQuery) }))
    .filter((item) => Number.isFinite(item.rank))
    .sort((left, right) => {
      if (left.rank !== right.rank) return left.rank - right.rank;
      return left.entry.label.localeCompare(right.entry.label);
    })
    .slice(0, 8)
    .map((item) => item.entry);
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

function getSearchResultsElement() {
  return activeSearchSurface === "mobile" ? mobileSearchResults : desktopSearchResults;
}

function getSearchStatusElement() {
  return activeSearchSurface === "mobile" ? mobileSearchStatus : desktopSearchStatus;
}

function getSearchInputElement() {
  return activeSearchSurface === "mobile" ? mobileSearchInput : desktopSearchInput;
}

function getSearchQuery() {
  return getSearchInputElement()?.value?.trim() || "";
}

function setSearchQuery(value) {
  if (desktopSearchInput) desktopSearchInput.value = value;
  if (mobileSearchInput) mobileSearchInput.value = value;
  syncSearchClearButtons(value);
}

function syncSearchClearButtons(value = null) {
  const nextValue = typeof value === "string" ? value : desktopSearchInput?.value || mobileSearchInput?.value || "";
  const hasValue = nextValue.trim().length > 0;
  if (desktopSearchClear) desktopSearchClear.hidden = !hasValue;
  if (mobileSearchClear) mobileSearchClear.hidden = !hasValue;
}

function getSearchResultsUrl(query) {
  const url = new URL("search.html", window.location.href);
  url.searchParams.set("q", query);
  return url.toString();
}

function isTopLevelSearchEntry(entry) {
  return entry?.l1Index === null && entry?.l2Index === null && entry?.l3Index === null;
}

function buildSearchActions(query) {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return [];
  const menuMatches = getLauncherMatches(trimmedQuery).map((entry) => ({ type: "menu", entry }));
  return [
    ...menuMatches,
    {
      type: "search-all",
      query: trimmedQuery,
      label: `Search all FDICnet for "${trimmedQuery}"`,
      href: getSearchResultsUrl(trimmedQuery),
    },
  ];
}

function syncSearchComboboxState() {
  const input = getSearchInputElement();
  const results = getSearchResultsElement();
  if (!(input instanceof HTMLElement) || !(results instanceof HTMLElement)) return;
  input.setAttribute("role", "combobox");
  input.setAttribute("aria-expanded", searchSuggestions.length > 0 ? "true" : "false");
  input.setAttribute("aria-controls", results.id);
  input.setAttribute("aria-autocomplete", "list");
  input.setAttribute("aria-haspopup", "listbox");
  if (searchActiveIndex >= 0) {
    input.setAttribute("aria-activedescendant", `site-search-option-${searchActiveIndex}`);
  } else {
    input.removeAttribute("aria-activedescendant");
  }
}

function setDesktopSearchPanelOpen(isOpen) {
  if (!desktopSearchPanel) return;
  desktopSearchPanel.hidden = !isOpen;
}

function clearSearchDebounce() {
  if (searchDebounceTimer) {
    window.clearTimeout(searchDebounceTimer);
    searchDebounceTimer = null;
  }
}

function closeDesktopSearchPanel() {
  searchSuggestions = [];
  searchActiveIndex = -1;
  setDesktopSearchPanelOpen(false);
  if (desktopSearchResults) desktopSearchResults.innerHTML = "";
  if (desktopSearchStatus) desktopSearchStatus.textContent = "";
  syncSearchClearButtons();
  syncSearchComboboxState();
}

function openMobileSearch({ focus = false } = {}) {
  searchReturnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : mobileSearchToggle;
  setSearchQuery(desktopSearchInput?.value || mobileSearchInput?.value || "");
  closeMenu();
  closeMobileNav();
  menuState.mobileSearchOpen = true;
  syncMobileSearchState({ focus });
  activeSearchSurface = "mobile";
  syncSearchClearButtons();
  if (getSearchQuery()) {
    scheduleSearchSuggestions("mobile");
  }
}

function closeMobileSearch({ restoreFocus = true } = {}) {
  menuState.mobileSearchOpen = false;
  syncMobileSearchState();
  searchSuggestions = [];
  searchActiveIndex = -1;
  if (mobileSearchResults) mobileSearchResults.innerHTML = "";
  if (mobileSearchStatus) mobileSearchStatus.textContent = "";
  syncSearchClearButtons();
  if (restoreFocus && searchReturnFocus instanceof HTMLElement && searchReturnFocus.isConnected) {
    searchReturnFocus.focus();
  }
}

function renderSearchSuggestions() {
  const results = getSearchResultsElement();
  const status = getSearchStatusElement();
  const query = getSearchQuery();
  if (!(results instanceof HTMLElement) || !(status instanceof HTMLElement)) return;

  searchSuggestions = buildSearchActions(query);
  searchActiveIndex = -1;
  results.innerHTML = "";

  if (searchSuggestions.length === 0) {
    status.textContent = query ? `No menu matches for "${query}".` : "";
    if (activeSearchSurface === "desktop") {
      closeDesktopSearchPanel();
    }
    syncSearchComboboxState();
    return;
  }

  searchSuggestions.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = `site-search-item site-search-option${item.type === "search-all" ? " site-search-option--action" : ""}`;
    li.id = `site-search-option-${index}`;
    li.setAttribute("role", "option");
    li.setAttribute("aria-selected", "false");
    li.dataset.index = String(index);

    const title = document.createElement("span");
    title.className = "site-search-option-title";
    title.textContent = item.type === "menu" ? item.entry.label : item.label;
    li.appendChild(title);

    if (item.type === "menu" && !isTopLevelSearchEntry(item.entry) && item.entry.crumbs.length > 0) {
      const meta = document.createElement("span");
      meta.className = "site-search-option-meta";
      meta.textContent = item.entry.crumbs.join(" / ");
      li.appendChild(meta);
    }

    results.appendChild(li);
  });

  status.textContent = `${searchSuggestions.length} suggestion${searchSuggestions.length === 1 ? "" : "s"} available.`;
  results.scrollTop = 0;
  if (activeSearchSurface === "desktop") {
    setDesktopSearchPanelOpen(true);
  }
  syncSearchComboboxState();
}

function scheduleSearchSuggestions(surface) {
  activeSearchSurface = surface;
  const query = getSearchQuery();
  clearSearchDebounce();
  syncSearchClearButtons(query);

  if (!query) {
    searchSuggestions = [];
    searchActiveIndex = -1;
    const results = getSearchResultsElement();
    const status = getSearchStatusElement();
    if (results) results.innerHTML = "";
    if (status) status.textContent = "";
    if (surface === "desktop") {
      closeDesktopSearchPanel();
    }
    syncSearchComboboxState();
    return;
  }

  searchDebounceTimer = window.setTimeout(() => {
    searchDebounceTimer = null;
    renderSearchSuggestions();
  }, SEARCH_DEBOUNCE_MS);
}

function setSearchActiveIndex(index) {
  searchActiveIndex = index >= 0 && index < searchSuggestions.length ? index : -1;
  const results = getSearchResultsElement();
  if (!(results instanceof HTMLElement)) return;
  const options = [...results.querySelectorAll(".site-search-option")];
  options.forEach((option, optionIndex) => {
    option.classList.toggle("is-active", optionIndex === searchActiveIndex);
    option.setAttribute("aria-selected", optionIndex === searchActiveIndex ? "true" : "false");
  });
  syncSearchComboboxState();
}

function ensureSearchActiveOptionVisible() {
  const results = getSearchResultsElement();
  if (!(results instanceof HTMLElement) || searchActiveIndex < 0) return;
  const activeOption = results.querySelector(`#site-search-option-${searchActiveIndex}`);
  if (!(activeOption instanceof HTMLElement)) return;
  const containerTop = results.scrollTop;
  const containerBottom = containerTop + results.clientHeight;
  const optionTop = activeOption.offsetTop;
  const optionBottom = optionTop + activeOption.offsetHeight;
  if (optionTop < containerTop) {
    results.scrollTop = optionTop;
  } else if (optionBottom > containerBottom) {
    results.scrollTop = optionBottom - results.clientHeight;
  }
}

function navigateToSearchResults(query) {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return;
  window.location.href = getSearchResultsUrl(trimmedQuery);
}

function getSearchResultTarget(entry) {
  if (!entry) return null;
  if (isMobileViewport()) {
    if (entry.kind === "Section overview") {
      return navList?.querySelector(`.mobile-drill-current-link[data-mobile-target-id="${entry.id}"]`);
    }
    if (entry.l3Index !== null) {
      return navList?.querySelector(`.mobile-drill-link[data-mobile-target-id="${entry.id}"]`);
    }
    if (entry.l2Index !== null) {
      return navList?.querySelector(`.mobile-drill-link[data-mobile-target-id="${entry.id}"]`)
        || navList?.querySelector(`.mobile-drill-trigger[data-mobile-target-id="${entry.id}"]`);
    }
    if (entry.l1Index !== null) {
      return navList?.querySelector(`.mobile-drill-link[data-mobile-target-id="${entry.id}"]`)
        || navList?.querySelector(`.mobile-drill-trigger[data-mobile-target-id="${entry.id}"]`);
    }
    return navList?.querySelector(`.mobile-drill-trigger[data-mobile-target-id="${entry.id}"]`);
  }

  if (entry.kind === "Section overview") {
    return megaMenu?.querySelector(`.l2-item[data-launcher-id="${entry.id}"]`);
  }
  if (entry.l3Index !== null) {
    return megaMenu?.querySelector(`.l3-item[data-launcher-id="${entry.id}"]`);
  }
  if (entry.l2Index !== null) {
    return megaMenu?.querySelector(`.l2-item[data-launcher-id="${entry.id}"]`);
  }
  if (entry.l1Index !== null) {
    return megaMenu?.querySelector(`.l1-item[data-launcher-id="${entry.id}"]`);
  }
  return getTopNavItems().find(
    (item) => item.classList.contains("fdic-nav-item--button") && item.dataset.panelKey === entry.panelKey
  ) || null;
}

function focusSearchResult(entry) {
  const target = getSearchResultTarget(entry);
  if (target instanceof HTMLElement) {
    target.focus();
    return;
  }
  if (isMobileViewport()) {
    const fallback = getMobileDrawerFocusableItems()[0];
    if (fallback instanceof HTMLElement) fallback.focus();
    return;
  }
  if (!focusSelectedL1()) {
    const fallback = megaMenu?.querySelector(".l1-item, .l2-item, .l3-item");
    if (fallback instanceof HTMLElement) fallback.focus();
  }
}

function activateSearchEntry(entry) {
  if (!entry) return;
  const navIndex = (menuState.siteContent?.header?.nav || []).findIndex(
    (item) => item.kind === "menu" && (item.panelKey || item.id) === entry.panelKey
  );

  menuState.activePanelKey = entry.panelKey;
  if (navIndex >= 0) {
    menuState.topNavFocusIndex = navIndex;
  }
  resetPanelSelection();

  if (typeof entry.l1Index === "number") {
    menuState.selectedL1Index = entry.l1Index;
    menuState.l1FocusIndex = entry.l1Index;
  }
  if (typeof entry.l2Index === "number") {
    menuState.selectedL2Index = entry.l2Index;
  }
  if (typeof entry.l3Index === "number") {
    menuState.previewL2Index = entry.l2Index;
    menuState.previewingOverview = false;
  }
  if (entry.kind === "Section overview") {
    menuState.previewL2Index = null;
    menuState.previewingOverview = true;
  }

  renderTopNav();
  renderMenuPanel();

  if (isMobileViewport()) {
    const nextPath = [entry.panelKey];
    if (typeof entry.l1Index === "number") nextPath.push(entry.l1Index);
    if (typeof entry.l2Index === "number" && entry.l3Index !== null) nextPath.push(entry.l2Index);
    menuState.mobileDrillPath = nextPath;
    closeMobileSearch({ restoreFocus: false });
    setMobileNavOpen(true);
    window.requestAnimationFrame(() => {
      renderMobileDrawerPanel();
      window.requestAnimationFrame(() => focusSearchResult(entry));
    });
    return;
  }

  closeDesktopSearchPanel();
  openMenu({ focusMenu: entry.kind === "Panel" });
  window.requestAnimationFrame(() => focusSearchResult(entry));
}

function activateSearchSuggestion(index) {
  if (!Number.isFinite(index) || index < 0 || index >= searchSuggestions.length) return;
  const suggestion = searchSuggestions[index];
  if (suggestion.type === "search-all") {
    navigateToSearchResults(suggestion.query);
    return;
  }
  activateSearchEntry(suggestion.entry);
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
    document.body.classList.remove("mobile-search-open");
    return;
  }
  mobileSearchToggle.setAttribute("aria-expanded", menuState.mobileSearchOpen ? "true" : "false");
  mobileSearchToggle.setAttribute("aria-label", menuState.mobileSearchOpen ? "Close search" : "Open search");
  mobileSearchRow.hidden = !menuState.mobileSearchOpen;
  document.body.classList.toggle("mobile-search-open", menuState.mobileSearchOpen);
  if (focus && menuState.mobileSearchOpen && mobileSearchInput) {
    mobileSearchInput.focus();
    mobileSearchInput.select();
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
  const createController = window.createFDICMobileDrawerController;
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
      mobileNavBackdrop.hidden = true;
      mobileNavBackdrop.classList.remove("is-visible");
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
  }
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

function initializeSiteSearch() {
  searchIndex = buildLauncherIndex(menuState.siteContent);
  const desktopField = desktopSearchInput?.closest(".site-search-field");

  function handleInput(surface) {
    activeSearchSurface = surface;
    scheduleSearchSuggestions(surface);
  }

  function clearSearch(surface) {
    activeSearchSurface = surface;
    clearSearchDebounce();
    setSearchQuery("");
    searchSuggestions = [];
    searchActiveIndex = -1;
    if (desktopSearchResults) desktopSearchResults.innerHTML = "";
    if (desktopSearchStatus) desktopSearchStatus.textContent = "";
    if (mobileSearchResults) mobileSearchResults.innerHTML = "";
    if (mobileSearchStatus) mobileSearchStatus.textContent = "";
    if (surface === "desktop") {
      closeDesktopSearchPanel();
      desktopSearchInput?.focus();
      return;
    }
    syncSearchComboboxState();
    mobileSearchInput?.focus();
  }

  function handleKeyboardNavigation(event, surface) {
    activeSearchSurface = surface;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!searchSuggestions.length) return;
      setSearchActiveIndex(searchActiveIndex < 0 ? 0 : (searchActiveIndex + 1) % searchSuggestions.length);
      ensureSearchActiveOptionVisible();
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!searchSuggestions.length) return;
      const nextIndex = searchActiveIndex <= 0 ? searchSuggestions.length - 1 : searchActiveIndex - 1;
      setSearchActiveIndex(nextIndex);
      ensureSearchActiveOptionVisible();
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      if (searchActiveIndex >= 0) {
        activateSearchSuggestion(searchActiveIndex);
      } else {
        navigateToSearchResults(getSearchQuery());
      }
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      clearSearchDebounce();
      if (surface === "mobile") {
        closeMobileSearch();
      } else {
        const panelOpen = Boolean(desktopSearchPanel && !desktopSearchPanel.hidden);
        if (panelOpen) {
          closeDesktopSearchPanel();
          suppressDesktopSearchFocusSuggestions = true;
          window.requestAnimationFrame(() => {
            desktopSearchInput?.focus();
          });
        } else if (getSearchQuery()) {
          clearSearch("desktop");
        }
      }
    }
  }

  function bindResultsClick(resultsEl, surface) {
    resultsEl?.addEventListener("click", (event) => {
      const target = event.target instanceof HTMLElement ? event.target : null;
      const option = target?.closest(".site-search-option");
      if (!(option instanceof HTMLLIElement)) return;
      activeSearchSurface = surface;
      activateSearchSuggestion(Number(option.dataset.index || -1));
    });
  }

  desktopSearchInput?.addEventListener("focus", () => {
    activeSearchSurface = "desktop";
    syncSearchClearButtons(desktopSearchInput.value);
    if (suppressDesktopSearchFocusSuggestions) {
      suppressDesktopSearchFocusSuggestions = false;
      return;
    }
    if (desktopSearchInput.value.trim()) {
      scheduleSearchSuggestions("desktop");
    }
  });
  desktopSearchInput?.addEventListener("input", () => handleInput("desktop"));
  desktopSearchInput?.addEventListener("keydown", (event) => handleKeyboardNavigation(event, "desktop"));
  desktopSearchClear?.addEventListener("click", () => clearSearch("desktop"));
  desktopSearchSubmit?.addEventListener("click", () => navigateToSearchResults(desktopSearchInput?.value || ""));
  bindResultsClick(desktopSearchResults, "desktop");

  mobileSearchInput?.addEventListener("input", () => handleInput("mobile"));
  mobileSearchInput?.addEventListener("keydown", (event) => handleKeyboardNavigation(event, "mobile"));
  mobileSearchClear?.addEventListener("click", () => clearSearch("mobile"));
  mobileSearchSubmit?.addEventListener("click", () => navigateToSearchResults(mobileSearchInput?.value || ""));
  mobileSearchClose?.addEventListener("click", () => closeMobileSearch());
  mobileSearchBackdrop?.addEventListener("click", () => closeMobileSearch());
  bindResultsClick(mobileSearchResults, "mobile");

  document.addEventListener("pointerdown", (event) => {
    if (!(event.target instanceof HTMLElement)) return;
    if (menuState.mobileSearchOpen) return;
    if (desktopField?.contains(event.target)) return;
    closeDesktopSearchPanel();
  });

  desktopSearchResults?.addEventListener("mousemove", (event) => {
    const target = event.target instanceof HTMLElement ? event.target.closest(".site-search-option") : null;
    if (!(target instanceof HTMLLIElement)) return;
    activeSearchSurface = "desktop";
    setSearchActiveIndex(Number(target.dataset.index || -1));
  });

  mobileSearchResults?.addEventListener("mousemove", (event) => {
    const target = event.target instanceof HTMLElement ? event.target.closest(".site-search-option") : null;
    if (!(target instanceof HTMLLIElement)) return;
    activeSearchSurface = "mobile";
    setSearchActiveIndex(Number(target.dataset.index || -1));
  });

  document.addEventListener("keydown", (event) => {
    const ctrlSlash = event.ctrlKey && !event.metaKey && event.code === "Slash";
    const cmdG = event.metaKey && !event.ctrlKey && event.key.toLowerCase() === "g";
    if (!ctrlSlash && !cmdG) return;
    event.preventDefault();
    if (isPhoneViewport()) {
      openMobileSearch({ focus: true });
      return;
    }
    activeSearchSurface = "desktop";
    desktopSearchInput?.focus();
    desktopSearchInput?.select();
    if (desktopSearchInput?.value.trim()) {
      scheduleSearchSuggestions("desktop");
    }
  });

  syncSearchClearButtons();
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
  const activeL3Items = showingPreview && !menuState.previewingOverview ? (previewL2?.l3 || []) : [];
  const l1HeadingLabel = `${panelLabel} sections`;
  const l2HeadingLabel = `${selectedL1?.label || "Section"} links`;
  const l3HeadingLabel = `${activeL2ForHeading?.label || "Section"} resources`;
  const hasActiveL3Items = activeL3Items.length > 0;
  const defaultL1Description = selectedL1?.description
    || getGeneratedMenuDescription(selectedL1?.label, panelLabel)
    || l2Overview?.description
    || "";
  const descriptionText = menuState.previewingOverview
    ? l2Overview?.description || ""
    : showingPreview
      ? (hasActiveL3Items ? "" : previewL2?.description || "")
      : defaultL1Description;

  return {
    panelKey: menuState.activePanelKey || "",
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
    l3Items: activeL3Items,
    l3Description: descriptionText,
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
  const binder = window.bindFDICMenuEvents;
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
  initializeSiteSearch,
  openMenu,
});

menuInitializer.init();
