/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

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

// Legacy render function (for backward compatibility with React 18+)
export default function renderLegacy(element, root, callback) {
  createSheet(root);

  // Check if React 18+ is available by detecting `createRoot`
  if (domCreateRoot) {
    // Use the modern React 18+ API
    const reactRoot = domCreateRoot(root); // Create root with React 18 API
    reactRoot.render(element); // Render the element using React 18+ API

    if (callback) {
      callback(); // Ensure callback support, even with React 18+
    }

    return {
      unmount: () => reactRoot.unmount(), // Ensure unmount functionality
    };
  } else {
    // Handle legacy React (React 17 and below) dynamically
    const { render: legacyRender } = require('react-dom'); // Dynamic import for React 17
    legacyRender(element, root, callback); // Use legacy render for React 17 or below
    return {
      unmount: () => unmountComponentAtNode(root), // Ensure unmount functionality
    };
  }
}

// Legacy hydrate function (for backward compatibility with React 18+)
export function hydrateLegacy(element, root) {
  createSheet(root);

  if (domHydrateRoot) {
    // Use the modern React 18+ hydrateRoot API
    return domHydrateRoot(root, element); // Modern hydrate for React 18+
  } else {
    // Handle legacy React (React 17 and below) dynamically
    const { hydrate: legacyHydrate } = require('react-dom'); // Dynamic import for React 17
    return legacyHydrate(element, root); // Use legacy hydrate for React 17 or below
  }
}
