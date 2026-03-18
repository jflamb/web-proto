import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const rootDir = path.resolve(process.cwd(), "sites/fdicnet-main-menu");

function createRuntime() {
  const modules = {};
  return {
    modules,
    registerModule(name, value) {
      modules[name] = value;
      return value;
    },
    requireModule(name) {
      return modules[name];
    },
  };
}

function loadRuntimeModules() {
  const runtime = createRuntime();
  const customElements = {
    registry: new Map(),
    define(name, ctor) {
      this.registry.set(name, ctor);
    },
    get(name) {
      return this.registry.get(name);
    },
  };

  const context = vm.createContext({
    window: { FDICMenuRuntime: runtime },
    customElements,
    HTMLElement: class {},
    document: {},
    console,
    setTimeout,
    clearTimeout,
    CustomEvent: class CustomEvent {},
  });

  const componentSource = fs.readFileSync(path.join(rootDir, "components.js"), "utf8");
  const searchSource = fs.readFileSync(path.join(rootDir, "search.js"), "utf8");

  vm.runInContext(componentSource, context, { filename: "components.js" });
  vm.runInContext(searchSource, context, { filename: "search.js" });

  return {
    runtime,
    customElements,
  };
}

function verifySearchComponentMarkup() {
  const { runtime, customElements } = loadRuntimeModules();
  const componentsModule = runtime.modules.components;
  assert(componentsModule, "Expected components module registration.");
  assert(customElements.get("fdic-site-search"), "Expected fdic-site-search custom element definition.");

  const desktopMarkup = componentsModule.buildFDICSiteSearchMarkup({ surface: "desktop" });
  assert.match(desktopMarkup, /desktopSearchInput/, "Desktop search markup should include desktop input ID.");
  assert.match(desktopMarkup, /desktopSearchSubmit/, "Desktop search markup should include desktop submit ID.");
  assert.match(desktopMarkup, /search-shortcut-hint/, "Desktop search markup should include the shortcut hint.");
  assert.match(desktopMarkup, /desktopSearchPanel/, "Desktop search markup should include the desktop suggestion panel.");
  assert.doesNotMatch(desktopMarkup, /mobile-search-shortcut-hint/, "Desktop markup should not include mobile helper copy.");

  const mobileMarkup = componentsModule.buildFDICSiteSearchMarkup({ surface: "mobile" });
  assert.match(mobileMarkup, /mobileSearchInput/, "Mobile search markup should include mobile input ID.");
  assert.match(mobileMarkup, /mobileSearchSubmit/, "Mobile search markup should include mobile submit ID.");
  assert.match(mobileMarkup, /mobile-search-shortcut-hint/, "Mobile search markup should include inline helper copy.");
  assert.doesNotMatch(mobileMarkup, /desktopSearchPanel/, "Mobile search markup should not include the desktop suggestion panel.");
}

function verifySearchExtensionHooks() {
  const { runtime } = loadRuntimeModules();
  const searchModule = runtime.modules.search;
  assert(searchModule, "Expected search module registration.");

  const fakeSiteContent = {
    header: {
      nav: [
        { kind: "menu", id: "benefits", label: "Benefits", panelKey: "benefits" },
      ],
    },
    menu: {
      panels: {
        benefits: {
          overviewLabel: "Benefits Overview",
          overviewHref: "#benefits-overview",
          l1: [
            {
              label: "Benefits Overview",
              overviewHref: "#benefits-overview",
            },
            {
              label: "Health Plans",
              overviewHref: "#health-plans",
              description: "Compare health coverage options.",
              l2: [
                {
                  label: "Open Enrollment",
                  href: "#open-enrollment",
                  description: "Review enrollment dates and plan guidance.",
                },
              ],
            },
          ],
        },
      },
    },
  };

  const provideSuggestions = searchModule.createMenuSuggestionsProvider({
    getL2Overview: () => null,
  });
  const suggestions = provideSuggestions({
    query: "open",
    siteContent: fakeSiteContent,
  });

  assert.equal(suggestions.length, 1, "Expected one matching suggestion for the sample query.");
  assert.equal(suggestions[0].title, "Open Enrollment", "Expected suggestion titles to come from launcher labels.");
  assert.equal(suggestions[0].action.kind, "menu-entry", "Expected suggestions to expose menu-entry actions by default.");
  assert.match(suggestions[0].meta, /Benefits/, "Expected suggestion metadata to include panel context.");

  let activatedIndex = null;
  let delegatedPayload = null;
  const delegatedSubmissionHandler = searchModule.createDefaultQuerySubmissionHandler({
    resultsViewHandler(payload) {
      delegatedPayload = payload;
      return true;
    },
  });

  delegatedSubmissionHandler({
    query: "benefits",
    surface: "desktop",
    suggestions,
    activeIndex: -1,
    activateSuggestion(index) {
      activatedIndex = index;
    },
  });

  assert.equal(activatedIndex, null, "Expected delegated results-view handling to short-circuit default activation.");
  assert.equal(delegatedPayload?.query, "benefits", "Expected delegated results-view handler to receive the query.");
  assert.equal(delegatedPayload?.selectedSuggestion?.title, "Open Enrollment", "Expected delegated handler to receive the default selected suggestion.");

  const defaultSubmissionHandler = searchModule.createDefaultQuerySubmissionHandler();
  defaultSubmissionHandler({
    query: "benefits",
    surface: "desktop",
    suggestions,
    activeIndex: -1,
    activateSuggestion(index) {
      activatedIndex = index;
    },
  });
  assert.equal(activatedIndex, 0, "Expected default query submission to activate the first suggestion when none is active.");
}

verifySearchComponentMarkup();
verifySearchExtensionHooks();

console.log("FDICnet search component and extension-hook checks passed.");
