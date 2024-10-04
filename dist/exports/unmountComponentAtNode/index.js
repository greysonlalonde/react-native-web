/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

import { createRoot } from 'react-dom/client';
var unmountComponentAtNode = container => {
  if (!container) return;
  var root = createRoot(container);
  root.unmount();
};
export default unmountComponentAtNode;