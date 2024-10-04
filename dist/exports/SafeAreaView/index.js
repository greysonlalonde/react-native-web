import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";
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

import * as React from 'react';
import StyleSheet from '../StyleSheet';
import View from '../View';
import canUseDOM from '../../modules/canUseDom';
var cssFunction = function () {
  if (canUseDOM && window.CSS && window.CSS.supports && window.CSS.supports('top: constant(safe-area-inset-top)')) {
    return 'constant';
  }
  return 'env';
}();
var SafeAreaView = _ref => {
  var ref = _ref.ref,
    props = _objectWithoutPropertiesLoose(_ref, _excluded);
  var style = props.style,
    rest = _objectWithoutPropertiesLoose(props, _excluded2);
  return /*#__PURE__*/React.createElement(View, _extends({}, rest, {
    ref: ref,
    style: [styles.root, style]
  }));
};
SafeAreaView.displayName = 'SafeAreaView';
var styles = StyleSheet.create({
  root: {
    paddingTop: cssFunction + "(safe-area-inset-top)",
    paddingRight: cssFunction + "(safe-area-inset-right)",
    paddingBottom: cssFunction + "(safe-area-inset-bottom)",
    paddingLeft: cssFunction + "(safe-area-inset-left)"
  }
});
export default SafeAreaView;