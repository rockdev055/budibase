const CouchDB = require("../../db")
const validateJs = require("validate.js")
const newid = require("../../db/newid")
const { getRecordParams, generateRecordID } = require("../../db/utils")

const MODEL_VIEW_BEGINS_WITH = "all_model:"

function emitEvent(eventType, ctx, record) {
  let event = {
    record,
    instanceId: ctx.user.instanceId,
  }
  // add syntactic sugar for mustache later
  if (record._id) {
    event.id = record._id
  }
  if (record._rev) {
    event.revision = record._rev
  }
  ctx.eventEmitter && ctx.eventEmitter.emit(eventType, event)
}

validateJs.extend(validateJs.validators.datetime, {
  parse: function(value) {
    return new Date(value).getTime()
  },
  // Input is a unix timestamp
  format: function(value) {
    return new Date(value).toISOString()
  },
})

exports.patch = async function(ctx) {
  const db = new CouchDB(ctx.user.instanceId)
  const record = await db.get(ctx.params.id)
  const model = await db.get(record.modelId)
  const patchfields = ctx.request.body

  for (let key in patchfields) {
    if (!model.schema[key]) continue
    record[key] = patchfields[key]
  }

  const validateResult = await validate({
    record,
    model,
  })

  if (!validateResult.valid) {
    ctx.status = 400
    ctx.body = {
      status: 400,
      errors: validateResult.errors,
    }
    return
  }

  const response = await db.put(record)
  record._rev = response.rev
  record.type = "record"
  ctx.body = record
  ctx.status = 200
  ctx.message = `${model.name} updated successfully.`
}

exports.save = async function(ctx) {
  const db = new CouchDB(ctx.user.instanceId)
  const record = ctx.request.body
  record.modelId = ctx.params.modelId

  if (!record._rev && !record._id) {
    record._id = generateRecordID(record.modelId, newid())
  }

  const model = await db.get(record.modelId)

  const validateResult = await validate({
    record,
    model,
  })

  if (!validateResult.valid) {
    ctx.status = 400
    ctx.body = {
      status: 400,
      errors: validateResult.errors,
    }
    return
  }

  const existingRecord = record._rev && (await db.get(record._id))

  if (existingRecord) {
    const response = await db.put(record)
    record._rev = response.rev
    record.type = "record"
    ctx.body = record
    ctx.status = 200
    ctx.message = `${model.name} updated successfully.`
    return
  }

  record.type = "record"
  const response = await db.post(record)
  record._rev = response.rev

  // create links in other tables
  for (let key in record) {
    if (model.schema[key] && model.schema[key].type === "link") {
      const linked = await db.allDocs({
        include_docs: true,
        keys: record[key],
      })

      // add this record to the linked records in attached models
      const linkedDocs = linked.rows.map(row => {
        const doc = row.doc
        return {
          ...doc,
          [model.name]: doc[model.name]
            ? [...doc[model.name], record._id]
            : [record._id],
        }
      })

      await db.bulkDocs(linkedDocs)
    }
  }

  emitEvent(`record:save`, ctx, record)
  ctx.body = record
  ctx.status = 200
  ctx.message = `${model.name} created successfully`
}

exports.fetchView = async function(ctx) {
  const db = new CouchDB(ctx.user.instanceId)
  const { stats, group, field } = ctx.query
  const viewName = ctx.params.viewName

  // if this is a model view being looked for just transfer to that
  if (viewName.indexOf(MODEL_VIEW_BEGINS_WITH) === 0) {
    ctx.params.modelId = viewName.substring(4)
    await exports.fetchModelRecords(ctx)
    return
  }

  const response = await db.query(`database/${viewName}`, {
    include_docs: !stats,
    group,
  })

  if (stats) {
    response.rows = response.rows.map(row => ({
      group: row.key,
      field,
      ...row.value,
      avg: row.value.sum / row.value.count,
    }))
  } else {
    response.rows = response.rows.map(row => row.doc)
  }

  ctx.body = response.rows
}

exports.fetchModelRecords = async function(ctx) {
  const db = new CouchDB(ctx.user.instanceId)
  const response = await db.allDocs(
    getRecordParams(ctx.params.modelId, null, {
      include_docs: true,
    })
  )
  ctx.body = response.rows.map(row => row.doc)
}

exports.search = async function(ctx) {
  const db = new CouchDB(ctx.user.instanceId)
  const response = await db.allDocs({
    include_docs: true,
    ...ctx.request.body,
  })
  ctx.body = response.rows.map(row => row.doc)
}

exports.find = async function(ctx) {
  const db = new CouchDB(ctx.user.instanceId)
  const record = await db.get(ctx.params.recordId)
  if (record.modelId !== ctx.params.modelId) {
    ctx.throw(400, "Supplied modelId does not match the records modelId")
    return
  }
  ctx.body = record
}

exports.destroy = async function(ctx) {
  const db = new CouchDB(ctx.user.instanceId)
  const record = await db.get(ctx.params.recordId)
  if (record.modelId !== ctx.params.modelId) {
    ctx.throw(400, "Supplied modelId doesn't match the record's modelId")
    return
  }
  ctx.body = await db.remove(ctx.params.recordId, ctx.params.revId)
  ctx.status = 200
  // for automations
  ctx.record = record
  emitEvent(`record:delete`, ctx, record)
}

exports.validate = async function(ctx) {
  const errors = await validate({
    instanceId: ctx.user.instanceId,
    modelId: ctx.params.modelId,
    record: ctx.request.body,
  })
  ctx.status = 200
  ctx.body = errors
}

async function validate({ instanceId, modelId, record, model }) {
  if (!model) {
    const db = new CouchDB(instanceId)
    model = await db.get(modelId)
  }
  const errors = {}
  for (let fieldName in model.schema) {
    const res = validateJs.single(
      record[fieldName],
      model.schema[fieldName].constraints
    )
    if (res) errors[fieldName] = res
  }
  return { valid: Object.keys(errors).length === 0, errors }
}
