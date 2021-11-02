const CouchDB = require("../../../db")
const viewTemplate = require("./viewBuilder")
const fs = require("fs")
const { join } = require("../../../utilities/sanitisedPath")
const os = require("os")
const exporters = require("./exporters")
const { fetchView } = require("../record")

const controller = {
  fetch: async ctx => {
    const db = new CouchDB(ctx.user.instanceId)
    const designDoc = await db.get("_design/database")
    const response = []

    for (let name of Object.keys(designDoc.views)) {
      // Only return custom views
      if (name === "by_link") {
        continue
      }
      response.push({
        name,
        ...designDoc.views[name],
      })
    }

    ctx.body = response
  },
  save: async ctx => {
    const db = new CouchDB(ctx.user.instanceId)
    const { originalName, ...viewToSave } = ctx.request.body

    const designDoc = await db.get("_design/database")

    const view = viewTemplate(viewToSave)

    designDoc.views = {
      ...designDoc.views,
      [viewToSave.name]: view,
    }

    // view has been renamed
    if (originalName) {
      delete designDoc.views[originalName]
    }

    await db.put(designDoc)

    // add views to model document
    const model = await db.get(ctx.request.body.modelId)
    if (!model.views) model.views = {}
    if (!view.meta.schema) {
      view.meta.schema = model.schema
    }
    model.views[viewToSave.name] = view.meta

    if (originalName) {
      delete model.views[originalName]
    }

    await db.put(model)

    ctx.body = model.views[viewToSave.name]
    ctx.message = `View ${viewToSave.name} saved successfully.`
  },
  destroy: async ctx => {
    const db = new CouchDB(ctx.user.instanceId)
    const designDoc = await db.get("_design/database")

    const viewName = decodeURI(ctx.params.viewName)

    const view = designDoc.views[viewName]

    delete designDoc.views[viewName]

    await db.put(designDoc)

    const model = await db.get(view.meta.modelId)
    delete model.views[viewName]
    await db.put(model)

    ctx.body = view
    ctx.message = `View ${ctx.params.viewName} saved successfully.`
  },
  exportView: async ctx => {
    const view = ctx.request.body
    const format = ctx.query.format

    // Fetch view records
    ctx.params.viewName = view.name
    ctx.query.group = view.groupBy
    if (view.field) {
      ctx.query.stats = true
      ctx.query.field = view.field
    }
    await fetchView(ctx)

    // Export part
    let headers = Object.keys(view.schema)
    const exporter = exporters[format]
    const exportedFile = exporter(headers, ctx.body)
    const filename = `${view.name}.${format}`
    fs.writeFileSync(join(os.tmpdir(), filename), exportedFile)

    ctx.body = {
      url: `/api/views/export/download/${filename}`,
      name: view.name,
    }
  },
  downloadExport: async ctx => {
    const filename = ctx.params.fileName

    ctx.attachment(filename)
    ctx.body = fs.createReadStream(join(os.tmpdir(), filename))
  },
}

module.exports = controller
