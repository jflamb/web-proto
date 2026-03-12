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
    const HOVER_INTENT_DELAY_MS = 140;
    let topNavPreviewTimer = null;
    let l1PreviewTimer = null;
    let l2PreviewTimer = null;

    function clearPreviewTimer(kind) {
      if (kind === "topNav" && topNavPreviewTimer) {
        window.clearTimeout(topNavPreviewTimer);
        topNavPreviewTimer = null;
      }
      if (kind === "l1" && l1PreviewTimer) {
        window.clearTimeout(l1PreviewTimer);
        l1PreviewTimer = null;
      }
      if (kind === "l2" && l2PreviewTimer) {
        window.clearTimeout(l2PreviewTimer);
        l2PreviewTimer = null;
      }
    }

    function scheduleHoverIntent(kind, callback) {
      clearPreviewTimer(kind);
      const timer = window.setTimeout(() => {
        clearPreviewTimer(kind);
        callback();
      }, HOVER_INTENT_DELAY_MS);
      if (kind === "topNav") topNavPreviewTimer = timer;
      if (kind === "l1") l1PreviewTimer = timer;
      if (kind === "l2") l2PreviewTimer = timer;
    }

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

    if (mobileNavBackdrop) {
      mobileNavBackdrop.addEventListener("click", () => {
        if (!isMobileViewport()) return;
        if (!menuState.mobileNavOpen) return;
        closeMobileNav();
        if (navToggle) navToggle.focus();
      });
      mobileNavBackdrop.addEventListener("keydown", (event) => {
        if (!isMobileViewport()) return;
        if (!menuState.mobileNavOpen) return;
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        closeMobileNav();
        if (navToggle) navToggle.focus();
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
        scheduleHoverIntent("topNav", () => {
          deps.previewTopNavPanel(panelKey, Number(navIndex || 0));
        });
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
        if (fromFocus) {
          clearPreviewTimer("l1");
          deps.setSelectedL1(index, { restoreFocus: true });
          return;
        }
        scheduleHoverIntent("l1", () => {
          deps.setSelectedL1(index, { restoreFocus: false });
        });
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
        if (fromFocus) {
          clearPreviewTimer("l2");
          setPreviewL2(index, { fromFocus: true, restoreFocus: true });
          return;
        }
        scheduleHoverIntent("l2", () => {
          setPreviewL2(index, { fromFocus: false, restoreFocus: false });
        });
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

      if (event.key === "ArrowRight" && menuState.mobileNavOpen) {
        const activeElement = document.activeElement;
        if (activeElement instanceof HTMLElement && activeElement.classList.contains("mobile-drill-trigger")) {
          event.preventDefault();
          handleMobileDelegatedClick(activeElement);
          return;
        }
      }

      if (event.key === "ArrowLeft" && menuState.mobileNavOpen && menuState.mobileDrillPath.length > 0) {
        event.preventDefault();
        menuState.mobileDrillPath = menuState.mobileDrillPath.slice(0, -1);
        renderMobileDrawerPanel();
        const firstFocusable = navList.querySelector(
          ".mobile-drill-trigger, .mobile-drill-link, .mobile-drill-current-link, .mobile-drill-back"
        );
        if (firstFocusable instanceof HTMLElement) {
          firstFocusable.focus();
        }
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
      clearPreviewTimer("topNav");
      clearPreviewTimer("l1");
      clearPreviewTimer("l2");
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Tab" && isMobileViewport() && menuState.mobileNavOpen) {
        const focusables = [
          navToggle,
          ...getMobileDrawerFocusableItems(),
        ].filter(
          (item) => item instanceof HTMLElement && !item.hasAttribute("disabled") && !item.hasAttribute("hidden")
        );
        if (focusables.length > 0) {
          const activeElement = document.activeElement;
          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          if (event.shiftKey && activeElement === first) {
            event.preventDefault();
            last.focus();
            return;
          }
          if (!event.shiftKey && activeElement === last) {
            event.preventDefault();
            first.focus();
            return;
          }
        }
      }

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
    l2List.addEventListener("mouseenter", () => clearPreviewTimer("l2"));
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
      l1Column.addEventListener("mouseenter", () => clearPreviewTimer("l1"));
      l1Column.addEventListener("mouseleave", (event) => {
        if (l2List.contains(event.relatedTarget)) {
          cancelPreviewClear();
          return;
        }
        clearPreviewTimer("l1");
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
    navList.addEventListener("mouseleave", () => clearPreviewTimer("topNav"));

    megaMenu.addEventListener("focusout", scheduleMenuSystemFocusExitCheck);
    megaMenu.addEventListener("mouseleave", () => {
      clearPreviewTimer("l1");
      clearPreviewTimer("l2");
    });
    navList.addEventListener("focusout", scheduleMenuSystemFocusExitCheck);
  }

  window.bindFDICMenuEvents = bindFDICMenuEvents;
})();
