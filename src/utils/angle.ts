export function angle(
  p1: { x: number; y: number },
  p2: { x: number; y: number }
) {
  return -Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
}
