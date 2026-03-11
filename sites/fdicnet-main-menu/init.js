(function initFDICMenuBootstrapModule() {
  function createFDICMenuInitializer(deps) {
    const {
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
    } = deps;

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

    function getMissingRequiredElements() {
      refreshDomRefs();
      const {
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
        l1OverviewLink,
        pageTitle,
        pageIntro,
        desktopSearchInput,
        mobileSearchToggle,
        mobileSearchRow,
        mobileSearchInput,
        mobileNavBackdrop,
      } = getDom();

      const requiredElements = [
        ["fdicTopNav", topNav],
        ["fdicMegaMenu", megaMenuHost],
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
      return requiredElements.filter(([, element]) => !element).map(([name]) => name);
    }

    function renderContentLoadFallback() {
      refreshDomRefs();
      const { pageTitle, pageIntro, megaMenu } = getDom();
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

    async function init() {
      refreshDomRefs();
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
      initializeMobileDrawerController();
      syncMobileNavState();
      syncMobileSearchState();
      renderPageContent();
      renderMenuPanel();
      setupEvents();
      const { megaMenu } = getDom();
      megaMenu.hidden = true;
      megaMenu.setAttribute("aria-hidden", "true");

      if (menuState.siteContent.menu?.openByDefault && !isMobileViewport()) {
        openMenu();
      }
    }

    return { init };
  }

  window.createFDICMenuInitializer = createFDICMenuInitializer;
})();
