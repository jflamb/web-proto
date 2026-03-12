(function initFDICMenuEventsModule() {
  function bindFDICMenuEvents(deps) {
    const {
      menuState,
      getDom,
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
      handleTopNavRovingRequest,
      getMobileDrawerFocusableItems,
      handleMobileDelegatedClick,
      scheduleMenuSystemFocusExitCheck,
      cancelPreviewClear,
      schedulePreviewClear,
      setPreviewL2,
      setPreviewOverview,
      renderMobileDrawerPanel,
      getTopNavItems,
    } = deps;

    const {
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
    } = getDom();

    function wirePreviewClearOnFocusOut(container, keepInColumns = []) {
      if (!container) return;
      container.addEventListener("focusout", () => {
        window.requestAnimationFrame(() => {
          const activeElement = document.activeElement;
          if (activeElement && keepInColumns.some((node) => node && node.contains(activeElement))) {
            return;
          }
          scheduleClearPreview();
        });
      });
    }

    function scheduleClearPreview() {
      schedulePreviewClear();
    }

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

    phoneSearchMediaQuery.addEventListener("change", () => {
      syncMobileSearchState();
    });

    if (topNav) {
      topNav.addEventListener("fdic-top-nav-preview", (event) => {
        if (isMobileViewport()) return;
        const { panelKey, navIndex } = event.detail || {};
        if (!panelKey) return;
        deps.previewTopNavPanel(panelKey, Number(navIndex || 0));
      });

      topNav.addEventListener("fdic-top-nav-activate", (event) => {
        const { panelKey, navIndex, focusMenu } = event.detail || {};
        if (!panelKey) return;
        activateTopNavPanel(panelKey, Number(navIndex || 0), { focusMenu: Boolean(focusMenu) });
      });

      topNav.addEventListener("fdic-top-nav-roving-request", (event) => {
        if (isMobileViewport()) return;
        handleTopNavRovingRequest(event.detail || {});
      });

      topNav.addEventListener("fdic-top-nav-link-activate", () => {
        closeMobileNav();
      });
    }

    if (megaMenuHost) {
      megaMenuHost.addEventListener("fdic-mega-l1-preview", (event) => {
        if (isMobileViewport()) return;
        const { index, fromFocus } = event.detail || {};
        if (!Number.isFinite(index)) return;
        deps.setSelectedL1(index, { restoreFocus: Boolean(fromFocus) });
      });

      megaMenuHost.addEventListener("fdic-mega-l1-roving", (event) => {
        const { index } = event.detail || {};
        if (!Number.isFinite(index)) return;
        menuState.l1FocusIndex = index;
      });

      megaMenuHost.addEventListener("fdic-mega-l2-preview", (event) => {
        if (isMobileViewport()) return;
        const { index, fromFocus } = event.detail || {};
        if (!Number.isFinite(index)) return;
        setPreviewL2(index, { fromFocus: Boolean(fromFocus), restoreFocus: Boolean(fromFocus) });
      });

      megaMenuHost.addEventListener("fdic-mega-l2-overview-preview", (event) => {
        if (isMobileViewport()) return;
        const { fromFocus } = event.detail || {};
        setPreviewOverview({ fromFocus: Boolean(fromFocus), restoreFocus: Boolean(fromFocus) });
      });
    }

    navList.addEventListener("keydown", (event) => {
      if (!isMobileViewport()) {
        return;
      }

      if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
        return;
      }
      const items = getMobileDrawerFocusableItems();
      if (items.length === 0) return;
      const currentIndex = items.indexOf(document.activeElement);

      event.preventDefault();
      let nextIndex = 0;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = items.length - 1;
      if (event.key === "ArrowDown") {
        nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % items.length;
      }
      if (event.key === "ArrowUp") {
        nextIndex = currentIndex === -1 ? items.length - 1 : (currentIndex - 1 + items.length) % items.length;
      }
      items[nextIndex].focus();
    });

    navList.addEventListener("click", (event) => {
      if (!isMobileViewport()) return;
      const target = event.target instanceof HTMLElement ? event.target : null;
      if (!target) return;
      handleMobileDelegatedClick(target);
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
      if (isMobileViewport() && navToggle) {
        navToggle.focus();
        return;
      }
      const activeButton = getTopNavItems().find(
        (item) => item.classList.contains("fdic-nav-item--button") && item.dataset.panelKey === menuState.activePanelKey
      );
      if (activeButton) {
        activeButton.focus();
        return;
      }
      if (navToggle) {
        navToggle.focus();
      }
    });

    l2List.addEventListener("mouseenter", cancelPreviewClear);
    l2List.addEventListener("mouseleave", (event) => {
      if (l3Column && l3Column.contains(event.relatedTarget)) {
        return;
      }
      if (l1Column && l1Column.contains(event.relatedTarget)) {
        schedulePreviewClear();
        return;
      }
      schedulePreviewClear();
    });

    if (l1Column) {
      l1Column.addEventListener("mouseleave", (event) => {
        if (l2List.contains(event.relatedTarget)) {
          cancelPreviewClear();
          return;
        }
        schedulePreviewClear();
      });
    }

    if (l3Column) {
      l3Column.addEventListener("mouseenter", cancelPreviewClear);
      l3Column.addEventListener("mouseleave", (event) => {
        if (l2List.contains(event.relatedTarget)) {
          return;
        }
        schedulePreviewClear();
      });
      l3Column.addEventListener("focusin", cancelPreviewClear);
      wirePreviewClearOnFocusOut(l3Column, [l3Column, l2List]);
    }

    wirePreviewClearOnFocusOut(l2List, [l2List, l3Column]);

    megaMenu.addEventListener("focusout", scheduleMenuSystemFocusExitCheck);
    navList.addEventListener("focusout", scheduleMenuSystemFocusExitCheck);
  }

  window.bindFDICMenuEvents = bindFDICMenuEvents;
})();
