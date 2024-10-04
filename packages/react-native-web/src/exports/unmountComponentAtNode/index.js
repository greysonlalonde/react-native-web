/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @noflow
 */

import { createRoot } from 'react-dom/client';

const unmountComponentAtNode = (container) => {
  if (!container) return;

  const root = createRoot(container);
  root.unmount();
};

export default unmountComponentAtNode;

