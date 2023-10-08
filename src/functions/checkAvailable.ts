import { Dir } from "../types/Dir";

export function checkAvailable(
  a: FrameNode,
  b: FrameNode,
  dir: Dir = Dir.Bottom
) {
  const rectA = a.absoluteBoundingBox;
  const rectB = b.absoluteBoundingBox;
  if (!rectA || !rectB) return "";

  const aCenter = {
    x: rectA.x + rectA.width / 2,
    y: rectA.y + rectA.height / 2,
  };
}
