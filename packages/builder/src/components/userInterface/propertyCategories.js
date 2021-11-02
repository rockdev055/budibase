import Input from "../common/Input.svelte"
import OptionSelect from "./OptionSelect.svelte"
import InputGroup from "../common/Inputs/InputGroup.svelte"
import Colorpicker from "../common/Colorpicker.svelte"
/*
  TODO: Allow for default values for all properties
*/

export const layout = [
  {
    label: "Direction",
    key: "flex-direction",
    control: OptionSelect,
    initialValue: "columnReverse",
    options: [
      { label: "row" },
      { label: "row-reverse", value: "rowReverse" },
      { label: "column" },
      { label: "column-reverse", value: "columnReverse" },
    ],
  },
  { label: "Justify", key: "justify-content", control: Input },
  { label: "Align", key: "align-items", control: Input },
  {
    label: "Wrap",
    key: "flex-wrap",
    control: OptionSelect,
    options: [{ label: "wrap" }, { label: "no wrap", value: "noWrap" }],
  },
]

const spacingMeta = [
  { placeholder: "T" },
  { placeholder: "R" },
  { placeholder: "B" },
  { placeholder: "L" },
]
export const spacing = [
  {
    label: "Padding",
    key: "padding",
    control: InputGroup,
    meta: spacingMeta,
  },
  { label: "Margin", key: "margin", control: InputGroup, meta: spacingMeta },
]

export const size = [
  { label: "Width", key: "width", control: Input },
  { label: "Height", key: "height", control: Input },
  { label: "Min W", key: "min-width", control: Input },
  { label: "Min H", key: "min-height", control: Input },
  { label: "Max W", key: "max-width", control: Input },
  { label: "Max H", key: "max-height", control: Input },
]

export const position = [
  {
    label: "Position",
    key: "position",
    control: OptionSelect,
    options: [
      { label: "static" },
      { label: "relative" },
      { label: "fixed" },
      { label: "absolute" },
      { label: "sticky" },
    ],
  },
]

export const typography = [
  {
    label: "Font",
    key: "font-family",
    control: OptionSelect,
    options: [
      { label: "initial" },
      { label: "Times New Roman" },
      { label: "Georgia" },
      { label: "Arial" },
      { label: "Arial Black" },
      { label: "Comic Sans MS" },
      { label: "Impact" },
      { label: "Lucida Sans Unicode" },
    ],
    styleBindingProperty: "font-family",
  },
  {
    label: "Weight",
    key: "font-weight",
    control: OptionSelect,
    options: [
      { label: "normal" },
      { label: "bold" },
      { label: "bolder" },
      { label: "lighter" },
    ],
  },
  { label: "size", key: "font-size", control: Input },
  { label: "Line H", key: "line-height", control: Input },
  {
    label: "Color",
    key: "color",
    control: Colorpicker,
  },
  {
    label: "align",
    key: "text-align",
    control: OptionSelect,
    options: ["initial", "left", "right", "center", "justify"],
  }, //custom
  { label: "transform", key: "text-transform", control: Input }, //custom
  { label: "style", key: "font-style", control: Input }, //custom
]

export const background = [
  {
    label: "Background",
    key: "background",
    control: Colorpicker,
  },
  { label: "Image", key: "image", control: Input }, //custom
]

export const border = [
  { label: "Radius", key: "border-radius", control: Input },
  { label: "Width", key: "border-width", control: Input }, //custom
  { label: "Color", key: "border-color", control: Colorpicker },
  { label: "Style", key: "border-style", control: Input },
]

export const effects = [
  { label: "Opacity", key: "opacity", control: Input },
  { label: "Rotate", key: "transform", control: Input }, //needs special control
  { label: "Shadow", key: "box-shadow", control: Input },
]

export const transitions = [
  { label: "Property", key: "transition-property", control: Input },
  { label: "Duration", key: "transition-timing-function", control: Input },
  { label: "Ease", key: "transition-ease", control: Input },
]

export const all = {
  layout,
  spacing,
  size,
  position,
  typography,
  background,
  border,
  effects,
  transitions,
}

export function excludeProps(props, propsToExclude) {
  const modifiedProps = {}
  for (const prop in props) {
    if (!propsToExclude.includes(prop)) {
      modifiedProps[prop] = props[prop]
    }
  }
  return modifiedProps
}
