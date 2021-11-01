window["##BUDIBASE_APPDEFINITION##"] = {
  hierarchy: {
    name: "root",
    type: "root",
    children: [
      {
        name: "customer",
        type: "record",
        fields: [
          {
            name: "name",
            type: "string",
            typeOptions: {
              maxLength: 1000,
              values: null,
              allowDeclaredValuesOnly: false,
            },
            label: "name",
            getInitialValue: "default",
            getUndefinedValue: "default",
          },
        ],
        children: [
          {
            name: "invoiceyooo",
            type: "record",
            fields: [
              {
                name: "amount",
                type: "number",
                typeOptions: {
                  minValue: 99999999999,
                  maxValue: 99999999999,
                  decimalPlaces: 2,
                },
                label: "amount",
                getInitialValue: "default",
                getUndefinedValue: "default",
              },
            ],
            children: [],
            validationRules: [],
            nodeId: 2,
            indexes: [],
            allidsShardFactor: 1,
            collectionName: "invoices",
            isSingle: false,
          },
        ],
        validationRules: [],
        nodeId: 1,
        indexes: [],
        allidsShardFactor: 64,
        collectionName: "customers",
        isSingle: false,
      },
    ],
    pathMaps: [],
    indexes: [],
    nodeId: 0,
  },
  componentLibraries: [
    {
      importPath: "/lib/customComponents/index.js",
      libName: "./customComponents",
    },
    {
      importPath: "/lib/moreCustomComponents/index.js",
      libName: "./moreCustomComponents",
    },
    {
      importPath:
        "/lib/node_modules/@budibase/standard-components/dist/index.js",
      libName: "@budibase/standard-components",
    },
  ],
  appRootPath: "",
  props: { _component: "some_other_component" },
}
