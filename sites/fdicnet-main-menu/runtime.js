(function initFDICMenuRuntime() {
  if (window.FDICMenuRuntime) {
    return;
  }

  const config = {
    breakpoints: {
      mobileNavMax: 768,
      phoneSearchMax: 640,
      tabletMax: 1049,
    },
    reducedMotionQuery: "(prefers-reduced-motion: reduce)",
  };

  const modules = {};

  function registerModule(name, value) {
    modules[name] = value;
    return value;
  }

  function requireModule(name) {
    const moduleValue = modules[name];
    if (!moduleValue) {
      throw new Error(`FDICMenuRuntime module missing: ${name}`);
    }
    return moduleValue;
  }

  function getMediaQuery(type, px) {
    return `(${type}-width: ${px}px)`;
  }

  window.FDICMenuRuntime = {
    config,
    modules,
    registerModule,
    requireModule,
    getMobileNavQuery() {
      return getMediaQuery("max", config.breakpoints.mobileNavMax);
    },
    getPhoneSearchQuery() {
      return getMediaQuery("max", config.breakpoints.phoneSearchMax);
    },
    getReducedMotionQuery() {
      return config.reducedMotionQuery;
    },
  };
})();
