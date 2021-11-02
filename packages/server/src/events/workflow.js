const mustache = require("mustache")

/**
 * The workflow orchestrator is a class responsible for executing workflows.
 * It relies on the strategy pattern, which allows composable behaviour to be
 * passed into its execute() function. This allows custom execution behaviour based
 * on where the orchestrator is run.
 *
 */
exports.Orchestrator = class Orchestrator {
  set strategy(strategy) {
    this._strategy = strategy()
  }

  async execute(workflow, context) {
    if (workflow.live) {
      this._strategy.run(workflow.definition, context)
    }
  }
}

exports.serverStrategy = () => ({
  context: {},
  bindContextArgs: function(args) {
    const mappedArgs = { ...args }

    // bind the workflow action args to the workflow context, if required
    for (let arg in args) {
      const argValue = args[arg]
      // We don't want to render mustache templates on non-strings
      if (typeof argValue !== "string") continue

      mappedArgs[arg] = mustache.render(argValue, { context: this.context })
    }

    return mappedArgs
  },
  run: async function(workflow, context) {
    for (let block of workflow.steps) {
      if (block.type === "CLIENT") continue

      const action = require(`../api/controllers/workflow/actions/${block.actionId}`)
      const response = await action({
        args: this.bindContextArgs(block.args),
        context,
      })

      this.context = {
        ...this.context,
        [block.id]: response,
      }
    }
  },
})
