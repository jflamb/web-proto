class FDICTopNav extends HTMLElement {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleMouseOver = this.handleMouseOver.bind(this);
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
    this.addEventListener("mouseover", this.handleMouseOver);
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.handleClick);
    this.removeEventListener("keydown", this.handleKeydown);
    this.removeEventListener("mouseover", this.handleMouseOver);
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
      delete button.dataset.focusMenuOnActivate;
      this.dispatchEvent(
        new CustomEvent("fdic-top-nav-activate", {
          bubbles: true,
          detail: {
            panelKey: button.dataset.panelKey || "",
            navIndex: Number(button.dataset.navIndex || 0),
            focusMenu,
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

    if ((event.key === "Enter" || event.key === " ") && target.classList.contains("fdic-nav-item--button")) {
      event.preventDefault();
      target.dataset.focusMenuOnActivate = "true";
      target.click();
    }
  }

  handleMouseOver(event) {
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
        },
      })
    );
  }
}

class FDICMegaMenu extends HTMLElement {
  constructor() {
    super();
    this.handleFocusIn = this.handleFocusIn.bind(this);
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.isMobileView = false;
  }

  connectedCallback() {
    if (!this.querySelector("#megaMenu")) {
      this.innerHTML = `
        <section id="megaMenu" class="mega-menu" aria-label="Main menu">
          <div class="fdic-shell mega-menu-inner">
            <section class="mega-col mega-col--l1" aria-labelledby="l1Heading">
              <h2 id="l1Heading" class="sr-only">Level 1</h2>
              <ul id="l1List" class="menu-list" aria-labelledby="l1Heading"></ul>
            </section>

            <section class="mega-col mega-col--l2" aria-labelledby="l2Heading">
              <h2 id="l2Heading" class="sr-only">Level 2</h2>
              <ul id="l2List" class="menu-list" aria-labelledby="l2Heading"></ul>
            </section>

            <section class="mega-col mega-col--l3" aria-labelledby="l3Heading">
              <h2 id="l3Heading" class="sr-only">Level 3</h2>
              <div id="l3Description" class="menu-description"></div>
              <ul id="l3List" class="menu-list menu-list--l3" role="list"></ul>
            </section>
          </div>
        </section>
      `;
    }
    this.addEventListener("focusin", this.handleFocusIn);
    this.addEventListener("mouseover", this.handleMouseOver);
    this.addEventListener("keydown", this.handleKeydown);
  }

  disconnectedCallback() {
    this.removeEventListener("focusin", this.handleFocusIn);
    this.removeEventListener("mouseover", this.handleMouseOver);
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

  updateView({
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
  } = {}) {
    this.isMobileView = isMobile;
    const megaMenu = this.megaMenuElement;
    if (megaMenu) {
      megaMenu.setAttribute("aria-label", panelLabel || "Site menu");
    }

    if (!this.l1List || !this.l2List || !this.l3List || !this.l3Description) return;

    if (isMobile) {
      this.l1List.innerHTML = "";
      this.l2List.innerHTML = "";
      this.l3List.innerHTML = "";
      this.l3List.hidden = true;
      this.l3Description.textContent = "";
      this.l3Description.hidden = true;
      return;
    }

    const boundedL1FocusIndex = Math.max(0, Math.min(l1FocusIndex, l1Items.length));

    this.l1List.innerHTML = "";
    l1Items.forEach((item, index) => {
      const li = document.createElement("li");
      li.setAttribute("role", "none");
      const link = document.createElement("a");
      const label = document.createElement("span");
      const caret = document.createElement("span");

      link.className = "l1-item";
      link.href = item.overviewHref || "#";
      link.dataset.column = "l1";
      link.dataset.index = String(index);
      link.dataset.selected = index === selectedL1Index ? "true" : "false";
      link.tabIndex = index === boundedL1FocusIndex ? 0 : -1;

      label.className = "l1-label";
      label.textContent = item.label || "Section";

      caret.className = "l1-caret ph ph-caret-right";
      caret.setAttribute("aria-hidden", "true");

      link.append(label, caret);
      li.appendChild(link);
      this.l1List.appendChild(li);
    });

    this.l2List.innerHTML = "";
    l2Items.forEach((item, index) => {
      const li = document.createElement("li");
      li.setAttribute("role", "none");
      const link = document.createElement("a");
      const label = document.createElement("span");
      const caret = document.createElement("span");
      const isActive = index === activeL2Index;

      link.className = "l2-item";
      link.href = item.href || "#";
      link.dataset.column = "l2";
      link.dataset.index = String(index);
      link.dataset.active = isActive ? "true" : "false";
      link.tabIndex = index === 0 ? 0 : -1;

      label.className = "l2-label";
      label.textContent = item.label || "Link";
      caret.className = "l1-caret l2-caret ph ph-caret-right";
      caret.setAttribute("aria-hidden", "true");
      link.append(label, caret);

      li.appendChild(link);
      this.l2List.appendChild(li);
    });

    if (l2Overview) {
      const separatorLi = document.createElement("li");
      separatorLi.className = "l2-separator-item";
      separatorLi.setAttribute("aria-hidden", "true");
      separatorLi.setAttribute("role", "presentation");

      const separatorLine = document.createElement("span");
      separatorLine.className = "l2-separator-line";
      separatorLi.appendChild(separatorLine);
      this.l2List.appendChild(separatorLi);

      const overviewLi = document.createElement("li");
      overviewLi.setAttribute("role", "none");
      const overviewLink = document.createElement("a");
      const overviewLabel = document.createElement("span");
      const overviewCaret = document.createElement("span");
      overviewLink.className = "l2-item l2-item--overview";
      overviewLink.href = l2Overview.href || "#";
      overviewLink.dataset.column = "l2";
      overviewLink.dataset.index = String(l2Items.length);
      overviewLink.tabIndex = l2Items.length === 0 ? 0 : -1;
      overviewLabel.className = "l2-label";
      overviewLabel.textContent = l2Overview.label || "Overview";
      overviewCaret.className = "l1-caret l2-caret ph ph-caret-right";
      overviewCaret.setAttribute("aria-hidden", "true");
      overviewLink.append(overviewLabel, overviewCaret);
      overviewLi.appendChild(overviewLink);
      this.l2List.appendChild(overviewLi);
    }

    this.l3Description.textContent = l3Description || "";
    this.l3Description.hidden = !l3Description;

    this.l3List.innerHTML = "";
    this.l3List.hidden = !showingPreview || previewingOverview;
    if (!showingPreview || previewingOverview) return;

    l3Items.forEach((item, index) => {
      const li = document.createElement("li");
      li.setAttribute("role", "none");
      const link = document.createElement("a");
      link.className = "l3-item";
      link.href = item.href || "#";
      link.textContent = item.label || "Sub-link";
      link.dataset.column = "l3";
      link.dataset.index = String(index);
      link.tabIndex = index === 0 ? 0 : -1;
      li.appendChild(link);
      this.l3List.appendChild(li);
    });
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
    if (l1Item instanceof HTMLAnchorElement) {
      this.dispatchEvent(
        new CustomEvent("fdic-mega-l1-preview", {
          bubbles: true,
          detail: { index: Number(l1Item.dataset.index || 0), fromFocus: true },
        })
      );
      return;
    }

    const l2Item = target.closest(".l2-item");
    if (!(l2Item instanceof HTMLAnchorElement)) return;

    if (l2Item.classList.contains("l2-item--overview")) {
      this.dispatchEvent(new CustomEvent("fdic-mega-l2-overview-preview", { bubbles: true, detail: { fromFocus: true } }));
      return;
    }

    this.dispatchEvent(
      new CustomEvent("fdic-mega-l2-preview", {
        bubbles: true,
        detail: { index: Number(l2Item.dataset.index || 0), fromFocus: true },
      })
    );
  }

  handleMouseOver(event) {
    if (this.isMobileView) return;
    const target = event.target instanceof HTMLElement ? event.target : null;
    if (!target) return;

    const l1Item = target.closest(".l1-item");
    if (l1Item instanceof HTMLAnchorElement) {
      this.dispatchEvent(
        new CustomEvent("fdic-mega-l1-preview", {
          bubbles: true,
          detail: { index: Number(l1Item.dataset.index || 0), fromFocus: false },
        })
      );
      return;
    }

    const l2Item = target.closest(".l2-item");
    if (!(l2Item instanceof HTMLAnchorElement)) return;

    if (l2Item.classList.contains("l2-item--overview")) {
      this.dispatchEvent(new CustomEvent("fdic-mega-l2-overview-preview", { bubbles: true, detail: { fromFocus: false } }));
      return;
    }

    this.dispatchEvent(
      new CustomEvent("fdic-mega-l2-preview", {
        bubbles: true,
        detail: { index: Number(l2Item.dataset.index || 0), fromFocus: false },
      })
    );
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
