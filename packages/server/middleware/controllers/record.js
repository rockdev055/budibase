const couchdb = require("../../db")
const { mapValues, keyBy, compose } = require("lodash/fp")
const {
  validateRecord,
  events,
  safeParseField
} = require("@budibase/common")

exports.save = async function(ctx) {
  const db = couchdb.use(ctx.databaseId)
  const record = ctx.body

  if (!ctx.schema.findModel(record._modelId)) {
    ctx.status = 400
    ctx.message = `Model ${record._modelId} does not exist in schema.`
    return
  }

  const validationResult = await validateRecord(ctx.schema, record)
  if (!validationResult.isValid) {
    await ctx.publish(events.recordApi.save.onInvalid, {
      record,
      validationResult,
    })
    ctx.status = 400
    ctx.message = "record failed validation rules"
    ctx.body = validationResult
  }

  if (!record._rev) {
    await db.insert(record)
    await ctx.publish(events.recordApi.save.onRecordCreated, {
      record: record,
    })
  } else {
    const oldRecord = await _findRecord(db, ctx.schema, record._id)
    await db.insert(record)
    await ctx.publish(events.recordApi.save.onRecordUpdated, {
      old: oldRecord,
      new: record,
    })
  }

  const savedHead = await db.head(record._id)
  record._rev = savedHead._rev
  return record
}

exports.fetch = function(ctx) {
  const db = couchdb.db.use(ctx.params.databaseId)
  const model = ctx.schema.findModel(ctx.modelName)
  ctx.body = db.viewAsStream(
    `all_${model.id}`,
    `all_${model.id}`,
    {
      include_docs: true,
    }
  )
}

exports.find = async function(ctx) {
  const db = couchdb.db.use(ctx.params.databaseId)
  const { body, status } = await _findRecord({
    db,
    schema: ctx.schema,
    id: ctx.params.recordId
  })
  ctx.status = status
  ctx.body = body
}

async function _findRecord({ db, schema, id }) {
  let storedData
  try {
    storedData = await db.get(id)
  } catch (err) {
    return err
  }

  const model = schema.findModel(storedData._modelId)

  const loadRecord = compose(
    mapValues(f => safeParseField(f, storedData)),
    keyBy("name")
  );

  const loadedRecord = loadRecord(model.fields); 

  return {
    ...loadedRecord,
    _rev: storedData._rev,
    _id: storedData._id,
    _modelId: storedData._modelId
  }
}

exports.destroy = async function(ctx) {
  const databaseId = ctx.params.databaseId;
  const database = couchdb.db.use(databaseId)
  ctx.body = await database.destroy(ctx.params.recordId);
};