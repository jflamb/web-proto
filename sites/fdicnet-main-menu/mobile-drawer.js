(function initFDICMobileDrawerModule() {
  function createFDICMobileDrawerController(deps) {
    const {
      menuState,
      reduceMotionMediaQuery,
      MOBILE_STAGGER_MAX_ITEMS,
      MOBILE_STAGGER_STEP_MS,
      refreshDomRefs,
      isMobileViewport,
      getNavList,
      getMobilePanelKeys,
      getPanelConfigByKey,
      syncMobileToggleButton,
      ensureMobileMenuFocus,
      triggerLightHaptic,
      announceMenuContext,
    } = deps;

    function encodeMobilePath(path) {
      return JSON.stringify(Array.isArray(path) ? path : []);
    }

    function decodeMobilePath(rawPath) {
      if (!rawPath) return null;
      try {
        const parsed = JSON.parse(rawPath);
        return Array.isArray(parsed) ? parsed : null;
      } catch {
        return null;
      }
    }

    function ensureMobileDrawerPanel() {
      const navList = getNavList();
      const existing = navList.querySelector(".mobile-drawer-panel-item");
      if (existing) return existing;
      const li = document.createElement("li");
      li.className = "mobile-drawer-panel-item";
      const container = document.createElement("div");
      container.id = "fdicMobileDrawerPanel";
      container.className = "mobile-drawer-panel";
      li.appendChild(container);
      navList.appendChild(li);
      return li;
    }

    function removeMobileDrawerPanel() {
      const navList = getNavList();
      const existing = navList.querySelector(".mobile-drawer-panel-item");
      if (existing) existing.remove();
    }

    function renderMobileDrillHeader(targetContainer, backLabel, backPath) {
      const drillHeader = document.createElement("div");
      drillHeader.className = "mobile-drill-header";

      if (Array.isArray(backPath)) {
        const backButton = document.createElement("button");
        backButton.type = "button";
        backButton.className = "mobile-drill-back";
        backButton.setAttribute("aria-label", `Back to ${backLabel}`);
        backButton.dataset.mobileDrillAction = "set-path";
        backButton.dataset.mobileDrillPath = encodeMobilePath(backPath);

        const icon = document.createElement("span");
        icon.className = "mobile-drill-back-icon ph ph-caret-left";
        icon.setAttribute("aria-hidden", "true");

        const text = document.createElement("span");
        text.textContent = backLabel;

        backButton.append(icon, text);
        drillHeader.appendChild(backButton);
      }

      if (drillHeader.childElementCount > 0) {
        targetContainer.appendChild(drillHeader);
      }
    }

    function renderMobileDrillContext(targetContainer, contextNodes) {
      if (!Array.isArray(contextNodes) || contextNodes.length === 0) return;

      const context = document.createElement("nav");
      context.className = "mobile-drill-context";
      context.setAttribute("aria-label", "Current location");

      const srPrefix = document.createElement("span");
      srPrefix.className = "sr-only";
      srPrefix.textContent = "You are here: ";
      context.appendChild(srPrefix);

      const crumbList = document.createElement("ol");
      crumbList.className = "mobile-drill-context-list";

      contextNodes.forEach((node, index) => {
        const li = document.createElement("li");
        li.className = "mobile-drill-context-item";
        const isCurrent = index === contextNodes.length - 1;

        if (!isCurrent && Array.isArray(node.path)) {
          const button = document.createElement("button");
          button.type = "button";
          button.className = "mobile-drill-crumb";
          button.dataset.mobileDrillAction = "set-path";
          button.dataset.mobileDrillPath = encodeMobilePath(node.path);
          button.textContent = node.label || "Section";
          button.setAttribute("aria-label", `Go to ${node.label || "section"}`);
          li.appendChild(button);
        } else {
          const current = document.createElement("span");
          current.className = "mobile-drill-crumb-current";
          current.setAttribute("aria-current", "page");
          current.textContent = node.label || "Section";
          li.appendChild(current);
        }

        crumbList.appendChild(li);
      });

      context.appendChild(crumbList);
      const list = targetContainer.querySelector(".mobile-drill-list, .mobile-drill-link-list");
      if (list) {
        targetContainer.insertBefore(context, list);
        return;
      }
      targetContainer.appendChild(context);
    }

    function createMobileDrillList() {
      const list = document.createElement("ul");
      list.className = "mobile-drill-list";
      return list;
    }

    function appendMobileDrillItem(list, label, nextPath, options = {}) {
      const { hasChildren = true, href = "#" } = options;
      const li = document.createElement("li");
      li.className = "mobile-drill-item";

      if (!hasChildren) {
        const link = document.createElement("a");
        link.className = "mobile-drill-link";
        link.href = href || "#";
        link.textContent = label || "Link";
        li.appendChild(link);
        list.appendChild(li);
        return;
      }

      const button = document.createElement("button");
      button.type = "button";
      button.className = "mobile-drill-trigger";
      button.dataset.mobileDrillAction = "set-path";
      button.dataset.mobileDrillPath = encodeMobilePath(nextPath);
      button.setAttribute("aria-haspopup", "true");
      button.setAttribute("aria-controls", "fdicMobileDrawerPanel");
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-label", `Open ${label}`);

      const text = document.createElement("span");
      text.className = "mobile-drill-label";
      text.textContent = label;

      const icon = document.createElement("span");
      icon.className = "mobile-drill-caret ph ph-caret-right";
      icon.setAttribute("aria-hidden", "true");

      button.append(text, icon);
      li.appendChild(button);
      list.appendChild(li);
    }

    function appendMobileDrillLinkItem(list, label, href) {
      const li = document.createElement("li");
      li.className = "mobile-drill-link-item";

      const link = document.createElement("a");
      link.className = "mobile-drill-current-link";
      link.href = href || "#";
      link.textContent = label || "Overview";

      li.appendChild(link);
      list.appendChild(li);
    }

    function renderMobileDrillRoot(panelContainer, panelKeys, siteContent) {
      const list = createMobileDrillList();
      panelKeys.forEach((panelKey) => {
        const panelMeta = (siteContent?.header?.nav || []).find(
          (item) => item.kind === "menu" && (item.panelKey || item.id) === panelKey
        );
        const panelConfig = getPanelConfigByKey(panelKey);
        const hasChildren = Array.isArray(panelConfig?.l1) && panelConfig.l1.length > 0;
        appendMobileDrillItem(list, panelMeta?.label || panelKey, [panelKey], {
          hasChildren,
          href: panelConfig?.overviewHref || "#",
        });
      });
      panelContainer.appendChild(list);
    }

    function renderMobileDrillL1(panelContainer, panelKey, panelConfig) {
      renderMobileDrillHeader(panelContainer, "Main menu", []);

      const list = createMobileDrillList();
      const l1Items = panelConfig.l1 || [];
      const hasOverviewRow = l1Items.length > 1;
      const primaryItems = hasOverviewRow ? l1Items.slice(1) : l1Items;

      primaryItems.forEach((l1Item, orderIndex) => {
        const l1Index = hasOverviewRow ? orderIndex + 1 : orderIndex;
        const hasChildren = Array.isArray(l1Item.l2) && l1Item.l2.length > 0;
        appendMobileDrillItem(list, l1Item.label || "Section", [panelKey, l1Index], {
          hasChildren,
          href: l1Item.href || l1Item.overviewHref || "#",
        });
      });

      if (hasOverviewRow) {
        const divider = document.createElement("li");
        divider.className = "mobile-drill-separator-item";
        divider.setAttribute("aria-hidden", "true");
        const dividerLine = document.createElement("span");
        dividerLine.className = "mobile-drill-separator-line";
        divider.appendChild(dividerLine);
        list.appendChild(divider);

        const overviewItem = l1Items[0];
        appendMobileDrillItem(list, overviewItem.label || "Overview", [panelKey, 0], {
          hasChildren: Array.isArray(overviewItem.l2) && overviewItem.l2.length > 0,
          href: overviewItem.href || overviewItem.overviewHref || "#",
        });
      }
      panelContainer.appendChild(list);
    }

    function renderMobileDrillL2(panelContainer, panelKey, panelConfig, l1Index) {
      const l1Item = (panelConfig.l1 || [])[l1Index];
      if (!l1Item) return;

      renderMobileDrillHeader(
        panelContainer,
        panelConfig?.overviewLabel || "Sections",
        [panelKey]
      );

      const list = createMobileDrillList();
      (l1Item.l2 || []).forEach((l2Item, l2Index) => {
        const hasChildren = Array.isArray(l2Item.l3) && l2Item.l3.length > 0;
        appendMobileDrillItem(list, l2Item.label || "Link", [panelKey, l1Index, l2Index], {
          hasChildren,
          href: l2Item.href || "#",
        });
      });
      appendMobileDrillLinkItem(list, l1Item.label || "Section", l1Item.href || l1Item.overviewHref || "#");
      panelContainer.appendChild(list);
    }

    function renderMobileDrillL3(panelContainer, panelKey, panelConfig, l1Index, l2Index) {
      const l1Item = (panelConfig.l1 || [])[l1Index];
      const l2Item = (l1Item?.l2 || [])[l2Index];
      if (!l1Item || !l2Item) return;

      renderMobileDrillHeader(
        panelContainer,
        l1Item.label || "Section",
        [panelKey, l1Index]
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

      appendMobileDrillLinkItem(list, l2Item.label || "Link", l2Item.href || "#");
      panelContainer.appendChild(list);
    }

    function animateMobileDrillReveal(panelContainer) {
      if (!panelContainer || reduceMotionMediaQuery.matches) return;
      const staggerItems = [...panelContainer.querySelectorAll(".mobile-drill-item, .mobile-drill-link-item")];
      if (staggerItems.length === 0) return;
      staggerItems.forEach((item, index) => {
        const clampedIndex = Math.min(index, MOBILE_STAGGER_MAX_ITEMS - 1);
        item.style.setProperty("--mobile-stagger-delay", `${clampedIndex * MOBILE_STAGGER_STEP_MS}ms`);
      });
      panelContainer.classList.add("is-entering");
      window.requestAnimationFrame(() => {
        panelContainer.classList.remove("is-entering");
      });
    }

    let mobileRegionCounter = 0;
    function createMobileDrillRegion(panelContainer, headingText) {
      const region = document.createElement("section");
      region.className = "mobile-drill-region";
      const heading = document.createElement("h2");
      const headingId = `mobileDrillHeading-${mobileRegionCounter += 1}`;
      heading.id = headingId;
      heading.className = "sr-only";
      heading.textContent = headingText || "Menu section";
      region.setAttribute("aria-labelledby", headingId);
      region.appendChild(heading);
      panelContainer.appendChild(region);
      return region;
    }

    function getPanelLabel(panelKey, panelConfig) {
      const navMeta = (menuState.siteContent?.header?.nav || []).find(
        (item) => item.kind === "menu" && (item.panelKey || item.id) === panelKey
      );
      return navMeta?.label || panelConfig?.overviewLabel || "Menu";
    }

    function getMobileContextNodes(panelKey, panelConfig, l1Index, l2Index) {
      if (!panelKey || !panelConfig) return [];
      const nodes = [{ label: getPanelLabel(panelKey, panelConfig), path: [panelKey] }];

      if (typeof l1Index !== "number") return nodes;
      const l1Item = (panelConfig.l1 || [])[l1Index];
      if (!l1Item) return nodes;
      nodes.push({ label: l1Item.label || "Section", path: [panelKey, l1Index] });

      if (typeof l2Index !== "number") return nodes;
      const l2Item = (l1Item.l2 || [])[l2Index];
      if (!l2Item) return nodes;
      nodes.push({ label: l2Item.label || "Link", path: [panelKey, l1Index, l2Index] });

      return nodes;
    }

    function announceMobileDrillContext(panelKey, panelConfig, l1Index, l2Index, panelKeys) {
      if (typeof announceMenuContext !== "function") return;

      if (!panelKey || !panelConfig) {
        const rootCount = Array.isArray(panelKeys) ? panelKeys.length : 0;
        announceMenuContext(`Main menu, ${rootCount} section${rootCount === 1 ? "" : "s"}.`);
        return;
      }

      const panelLabel = getPanelLabel(panelKey, panelConfig);

      if (typeof l1Index !== "number") {
        const l1Items = panelConfig.l1 || [];
        const hasOverviewRow = l1Items.length > 1;
        const count = hasOverviewRow ? l1Items.length - 1 : l1Items.length;
        announceMenuContext(`${panelLabel}, ${count} item${count === 1 ? "" : "s"}. Back to Main menu.`);
        return;
      }

      const l1Item = (panelConfig.l1 || [])[l1Index];
      if (!l1Item) {
        announceMenuContext(`${panelLabel}. Back to Main menu.`);
        return;
      }

      if (typeof l2Index !== "number") {
        const count = (l1Item.l2 || []).length + 1;
        announceMenuContext(`${l1Item.label || "Section"}, ${count} item${count === 1 ? "" : "s"}. Back to ${panelLabel}.`);
        return;
      }

      const l2Item = (l1Item.l2 || [])[l2Index];
      if (!l2Item) {
        announceMenuContext(`${l1Item.label || "Section"}. Back to ${panelLabel}.`);
        return;
      }
      const count = (l2Item.l3 || []).length + 1;
      announceMenuContext(`${l2Item.label || "Link"}, ${count} item${count === 1 ? "" : "s"}. Back to ${l1Item.label || panelLabel}.`);
    }

    function renderMobileDrawerPanel() {
      refreshDomRefs();
      if (!isMobileViewport()) return;
      if (!menuState.mobileNavOpen) return;
      syncMobileToggleButton();
      const panelItem = ensureMobileDrawerPanel();
      const panelContainer = panelItem.querySelector(".mobile-drawer-panel");
      if (!panelContainer) return;
      panelContainer.innerHTML = "";

      const panelKeys = getMobilePanelKeys();
      if (panelKeys.length === 0) return;

      const [panelKey, l1Index, l2Index] = menuState.mobileDrillPath;
      if (!panelKey) {
        const region = createMobileDrillRegion(panelContainer, "Main menu sections");
        renderMobileDrillRoot(region, panelKeys, menuState.siteContent);
        announceMobileDrillContext(null, null, null, null, panelKeys);
        ensureMobileMenuFocus();
        animateMobileDrillReveal(panelContainer);
        return;
      }

      const panelConfig = getPanelConfigByKey(panelKey);
      if (!panelConfig) {
        menuState.mobileDrillPath = [];
        const region = createMobileDrillRegion(panelContainer, "Main menu sections");
        renderMobileDrillRoot(region, panelKeys, menuState.siteContent);
        announceMobileDrillContext(null, null, null, null, panelKeys);
        ensureMobileMenuFocus();
        animateMobileDrillReveal(panelContainer);
        return;
      }

      if (typeof l1Index !== "number") {
        const region = createMobileDrillRegion(panelContainer, `${getPanelLabel(panelKey, panelConfig)} sections`);
        renderMobileDrillL1(region, panelKey, panelConfig);
        renderMobileDrillContext(region, getMobileContextNodes(panelKey, panelConfig, null, null));
        announceMobileDrillContext(panelKey, panelConfig, null, null, panelKeys);
        ensureMobileMenuFocus();
        animateMobileDrillReveal(panelContainer);
        return;
      }

      if (typeof l2Index !== "number") {
        const l1Item = (panelConfig.l1 || [])[l1Index];
        const headingText = `${l1Item?.label || getPanelLabel(panelKey, panelConfig)} links`;
        const region = createMobileDrillRegion(panelContainer, headingText);
        renderMobileDrillL2(region, panelKey, panelConfig, l1Index);
        renderMobileDrillContext(region, getMobileContextNodes(panelKey, panelConfig, l1Index, null));
        announceMobileDrillContext(panelKey, panelConfig, l1Index, null, panelKeys);
        ensureMobileMenuFocus();
        animateMobileDrillReveal(panelContainer);
        return;
      }

      const l1Item = (panelConfig.l1 || [])[l1Index];
      const l2Item = (l1Item?.l2 || [])[l2Index];
      const region = createMobileDrillRegion(panelContainer, `${l2Item?.label || "Section"} links`);
      renderMobileDrillL3(region, panelKey, panelConfig, l1Index, l2Index);
      renderMobileDrillContext(region, getMobileContextNodes(panelKey, panelConfig, l1Index, l2Index));
      announceMobileDrillContext(panelKey, panelConfig, l1Index, l2Index, panelKeys);
      ensureMobileMenuFocus();
      animateMobileDrillReveal(panelContainer);
    }

    function handleDelegatedMobileDrillClick(target) {
      const drillControl = target.closest("[data-mobile-drill-action='set-path']");
      if (!(drillControl instanceof HTMLElement)) return false;

      const nextPath = decodeMobilePath(drillControl.dataset.mobileDrillPath);
      if (!nextPath) return false;

      if (drillControl.classList.contains("mobile-drill-trigger")) {
        drillControl.setAttribute("aria-expanded", "true");
        const triggerLabel = drillControl.querySelector(".mobile-drill-label")?.textContent?.trim();
        if (triggerLabel && typeof announceMenuContext === "function") {
          announceMenuContext(`Opening ${triggerLabel}.`);
        }
      }

      triggerLightHaptic();
      menuState.mobileDrillPath = nextPath;
      if (typeof nextPath[0] === "string") {
        menuState.activePanelKey = nextPath[0];
      }
      renderMobileDrawerPanel();
      return true;
    }

    return {
      removeMobileDrawerPanel,
      renderMobileDrawerPanel,
      handleDelegatedMobileDrillClick,
    };
  }

  window.createFDICMobileDrawerController = createFDICMobileDrawerController;
})();
