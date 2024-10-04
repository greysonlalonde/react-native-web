"use strict";

exports.__esModule = true;
exports.default = void 0;
var _react = require("react");
/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

/**
 * Imperatively finding the DOM element of a react component has been deprecated.
 * You should use ref properties on the component instead.
 */

// For functional components, use useRef.

var findNodeHandle = component => {
  var ref = (0, _react.useRef)(null);
  (0, _react.useEffect)(() => {
    if (component && component.current) {
      ref.current = component.current;
    }
  }, [component]);
  return ref.current;
};
var _default = findNodeHandle;
exports.default = _default;
module.exports = exports.default;