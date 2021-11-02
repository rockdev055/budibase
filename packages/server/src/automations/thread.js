const mustache = require("mustache")
const actions = require("./actions")
const logic = require("./logic")

const FILTER_STEP_ID = logic.BUILTIN_DEFINITIONS.FILTER.stepId

function cleanMustache(string) {
  let charToReplace = {
    "[": ".",
    "]": "",
  }
  let regex = new RegExp(/{{[^}}]*}}/g)
  let matches = string.match(regex)
  if (matches == null) {
    return string
  }
  for (let match of matches) {
    let baseIdx = string.indexOf(match)
    for (let key of Object.keys(charToReplace)) {
      let idxChar = match.indexOf(key)
      if (idxChar !== -1) {
        string =
          string.slice(baseIdx, baseIdx + idxChar) +
          charToReplace[key] +
          string.slice(baseIdx + idxChar + 1)
      }
    }
  }
  return string
}

// looks for inputs that need cleanup to the correct type
function cleanInputValue(inputs, schema) {
  if (schema == null) {
    return inputs
  }
  for (let inputKey of Object.keys(inputs)) {
    let input = inputs[inputKey]
    if (typeof input !== "string") {
      continue
    }
    let propSchema = schema.properties[inputKey]
    if (propSchema.type === "boolean") {
      let lcInput = input.toLowerCase()
      if (lcInput === "true") {
        inputs[inputKey] = true
      }
      if (lcInput === "false") {
        inputs[inputKey] = false
      }
    }
    if (propSchema.type === "number") {
      let floatInput = parseFloat(input)
      if (!isNaN(floatInput)) {
        inputs[inputKey] = floatInput
      }
    }
  }
  return inputs
}

function recurseMustache(inputs, context) {
  for (let key of Object.keys(inputs)) {
    let val = inputs[key]
    if (typeof val === "string") {
      val = cleanMustache(inputs[key])
      inputs[key] = mustache.render(val, context)
    }
    // this covers objects and arrays
    else if (typeof val === "object") {
      inputs[key] = recurseMustache(inputs[key], context)
    }
  }
  return inputs
}

/**
 * The automation orchestrator is a class responsible for executing automations.
 * It handles the context of the automation and makes sure each step gets the correct
 * inputs and handles any outputs.
 */
class Orchestrator {
  constructor(automation, triggerOutput) {
    this._instanceId = triggerOutput.instanceId
    // remove from context
    delete triggerOutput.instanceId
    // step zero is never used as the mustache is zero indexed for customer facing
    this._context = { steps: [{}], trigger: triggerOutput }
    this._automation = automation
  }

  async getStepFunctionality(type, stepId) {
    let step = null
    if (type === "ACTION") {
      step = await actions.getAction(stepId)
    } else if (type === "LOGIC") {
      step = logic.getLogic(stepId)
    }
    if (step == null) {
      throw `Cannot find automation step by name ${stepId}`
    }
    return step
  }

  async execute() {
    let automation = this._automation
    for (let step of automation.definition.steps) {
      let stepFn = await this.getStepFunctionality(step.type, step.stepId)
      step.inputs = recurseMustache(step.inputs, this._context)
      step.inputs = cleanInputValue(step.inputs, step.schema.inputs)
      // instanceId is always passed
      const outputs = await stepFn({
        inputs: step.inputs,
        instanceId: this._instanceId,
      })
      if (step.stepId === FILTER_STEP_ID && !outputs.success) {
        break
      }
      this._context.steps.push(outputs)
    }
  }
}

// callback is required for worker-farm to state that the worker thread has completed
module.exports = async (job, cb = null) => {
  try {
    const automationOrchestrator = new Orchestrator(
      job.data.automation,
      job.data.event
    )
    await automationOrchestrator.execute()
    if (cb) {
      cb()
    }
  } catch (err) {
    if (cb) {
      cb(err)
    }
  }
}
