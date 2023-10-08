import { Options } from "../types/Options";
import { Dir } from "../types/Dir";
import { DrawData } from "../types/DrawData";

export class UnsupportedError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export function createDrawData(
  a: FrameNode,
  b: FrameNode,
  options?: Options
): DrawData {
  let dir = options?.direction;
  const aRect = a.absoluteBoundingBox;
  const bRect = b.absoluteBoundingBox;
  const p1 = { x: 0, y: 0 };
  const p2 = { x: 0, y: 0 };
  const p3 = { x: 0, y: 0 };
  const p4 = { x: 0, y: 0 };
  if (!aRect || !bRect) {
    return { p1, p2, p3, p4, dir: Dir.Bottom, autoDir: Dir.Bottom };
  }

  const aCenter = {
    x: aRect.x + aRect.width / 2,
    y: aRect.y + aRect.height / 2,
  };

  const bCenter = {
    x: bRect.x + bRect.width / 2,
    y: bRect.y + bRect.height / 2,
  };

  if (!dir) {
    if (aCenter.x < bCenter.x) {
      dir = Dir.Left;
    } else {
      dir = Dir.Right;
    }
  }

  if (dir === Dir.Top && aRect.y + aRect.height / 2 > bRect.y) {
    throw new UnsupportedError("Selected node is below the target node");
  } else if (
    dir === Dir.Bottom &&
    aRect.y + aRect.height / 2 < bRect.y + bRect.height
  ) {
    throw new UnsupportedError("Selected node is above the target node");
  } else if (dir === Dir.Left && aRect.x + aRect.width / 2 > bRect.x) {
    throw new UnsupportedError("Selected node is right of the target node");
  } else if (
    dir === Dir.Right &&
    aRect.x + aRect.width / 2 < bRect.x + bRect.width
  ) {
    throw new UnsupportedError("Selected node is left of the target node");
  }

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

  if (
    aRect.x < bCenter.x &&
    bCenter.x < aRect.x + aRect.width &&
    (dir === Dir.Top || dir === Dir.Bottom)
  ) {
    autoDir = dir;
  }
  if (
    aRect.y < bCenter.y &&
    bCenter.y < aRect.y + aRect.height &&
    (dir === Dir.Left || dir === Dir.Right)
  ) {
    autoDir = dir;
  }

  if (dir === Dir.Top) {
    p1.x = bRect.width / 2;
    p1.y = 0;
    p2.x = bRect.width / 2;
    p2.y = aRect.y - bRect.y + aRect.height / 2;
    if (autoDir === Dir.Top) {
      p2.y = aRect.y - bRect.y + aRect.height;
    }
  } else if (dir === Dir.Bottom) {
    p1.x = bRect.width / 2;
    p2.x = bRect.width / 2;

    p1.y = bRect.height;

    p2.y = aRect.y - bRect.y + aRect.height / 2;

    if (autoDir === Dir.Bottom) {
      p2.y = Math.abs(aRect.y - bRect.y);
    }
  } else if (dir === Dir.Right) {
    p1.x = bRect.width;
    p1.y = bRect.height / 2;
    p2.x = aRect.x - bRect.x + aRect.width / 2;
    p2.y = p1.y;
    if (autoDir === Dir.Right) {
      p2.x = Math.abs(bRect.x - aRect.x);
    }
  } else if (dir === Dir.Left) {
    p1.x = 0;
    p1.y = bRect.height / 2;
    p2.x = -Math.abs(bRect.x - aRect.x) + aRect.width / 2;
    p2.y = p1.y;
    if (autoDir === Dir.Left) {
      p2.x = -Math.abs(bRect.x - aRect.x) + aRect.width;
    }
  }

  if (autoDir === Dir.Right) {
    p3.x = p2.x;
    p3.y = p2.y;
    p4.y = p3.y;
    p4.x = aRect.x - bRect.x;
  } else if (autoDir === Dir.Left) {
    p3.x = p2.x;
    p3.y = p2.y;
    p4.y = p3.y;
    p4.x = aRect.x - bRect.x + aRect.width;
  } else if (autoDir === Dir.Top) {
    p3.x = p2.x;
    p3.y = p2.y;
    p4.x = p2.x;
    p4.y = aRect.y - bRect.y + aRect.height;
  } else if (autoDir === Dir.Bottom) {
    p3.x = p2.x;
    p3.y = p2.y;
    p4.x = p2.x;
    p4.y = Math.abs(bRect.y - aRect.y);
  }

  return { p1, p2, p3, p4, dir, autoDir };
}
