import { COLOR } from "../../consts/COLOR";
import { Dir } from "../../types/Dir";
import { Mode } from "../../types/Mode";
import { Header } from "../Header";
import { formatTime } from "../../utils/formatTime";
import { DrawData } from "../../types/DrawData";
import { PropName } from "../../types/PropName";
import {
  UnsupportedError,
  createDrawData,
} from "../../functions/createDrawData";
import { AnnotationPath } from "../AnnotationPath";
import { dirItem, colorItem } from "./internals/items";
import { Options } from "../../types/Options";
import { showHeaderItem } from "./internals/items";
import { AVAILABLE_COLORS } from "../../consts/AVAILABLE_COLORS";

const { widget } = figma;
const { useSyncedState, usePropertyMenu, AutoLayout, useEffect } = widget;

export function Widget() {
  const [targetNodeId, setTargetNodeId] = useSyncedState("target-node-id", "");
  const widgetId = widget.useWidgetNodeId();
  const [direction, setDirection] = useSyncedState<Dir | undefined>(
    "direction",
    undefined
  );
  const [mode, setMode] = useSyncedState<Mode>("mode", Mode.Circle);
  const [img, setImg] = useSyncedState("img", "");
  const [userName, setUserName] = useSyncedState("user-name", "");
  const [text, setText] = useSyncedState("text", "");
  const [updatedAt, setUpdatedAt] = useSyncedState("updated-at", "");
  const [color, setColor] = useSyncedState("color", COLOR.primary);
  const [showHeader, setShowHeader] = useSyncedState("show-header", true);
  const [drawData, setDrawData] = useSyncedState<DrawData>("draw-data", {
    p1: { x: 0, y: 0 },
    p2: { x: 0, y: 0 },
    p3: { x: 0, y: 0 },
    p4: { x: 0, y: 0 },
    autoDir: Dir.Bottom,
    dir: Dir.Bottom,
  });

  usePropertyMenu(
    [
      { ...dirItem, selectedOption: direction ?? "" },
      {
        ...colorItem,
        selectedOption: color,
      },
      {
        ...showHeaderItem,
        isToggled: showHeader,
      },
    ],
    (e) => {
      if (e.propertyName === PropName.Dir) {
        const direction = (e.propertyValue as Dir | undefined) ?? Dir.Bottom;
        setDirection(direction);
        update({
          direction,
          color,
          mode,
        });
      } else if (e.propertyName === PropName.Mode) {
        const mode = (e.propertyValue as Mode | undefined) ?? Mode.Circle;
        setMode(mode);
        update({
          mode,
          color,
          direction,
        });
      } else if (e.propertyName === PropName.Color) {
        update({
          color: e.propertyValue as string,
          direction,
          mode,
        });
        setColor(e.propertyValue ?? AVAILABLE_COLORS.red);
      } else if (e.propertyName === PropName.ShowHeader) {
        setShowHeader((v) => !v);
      } else if (e.propertyName === PropName.Focus) {
        update({
          color,
          direction,
          mode,
        });
      }
    }
  );

  useEffect(() => {
    if (img === "") {
      setImg(figma.currentUser?.photoUrl ?? "");
    }
    if (userName === "") {
      setUserName(figma.currentUser?.name ?? "");
    }
    if (updatedAt === "") {
      setUpdatedAt(formatTime(new Date()));
    }
  });

  function update(options?: Options) {
    const select = figma.currentPage.selection;
    if (select.length === 0 && targetNodeId === "") {
      figma.notify("Please select a frame");
    } else {
      const widgetNode = figma.getNodeById(widgetId) as FrameNode;
      let targetNode =
        select.length > 0
          ? (figma.getNodeById(select[0].id) as FrameNode)
          : undefined;
      if (!targetNode || targetNode.id === widgetNode.id) {
        targetNode = figma.getNodeById(targetNodeId) as FrameNode;
      }
      if (!targetNode || !widgetNode) return;
      setTargetNodeId(targetNode.id);
      try {
        const data = createDrawData(targetNode, widgetNode, options);
        setDirection(data.dir);
        setDrawData(data);

        setImg(figma.currentUser?.photoUrl ?? "");
        setUserName(figma.currentUser?.name ?? "");
        if (updatedAt === "") {
          setUpdatedAt(formatTime(new Date()));
        }
      } catch (e) {
        if (e instanceof UnsupportedError) {
          figma.notify(e.message, {});
        } else {
          figma.notify("Something went wrong", {});
        }
      }
    }
  }

  return (
    <AutoLayout
      verticalAlignItems={"center"}
      padding={8}
      cornerRadius={0}
      spacing={4}
      fill={COLOR.background}
      stroke={color}
      overflow="visible"
      direction="vertical"
    >
      <AnnotationPath points={drawData} color={color}></AnnotationPath>
      {showHeader ? (
        <Header
          onFocus={() =>
            update({
              color,
              direction,
              mode,
            })
          }
          updatedAt={updatedAt}
          userImg={img}
          userName={userName}
        />
      ) : null}
      <AutoLayout padding={0}>
        <AutoLayout padding={4} fill={"#eeeeee"}>
          <widget.Input
            value={text}
            fontSize={14}
            fill={COLOR.text}
            onTextEditEnd={(e) => {
              setText(e.characters);
              setImg(figma.currentUser?.photoUrl ?? "");
              setUserName(figma.currentUser?.name ?? "");
              setUpdatedAt(formatTime(new Date()));
            }}
          ></widget.Input>
        </AutoLayout>
      </AutoLayout>
    </AutoLayout>
  );
}
