import { AVAILABLE_COLORS } from "../consts/AVAILABLE_COLORS";
import { Dir } from "../types/Dir";
import { Mode } from "../types/Mode";
import { createArrowPathTag } from "./createArrowPathTag";

export function createSVGString(
  a: FrameNode,
  b: FrameNode,
  dir: Dir = Dir.Bottom,
  mode: Mode = Mode.Arrow,
  color: string = AVAILABLE_COLORS.red
) {
  const pathStrings: string[] = [];
  const rectA = a.absoluteBoundingBox;
  const rectB = b.absoluteBoundingBox;
  if (!rectA || !rectB) return "";

  const start = {
    x: 0,
    y: 0,
  };
  const aCenter = {
    x: rectA.x + rectA.width / 2,
    y: rectA.y + rectA.height / 2,
  };
  const bCenter = {
    x: rectB.x + rectB.width / 2,
    y: rectB.y + rectB.height / 2,
  };

  let autoDir: Dir = Dir.Left;
  if (dir === Dir.Top || dir === Dir.Bottom) {
    if (aCenter.x > bCenter.x) {
      autoDir = Dir.Right;
    } else {
      autoDir = Dir.Left;
    }
  }
  if (dir === Dir.Left || dir === Dir.Right) {
    if (aCenter.y > bCenter.y) {
      autoDir = Dir.Bottom;
    } else {
      autoDir = Dir.Top;
    }
  }

  if (dir === Dir.Right) {
    start.x = b.width;
  } else if (dir === Dir.Bottom || dir === Dir.Top) {
    start.x = b.width / 2;
  }

  if (dir === Dir.Left || dir === Dir.Right) {
    start.y = rectB.height / 2;
  }
  if (dir === Dir.Top || dir === Dir.Bottom) {
    if (dir === Dir.Bottom) {
      start.y = rectB.height;
    }
  }

  let endX = aCenter.x - rectB.x;
  let endY = aCenter.y - rectB.y;

  if (mode === Mode.Arrow) {
    if (autoDir === Dir.Bottom) {
      endY -= a.height / 2;
    }
    if (autoDir === Dir.Left) {
      endX += a.width / 2;
    }
    if (autoDir === Dir.Right) {
      endX -= a.width / 2;
    }
    if (autoDir === Dir.Top) {
      endY += a.height / 2;
    }
  }

  if (rectB.x < aCenter.x && aCenter.x < rectB.x + rectB.width) {
    start.x = -(rectB.x - aCenter.x);
    start.y = 0;
    autoDir = dir;
    pathStrings.push(`M ${start.x} ${start.y}`);
    endX = start.x;
  } else {
    pathStrings.push(`M ${start.x} ${start.y}`);
    if (dir == Dir.Left || dir == Dir.Right) {
      pathStrings.push(`L ${endX} ${start.y}`);
    } else {
      pathStrings.push(`L ${start.x} ${endY}`);
    }
  }
  pathStrings.push(`L ${endX} ${endY}`);

  let width = aCenter.x - rectB.x;
  if (autoDir === Dir.Right || dir == Dir.Right) {
    width += 4;
  } else {
    width -= 4;
  }
  let height = aCenter.y - rectB.y;
  if (autoDir === Dir.Bottom || dir === Dir.Bottom) {
    height += 4;
  } else {
    height -= 4;
  }
  if (mode === Mode.Arrow) {
    if (autoDir === Dir.Top) {
      height += a.height / 2 + 4;
    }
    if (autoDir === Dir.Left) {
      width += a.width / 2 + 4;
    }
  }
  if (rectB.x < aCenter.x && aCenter.x < rectB.x + rectB.width) {
    width = start.x;
  }
  const viewBox = `${0} ${0} ${width} ${height}`;

  let y = 0;
  if (dir === Dir.Top || dir === Dir.Bottom) {
    if (autoDir === Dir.Left) {
      y = start.y;
    }
  } else if (dir === Dir.Right) {
    y = 0;
  } else if (dir === Dir.Left && autoDir === Dir.Top) {
    // y = start.y;
  } else {
    y = start.y;
  }

  let x = 0;
  if (
    (dir === Dir.Top && autoDir === Dir.Right) ||
    (dir === Dir.Right && autoDir === Dir.Top)
  ) {
    x = start.x;
  }
  if (rectB.x < aCenter.x && aCenter.x < rectB.x + rectB.width) {
    x = start.x - 4;
  }

  let endPoint = "";
  if (mode === "circle") {
    endPoint = `<circle cx="${endX}" cy="${endY}" r="4" fill="transparent" stroke="${color}" />`;
  } else {
    endPoint = createArrowPathTag(endX, endY, 4, autoDir, color);
  }

  return {
    src: `<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">
  <path d="${pathStrings.join(" ")}" stroke="${color}" fill="none" />
  ${endPoint}
</svg>`,
    width,
    height,
    x,
    y,
  };
}
