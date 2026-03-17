class FDICTopNav extends HTMLElement {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.handlePointerOver = this.handlePointerOver.bind(this);
  }

  connectedCallback() {
    if (!this.querySelector(".fdic-nav-list")) {
      this.innerHTML = `
        <nav class="fdic-nav" aria-label="Primary navigation">
          <div class="fdic-shell">
            <ul id="fdicNavList" class="fdic-nav-list"></ul>
          </div>
        </nav>
      `;
    }
    this.addEventListener("click", this.handleClick);
    this.addEventListener("keydown", this.handleKeydown);
    this.addEventListener("pointerover", this.handlePointerOver);
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.handleClick);
    this.removeEventListener("keydown", this.handleKeydown);
    this.removeEventListener("pointerover", this.handlePointerOver);
  }

  get navList() {
    return this.querySelector("#fdicNavList");
  }

  getTopNavItems() {
    return Array.from(this.querySelectorAll(".fdic-nav-item"));
  }

  renderItems(items) {
    const navList = this.navList;
    if (!navList) return;
    navList.innerHTML = "";
    items.forEach((item, index) => {
      const li = document.createElement("li");
      li.setAttribute("role", "none");
      if (item.kind === "menu") {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "fdic-nav-item fdic-nav-item--button";
        button.dataset.navIndex = String(index);
        button.dataset.panelKey = item.panelKey || item.id || "";
        button.setAttribute("aria-haspopup", "true");
        button.setAttribute("aria-controls", "megaMenu");
        button.setAttribute("aria-expanded", "false");
        button.textContent = item.label || "Menu";
        li.appendChild(button);
      } else {
        const link = document.createElement("a");
        link.className = "fdic-nav-item";
        link.dataset.navIndex = String(index);
        link.href = item.href || "#";
        link.textContent = item.label || "Link";
        li.appendChild(link);
      }
      navList.appendChild(li);
    });
  }

  updateState({ activePanelKey = "", menuOpen = false, mobileNavOpen = false, isMobile = false, focusIndex = 0, focus = false } = {}) {
    const items = this.getTopNavItems();
    if (items.length === 0) return;

    const buttons = this.querySelectorAll(".fdic-nav-item--button");
    buttons.forEach((button) => {
      const isActive = button.dataset.panelKey === activePanelKey;
      const isExpanded = isMobile ? isActive && mobileNavOpen : isActive && menuOpen;
      button.classList.toggle("fdic-nav-item--selected", isExpanded);
      button.setAttribute("aria-expanded", isExpanded ? "true" : "false");
    });

    if (isMobile) {
      items.forEach((item) => {
        item.tabIndex = 0;
      });
      return;
    }

    const boundedFocusIndex = Math.max(0, Math.min(focusIndex, items.length - 1));
    items.forEach((item, index) => {
      item.tabIndex = index === boundedFocusIndex ? 0 : -1;
    });
    if (focus) {
      items[boundedFocusIndex].focus();
    }
  }

  handleClick(event) {
    const target = event.target instanceof HTMLElement ? event.target : null;
    if (!target) return;

    const button = target.closest(".fdic-nav-item--button");
    if (button instanceof HTMLButtonElement) {
      const focusMenu = button.dataset.focusMenuOnActivate === "true";
      const forceOpen = button.dataset.forceOpenOnActivate === "true";
      delete button.dataset.focusMenuOnActivate;
      delete button.dataset.forceOpenOnActivate;
      this.dispatchEvent(
        new CustomEvent("fdic-top-nav-activate", {
          bubbles: true,
          detail: {
            panelKey: button.dataset.panelKey || "",
            navIndex: Number(button.dataset.navIndex || 0),
            focusMenu,
            forceOpen,
          },
        })
      );
      return;
    }

    const link = target.closest(".fdic-nav-item");
    if (link instanceof HTMLAnchorElement) {
      this.dispatchEvent(new CustomEvent("fdic-top-nav-link-activate", { bubbles: true }));
    }
  }

  handleKeydown(event) {
    const target = event.target instanceof HTMLElement ? event.target : null;
    if (!target || !target.classList.contains("fdic-nav-item")) return;

    const items = this.getTopNavItems();
    if (items.length === 0) return;
    const currentIndex = items.indexOf(target);
    if (currentIndex < 0) return;

    if (["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      this.dispatchEvent(
        new CustomEvent("fdic-top-nav-roving-request", {
          bubbles: true,
          detail: { key: event.key, currentIndex, itemCount: items.length },
        })
      );
      return;
    }

    if (event.key === "ArrowDown" && target.classList.contains("fdic-nav-item--button")) {
      event.preventDefault();
      target.dataset.focusMenuOnActivate = "true";
      target.dataset.forceOpenOnActivate = "true";
      target.click();
      return;
    }

    if ((event.key === "Enter" || event.key === " ") && target.classList.contains("fdic-nav-item--button")) {
      event.preventDefault();
      target.dataset.focusMenuOnActivate = "true";
      target.click();
    }
  }

  handlePointerOver(event) {
    const target = event.target instanceof HTMLElement ? event.target : null;
    if (!target) return;
    const button = target.closest(".fdic-nav-item--button");
    if (!(button instanceof HTMLButtonElement)) return;
    this.dispatchEvent(
      new CustomEvent("fdic-top-nav-preview", {
        bubbles: true,
        detail: {
          panelKey: button.dataset.panelKey || "",
          navIndex: Number(button.dataset.navIndex || 0),
          pointerType: typeof event.pointerType === "string" ? event.pointerType : "mouse",
        },
      })
    );
  }
}

class FDICMegaMenu extends HTMLElement {
  constructor() {
    super();
    this.handleFocusIn = this.handleFocusIn.bind(this);
    this.handlePointerOver = this.handlePointerOver.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.isMobileView = false;
  }

  connectedCallback() {
    if (!this.querySelector("#megaMenu")) {
      this.innerHTML = `
        <section id="megaMenu" class="mega-menu" aria-label="Main menu">
          <div class="fdic-shell mega-menu-inner">
            <section class="mega-col mega-col--l1" aria-labelledby="l1Heading">
              <h2 id="l1Heading" class="sr-only">Menu sections</h2>
              <ul id="l1List" class="menu-list" aria-labelledby="l1Heading"></ul>
            </section>

            <section class="mega-col mega-col--l2" aria-labelledby="l2Heading">
              <h2 id="l2Heading" class="sr-only">Section links</h2>
              <ul id="l2List" class="menu-list" aria-labelledby="l2Heading"></ul>
            </section>

            <section class="mega-col mega-col--l3" aria-labelledby="l3Heading">
              <h2 id="l3Heading" class="sr-only">Resources</h2>
              <div id="l3Description" class="menu-description"></div>
              <ul id="l3List" class="menu-list menu-list--l3" role="list"></ul>
            </section>
          </div>
        </section>
      `;
    }
    this.addEventListener("focusin", this.handleFocusIn);
    this.addEventListener("pointerover", this.handlePointerOver);
    this.addEventListener("keydown", this.handleKeydown);
  }

  disconnectedCallback() {
    this.removeEventListener("focusin", this.handleFocusIn);
    this.removeEventListener("pointerover", this.handlePointerOver);
    this.removeEventListener("keydown", this.handleKeydown);
  }

  get megaMenuElement() {
    return this.querySelector("#megaMenu");
  }

  get l1Column() {
    return this.querySelector(".mega-col--l1");
  }

  get l3Column() {
    return this.querySelector(".mega-col--l3");
  }

  get l2Column() {
    return this.querySelector(".mega-col--l2");
  }

  get l1List() {
    return this.querySelector("#l1List");
  }

  get l2List() {
    return this.querySelector("#l2List");
  }

  get l3List() {
    return this.querySelector("#l3List");
  }

  get l3Description() {
    return this.querySelector("#l3Description");
  }

  get l1Heading() {
    return this.querySelector("#l1Heading");
  }

  get l2Heading() {
    return this.querySelector("#l2Heading");
  }

  get l3Heading() {
    return this.querySelector("#l3Heading");
  }

  updateColumnRail(column, selector) {
    if (!(column instanceof HTMLElement)) return;

    const target = column.querySelector(selector);
    this.updateColumnRailTarget(column, target);
  }

  updateColumnRailTarget(column, target) {
    if (!(column instanceof HTMLElement)) return;

    if (!(target instanceof HTMLElement)) {
      column.style.setProperty("--column-rail-opacity", "0");
      column.style.setProperty("--column-rail-height", "0px");
      column.style.setProperty("--column-rail-top", "0px");
      return;
    }

    const columnRect = column.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const top = Math.max(0, targetRect.top - columnRect.top);
    column.style.setProperty("--column-rail-opacity", "1");
    column.style.setProperty("--column-rail-height", `${targetRect.height}px`);
    column.style.setProperty("--column-rail-top", `${top}px`);
  }

  updateColumnRails() {
    this.updateColumnRail(this.l1Column, '.l1-item[data-selected="true"]');
    this.updateColumnRail(this.l2Column, '.l2-item[data-active="true"]');
    this.updateColumnRail(this.l3Column, '.l3-item[data-active="true"]');
  }

  updateView({
    panelKey = "",
    panelLabel = "Site menu",
    isMobile = false,
    l1Items = [],
    selectedL1Index = 0,
    l1FocusIndex = 0,
    l2Items = [],
    activeL2Index = 0,
    l2Overview = null,
    previewingOverview = false,
    showingPreview = false,
    l3Items = [],
    l3Description = "",
    l1HeadingLabel = "Menu sections",
    l2HeadingLabel = "Section links",
    l3HeadingLabel = "Resources",
  } = {}) {
    this.isMobileView = isMobile;
    const megaMenu = this.megaMenuElement;
    if (megaMenu) {
      megaMenu.setAttribute("aria-label", panelLabel || "Site menu");
    }

    if (!this.l1List || !this.l2List || !this.l3List || !this.l3Description) return;
    if (this.l1Heading) this.l1Heading.textContent = l1HeadingLabel || "Menu sections";
    if (this.l2Heading) this.l2Heading.textContent = l2HeadingLabel || "Section links";
    if (this.l3Heading) this.l3Heading.textContent = l3HeadingLabel || "Resources";

    if (isMobile) {
      this.l1List.innerHTML = "";
      this.l2List.innerHTML = "";
      this.l3List.innerHTML = "";
      this.l3List.hidden = true;
      this.l3Description.textContent = "";
      this.l3Description.hidden = true;
      this.updateColumnRails();
      return;
    }

    const boundedL1FocusIndex = Math.max(0, Math.min(l1FocusIndex, l1Items.length));

    this.l1List.innerHTML = "";
    const hasOverviewRow = l1Items.length > 1;
    const overviewItem = hasOverviewRow ? l1Items[0] : null;
    const primaryItems = hasOverviewRow ? l1Items.slice(1) : l1Items;

    if (overviewItem) {
      const overviewLi = document.createElement("li");
      overviewLi.setAttribute("role", "none");
      const overviewLink = document.createElement("a");
      const overviewLabel = document.createElement("span");

      overviewLink.className = "l1-item l1-item--overview";
      overviewLink.href = overviewItem?.overviewHref || overviewItem?.href || "#";
      overviewLink.dataset.launcherId = `l1:${panelKey}:0`;
      overviewLink.dataset.column = "l1";
      overviewLink.dataset.index = "0";
      overviewLink.dataset.selected = selectedL1Index === 0 ? "true" : "false";
      overviewLink.tabIndex = boundedL1FocusIndex === 0 ? 0 : -1;

      overviewLabel.className = "l1-label";
      overviewLabel.textContent = overviewItem?.label || "Overview";
      overviewLink.append(overviewLabel);
      overviewLi.appendChild(overviewLink);
      this.l1List.appendChild(overviewLi);

      if (primaryItems.length > 0) {
        const dividerLi = document.createElement("li");
        dividerLi.className = "l1-separator-item";
        dividerLi.setAttribute("aria-hidden", "true");
        dividerLi.setAttribute("role", "presentation");
        const dividerLine = document.createElement("span");
        dividerLine.className = "l1-separator-line";
        dividerLi.appendChild(dividerLine);
        this.l1List.appendChild(dividerLi);
      }
    }

    primaryItems.forEach((item, orderIndex) => {
      const index = hasOverviewRow ? orderIndex + 1 : orderIndex;
      const li = document.createElement("li");
      li.setAttribute("role", "none");
      const hasNextLevel = Array.isArray(item.l2) && item.l2.length > 0;
      const control = document.createElement(hasNextLevel ? "button" : "a");
      const label = document.createElement("span");

      control.className = "l1-item";
      control.dataset.launcherId = `l1:${panelKey}:${index}`;
      control.dataset.column = "l1";
      control.dataset.index = String(index);
      control.dataset.selected = index === selectedL1Index ? "true" : "false";
      control.tabIndex = index === boundedL1FocusIndex ? 0 : -1;
      if (hasNextLevel) {
        control.type = "button";
        control.setAttribute("aria-controls", "l2List");
        control.setAttribute("aria-expanded", index === selectedL1Index ? "true" : "false");
        control.setAttribute("aria-haspopup", "true");
      } else {
        control.href = item.overviewHref || "#";
      }

      label.className = "l1-label";
      label.textContent = item.label || "Section";

      control.append(label);
      if (hasNextLevel) {
        const caret = document.createElement("span");
        caret.className = "l1-caret ph ph-caret-right";
        caret.setAttribute("aria-hidden", "true");
        control.append(caret);
      } else {
        const spacer = document.createElement("span");
        spacer.className = "menu-caret-spacer";
        spacer.setAttribute("aria-hidden", "true");
        control.append(spacer);
      }
      li.appendChild(control);
      this.l1List.appendChild(li);
    });

    this.l2List.innerHTML = "";
    const shouldHighlightL2 = showingPreview && !previewingOverview;

    if (l2Overview) {
      const overviewLi = document.createElement("li");
      overviewLi.setAttribute("role", "none");
      const overviewLink = document.createElement("a");
      const overviewLabel = document.createElement("span");

      overviewLink.className = "l2-item l2-item--overview";
      overviewLink.href = l2Overview.href || "#";
      overviewLink.dataset.launcherId = `l2overview:${panelKey}:${selectedL1Index}`;
      overviewLink.dataset.column = "l2";
      overviewLink.dataset.active = previewingOverview ? "true" : "false";
      overviewLink.tabIndex = previewingOverview || l2Items.length === 0 ? 0 : -1;

      overviewLabel.className = "l2-label";
      overviewLabel.textContent = l2Overview.label || "Overview";
      overviewLink.append(overviewLabel);
      overviewLi.appendChild(overviewLink);
      this.l2List.appendChild(overviewLi);

      if (l2Items.length > 0) {
        const dividerLi = document.createElement("li");
        dividerLi.className = "l2-separator-item";
        dividerLi.setAttribute("aria-hidden", "true");
        dividerLi.setAttribute("role", "presentation");
        const dividerLine = document.createElement("span");
        dividerLine.className = "l2-separator-line";
        dividerLi.appendChild(dividerLine);
        this.l2List.appendChild(dividerLi);
      }
    }

    l2Items.forEach((item, index) => {
      const li = document.createElement("li");
      li.setAttribute("role", "none");
      const link = document.createElement("a");
      const label = document.createElement("span");
      const isActive = shouldHighlightL2 && index === activeL2Index;
      const hasNextLevel = Array.isArray(item.l3) && item.l3.length > 0;

      link.className = "l2-item";
      link.href = item.href || "#";
      link.dataset.launcherId = `l2:${panelKey}:${selectedL1Index}:${index}`;
      link.dataset.column = "l2";
      link.dataset.index = String(index);
      link.dataset.active = isActive ? "true" : "false";
      link.tabIndex = index === 0 ? 0 : -1;

      label.className = "l2-label";
      label.textContent = item.label || "Link";
      link.append(label);
      if (hasNextLevel) {
        const caret = document.createElement("span");
        caret.className = "l1-caret l2-caret ph ph-caret-right";
        caret.setAttribute("aria-hidden", "true");
        link.append(caret);
      } else {
        const spacer = document.createElement("span");
        spacer.className = "menu-caret-spacer";
        spacer.setAttribute("aria-hidden", "true");
        link.append(spacer);
      }

      li.appendChild(link);
      this.l2List.appendChild(li);
    });

    this.l3Description.textContent = l3Description || "";
    this.l3Description.hidden = !l3Description;

    this.l3List.innerHTML = "";
    const showL3List = showingPreview && !previewingOverview && l3Items.length > 0;
    this.l3List.hidden = !showL3List;
    if (!showL3List) {
      this.updateColumnRails();
      return;
    }

    l3Items.forEach((item, index) => {
      const li = document.createElement("li");
      li.setAttribute("role", "none");
      const link = document.createElement("a");
      link.className = "l3-item";
      link.href = item.href || "#";
      link.textContent = item.label || "Sub-link";
      link.dataset.launcherId = `l3:${panelKey}:${selectedL1Index}:${activeL2Index}:${index}`;
      link.dataset.column = "l3";
      link.dataset.index = String(index);
      link.tabIndex = index === 0 ? 0 : -1;
      li.appendChild(link);
      this.l3List.appendChild(li);
    });

    this.updateColumnRails();
  }

  setColumnFocus(container, selector, target) {
    if (!container || !target) return false;
    const items = Array.from(container.querySelectorAll(selector));
    if (items.length === 0) return false;
    items.forEach((item) => {
      item.tabIndex = item === target ? 0 : -1;
    });
    target.focus();
    return true;
  }

  focusL1Index(index) {
    const target = this.l1List?.querySelector(`.l1-item[data-index="${index}"]`);
    return this.setColumnFocus(this.l1Column, ".l1-item", target);
  }

  focusL2Index(index) {
    const target = this.l2List?.querySelector(`.l2-item[data-index="${index}"]`);
    return this.setColumnFocus(this.l2List, ".l2-item", target);
  }

  focusL2Overview() {
    const target = this.l2List?.querySelector(".l2-item--overview");
    return this.setColumnFocus(this.l2List, ".l2-item", target);
  }

  focusSelectedL1() {
    const target = this.l1List?.querySelector('.l1-item[data-selected="true"]') || this.l1List?.querySelector(".l1-item");
    return this.setColumnFocus(this.l1Column, ".l1-item", target);
  }

  focusActiveL2() {
    const target = this.l2List?.querySelector('.l2-item[data-active="true"]')
      || this.l2List?.querySelector('.l2-item[tabindex="0"]')
      || this.l2List?.querySelector(".l2-item");
    return this.setColumnFocus(this.l2List, ".l2-item", target);
  }

  focusActiveL3() {
    if (this.l3List?.hidden) return false;
    const target = this.l3List?.querySelector('.l3-item[tabindex="0"]') || this.l3List?.querySelector(".l3-item");
    return this.setColumnFocus(this.l3List, ".l3-item", target);
  }

  handleFocusIn(event) {
    if (this.isMobileView) return;
    const target = event.target instanceof HTMLElement ? event.target : null;
    if (!target) return;

    const l1Item = target.closest(".l1-item");
    if (l1Item instanceof HTMLElement) {
      if (l1Item.classList.contains("l1-item--overview")) return;
      this.updateColumnRailTarget(this.l1Column, l1Item);
      this.dispatchEvent(
        new CustomEvent("fdic-mega-l1-preview", {
          bubbles: true,
          detail: { index: Number(l1Item.dataset.index || 0), fromFocus: true },
        })
      );
      return;
    }

    const l2Item = target.closest(".l2-item");
    if (l2Item instanceof HTMLAnchorElement) {
      if (l2Item.classList.contains("l2-item--overview")) {
        this.updateColumnRailTarget(this.l2Column, l2Item);
        this.dispatchEvent(new CustomEvent("fdic-mega-l2-overview-preview", { bubbles: true, detail: { fromFocus: true } }));
        return;
      }

      this.updateColumnRailTarget(this.l2Column, l2Item);
      this.dispatchEvent(
        new CustomEvent("fdic-mega-l2-preview", {
          bubbles: true,
          detail: { index: Number(l2Item.dataset.index || 0), fromFocus: true },
        })
      );
      return;
    }

    const l3Item = target.closest(".l3-item");
    if (l3Item instanceof HTMLAnchorElement) {
      this.updateColumnRailTarget(this.l3Column, l3Item);
    }
  }

  handlePointerOver(event) {
    if (this.isMobileView) return;
    const target = event.target instanceof HTMLElement ? event.target : null;
    if (!target) return;

    const l1Item = target.closest(".l1-item");
    if (l1Item instanceof HTMLElement) {
      if (l1Item.classList.contains("l1-item--overview")) return;
      this.updateColumnRailTarget(this.l1Column, l1Item);
      this.dispatchEvent(
        new CustomEvent("fdic-mega-l1-preview", {
          bubbles: true,
          detail: {
            index: Number(l1Item.dataset.index || 0),
            fromFocus: false,
            pointerType: typeof event.pointerType === "string" ? event.pointerType : "mouse",
          },
        })
      );
      return;
    }

    const l2Item = target.closest(".l2-item");
    if (l2Item instanceof HTMLAnchorElement) {
      if (l2Item.classList.contains("l2-item--overview")) {
        this.updateColumnRailTarget(this.l2Column, l2Item);
        this.dispatchEvent(new CustomEvent("fdic-mega-l2-overview-preview", { bubbles: true, detail: { fromFocus: false } }));
        return;
      }

      this.updateColumnRailTarget(this.l2Column, l2Item);
      this.dispatchEvent(
        new CustomEvent("fdic-mega-l2-preview", {
          bubbles: true,
          detail: {
            index: Number(l2Item.dataset.index || 0),
            fromFocus: false,
            pointerType: typeof event.pointerType === "string" ? event.pointerType : "mouse",
          },
        })
      );
      return;
    }

    const l3Item = target.closest(".l3-item");
    if (l3Item instanceof HTMLAnchorElement) {
      this.updateColumnRailTarget(this.l3Column, l3Item);
    }
  }

  handleKeydown(event) {
    if (this.isMobileView) return;
    const activeElement = document.activeElement;
    if (!(activeElement instanceof HTMLElement)) return;

    const key = event.key;
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(key)) {
      const column = activeElement.dataset.column;
      let container = null;
      let selector = "";
      if (column === "l1") {
        container = this.l1Column;
        selector = ".l1-item";
      } else if (column === "l2") {
        container = this.l2List;
        selector = ".l2-item";
      } else if (column === "l3") {
        container = this.l3List;
        selector = ".l3-item";
      } else {
        return;
      }

      const items = Array.from(container?.querySelectorAll(selector) || []);
      const currentIndex = items.indexOf(activeElement);
      if (currentIndex === -1 || items.length === 0) return;

      if (key === "ArrowUp" && currentIndex === 0) {
        event.preventDefault();
        this.dispatchEvent(new CustomEvent("fdic-mega-focus-active-top-nav", { bubbles: true }));
        return;
      }

      event.preventDefault();
      let nextIndex = currentIndex;
      if (key === "ArrowDown") nextIndex = (currentIndex + 1) % items.length;
      if (key === "ArrowUp") nextIndex = (currentIndex - 1 + items.length) % items.length;
      if (key === "Home") nextIndex = 0;
      if (key === "End") nextIndex = items.length - 1;

      items.forEach((item) => {
        item.tabIndex = -1;
      });
      items[nextIndex].tabIndex = 0;
      items[nextIndex].focus();

      if (column === "l1") {
        this.dispatchEvent(
          new CustomEvent("fdic-mega-l1-roving", {
            bubbles: true,
            detail: { index: Number(items[nextIndex].dataset.index || 0) },
          })
        );
      }
      return;
    }

    if (!["ArrowLeft", "ArrowRight"].includes(key)) return;
    const column = activeElement.dataset.column;
    let moved = false;
    if (key === "ArrowRight") {
      if (column === "l1") moved = this.focusActiveL2();
      if (column === "l2") moved = this.focusActiveL3();
    }
    if (key === "ArrowLeft") {
      if (column === "l3") moved = this.focusActiveL2();
      if (column === "l2") moved = this.focusSelectedL1();
    }
    if (moved) {
      event.preventDefault();
    }
  }
}

if (!customElements.get("fdic-top-nav")) {
  customElements.define("fdic-top-nav", FDICTopNav);
}

if (!customElements.get("fdic-mega-menu")) {
  customElements.define("fdic-mega-menu", FDICMegaMenu);
}
