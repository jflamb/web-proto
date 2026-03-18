(function initFDICMenuSearchModule() {
  const runtime = window.FDICMenuRuntime;
  if (!runtime) {
    throw new Error("FDICMenuRuntime missing. Ensure runtime.js is loaded before search.js.");
  }

  function normalizeLauncherText(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
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
        if (token.length >= 2) {
          parentheticalAliases.add(token);
        }
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

  function buildLauncherIndex(siteContent, { getL2Overview = () => null } = {}) {
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

  function getLauncherMatches(query, searchIndex, { limit = 8 } = {}) {
    const normalizedQuery = normalizeLauncherText(query);
    if (!normalizedQuery) return [];

    return searchIndex
      .map((entry) => ({ entry, rank: getLauncherMatchRank(entry, normalizedQuery) }))
      .filter((item) => Number.isFinite(item.rank))
      .sort((left, right) => {
        if (left.rank !== right.rank) return left.rank - right.rank;
        return left.entry.label.localeCompare(right.entry.label);
      })
      .slice(0, limit)
      .map((item) => item.entry);
  }

  function isTopLevelSearchEntry(entry) {
    return entry?.l1Index === null && entry?.l2Index === null && entry?.l3Index === null;
  }

  function createMenuSuggestionItem(entry) {
    return {
      id: entry.id,
      title: entry.label,
      meta: isTopLevelSearchEntry(entry) ? "" : entry.crumbs.join(" / "),
      entry,
      action: {
        kind: "menu-entry",
        entry,
      },
    };
  }

  function normalizeSuggestionItem(item, index) {
    if (!item) return null;
    const title = String(item.title || item.label || "").trim();
    if (!title) return null;
    return {
      id: item.id || `search-suggestion-${index}`,
      title,
      meta: String(item.meta || ""),
      action: item.action || null,
      entry: item.entry || null,
    };
  }

  function createMenuSuggestionsProvider({ getL2Overview, limit = 8 } = {}) {
    let lastSiteContent = null;
    let lastIndex = [];

    return function provideMenuSuggestions({ query, siteContent }) {
      if (siteContent !== lastSiteContent) {
        lastSiteContent = siteContent;
        lastIndex = buildLauncherIndex(siteContent, { getL2Overview });
      }
      return getLauncherMatches(query, lastIndex, { limit }).map(createMenuSuggestionItem);
    };
  }

  function defaultSuggestionActionHandler({ suggestion, activateMenuEntry }) {
    if (suggestion?.action?.kind !== "menu-entry" || !suggestion.action.entry) {
      return false;
    }
    activateMenuEntry(suggestion.action.entry);
    return true;
  }

  function createDefaultQuerySubmissionHandler({ resultsViewHandler = null } = {}) {
    return function handleQuerySubmission({
      query,
      surface,
      suggestions,
      activeIndex,
      activateSuggestion,
    }) {
      if (typeof resultsViewHandler === "function") {
        const handled = resultsViewHandler({
          query,
          surface,
          suggestions,
          activeIndex,
          selectedSuggestion: activeIndex >= 0 ? suggestions[activeIndex] || null : suggestions[0] || null,
        });
        if (handled) {
          return true;
        }
      }

      if (!suggestions.length) {
        return false;
      }

      activateSuggestion(activeIndex >= 0 ? activeIndex : 0);
      return true;
    };
  }

  function createFDICMenuSearchController(deps) {
    const {
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
    } = deps;

    let searchSuggestions = [];
    let searchActiveIndex = -1;
    let searchDebounceTimer = null;
    let searchReturnFocus = null;
    let activeSearchSurface = "desktop";
    let suppressDesktopSearchFocusSuggestions = false;
    const SEARCH_DEBOUNCE_MS = 180;
    // These hooks are the intended extension seam:
    // - suggestionsProvider can replace menu-derived suggestions entirely
    // - querySubmissionHandler / resultsViewHandler can hand off submit to a results view
    const suggestionsProvider = deps.suggestionsProvider || createMenuSuggestionsProvider({ getL2Overview });
    const suggestionActionHandler = deps.suggestionActionHandler || defaultSuggestionActionHandler;
    const querySubmissionHandler = deps.querySubmissionHandler || createDefaultQuerySubmissionHandler({
      resultsViewHandler: deps.resultsViewHandler,
    });

    function getSearchResultsElement() {
      const { desktopSearchResults, mobileSearchResults } = getDom();
      return activeSearchSurface === "mobile" ? mobileSearchResults : desktopSearchResults;
    }

    function getSearchStatusElement() {
      const { desktopSearchStatus, mobileSearchStatus } = getDom();
      return activeSearchSurface === "mobile" ? mobileSearchStatus : desktopSearchStatus;
    }

    function getSearchInputElement() {
      const { desktopSearchInput, mobileSearchInput } = getDom();
      return activeSearchSurface === "mobile" ? mobileSearchInput : desktopSearchInput;
    }

    function getSearchQuery() {
      return getSearchInputElement()?.value?.trim() || "";
    }

    function syncSearchClearButtons(value = null) {
      const {
        desktopSearchInput,
        mobileSearchInput,
        desktopSearchClear,
        mobileSearchClear,
      } = getDom();
      const nextValue = typeof value === "string" ? value : desktopSearchInput?.value || mobileSearchInput?.value || "";
      const hasValue = nextValue.trim().length > 0;
      if (desktopSearchClear) desktopSearchClear.hidden = !hasValue;
      if (mobileSearchClear) mobileSearchClear.hidden = !hasValue;
    }

    function setSearchQuery(value) {
      const { desktopSearchInput, mobileSearchInput } = getDom();
      if (desktopSearchInput) desktopSearchInput.value = value;
      if (mobileSearchInput) mobileSearchInput.value = value;
      syncSearchClearButtons(value);
    }

    function syncSearchComboboxState() {
      const {
        desktopSearchInput,
        desktopSearchResults,
        mobileSearchInput,
        mobileSearchResults,
      } = getDom();
      const isDesktopSurface = activeSearchSurface === "desktop";
      const surfaces = [
        { input: desktopSearchInput, results: desktopSearchResults, isActive: isDesktopSurface },
        { input: mobileSearchInput, results: mobileSearchResults, isActive: !isDesktopSurface },
      ];

      surfaces.forEach(({ input, results, isActive }) => {
        if (!(input instanceof HTMLElement) || !(results instanceof HTMLElement)) return;
        input.setAttribute("role", "combobox");
        input.setAttribute("aria-expanded", isActive && searchSuggestions.length > 0 ? "true" : "false");
        input.setAttribute("aria-controls", results.id);
        input.setAttribute("aria-autocomplete", "list");
        input.setAttribute("aria-haspopup", "listbox");
        if (isActive && searchActiveIndex >= 0) {
          input.setAttribute("aria-activedescendant", `site-search-option-${searchActiveIndex}`);
        } else {
          input.removeAttribute("aria-activedescendant");
        }
      });
    }

    function setDesktopSearchPanelOpen(isOpen) {
      const { desktopSearchPanel } = getDom();
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
      const { desktopSearchResults, desktopSearchStatus } = getDom();
      searchSuggestions = [];
      searchActiveIndex = -1;
      setDesktopSearchPanelOpen(false);
      if (desktopSearchResults) desktopSearchResults.innerHTML = "";
      if (desktopSearchStatus) desktopSearchStatus.textContent = "";
      syncSearchClearButtons();
      syncSearchComboboxState();
    }

    function buildSuggestionsForQuery(query, surface) {
      const trimmedQuery = query.trim();
      if (!trimmedQuery) return [];
      const nextSuggestions = suggestionsProvider({
        query: trimmedQuery,
        surface,
        siteContent: menuState.siteContent,
      });
      return (Array.isArray(nextSuggestions) ? nextSuggestions : [])
        .map((item, index) => normalizeSuggestionItem(item, index))
        .filter(Boolean);
    }

    function renderSearchSuggestions() {
      const results = getSearchResultsElement();
      const status = getSearchStatusElement();
      const query = getSearchQuery();
      if (!(results instanceof HTMLElement) || !(status instanceof HTMLElement)) return;

      searchSuggestions = buildSuggestionsForQuery(query, activeSearchSurface);
      searchActiveIndex = -1;
      results.innerHTML = "";

      if (searchSuggestions.length === 0) {
        status.textContent = query ? `No menu destinations match "${query}".` : "";
        if (activeSearchSurface === "desktop") {
          closeDesktopSearchPanel();
        }
        syncSearchComboboxState();
        return;
      }

      searchSuggestions.forEach((item, index) => {
        const li = document.createElement("li");
        li.className = "site-search-item site-search-option";
        li.id = `site-search-option-${index}`;
        li.setAttribute("role", "option");
        li.setAttribute("aria-selected", "false");
        li.dataset.index = String(index);

        const title = document.createElement("span");
        title.className = "site-search-option-title";
        title.textContent = item.title;
        li.appendChild(title);

        if (item.meta) {
          const meta = document.createElement("span");
          meta.className = "site-search-option-meta";
          meta.textContent = item.meta;
          li.appendChild(meta);
        }

        results.appendChild(li);
      });

      status.textContent = `${searchSuggestions.length} menu result${searchSuggestions.length === 1 ? "" : "s"} available.`;
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

    function getSearchResultTarget(entry) {
      if (!entry) return null;
      const { navList, megaMenu } = getDom();

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
        const { megaMenu } = getDom();
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
      suggestionActionHandler({
        suggestion,
        surface: activeSearchSurface,
        activateMenuEntry: activateSearchEntry,
      });
    }

    function submitSearchQuery(surface) {
      activeSearchSurface = surface;
      clearSearchDebounce();
      const query = getSearchQuery();
      if (!query.trim()) return;

      searchSuggestions = buildSuggestionsForQuery(query, surface);
      searchActiveIndex = searchActiveIndex >= 0 && searchActiveIndex < searchSuggestions.length ? searchActiveIndex : -1;
      renderSearchSuggestions();
      querySubmissionHandler({
        query: query.trim(),
        surface,
        suggestions: searchSuggestions,
        activeIndex: searchActiveIndex,
        activateSuggestion: activateSearchSuggestion,
      });
    }

    function applyHeaderContent() {
      const placeholder = menuState.siteContent?.header?.searchPlaceholder || "Search";
      const { desktopSearchInput, mobileSearchInput } = getDom();
      if (desktopSearchInput) desktopSearchInput.placeholder = placeholder;
      if (mobileSearchInput) mobileSearchInput.placeholder = placeholder;
    }

    function isEditableSearchShortcutTarget(target) {
      if (!(target instanceof HTMLElement)) return false;
      if (target.isContentEditable) return true;
      return Boolean(
        target.closest(
          'input, textarea, select, [contenteditable="true"], [role="textbox"], [role="combobox"], [role="searchbox"]'
        )
      );
    }

    function openMobileSearch({ focus = false } = {}) {
      const { desktopSearchInput, mobileSearchInput, mobileSearchToggle } = getDom();
      searchReturnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : mobileSearchToggle;
      setSearchQuery(desktopSearchInput?.value || mobileSearchInput?.value || "");
      closeMenu();
      closeMobileNav();
      menuState.mobileSearchOpen = true;
      deps.syncMobileSearchState({ focus });
      activeSearchSurface = "mobile";
      syncSearchClearButtons();
      if (getSearchQuery()) {
        scheduleSearchSuggestions("mobile");
      }
    }

    function closeMobileSearch({ restoreFocus = true } = {}) {
      const { mobileSearchResults, mobileSearchStatus } = getDom();
      menuState.mobileSearchOpen = false;
      deps.syncMobileSearchState();
      searchSuggestions = [];
      searchActiveIndex = -1;
      if (mobileSearchResults) mobileSearchResults.innerHTML = "";
      if (mobileSearchStatus) mobileSearchStatus.textContent = "";
      syncSearchClearButtons();
      syncSearchComboboxState();
      if (restoreFocus && searchReturnFocus instanceof HTMLElement && searchReturnFocus.isConnected) {
        searchReturnFocus.focus();
      }
    }

    function initializeSiteSearch() {
      const {
        desktopSearchInput,
        desktopSearchResults,
        desktopSearchClear,
        desktopSearchSubmit,
        desktopSearchPanel,
        mobileSearchInput,
        mobileSearchResults,
        mobileSearchClear,
        mobileSearchSubmit,
      } = getDom();
      const desktopField = desktopSearchInput?.closest(".site-search-field");

      function handleInput(surface) {
        activeSearchSurface = surface;
        scheduleSearchSuggestions(surface);
      }

      function clearSearch(surface) {
        const { desktopSearchResults, desktopSearchStatus, mobileSearchResults, mobileSearchStatus, desktopSearchInput, mobileSearchInput } = getDom();
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
            submitSearchQuery(surface);
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
                const { desktopSearchInput } = getDom();
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
      desktopSearchSubmit?.addEventListener("click", () => submitSearchQuery("desktop"));
      bindResultsClick(desktopSearchResults, "desktop");

      mobileSearchInput?.addEventListener("input", () => handleInput("mobile"));
      mobileSearchInput?.addEventListener("keydown", (event) => handleKeyboardNavigation(event, "mobile"));
      mobileSearchClear?.addEventListener("click", () => clearSearch("mobile"));
      mobileSearchSubmit?.addEventListener("click", () => submitSearchQuery("mobile"));
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
        const plainSlash = !event.ctrlKey
          && !event.metaKey
          && !event.altKey
          && !event.shiftKey
          && !event.isComposing
          && event.code === "Slash"
          && !isEditableSearchShortcutTarget(event.target);
        if (!ctrlSlash && !cmdG && !plainSlash) return;
        event.preventDefault();
        if (isPhoneViewport()) {
          openMobileSearch({ focus: true });
          return;
        }
        activeSearchSurface = "desktop";
        const { desktopSearchInput } = getDom();
        desktopSearchInput?.focus();
        desktopSearchInput?.select();
        if (desktopSearchInput?.value.trim()) {
          scheduleSearchSuggestions("desktop");
        }
      });

      syncSearchClearButtons();
      syncSearchComboboxState();
    }

    return {
      applyHeaderContent,
      initializeSiteSearch,
      openMobileSearch,
      closeMobileSearch,
      syncSearchComboboxState,
    };
  }

  runtime.registerModule("search", {
    createFDICMenuSearchController,
    buildLauncherIndex,
    createMenuSuggestionsProvider,
    createDefaultQuerySubmissionHandler,
    defaultSuggestionActionHandler,
  });
})();
