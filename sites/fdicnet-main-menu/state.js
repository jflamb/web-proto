(function initFDICMenuStateModule() {
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
    mobileNavCloseHideTimer: null,
    closeTransitionHandler: null,
    l1FocusIndex: 0,
    closeHideTimer: null,
    mobileDrillPath: [],
    lastMobileDrillPath: null,
  };

  function getPanelConfig(siteContent, activePanelKey) {
    return siteContent?.menu?.panels?.[activePanelKey] || null;
  }

  function getPanelConfigByKey(siteContent, panelKey) {
    return siteContent?.menu?.panels?.[panelKey] || null;
  }

  function getMobilePanelKeys(siteContent) {
    return (siteContent?.header?.nav || [])
      .filter((item) => item.kind === "menu")
      .map((item) => item.panelKey || item.id)
      .filter(Boolean);
  }

  function getPanelL1(panelConfig) {
    return panelConfig?.l1 || [];
  }

  function getSelectedL1(panelConfig, selectedL1Index) {
    return getPanelL1(panelConfig)[selectedL1Index] || null;
  }

  function getVisibleL2Index(previewL2Index, selectedL2Index) {
    if (previewL2Index !== null) return previewL2Index;
    return selectedL2Index;
  }

  function getVisibleL2(selectedL1, visibleL2Index) {
    const items = selectedL1?.l2 || [];
    return items[visibleL2Index] || null;
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

  window.FDICMenuState = {
    menuState,
    getPanelConfig,
    getPanelConfigByKey,
    getMobilePanelKeys,
    getPanelL1,
    getSelectedL1,
    getVisibleL2Index,
    getVisibleL2,
    getL2Overview,
  };
})();
