import { Dir } from "../types/Dir";

export function createArrowPathTag(
  x: number,
  y: number,
  size: number,
  dir: Dir.Top | Dir.Bottom | Dir.Left | Dir.Right = Dir.Bottom,
  color: string
) {
  const pathStrings: string[] = [];
  if (dir === Dir.Top) {
    pathStrings.push(`M ${x} ${y}`);
    pathStrings.push(`L ${x + size} ${y + size * 2}`);
    pathStrings.push(`L ${x - size} ${y + size * 2}`);
    pathStrings.push(`L ${x} ${y}`);
  }
  if (dir === Dir.Bottom) {
    pathStrings.push(`M ${x} ${y}`);
    pathStrings.push(`L ${x + size} ${y - size * 2}`);
    pathStrings.push(`L ${x - size} ${y - size * 2}`);
    pathStrings.push(`L ${x} ${y}`);
  }
  if (dir === Dir.Left) {
    pathStrings.push(`M ${x} ${y}`);
    pathStrings.push(`L ${x + size * 2} ${y + size}`);
    pathStrings.push(`L ${x + size * 2} ${y - size}`);
    pathStrings.push(`L ${x} ${y}`);
  }
  if (dir === Dir.Right) {
    pathStrings.push(`M ${x} ${y}`);
    pathStrings.push(`L ${x - size * 2} ${y + size}`);
    pathStrings.push(`L ${x - size * 2} ${y - size}`);
    pathStrings.push(`L ${x} ${y}`);
  }

  return `<path d="${pathStrings.join(
    " "
  )}" stroke="${color}" fill="${color}" />`;
}
