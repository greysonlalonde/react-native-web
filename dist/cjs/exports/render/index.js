"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
exports.__esModule = true;
exports.default = renderLegacy;
exports.hydrate = hydrate;
exports.render = render;
var _reactDom = require("react-dom");
var _client = require("react-dom/client");
var _unmountComponentAtNode = _interopRequireDefault(require("../unmountComponentAtNode"));
var _dom = require("../StyleSheet/dom");
/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

// No hydrate here

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

// Legacy render (for backward compatibility) using react-dom's render
function renderLegacy(element, root, callback) {
  (0, _dom.createSheet)(root);
  (0, _reactDom.render)(element, root, callback); // Legacy render (for React < 18)
  return {
    unmount: function unmount() {
      return (0, _unmountComponentAtNode.default)(root); // Ensures unmount functionality
    }
  };
}