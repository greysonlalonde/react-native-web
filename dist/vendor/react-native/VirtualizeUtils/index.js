/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */

'use strict';

/**
 * Used to find the indices of the frames that overlap the given offsets. Useful for finding the
 * items that bound different windows of content, such as the visible area or the buffered overscan
 * area.
 */
export function elementsThatOverlapOffsets(offsets, props, getFrameMetrics, zoomScale) {
  if (zoomScale === void 0) {
    zoomScale = 1;
  }
  var itemCount = props.getItemCount(props.data);
  var result = [];
  for (var offsetIndex = 0; offsetIndex < offsets.length; offsetIndex++) {
    var currentOffset = offsets[offsetIndex];
    var left = 0;
    var right = itemCount - 1;
    while (left <= right) {
      // eslint-disable-next-line no-bitwise
      var mid = left + (right - left >>> 1);
      var frame = getFrameMetrics(mid, props);
      var scaledOffsetStart = frame.offset * zoomScale;
      var scaledOffsetEnd = (frame.offset + frame.length) * zoomScale;

      // We want the first frame that contains the offset, with inclusive bounds. Thus, for the
      // first frame the scaledOffsetStart is inclusive, while for other frames it is exclusive.
      if (mid === 0 && currentOffset < scaledOffsetStart || mid !== 0 && currentOffset <= scaledOffsetStart) {
        right = mid - 1;
      } else if (currentOffset > scaledOffsetEnd) {
        left = mid + 1;
      } else {
        result[offsetIndex] = mid;
        break;
      }
    }
  }
  return result;
}

/**
 * Computes the number of elements in the `next` range that are new compared to the `prev` range.
 * Handy for calculating how many new items will be rendered when the render window changes so we
 * can restrict the number of new items render at once so that content can appear on the screen
 * faster.
 */
export function newRangeCount(prev, next) {
  return next.last - next.first + 1 - Math.max(0, 1 + Math.min(next.last, prev.last) - Math.max(next.first, prev.first));
}

/**
 * Custom logic for determining which items should be rendered given the current frame and scroll
 * metrics, as well as the previous render state. The algorithm may evolve over time, but generally
 * prioritizes the visible area first, then expands that with overscan regions ahead and behind,
 * biased in the direction of scroll.
 */
export function computeWindowedRenderLimits(props, maxToRenderPerBatch, windowSize, prev, getFrameMetricsApprox, scrollMetrics) {
  var itemCount = props.getItemCount(props.data);
  if (itemCount === 0) {
    return {
      first: 0,
      last: -1
    };
  }
  var offset = scrollMetrics.offset,
    velocity = scrollMetrics.velocity,
    visibleLength = scrollMetrics.visibleLength,
    _scrollMetrics$zoomSc = scrollMetrics.zoomScale,
    zoomScale = _scrollMetrics$zoomSc === void 0 ? 1 : _scrollMetrics$zoomSc;

  // Start with visible area, then compute maximum overscan region by expanding from there, biased
  // in the direction of scroll. Total overscan area is capped, which should cap memory consumption
  // too.
  var visibleBegin = Math.max(0, offset);
  var visibleEnd = visibleBegin + visibleLength;
  var overscanLength = (windowSize - 1) * visibleLength;

  // Considering velocity seems to introduce more churn than it's worth.
  var leadFactor = 0.5; // Math.max(0, Math.min(1, velocity / 25 + 0.5));

  var fillPreference = velocity > 1 ? 'after' : velocity < -1 ? 'before' : 'none';
  var overscanBegin = Math.max(0, visibleBegin - (1 - leadFactor) * overscanLength);
  var overscanEnd = Math.max(0, visibleEnd + leadFactor * overscanLength);
  var lastItemOffset = getFrameMetricsApprox(itemCount - 1, props).offset * zoomScale;
  if (lastItemOffset < overscanBegin) {
    // Entire list is before our overscan window
    return {
      first: Math.max(0, itemCount - 1 - maxToRenderPerBatch),
      last: itemCount - 1
    };
  }

  // Find the indices that correspond to the items at the render boundaries we're targeting.
  var _elementsThatOverlapO = elementsThatOverlapOffsets([overscanBegin, visibleBegin, visibleEnd, overscanEnd], props, getFrameMetricsApprox, zoomScale),
    overscanFirst = _elementsThatOverlapO[0],
    first = _elementsThatOverlapO[1],
    last = _elementsThatOverlapO[2],
    overscanLast = _elementsThatOverlapO[3];
  overscanFirst = overscanFirst == null ? 0 : overscanFirst;
  first = first == null ? Math.max(0, overscanFirst) : first;
  overscanLast = overscanLast == null ? itemCount - 1 : overscanLast;
  last = last == null ? Math.min(overscanLast, first + maxToRenderPerBatch - 1) : last;
  var visible = {
    first,
    last
  };

  // We want to limit the number of new cells we're rendering per batch so that we can fill the
  // content on the screen quickly. If we rendered the entire overscan window at once, the user
  // could be staring at white space for a long time waiting for a bunch of offscreen content to
  // render.
  var newCellCount = newRangeCount(prev, visible);
  while (true) {
    if (first <= overscanFirst && last >= overscanLast) {
      // If we fill the entire overscan range, we're done.
      break;
    }
    var maxNewCells = newCellCount >= maxToRenderPerBatch;
    var firstWillAddMore = first <= prev.first || first > prev.last;
    var firstShouldIncrement = first > overscanFirst && (!maxNewCells || !firstWillAddMore);
    var lastWillAddMore = last >= prev.last || last < prev.first;
    var lastShouldIncrement = last < overscanLast && (!maxNewCells || !lastWillAddMore);
    if (maxNewCells && !firstShouldIncrement && !lastShouldIncrement) {
      // We only want to stop if we've hit maxNewCells AND we cannot increment first or last
      // without rendering new items. This let's us preserve as many already rendered items as
      // possible, reducing render churn and keeping the rendered overscan range as large as
      // possible.
      break;
    }
    if (firstShouldIncrement && !(fillPreference === 'after' && lastShouldIncrement && lastWillAddMore)) {
      if (firstWillAddMore) {
        newCellCount++;
      }
      first--;
    }
    if (lastShouldIncrement && !(fillPreference === 'before' && firstShouldIncrement && firstWillAddMore)) {
      if (lastWillAddMore) {
        newCellCount++;
      }
      last++;
    }
  }
  if (!(last >= first && first >= 0 && last < itemCount && first >= overscanFirst && last <= overscanLast && first <= visible.first && last >= visible.last)) {
    throw new Error('Bad window calculation ' + JSON.stringify({
      first,
      last,
      itemCount,
      overscanFirst,
      overscanLast,
      visible
    }));
  }
  return {
    first,
    last
  };
}
export function keyExtractor(item, index) {
  if (typeof item === 'object' && (item == null ? void 0 : item.key) != null) {
    return item.key;
  }
  if (typeof item === 'object' && (item == null ? void 0 : item.id) != null) {
    return item.id;
  }
  return String(index);
}