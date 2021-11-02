const CouchDB = require("../../../db")
const { create, destroy } = require("../../../db/clientDb")
const supertest = require("supertest")
const app = require("../../../app")

const TEST_CLIENT_ID = "test-client-id"

exports.supertest = async () => {
  let request
  let port = 4002
  let started = false
  let server
  while (!started && port < 4020) {
    try {
      server = await app(port)
      started = true
    } catch (err) {
      if (err.code === "EADDRINUSE") {
        port = port + 1
      } else {
        throw err
      }
    }
  }

  if (!started) throw Error("Application failed to start")

  request = supertest(server)
  return { request, server }
}

exports.defaultHeaders = {
  Accept: "application/json",
  Authorization: "Basic test-admin-secret",
}

exports.createModel = async (request, instanceId, model) => {
  model = model || {
    name: "TestModel",
    type: "model",
    key: "name",
    schema: {
      name: { type: "string" },
    },
  }

  const res = await request
    .post(`/api/${instanceId}/models`)
    .set(exports.defaultHeaders)
    .send(model)
  return res.body
}

exports.createClientDatabase = async () => await create(TEST_CLIENT_ID)

exports.createApplication = async (request, name = "test_application") => {
  const res = await request
    .post("/api/applications")
    .set(exports.defaultHeaders)
    .send({
      name,
    })
  return res.body
}

exports.destroyClientDatabase = async () => await destroy(TEST_CLIENT_ID)

exports.createInstance = async (request, appId) => {
  const res = await request
    .post(`/api/${appId}/instances`)
    .set(exports.defaultHeaders)
    .send({
      name: "test-instance",
    })
  return res.body
}

exports.createUser = async (
  request,
  instanceId,
  username = "bill",
  password = "bills_password"
) => {
  const res = await request
    .post(`/api/${instanceId}/users`)
    .set(exports.defaultHeaders)
    .send({ name: "Bill", username, password })
  return res.body
}

exports.insertDocument = async (databaseId, document) => {
  const { id, ...documentFields } = document
  await new CouchDB(databaseId).put({ _id: id, ...documentFields })
}

exports.createSchema = async (request, instanceId, schema) => {
  for (let model of schema.models) {
    await request.post(`/api/${instanceId}/models`).send(model)
  }
  for (let view of schema.views) {
    await request.post(`/api/${instanceId}/views`).send(view)
  }
}
