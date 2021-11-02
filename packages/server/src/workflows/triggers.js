const CouchDB = require("../db")
const emitter = require("../events/index")
const InMemoryQueue = require("./queue/inMemoryQueue")

let workflowQueue = new InMemoryQueue()

const BUILTIN_DEFINITIONS = {
  RECORD_SAVED: {
    name: "Record Saved",
    event: "record:save",
    icon: "ri-save-line",
    tagline: "Record is added to {{inputs.enriched.model.name}}",
    description: "Fired when a record is saved to your database",
    inputs: {},
    schema: {
      inputs: {
        properties: {
          modelId: {
            type: "string",
            customType: "model",
            title: "Table",
          },
        },
        required: ["modelId"],
      },
      outputs: {
        properties: {
          record: {
            type: "object",
            customType: "record",
            description: "The new record that was saved",
          },
        },
        required: ["record"],
      },
    },
    type: "TRIGGER",
  },
  RECORD_DELETED: {
    name: "Record Deleted",
    event: "record:delete",
    icon: "ri-delete-bin-line",
    tagline: "Record is deleted from {{inputs.enriched.model.name}}",
    description: "Fired when a record is deleted from your database",
    inputs: {},
    schema: {
      inputs: {
        properties: {
          modelId: {
            type: "string",
            customType: "model",
            title: "Table",
          },
        },
        required: ["modelId"],
      },
      outputs: {
        properties: {
          record: {
            type: "object",
            customType: "record",
            description: "The record that was deleted",
          },
        },
        required: ["record"],
      },
    },
    type: "TRIGGER",
  },
}

async function queueRelevantWorkflows(event, eventType) {
  if (event.instanceId == null) {
    throw `No instanceId specified for ${eventType} - check event emitters.`
  }
  const db = new CouchDB(event.instanceId)
  const workflowsToTrigger = await db.query("database/by_workflow_trigger", {
    key: [eventType],
    include_docs: true,
  })

  const workflows = workflowsToTrigger.rows.map(wf => wf.doc)
  for (let workflow of workflows) {
    if (!workflow.live) {
      continue
    }
    workflowQueue.add({ workflow, event })
  }
}

emitter.on("record:save", async function(event) {
  await queueRelevantWorkflows(event, "record:save")
})

emitter.on("record:delete", async function(event) {
  await queueRelevantWorkflows(event, "record:delete")
})

module.exports.externalTrigger = async function(workflow, params) {
  workflowQueue.add({ workflow, event: params })
}

module.exports.workflowQueue = workflowQueue

module.exports.BUILTIN_DEFINITIONS = BUILTIN_DEFINITIONS
