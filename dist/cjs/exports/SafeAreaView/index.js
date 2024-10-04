"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
exports.__esModule = true;
exports.default = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var React = _interopRequireWildcard(require("react"));
var _StyleSheet = _interopRequireDefault(require("../StyleSheet"));
var _View = _interopRequireDefault(require("../View"));
var _canUseDom = _interopRequireDefault(require("../../modules/canUseDom"));
var _excluded = ["ref"],
  _excluded2 = ["style"];
/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
var cssFunction = function () {
  if (_canUseDom.default && window.CSS && window.CSS.supports && window.CSS.supports('top: constant(safe-area-inset-top)')) {
    return 'constant';
  }
  return 'env';
}();
var SafeAreaView = _ref => {
  var ref = _ref.ref,
    props = (0, _objectWithoutPropertiesLoose2.default)(_ref, _excluded);
  var style = props.style,
    rest = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded2);
  return /*#__PURE__*/React.createElement(_View.default, (0, _extends2.default)({}, rest, {
    ref: ref,
    style: [styles.root, style]
  }));
};
SafeAreaView.displayName = 'SafeAreaView';
var styles = _StyleSheet.default.create({
  root: {
    paddingTop: cssFunction + "(safe-area-inset-top)",
    paddingRight: cssFunction + "(safe-area-inset-right)",
    paddingBottom: cssFunction + "(safe-area-inset-bottom)",
    paddingLeft: cssFunction + "(safe-area-inset-left)"
  }
});
var _default = SafeAreaView;
exports.default = _default;
module.exports = exports.default;