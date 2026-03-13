# FDICnet Main Menu Single Directory Component

This directory is an additive Drupal-oriented wrapper around the existing static prototype in `sites/fdicnet-main-menu`.

## Purpose

- Keep the current HTML/CSS/JS prototype working as-is.
- Give Drupal teammates a single directory that collocates the component template, metadata, CSS entrypoint, and JS entrypoint.
- Avoid duplicating the menu runtime by reusing the existing prototype assets through relative imports/bootstrap.

## Files

- `fdicnet-main-menu.component.yml`: component metadata and basic props.
- `fdicnet-main-menu.twig`: component markup shell with the DOM IDs and custom-element hosts required by the current runtime.
- `fdicnet-main-menu.css`: CSS entrypoint that reuses the prototype stylesheet.
- `fdicnet-main-menu.js`: safe bootstrap that loads the existing prototype runtime only when the page has not already loaded it.

## Integration Notes

- The Twig template preserves the existing DOM contract used by `components.js`, `state.js`, `mobile-drawer.js`, `events.js`, `init.js`, and `script.js`.
- The JS entrypoint is intentionally defensive:
  - if the prototype runtime is already on the page, it does nothing
  - otherwise it loads the current runtime files in dependency order
- `content.yaml` remains the menu content source. If Drupal replaces that with server-rendered data later, the runtime will need a follow-up adaptation.

## Prototype Status

The static prototype entrypoint remains `sites/fdicnet-main-menu/index.html`. This SDC package is a compatibility layer for Drupal handoff, not a rewrite of the runtime.
