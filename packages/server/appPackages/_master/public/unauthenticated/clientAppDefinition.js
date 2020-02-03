window["##BUDIBASE_APPDEFINITION##"] = {
  hierarchy: {
    name: "root",
    type: "root",
    children: [
      {
        name: "application",
        type: "record",
        fields: [
          {
            name: "name",
            type: "string",
            typeOptions: {
              maxLength: 500,
              values: null,
              allowDeclaredValuesOnly: false,
            },
            label: "Name",
            getInitialValue: "default",
            getUndefinedValue: "default",
          },
          {
            name: "domain",
            type: "string",
            typeOptions: {
              maxLength: 500,
              values: null,
              allowDeclaredValuesOnly: false,
            },
            label: "domain",
            getInitialValue: "default",
            getUndefinedValue: "default",
          },
          {
            name: "application_resolve_strategy",
            type: "string",
            typeOptions: {
              maxLength: 100,
              values: ["domain", "path"],
              allowDeclaredValuesOnly: true,
            },
            label: "Resolve Application By",
            getInitialValue: "default",
            getUndefinedValue: "default",
          },
          {
            name: "defaultVersion",
            type: "reference",
            typeOptions: {
              indexNodeKey: "/applications/1-{id}/all_versions",
              reverseIndexNodeKeys: [
                "/applications/1-{id}/versions/3-{id}/isdefault",
              ],
              displayValue: "name",
            },
            label: "Default Version",
            getInitialValue: "default",
            getUndefinedValue: "default",
          },
        ],
        children: [
          {
            name: "user",
            type: "record",
            fields: [
              {
                name: "name",
                type: "string",
                typeOptions: {
                  maxLength: 200,
                  values: null,
                  allowDeclaredValuesOnly: false,
                },
                label: "Name (unique)",
                getInitialValue: "default",
                getUndefinedValue: "default",
              },
              {
                name: "active",
                type: "bool",
                typeOptions: { allowNulls: false },
                label: "Is Active",
                getInitialValue: "default",
                getUndefinedValue: "default",
              },
              {
                name: "createdByMaster",
                type: "bool",
                typeOptions: { allowNulls: false },
                label: "Created by Master",
                getInitialValue: "default",
                getUndefinedValue: "default",
              },
              {
                name: "instance",
                type: "reference",
                typeOptions: {
                  indexNodeKey: "/applications/1-{id}/allinstances",
                  reverseIndexNodeKeys: [
                    "/applications/1-{id}/instances/2-{id}/users_on_this_instance",
                  ],
                  displayValue: "name",
                },
                label: "Instance",
                getInitialValue: "default",
                getUndefinedValue: "default",
              },
            ],
            children: [],
            validationRules: [],
            nodeId: 8,
            indexes: [],
            allidsShardFactor: "64",
            collectionName: "users",
            isSingle: false,
          },
          {
            name: "instance",
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
                label: "Name",
                getInitialValue: "default",
                getUndefinedValue: "default",
              },
              {
                name: "active",
                type: "bool",
                typeOptions: { allowNulls: false },
                label: "Is Active",
                getInitialValue: "default",
                getUndefinedValue: "default",
              },
              {
                name: "version",
                type: "reference",
                typeOptions: {
                  indexNodeKey: "/applications/1-{id}/all_versions",
                  reverseIndexNodeKeys: [
                    "/applications/1-{id}/versions/3-{id}/instances_on_this_version",
                  ],
                  displayValue: "name",
                },
                label: "Version",
                getInitialValue: "default",
                getUndefinedValue: "default",
              },
              {
                name: "datastoreconfig",
                type: "string",
                typeOptions: {
                  maxLength: 1000,
                  values: null,
                  allowDeclaredValuesOnly: false,
                },
                label: "Datastore Config",
                getInitialValue: "default",
                getUndefinedValue: "default",
              },
            ],
            children: [],
            validationRules: [],
            nodeId: 2,
            indexes: [
              {
                name: "users_on_this_instance",
                type: "index",
                map: "return {...record};",
                filter: "",
                indexType: "reference",
                getShardName: "",
                getSortKey: "record.id",
                aggregateGroups: [],
                allowedRecordNodeIds: [],
                nodeId: 15,
              },
            ],
            allidsShardFactor: 1,
            collectionName: "instances",
            isSingle: false,
          },
          {
            name: "version",
            type: "record",
            fields: [
              {
                name: "name",
                type: "string",
                typeOptions: {
                  maxLength: 200,
                  values: null,
                  allowDeclaredValuesOnly: false,
                },
                label: "Name",
                getInitialValue: "default",
                getUndefinedValue: "default",
              },
              {
                name: "defaultAccessLevel",
                type: "string",
                typeOptions: {
                  maxLength: 200,
                  values: null,
                  allowDeclaredValuesOnly: false,
                },
                label: "Default Access Level",
                getInitialValue: "default",
                getUndefinedValue: "default",
              },
            ],
            children: [],
            validationRules: [],
            nodeId: 3,
            indexes: [
              {
                name: "instances_for_this_version",
                type: "index",
                map: "return {name:record.name};",
                filter: "",
                indexType: "ancestor",
                getShardName: "",
                getSortKey: "record.id",
                aggregateGroups: [],
                allowedRecordNodeIds: [],
                nodeId: 9,
              },
              {
                name: "instances_on_this_version",
                type: "index",
                map: "return {...record};",
                filter: "",
                indexType: "reference",
                getShardName: "",
                getSortKey: "record.id",
                aggregateGroups: [],
                allowedRecordNodeIds: [],
                nodeId: 10,
              },
              {
                name: "isdefault",
                type: "index",
                map: "return {};",
                filter: "",
                indexType: "reference",
                getShardName: "",
                getSortKey: "record.id",
                aggregateGroups: [],
                allowedRecordNodeIds: [],
                nodeId: 28,
              },
            ],
            allidsShardFactor: 1,
            collectionName: "versions",
            isSingle: false,
          },
          {
            name: "session",
            type: "record",
            fields: [
              {
                name: "created",
                type: "number",
                typeOptions: {
                  minValue: 0,
                  maxValue: 99999999999999,
                  decimalPlaces: 0,
                },
                label: "Created",
                getInitialValue: "default",
                getUndefinedValue: "default",
              },
              {
                name: "user_json",
                type: "string",
                typeOptions: {
                  maxLength: null,
                  values: null,
                  allowDeclaredValuesOnly: false,
                },
                label: "User Json",
                getInitialValue: "default",
                getUndefinedValue: "default",
              },
              {
                name: "instanceDatastoreConfig",
                type: "string",
                typeOptions: {
                  maxLength: null,
                  values: null,
                  allowDeclaredValuesOnly: false,
                },
                label: "Instance Datastore Config",
                getInitialValue: "default",
                getUndefinedValue: "default",
              },
              {
                name: "instanceKey",
                type: "string",
                typeOptions: {
                  maxLength: null,
                  values: null,
                  allowDeclaredValuesOnly: false,
                },
                label: "Instance Key",
                getInitialValue: "default",
                getUndefinedValue: "default",
              },
              {
                name: "instanceVersion",
                type: "string",
                typeOptions: {
                  maxLength: null,
                  values: null,
                  allowDeclaredValuesOnly: false,
                },
                label: "Instance Version",
                getInitialValue: "default",
                getUndefinedValue: "default",
              },
              {
                name: "username",
                type: "string",
                typeOptions: {
                  maxLength: null,
                  values: null,
                  allowDeclaredValuesOnly: false,
                },
                label: "User",
                getInitialValue: "default",
                getUndefinedValue: "default",
              },
            ],
            children: [],
            validationRules: [],
            nodeId: 16,
            indexes: [],
            allidsShardFactor: 1,
            collectionName: "sessions",
            isSingle: false,
          },
        ],
        validationRules: [],
        nodeId: 1,
        indexes: [
          {
            name: "allinstances",
            type: "index",
            map: "return {...record};",
            filter: "",
            indexType: "ancestor",
            getShardName: "",
            getSortKey: "record.id",
            aggregateGroups: [],
            allowedRecordNodeIds: [2],
            nodeId: 23,
          },
          {
            name: "sessions_by_user",
            type: "index",
            map: "return {username:record.username};",
            filter: "",
            indexType: "ancestor",
            getShardName: "return record.username.substring(0,2)",
            getSortKey: "record.id",
            aggregateGroups: [],
            allowedRecordNodeIds: [16],
            nodeId: 24,
          },
          {
            name: "user_name_lookup",
            type: "index",
            map:
              "return ({name:record.name, instanceKey:record.instance.key ? record.instance.key : '', instanceDatastoreConfig:record.instance.datastoreconfig ? record.instance.datastoreconfig : 'nothing'});",
            filter: "",
            indexType: "ancestor",
            getShardName: "return record.name.substring(0,2)",
            getSortKey: "record.id",
            aggregateGroups: [],
            allowedRecordNodeIds: [8],
            nodeId: 25,
          },
          {
            name: "all_versions",
            type: "index",
            map: "return {...record};",
            filter: "",
            indexType: "ancestor",
            getShardName: "",
            getSortKey: "record.id",
            aggregateGroups: [],
            allowedRecordNodeIds: [3],
            nodeId: 26,
          },
        ],
        allidsShardFactor: 64,
        collectionName: "applications",
        isSingle: false,
      },
      {
        name: "mastersession",
        type: "record",
        fields: [
          {
            name: "user_json",
            type: "string",
            typeOptions: {
              maxLength: 10000,
              values: null,
              allowDeclaredValuesOnly: false,
            },
            label: "User Json",
            getInitialValue: "default",
            getUndefinedValue: "default",
          },
          {
            name: "username",
            type: "string",
            typeOptions: {
              maxLength: null,
              values: null,
              allowDeclaredValuesOnly: false,
            },
            label: "User",
            getInitialValue: "default",
            getUndefinedValue: "default",
          },
        ],
        children: [],
        validationRules: [],
        nodeId: 17,
        indexes: [],
        allidsShardFactor: 64,
        collectionName: "sessions",
        isSingle: false,
      },
    ],
    pathMaps: [],
    indexes: [
      {
        name: "all_applications",
        type: "index",
        map: "return {...record};",
        filter: "",
        indexType: "ancestor",
        getShardName: "",
        getSortKey: "record.id",
        aggregateGroups: [],
        allowedRecordNodeIds: [1],
        nodeId: 22,
      },
      {
        name: "mastersessions_by_user",
        type: "index",
        map: "return {username:record.username};",
        filter: "",
        indexType: "ancestor",
        getShardName: "return record.username.substring(0,2)",
        getSortKey: "record.id",
        aggregateGroups: [],
        allowedRecordNodeIds: [17],
        nodeId: 27,
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
  ],
  appRootPath: "/_master",
  props: {
    _component: "@budibase/standard-components/login",
    logo: "_shared/budibase-logo.png",
    loginRedirect: "",
    usernameLabel: "Username",
    passwordLabel: "Password",
    loginButtonLabel: "Login",
    buttonClass: "",
    inputClass: "",
  },
}
