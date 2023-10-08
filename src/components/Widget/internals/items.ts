import { AVAILABLE_COLORS } from "../../../consts/AVAILABLE_COLORS";
import { COLOR } from "../../../consts/COLOR";
import { Dir } from "../../../types/Dir";
import { PropName } from "../../../types/PropName";

export const dirItem: WidgetPropertyMenuDropdownItem = {
  propertyName: PropName.Dir,
  itemType: "dropdown",
  selectedOption: Dir.Bottom,
  tooltip: "Direction",
  options: [Dir.Top, Dir.Bottom, Dir.Left, Dir.Right].map((d) => ({
    label: d,
    option: d,
  })),
};

export const colorItem: WidgetPropertyMenuColorItem = {
  propertyName: PropName.Color,
  itemType: "color-selector",
  selectedOption: COLOR.primary,
  tooltip: "Color",
  options: Object.keys(AVAILABLE_COLORS).map((k) => {
    return {
      tooltip: k,
      option: AVAILABLE_COLORS[k as keyof typeof AVAILABLE_COLORS],
    };
  }),
};

export const showHeaderItem: WidgetPropertyMenuToggleItem = {
  propertyName: PropName.ShowHeader,
  isToggled: true,
  itemType: "toggle",
  tooltip: "show header",
  icon: "eye",
};
