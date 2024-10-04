/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @noflow
 */

import { render as domLegacyRender } from 'react-dom'; // No hydrate here
import {
  createRoot as domCreateRoot,
  hydrateRoot as domHydrateRoot
} from 'react-dom/client';

import unmountComponentAtNode from '../unmountComponentAtNode';
import { createSheet } from '../StyleSheet/dom';

// Modern hydrate using React 18+ hydrateRoot
export function hydrate(element, root) {
  createSheet(root);
  return domHydrateRoot(root, element); // Uses the modern hydrateRoot
}

// Modern render using React 18+ createRoot
export function render(element, root) {
  createSheet(root);
  const reactRoot = domCreateRoot(root); // Uses the modern createRoot
  reactRoot.render(element); // Render the element
  return reactRoot;
}

// Legacy render (for backward compatibility) using react-dom's render
export default function renderLegacy(element, root, callback) {
  createSheet(root);
  domLegacyRender(element, root, callback); // Legacy render (for React < 18)
  return {
    unmount: function () {
      return unmountComponentAtNode(root); // Ensures unmount functionality
    }
  };
}
