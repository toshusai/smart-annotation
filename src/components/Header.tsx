import { COLOR } from "../consts/COLOR";

const { widget } = figma;
const { AutoLayout, Text, SVG } = widget;

export function Header({
  userImg,
  userName,
  updatedAt,
  onFocus,
}: {
  userImg: string;
  userName: string;
  updatedAt: string;
  onFocus: () => void;
}) {
  return (
    <AutoLayout
      direction="horizontal"
      horizontalAlignItems="end"
      verticalAlignItems="center"
      spacing="auto"
      width="fill-parent"
    >
      <AutoLayout verticalAlignItems="center" spacing={4}>
        {userImg != "" ? (
          <widget.Image
            stroke={COLOR.border}
            height={24}
            width={24}
            src={userImg}
          ></widget.Image>
        ) : (
          <widget.Frame
            width={24}
            height={24}
            fill={COLOR.border}
          ></widget.Frame>
        )}
        <AutoLayout direction="vertical" spacing={0}>
          <Text fontSize={12} fill={COLOR.text}>
            {userName}
          </Text>
          <Text fontSize={10} fill={COLOR.textSecondary}>
            {updatedAt}
          </Text>
        </AutoLayout>
      </AutoLayout>
      <AutoLayout
        stroke={COLOR.border}
        cornerRadius={24}
        padding={4}
        onClick={onFocus}
      >
        <SVG src={iconSVG}></SVG>
      </AutoLayout>
    </AutoLayout>
  );
}

/**
 * https://github.com/google/material-design-icons
 * Apache-2.0 license
 */
export const iconSVG = `<svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16" fill="${COLOR.textSecondary}"><path d="M480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 280q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>`;
