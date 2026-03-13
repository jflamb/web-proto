(function initFDICnetMainMenuSDC() {
  const runtimeAlreadyPresent =
    typeof window.FDICMenuRuntime !== "undefined" ||
    Boolean(document.querySelector('script[src$="/sites/fdicnet-main-menu/script.js"], script[src$="sites/fdicnet-main-menu/script.js"], script[src$="/script.js"], script[src="script.js"]'));

  if (runtimeAlreadyPresent) {
    return;
  }

  if (window.__fdicnetMenuSdcBootstrapPromise) {
    return;
  }

  const currentScript = document.currentScript;
  const baseUrl = currentScript?.src || window.location.href;
  const externalScriptUrls = [
    "https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.min.js",
    "../../runtime.js",
    "../../components.js",
    "../../state.js",
    "../../search.js",
    "../../mobile-drawer.js",
    "../../events.js",
    "../../init.js",
    "../../script.js",
  ].map((src) => new URL(src, baseUrl).toString());

  function loadScript(src) {
    const existing = Array.from(document.scripts).find((script) => script.src === src);
    if (existing) {
      return existing.dataset.loaded === "true"
        ? Promise.resolve()
        : new Promise((resolve, reject) => {
            existing.addEventListener("load", () => resolve(), { once: true });
            existing.addEventListener("error", () => reject(new Error(`Failed to load ${src}`)), { once: true });
          });
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = false;
      script.dataset.fdicnetMenuRuntime = "true";
      script.addEventListener(
        "load",
        () => {
          script.dataset.loaded = "true";
          resolve();
        },
        { once: true }
      );
      script.addEventListener("error", () => reject(new Error(`Failed to load ${src}`)), { once: true });
      document.head.appendChild(script);
    });
  }

  window.__fdicnetMenuSdcBootstrapPromise = externalScriptUrls
    .reduce((promise, src) => promise.then(() => loadScript(src)), Promise.resolve())
    .catch((error) => {
      console.error("FDICnet SDC bootstrap failed.", error);
    })
    .finally(() => {
      window.__fdicnetMenuSdcBootstrapPromise = null;
    });
})();
