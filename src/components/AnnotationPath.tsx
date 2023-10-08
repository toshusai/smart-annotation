import { Dir } from "../types/Dir";
import { DrawData } from "../types/DrawData";
import { angle } from "../utils/angle";
import { distance } from "../utils/distance";

const { widget } = figma;
const { Line } = widget;

export function AnnotationPath(props: { points: DrawData; color: string }) {
  try {
    const l1 = distance(props.points.p1, props.points.p2);
    const l2 = distance(props.points.p3, props.points.p4);

    const angle1 = angle(props.points.p1, props.points.p2);
    const angle2 = angle(props.points.p3, props.points.p4);

    let moreOffset = -2;
    if (
      (props.points.dir === Dir.Top && props.points.autoDir === Dir.Right) ||
      (props.points.dir === Dir.Top && props.points.autoDir === Dir.Top) ||
      (props.points.dir === Dir.Right && props.points.autoDir === Dir.Top) ||
      (props.points.dir === Dir.Bottom && props.points.autoDir === Dir.Right) ||
      (props.points.dir === Dir.Left && props.points.autoDir === Dir.Top) ||
      (props.points.dir === Dir.Right && props.points.autoDir === Dir.Right)
    ) {
      moreOffset = -3;
    }

    return (
      <>
        {l1 !== 0 ? (
          <Line
            x={props.points.p1.x}
            y={props.points.p1.y}
            length={l1}
            positioning="absolute"
            stroke={props.color}
            rotation={angle1}
          ></Line>
        ) : null}
        {l2 !== 0 ? (
          <>
            <Line
              x={props.points.p3.x}
              y={props.points.p3.y}
              length={l2}
              positioning="absolute"
              stroke={props.color}
              rotation={angle2}
            ></Line>
          </>
        ) : null}
        <widget.Ellipse
          x={props.points.p4.x + moreOffset}
          y={props.points.p4.y + moreOffset}
          width={5}
          height={5}
          fill={props.color}
          positioning="absolute"
        />
      </>
    );
  } catch (e) {
    return null;
  }
}
