const WORKFLOW_SCHEMA = {
  properties: {
    type: "workflow",
    pageId: {
      type: "string",
    },
    screenId: {
      type: "string",
    },
    live: {
      type: "boolean",
    },
    uiTree: {
      type: "object",
    },
    definition: {
      type: "object",
      properties: {
        triggers: { type: "array" },
        steps: { type: "array" }
        // next: {
        //   type: "object",
        //   properties: {
        //     environment: { environment: "string" },
        //     type: { type: "string" },
        //     actionId: { type: "string" },
        //     args: { type: "object" },
        //     conditions: { type: "array" },
        //     errorHandling: { type: "object" },
        //     next: { type: "object" },
        //   },
        // },
      },
    },
  },
}

module.exports = {
  WORKFLOW_SCHEMA,
}
