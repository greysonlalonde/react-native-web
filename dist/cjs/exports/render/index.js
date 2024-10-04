"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
exports.__esModule = true;
exports.default = renderLegacy;
exports.hydrate = hydrate;
exports.hydrateLegacy = hydrateLegacy;
exports.render = render;
var _client = require("react-dom/client");
var _unmountComponentAtNode = _interopRequireDefault(require("../unmountComponentAtNode"));
var _dom = require("../StyleSheet/dom");
/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Modern hydrate using React 18+ hydrateRoot
function hydrate(element, root) {
  (0, _dom.createSheet)(root);
  return (0, _client.hydrateRoot)(root, element); // Uses the modern hydrateRoot
}

// Modern render using React 18+ createRoot
function render(element, root) {
  (0, _dom.createSheet)(root);
  var reactRoot = (0, _client.createRoot)(root); // Uses the modern createRoot
  reactRoot.render(element); // Render the element
  return reactRoot;
}

// Legacy render function (for backward compatibility with React 18+)
function renderLegacy(element, root, callback) {
  (0, _dom.createSheet)(root);

  // Check if React 18+ is available by detecting `createRoot`
  if (_client.createRoot) {
    // Use the modern React 18+ API
    var reactRoot = (0, _client.createRoot)(root); // Create root with React 18 API
    reactRoot.render(element); // Render the element using React 18+ API

    if (callback) {
      callback(); // Ensure callback support, even with React 18+
    }

    return {
      unmount: () => reactRoot.unmount() // Ensure unmount functionality
    };
  } else {
    // Handle legacy React (React 17 and below) dynamically
    var _require = require('react-dom'),
      legacyRender = _require.render; // Dynamic import for React 17
    legacyRender(element, root, callback); // Use legacy render for React 17 or below
    return {
      unmount: () => (0, _unmountComponentAtNode.default)(root) // Ensure unmount functionality
    };
  }
}

// Legacy hydrate function (for backward compatibility with React 18+)
function hydrateLegacy(element, root) {
  (0, _dom.createSheet)(root);
  if (_client.hydrateRoot) {
    // Use the modern React 18+ hydrateRoot API
    return (0, _client.hydrateRoot)(root, element); // Modern hydrate for React 18+
  } else {
    // Handle legacy React (React 17 and below) dynamically
    var _require2 = require('react-dom'),
      legacyHydrate = _require2.hydrate; // Dynamic import for React 17
    return legacyHydrate(element, root); // Use legacy hydrate for React 17 or below
  }
}