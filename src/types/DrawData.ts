import { Dir } from "./Dir";

export type DrawData = {
  p1: { x: number; y: number };
  p2: { x: number; y: number };
  p3: { x: number; y: number };
  p4: { x: number; y: number };
  dir: Dir;
  autoDir: Dir;
};
