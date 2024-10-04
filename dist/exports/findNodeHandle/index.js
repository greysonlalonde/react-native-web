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
import { useRef, useEffect } from 'react';
var findNodeHandle = component => {
  var ref = useRef(null);
  useEffect(() => {
    if (component && component.current) {
      ref.current = component.current;
    }
  }, [component]);
  return ref.current;
};
export default findNodeHandle;