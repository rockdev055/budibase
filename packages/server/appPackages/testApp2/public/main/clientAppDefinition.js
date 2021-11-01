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
              maxLength: null,
              values: null,
              allowDeclaredValuesOnly: false,
            },
            label: "Name",
            getInitialValue: "default",
            getUndefinedValue: "default",
          },
          {
            name: "enquiry",
            type: "string",
            typeOptions: {
              maxLength: null,
              values: ["Google", "Facebook", "Word of Mouth"],
              allowDeclaredValuesOnly: true,
            },
            label: "Enquiry Source",
            getInitialValue: "default",
            getUndefinedValue: "default",
          },
        ],
        children: [],
        validationRules: [],
        nodeId: 1,
        indexes: [],
        allidsShardFactor: 64,
        collectionName: "customers",
        isSingle: false,
      },
      {
        name: "Contact",
        type: "record",
        fields: [
          {
            name: "name",
            type: "string",
            typeOptions: {
              maxLength: null,
              values: null,
              allowDeclaredValuesOnly: false,
            },
            label: "Name",
            getInitialValue: "default",
            getUndefinedValue: "default",
          },
          {
            name: "contacted",
            type: "bool",
            typeOptions: { allowNulls: false },
            label: "Has Been Contacted",
            getInitialValue: "default",
            getUndefinedValue: "default",
          },
        ],
        children: [],
        validationRules: [],
        nodeId: 3,
        indexes: [],
        allidsShardFactor: 64,
        collectionName: "contacts",
        isSingle: false,
      },
      {
        name: "naw",
        type: "record",
        fields: [
          {
            name: "s",
            type: "string",
            typeOptions: {
              maxLength: null,
              values: null,
              allowDeclaredValuesOnly: false,
            },
            label: "s",
            getInitialValue: "default",
            getUndefinedValue: "default",
          },
        ],
        children: [],
        validationRules: [],
        nodeId: 5,
        indexes: [],
        allidsShardFactor: 64,
        collectionName: "nas",
        isSingle: false,
      },
      {
        name: "jon",
        type: "record",
        fields: [
          {
            name: "j",
            type: "string",
            typeOptions: {
              maxLength: null,
              values: null,
              allowDeclaredValuesOnly: false,
            },
            label: "j",
            getInitialValue: "default",
            getUndefinedValue: "default",
          },
        ],
        children: [],
        validationRules: [],
        nodeId: 6,
        indexes: [],
        allidsShardFactor: 64,
        collectionName: "jos",
        isSingle: false,
      },
      {
        name: "Hello",
        type: "record",
        fields: [
          {
            name: "yes",
            type: "string",
            typeOptions: {
              maxLength: null,
              values: null,
              allowDeclaredValuesOnly: false,
            },
            label: "Yea",
            getInitialValue: "default",
            getUndefinedValue: "default",
          },
        ],
        children: [],
        validationRules: [],
        nodeId: 7,
        indexes: [],
        allidsShardFactor: 64,
        collectionName: "",
        isSingle: false,
      },
    ],
    pathMaps: [],
    indexes: [
      {
        name: "all_customers",
        type: "index",
        map: "return {...record};",
        filter: "",
        indexType: "ancestor",
        getShardName: "",
        getSortKey: "record.id",
        aggregateGroups: [],
        allowedRecordNodeIds: [1],
        nodeId: 2,
      },
      {
        name: "all_contacts",
        type: "index",
        map: "return {...record};",
        filter: "",
        indexType: "ancestor",
        getShardName: "",
        getSortKey: "record.id",
        aggregateGroups: [],
        allowedRecordNodeIds: [3],
        nodeId: 4,
      },
      {
        name: "all_",
        type: "index",
        map: "return {...record};",
        filter: "",
        indexType: "ancestor",
        getShardName: "",
        getSortKey: "record.id",
        aggregateGroups: [],
        allowedRecordNodeIds: [7],
        nodeId: 8,
      },
    ],
    nodeId: 0,
  },
  componentLibraries: [
    {
      importPath:
        "/lib/node_modules/@budibase/standard-components/dist/index.js",
      libName: "@budibase/standard-components",
    },
    {
      importPath:
        "/lib/node_modules/@budibase/bootstrap-components/dist/index.js",
      libName: "@budibase/bootstrap-components",
    },
  ],
  appRootPath: "/testApp2",
  props: {
    _component: "@budibase/bootstrap-components/nav",
    items: [
      {
        _component: "items#array_element#",
        title: "customers",
        component: {
          _component: "@budibase/standard-components/if",
          condition: "$store.isEditingcustomer",
          thenComponent: {
            _component: "@budibase/standard-components/div",
            children: [
              {
                _component: "children#array_element#",
                component: {
                  _component: "@budibase/standard-components/h3",
                  text: "Edit customer",
                  className: "",
                },
                className: "",
              },
              {
                _component: "children#array_element#",
                component: {
                  _component: "@budibase/standard-components/form",
                  containerClass: "",
                  formControls: [
                    {
                      _component: "formControls#array_element#",
                      label: "Name",
                      control: {
                        _component: "@budibase/standard-components/input",
                        value: {
                          "##bbstate": "customer.name",
                          "##bbsource": "store",
                        },
                        type: "text",
                        className: "form-control",
                      },
                    },
                    {
                      _component: "formControls#array_element#",
                      label: "Enquiry Source",
                      control: {
                        _component: "@budibase/standard-components/select",
                        value: {
                          "##bbstate": "customer.enquiry",
                          "##bbsource": "store",
                        },
                        options: [
                          {
                            _component: "options#array_element#",
                            id: "Google",
                            value: "Google",
                          },
                          {
                            _component: "options#array_element#",
                            id: "Facebook",
                            value: "Facebook",
                          },
                          {
                            _component: "options#array_element#",
                            id: "Word of Mouth",
                            value: "Word of Mouth",
                          },
                        ],
                        className: "form-control",
                      },
                    },
                  ],
                },
                className: "",
              },
              {
                _component: "children#array_element#",
                component: {
                  _component: "@budibase/standard-components/stackpanel",
                  direction: "horizontal",
                  children: [
                    {
                      _component: "children#array_element#",
                      control: {
                        _component: "@budibase/standard-components/div",
                        children: [
                          {
                            _component: "children#array_element#",
                            component: {
                              _component:
                                "@budibase/standard-components/button",
                              contentText: "Save customer",
                              contentComponent: { _component: "" },
                              className: "btn btn-primary",
                              disabled: false,
                              onClick: [
                                {
                                  "##eventHandlerType": "Save Record",
                                  parameters: { statePath: "customer" },
                                },
                                {
                                  "##eventHandlerType": "Set State",
                                  parameters: {
                                    path: "isEditingcustomer",
                                    value: "",
                                  },
                                },
                              ],
                              background: "",
                              color: "",
                              border: "",
                              padding: "",
                              hoverColor: "",
                              hoverBackground: "",
                              hoverBorder: "",
                            },
                            className: "",
                          },
                        ],
                        className: "btn-group",
                        data: { "##bbstate": "" },
                        dataItemComponent: { _component: "" },
                        onLoad: [],
                      },
                    },
                    {
                      _component: "children#array_element#",
                      control: {
                        _component: "@budibase/standard-components/div",
                        children: [
                          {
                            _component: "children#array_element#",
                            component: {
                              _component:
                                "@budibase/standard-components/button",
                              contentText: "Cancel",
                              contentComponent: { _component: "" },
                              className: "btn btn-secondary",
                              disabled: false,
                              onClick: [
                                {
                                  "##eventHandlerType": "Set State",
                                  parameters: {
                                    path: "isEditingcustomer",
                                    value: "",
                                  },
                                },
                              ],
                              background: "",
                              color: "",
                              border: "",
                              padding: "",
                              hoverColor: "",
                              hoverBackground: "",
                              hoverBorder: "",
                            },
                            className: "",
                          },
                        ],
                        className: "btn-group",
                        data: { "##bbstate": "" },
                        dataItemComponent: { _component: "" },
                        onLoad: [],
                      },
                    },
                  ],
                  width: "auto",
                  height: "auto",
                  containerClass: "",
                  itemContainerClass: "",
                  data: { "##bbstate": "" },
                  dataItemComponent: { _component: "" },
                  onLoad: [],
                },
                className: "",
              },
            ],
            className: "p-1",
            data: { "##bbstate": "" },
            dataItemComponent: { _component: "" },
            onLoad: [],
          },
          elseComponent: {
            _component: "@budibase/standard-components/div",
            children: [
              {
                _component: "children#array_element#",
                component: {
                  _component: "@budibase/standard-components/div",
                  children: [
                    {
                      _component: "children#array_element#",
                      component: {
                        _component: "@budibase/standard-components/div",
                        children: [
                          {
                            _component: "children#array_element#",
                            component: {
                              _component:
                                "@budibase/standard-components/button",
                              contentText: "Create customer",
                              contentComponent: { _component: "" },
                              className: "btn btn-secondary",
                              disabled: false,
                              onClick: [
                                {
                                  "##eventHandlerType": "Get New Record",
                                  parameters: {
                                    statePath: "customer",
                                    collectionKey: "/customers",
                                    childRecordType: "customer",
                                  },
                                },
                                {
                                  "##eventHandlerType": "Set State",
                                  parameters: {
                                    path: "isEditingcustomer",
                                    value: "true",
                                  },
                                },
                              ],
                              background: "",
                              color: "",
                              border: "",
                              padding: "",
                              hoverColor: "",
                              hoverBackground: "",
                              hoverBorder: "",
                            },
                            className: "",
                          },
                          {
                            _component: "children#array_element#",
                            component: {
                              _component:
                                "@budibase/standard-components/button",
                              contentText: "Refresh",
                              contentComponent: { _component: "" },
                              className: "btn btn-secondary",
                              disabled: false,
                              onClick: [
                                {
                                  "##eventHandlerType": "List Records",
                                  parameters: {
                                    statePath: "/all_customers",
                                    indexKey: "/all_customers",
                                  },
                                },
                              ],
                              background: "",
                              color: "",
                              border: "",
                              padding: "",
                              hoverColor: "",
                              hoverBackground: "",
                              hoverBorder: "",
                            },
                            className: "",
                          },
                        ],
                        className: "btn-group mr-3",
                        data: { "##bbstate": "" },
                        dataItemComponent: { _component: "" },
                        onLoad: [],
                      },
                      className: "",
                    },
                    {
                      _component: "children#array_element#",
                      component: {
                        _component: "@budibase/standard-components/if",
                        condition:
                          "$store.selectedrow_all_customers && $store.selectedrow_all_customers.length > 0",
                        thenComponent: {
                          _component: "@budibase/standard-components/div",
                          children: [
                            {
                              _component: "children#array_element#",
                              component: {
                                _component:
                                  "@budibase/standard-components/button",
                                contentText: "Edit customer",
                                contentComponent: { _component: "" },
                                className: "btn btn-secondary",
                                disabled: false,
                                onClick: [
                                  {
                                    "##eventHandlerType": "Load Record",
                                    parameters: {
                                      statePath: "customer",
                                      recordKey: {
                                        "##bbstate":
                                          "selectedrow_all_customers",
                                        "##source": "store",
                                      },
                                    },
                                  },
                                  {
                                    "##eventHandlerType": "Set State",
                                    parameters: {
                                      path: "isEditingcustomer",
                                      value: "true",
                                    },
                                  },
                                ],
                                background: "",
                                color: "",
                                border: "",
                                padding: "",
                                hoverColor: "",
                                hoverBackground: "",
                                hoverBorder: "",
                              },
                              className: "",
                            },
                            {
                              _component: "children#array_element#",
                              component: {
                                _component:
                                  "@budibase/standard-components/button",
                                contentText: "Delete customer",
                                contentComponent: { _component: "" },
                                className: "btn btn-secondary",
                                disabled: false,
                                onClick: [
                                  {
                                    "##eventHandlerType": "Delete Record",
                                    parameters: {
                                      recordKey: {
                                        "##bbstate":
                                          "selectedrow_all_customers",
                                        "##source": "store",
                                      },
                                    },
                                  },
                                ],
                                background: "",
                                color: "",
                                border: "",
                                padding: "",
                                hoverColor: "",
                                hoverBackground: "",
                                hoverBorder: "",
                              },
                              className: "",
                            },
                          ],
                          className: "btn-group",
                          data: { "##bbstate": "" },
                          dataItemComponent: { _component: "" },
                          onLoad: [],
                        },
                        elseComponent: { _component: "" },
                      },
                      className: "",
                    },
                  ],
                  className: "btn-toolbar mt-4 mb-2",
                  data: { "##bbstate": "" },
                  dataItemComponent: { _component: "" },
                  onLoad: [],
                },
                className: "",
              },
              {
                _component: "children#array_element#",
                component: {
                  _component: "@budibase/standard-components/table",
                  data: {
                    "##bbstate": "/all_customers",
                    "##bbsource": "store",
                  },
                  columns: [
                    {
                      _component: "columns#array_element#",
                      title: "enquiry",
                      value: {
                        "##bbstate": "enquiry",
                        "##bbsource": "context",
                      },
                    },
                    {
                      _component: "columns#array_element#",
                      title: "name",
                      value: { "##bbstate": "name", "##bbsource": "context" },
                    },
                  ],
                  onRowClick: [
                    {
                      "##eventHandlerType": "Set State",
                      parameters: {
                        path: "selectedrow_all_customers",
                        value: { "##bbstate": "key", "##bbsource": "event" },
                      },
                    },
                  ],
                  tableClass: "table table-hover",
                  theadClass: "thead-dark",
                  tbodyClass: "tbody-default",
                  trClass: "tr-default",
                  thClass: "th-default",
                },
                className: "flex-gow-1 overflow-auto",
              },
            ],
            className: "d-flex flex-column h-100",
            data: { "##bbstate": "" },
            dataItemComponent: { _component: "" },
            onLoad: [
              {
                "##eventHandlerType": "Set State",
                parameters: { path: "isEditingcustomer", value: "" },
              },
              {
                "##eventHandlerType": "List Records",
                parameters: {
                  statePath: "/all_customers",
                  indexKey: "/all_customers",
                },
              },
            ],
          },
        },
      },
      {
        _component: "items#array_element#",
        title: "contacts",
        component: {
          _component: "@budibase/standard-components/if",
          condition: "$store.isEditingContact",
          thenComponent: {
            _component: "@budibase/standard-components/div",
            children: [
              {
                _component: "children#array_element#",
                component: {
                  _component: "@budibase/standard-components/h3",
                  text: "Edit Contact",
                  className: "",
                },
                className: "",
              },
              {
                _component: "children#array_element#",
                component: {
                  _component: "@budibase/standard-components/form",
                  containerClass: "",
                  formControls: [
                    {
                      _component: "formControls#array_element#",
                      label: "Name",
                      control: {
                        _component: "@budibase/standard-components/input",
                        value: {
                          "##bbstate": "Contact.name",
                          "##bbsource": "store",
                        },
                        type: "text",
                        className: "form-control",
                      },
                    },
                    {
                      _component: "formControls#array_element#",
                      label: "Has Been Contacted",
                      control: {
                        _component: "@budibase/standard-components/input",
                        value: {
                          "##bbstate": "Contact.contacted",
                          "##bbsource": "store",
                        },
                        type: "text",
                        className: "form-control",
                      },
                    },
                  ],
                },
                className: "",
              },
              {
                _component: "children#array_element#",
                component: {
                  _component: "@budibase/standard-components/stackpanel",
                  direction: "horizontal",
                  children: [
                    {
                      _component: "children#array_element#",
                      control: {
                        _component: "@budibase/standard-components/div",
                        children: [
                          {
                            _component: "children#array_element#",
                            component: {
                              _component:
                                "@budibase/standard-components/button",
                              contentText: "Save Contact",
                              contentComponent: { _component: "" },
                              className: "btn btn-primary",
                              disabled: false,
                              onClick: [
                                {
                                  "##eventHandlerType": "Save Record",
                                  parameters: { statePath: "Contact" },
                                },
                                {
                                  "##eventHandlerType": "Set State",
                                  parameters: {
                                    path: "isEditingContact",
                                    value: "",
                                  },
                                },
                              ],
                              background: "",
                              color: "",
                              border: "",
                              padding: "",
                              hoverColor: "",
                              hoverBackground: "",
                              hoverBorder: "",
                            },
                            className: "",
                          },
                        ],
                        className: "btn-group",
                        data: { "##bbstate": "" },
                        dataItemComponent: { _component: "" },
                        onLoad: [],
                      },
                    },
                    {
                      _component: "children#array_element#",
                      control: {
                        _component: "@budibase/standard-components/div",
                        children: [
                          {
                            _component: "children#array_element#",
                            component: {
                              _component:
                                "@budibase/standard-components/button",
                              contentText: "Cancel",
                              contentComponent: { _component: "" },
                              className: "btn btn-secondary",
                              disabled: false,
                              onClick: [
                                {
                                  "##eventHandlerType": "Set State",
                                  parameters: {
                                    path: "isEditingContact",
                                    value: "",
                                  },
                                },
                              ],
                              background: "",
                              color: "",
                              border: "",
                              padding: "",
                              hoverColor: "",
                              hoverBackground: "",
                              hoverBorder: "",
                            },
                            className: "",
                          },
                        ],
                        className: "btn-group",
                        data: { "##bbstate": "" },
                        dataItemComponent: { _component: "" },
                        onLoad: [],
                      },
                    },
                  ],
                  width: "auto",
                  height: "auto",
                  containerClass: "",
                  itemContainerClass: "",
                  data: { "##bbstate": "" },
                  dataItemComponent: { _component: "" },
                  onLoad: [],
                },
                className: "",
              },
            ],
            className: "p-1",
            data: { "##bbstate": "" },
            dataItemComponent: { _component: "" },
            onLoad: [],
          },
          elseComponent: {
            _component: "@budibase/standard-components/div",
            children: [
              {
                _component: "children#array_element#",
                component: {
                  _component: "@budibase/standard-components/div",
                  children: [
                    {
                      _component: "children#array_element#",
                      component: {
                        _component: "@budibase/standard-components/div",
                        children: [
                          {
                            _component: "children#array_element#",
                            component: {
                              _component:
                                "@budibase/standard-components/button",
                              contentText: "Create Contact",
                              contentComponent: { _component: "" },
                              className: "btn btn-secondary",
                              disabled: false,
                              onClick: [
                                {
                                  "##eventHandlerType": "Get New Record",
                                  parameters: {
                                    statePath: "Contact",
                                    collectionKey: "/contacts",
                                    childRecordType: "Contact",
                                  },
                                },
                                {
                                  "##eventHandlerType": "Set State",
                                  parameters: {
                                    path: "isEditingContact",
                                    value: "true",
                                  },
                                },
                              ],
                              background: "",
                              color: "",
                              border: "",
                              padding: "",
                              hoverColor: "",
                              hoverBackground: "",
                              hoverBorder: "",
                            },
                            className: "",
                          },
                          {
                            _component: "children#array_element#",
                            component: {
                              _component:
                                "@budibase/standard-components/button",
                              contentText: "Refresh",
                              contentComponent: { _component: "" },
                              className: "btn btn-secondary",
                              disabled: false,
                              onClick: [
                                {
                                  "##eventHandlerType": "List Records",
                                  parameters: {
                                    statePath: "/all_contacts",
                                    indexKey: "/all_contacts",
                                  },
                                },
                              ],
                              background: "",
                              color: "",
                              border: "",
                              padding: "",
                              hoverColor: "",
                              hoverBackground: "",
                              hoverBorder: "",
                            },
                            className: "",
                          },
                        ],
                        className: "btn-group mr-3",
                        data: { "##bbstate": "" },
                        dataItemComponent: { _component: "" },
                        onLoad: [],
                      },
                      className: "",
                    },
                    {
                      _component: "children#array_element#",
                      component: {
                        _component: "@budibase/standard-components/if",
                        condition:
                          "$store.selectedrow_all_contacts && $store.selectedrow_all_contacts.length > 0",
                        thenComponent: {
                          _component: "@budibase/standard-components/div",
                          children: [
                            {
                              _component: "children#array_element#",
                              component: {
                                _component:
                                  "@budibase/standard-components/button",
                                contentText: "Edit Contact",
                                contentComponent: { _component: "" },
                                className: "btn btn-secondary",
                                disabled: false,
                                onClick: [
                                  {
                                    "##eventHandlerType": "Load Record",
                                    parameters: {
                                      statePath: "Contact",
                                      recordKey: {
                                        "##bbstate": "selectedrow_all_contacts",
                                        "##source": "store",
                                      },
                                    },
                                  },
                                  {
                                    "##eventHandlerType": "Set State",
                                    parameters: {
                                      path: "isEditingContact",
                                      value: "true",
                                    },
                                  },
                                ],
                                background: "",
                                color: "",
                                border: "",
                                padding: "",
                                hoverColor: "",
                                hoverBackground: "",
                                hoverBorder: "",
                              },
                              className: "",
                            },
                            {
                              _component: "children#array_element#",
                              component: {
                                _component:
                                  "@budibase/standard-components/button",
                                contentText: "Delete Contact",
                                contentComponent: { _component: "" },
                                className: "btn btn-secondary",
                                disabled: false,
                                onClick: [
                                  {
                                    "##eventHandlerType": "Delete Record",
                                    parameters: {
                                      recordKey: {
                                        "##bbstate": "selectedrow_all_contacts",
                                        "##source": "store",
                                      },
                                    },
                                  },
                                ],
                                background: "",
                                color: "",
                                border: "",
                                padding: "",
                                hoverColor: "",
                                hoverBackground: "",
                                hoverBorder: "",
                              },
                              className: "",
                            },
                          ],
                          className: "btn-group",
                          data: { "##bbstate": "" },
                          dataItemComponent: { _component: "" },
                          onLoad: [],
                        },
                        elseComponent: { _component: "" },
                      },
                      className: "",
                    },
                  ],
                  className: "btn-toolbar mt-4 mb-2",
                  data: { "##bbstate": "" },
                  dataItemComponent: { _component: "" },
                  onLoad: [],
                },
                className: "",
              },
              {
                _component: "children#array_element#",
                component: {
                  _component: "@budibase/standard-components/table",
                  data: { "##bbstate": "/all_contacts", "##bbsource": "store" },
                  columns: [
                    {
                      _component: "columns#array_element#",
                      title: "contacted",
                      value: {
                        "##bbstate": "contacted",
                        "##bbsource": "context",
                      },
                    },
                    {
                      _component: "columns#array_element#",
                      title: "name",
                      value: { "##bbstate": "name", "##bbsource": "context" },
                    },
                  ],
                  onRowClick: [
                    {
                      "##eventHandlerType": "Set State",
                      parameters: {
                        path: "selectedrow_all_contacts",
                        value: { "##bbstate": "key", "##bbsource": "event" },
                      },
                    },
                  ],
                  tableClass: "table table-hover",
                  theadClass: "thead-dark",
                  tbodyClass: "tbody-default",
                  trClass: "tr-default",
                  thClass: "th-default",
                },
                className: "flex-gow-1 overflow-auto",
              },
            ],
            className: "d-flex flex-column h-100",
            data: { "##bbstate": "" },
            dataItemComponent: { _component: "" },
            onLoad: [
              {
                "##eventHandlerType": "Set State",
                parameters: { path: "isEditingContact", value: "" },
              },
              {
                "##eventHandlerType": "List Records",
                parameters: {
                  statePath: "/all_contacts",
                  indexKey: "/all_contacts",
                },
              },
            ],
          },
        },
      },
    ],
    selectedItem: {
      "##bbstate": "selectedNav",
      "##bbstatefallback": "customers",
      "##bbsource": "store",
    },
    pills: false,
    orientation: "horizontal",
    alignment: "end",
    fill: false,
    hideNavBar: false,
    className: "p-3",
  },
}
