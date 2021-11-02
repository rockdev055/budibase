const CouchDB = require("../db")
const emitter = require("../events/index")
const InMemoryQueue = require("../utilities/queue/inMemoryQueue")
const { getAutomationParams } = require("../db/utils")

let automationQueue = new InMemoryQueue("automationQueue")

const FAKE_STRING = "TEST"
const FAKE_BOOL = false
const FAKE_NUMBER = 1
const FAKE_DATETIME = "1970-01-01T00:00:00.000Z"

const BUILTIN_DEFINITIONS = {
  RECORD_SAVED: {
    name: "Row Saved",
    event: "record:save",
    icon: "ri-save-line",
    tagline: "Row is added to {{inputs.enriched.model.name}}",
    description: "Fired when a row is saved to your database",
    stepId: "RECORD_SAVED",
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
            description: "The new row that was saved",
          },
          id: {
            type: "string",
            description: "Row ID - can be used for updating",
          },
          revision: {
            type: "string",
            description: "Revision of row",
          },
        },
        required: ["record", "id"],
      },
    },
    type: "TRIGGER",
  },
  RECORD_DELETED: {
    name: "Row Deleted",
    event: "record:delete",
    icon: "ri-delete-bin-line",
    tagline: "Row is deleted from {{inputs.enriched.model.name}}",
    description: "Fired when a row is deleted from your database",
    stepId: "RECORD_DELETED",
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
            description: "The row that was deleted",
          },
        },
        required: ["record", "id"],
      },
    },
    type: "TRIGGER",
  },
}

async function queueRelevantRecordAutomations(event, eventType) {
  if (event.instanceId == null) {
    throw `No instanceId specified for ${eventType} - check event emitters.`
  }
  const db = new CouchDB(event.instanceId)
  let automations = await db.allDocs(
    getAutomationParams(null, { include_docs: true })
  )

  // filter down to the correct event type
  automations = automations.rows
    .map(automation => automation.doc)
    .filter(automation => {
      const trigger = automation.definition.trigger
      return trigger && trigger.event === eventType
    })

  for (let automation of automations) {
    let automationDef = automation.definition
    let automationTrigger = automationDef ? automationDef.trigger : {}
    if (
      !automation.live ||
      !automationTrigger.inputs ||
      automationTrigger.inputs.modelId !== event.record.modelId
    ) {
      continue
    }
    automationQueue.add({ automation, event })
  }
}

emitter.on("record:save", async function(event) {
  if (!event || !event.record || !event.record.modelId) {
    return
  }
  await queueRelevantRecordAutomations(event, "record:save")
})

emitter.on("record:delete", async function(event) {
  if (!event || !event.record || !event.record.modelId) {
    return
  }
  await queueRelevantRecordAutomations(event, "record:delete")
})

async function fillRecordOutput(automation, params) {
  let triggerSchema = automation.definition.trigger
  let modelId = triggerSchema.inputs.modelId
  const db = new CouchDB(params.instanceId)
  try {
    let model = await db.get(modelId)
    let record = {}
    for (let schemaKey of Object.keys(model.schema)) {
      if (params[schemaKey] != null) {
        continue
      }
      let propSchema = model.schema[schemaKey]
      switch (propSchema.constraints.type) {
        case "string":
          record[schemaKey] = FAKE_STRING
          break
        case "boolean":
          record[schemaKey] = FAKE_BOOL
          break
        case "number":
          record[schemaKey] = FAKE_NUMBER
          break
        case "datetime":
          record[schemaKey] = FAKE_DATETIME
          break
      }
    }
    params.record = record
  } catch (err) {
    throw "Failed to find model for trigger"
  }
  return params
}

module.exports.externalTrigger = async function(automation, params) {
  // TODO: replace this with allowing user in builder to input values in future
  if (
    automation.definition != null &&
    automation.definition.trigger != null &&
    automation.definition.trigger.inputs.modelId != null
  ) {
    params = await fillRecordOutput(automation, params)
  }

  automationQueue.add({ automation, event: params })
}

module.exports.automationQueue = automationQueue

module.exports.BUILTIN_DEFINITIONS = BUILTIN_DEFINITIONS
