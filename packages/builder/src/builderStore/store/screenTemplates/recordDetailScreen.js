export default function(models) {
  return models.map(model => ({
    name: `New ${model.name}`,
    create: () => createScreen(model),
  }))
}

const createScreen = model => ({
  props: {
    _id: "f684460e-1f79-42b4-8ffd-1f708bca93ed",
    _component: "@budibase/standard-components/recorddetail",
    _styles: {
      normal: {},
      hover: {},
      active: {},
      selected: {},
    },
    className: "",
    onLoad: [],
    type: "div",
    _children: [
      {
        _id: "7d1d6b43-b444-46a5-a75c-267fd6b5baf6",
        _component: "@budibase/standard-components/heading",
        _styles: {
          normal: {},
          hover: {},
          active: {},
          selected: {},
        },
        _code: "",
        className: "",
        text: `${model.name} Detail`,
        type: "h1",
        _instanceId: "inst_cf8ace4_69efc0d72e6f443db2d4c902c14d9394",
        _instanceName: `Heading 1`,
        _children: [],
      },
    ],
    _instanceName: `${model.name} Detail`,
  },
  route: `/${model.name}/new`,
  name: "screen-id",
})