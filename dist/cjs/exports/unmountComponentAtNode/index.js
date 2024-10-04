"use strict";

exports.__esModule = true;
exports.default = void 0;
var _client = require("react-dom/client");
/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

var unmountComponentAtNode = container => {
  if (!container) return;
  var root = (0, _client.createRoot)(container);
  root.unmount();
};
var _default = unmountComponentAtNode;
exports.default = _default;
module.exports = exports.default;