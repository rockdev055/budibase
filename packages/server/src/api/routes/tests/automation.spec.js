const {
  createApplication,
  createTable,
  getAllFromTable,
  defaultHeaders,
  supertest,
  insertDocument,
  destroyDocument,
  builderEndpointShouldBlockNormalUsers
} = require("./couchTestUtils")
let { generateAutomationID } = require("../../../db/utils")

const { delay } = require("./testUtils")

const MAX_RETRIES = 4
const AUTOMATION_ID = generateAutomationID()
const TEST_AUTOMATION = {
  _id: AUTOMATION_ID,
  name: "My Automation",
  screenId: "kasdkfldsafkl",
  live: true,
  uiTree: {

  },
  definition: {
    trigger: {},
    steps: [
    ],
  },
  type: "automation",
}

let ACTION_DEFINITIONS = {}
let TRIGGER_DEFINITIONS = {}
let LOGIC_DEFINITIONS = {}

describe("/automations", () => {
  let request
  let server
  let app
  let appId
  let automation
  let automationId

  beforeAll(async () => {
    ({ request, server } = await supertest())
  })

  beforeEach(async () => {
    app = await createApplication(request)
    appId = app.instance._id
    if (automation) await destroyDocument(automation.id)
  })

  afterAll(() => {
    server.close()
  })

  const createAutomation = async () => {
    automation = await insertDocument(appId, {
      type: "automation",
      ...TEST_AUTOMATION
    })
    automation = { ...automation, ...TEST_AUTOMATION }
  }

  const triggerWorkflow = async (automationId) => {
    return await request
      .post(`/api/automations/${automationId}/trigger`)
      .send({ name: "Test", description: "TEST" })
      .set(defaultHeaders(appId))
      .expect('Content-Type', /json/)
      .expect(200)
  }

  describe("get definitions", () => {
    it("returns a list of definitions for actions", async () => {
      const res = await request
        .get(`/api/automations/action/list`)
        .set(defaultHeaders(appId))
        .expect('Content-Type', /json/)
        .expect(200)

      expect(Object.keys(res.body).length).not.toEqual(0)
      ACTION_DEFINITIONS = res.body
    })

    it("returns a list of definitions for triggers", async () => {
      const res = await request
        .get(`/api/automations/trigger/list`)
        .set(defaultHeaders(appId))
        .expect('Content-Type', /json/)
        .expect(200)

      expect(Object.keys(res.body).length).not.toEqual(0)
      TRIGGER_DEFINITIONS = res.body
    })

    it("returns a list of definitions for actions", async () => {
      const res = await request
        .get(`/api/automations/logic/list`)
        .set(defaultHeaders(appId))
        .expect('Content-Type', /json/)
        .expect(200)

      expect(Object.keys(res.body).length).not.toEqual(0)
      LOGIC_DEFINITIONS = res.body
    })

    it("returns all of the definitions in one", async () => {
      const res = await request
        .get(`/api/automations/definitions/list`)
        .set(defaultHeaders(appId))
        .expect('Content-Type', /json/)
        .expect(200)

      expect(Object.keys(res.body.action).length).toEqual(Object.keys(ACTION_DEFINITIONS).length)
      expect(Object.keys(res.body.trigger).length).toEqual(Object.keys(TRIGGER_DEFINITIONS).length)
      expect(Object.keys(res.body.logic).length).toEqual(Object.keys(LOGIC_DEFINITIONS).length)
    })
  })

  describe("create", () => {
    it("should setup the automation fully", () => {
      let trigger = TRIGGER_DEFINITIONS["ROW_SAVED"]
      trigger.id = "wadiawdo34"
      let createAction = ACTION_DEFINITIONS["CREATE_ROW"]
      createAction.inputs.row = {
        name: "{{trigger.row.name}}",
        description: "{{trigger.row.description}}"
      }
      createAction.id = "awde444wk"

      TEST_AUTOMATION.definition.steps.push(createAction)
      TEST_AUTOMATION.definition.trigger = trigger
    })

    it("returns a success message when the automation is successfully created", async () => {
      const res = await request
        .post(`/api/automations`)
        .set(defaultHeaders(appId))
        .send(TEST_AUTOMATION)
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.body.message).toEqual("Automation created successfully")
      expect(res.body.automation.name).toEqual("My Automation")
      expect(res.body.automation._id).not.toEqual(null)
      automationId = res.body.automation._id
    })

    it("should apply authorization to endpoint", async () => {
      await builderEndpointShouldBlockNormalUsers({
        request,
        method: "POST",
        url: `/api/automations`,
        appId: appId,
        body: TEST_AUTOMATION
      })
    })
  })

  describe("trigger", () => {
    it("trigger the automation successfully", async () => {
      let table = await createTable(request, appId)
      TEST_AUTOMATION.definition.trigger.inputs.tableId = table._id
      TEST_AUTOMATION.definition.steps[0].inputs.row.tableId = table._id
      await createAutomation()
      await delay(500)
      const res = await triggerWorkflow(automation._id)
      // this looks a bit mad but we don't actually have a way to wait for a response from the automation to
      // know that it has finished all of its actions - this is currently the best way
      // also when this runs in CI it is very temper-mental so for now trying to make run stable by repeating until it works
      // TODO: update when workflow logs are a thing
      for (let tries = 0; tries < MAX_RETRIES; tries++) {
        expect(res.body.message).toEqual(`Automation ${automation._id} has been triggered.`)
        expect(res.body.automation.name).toEqual(TEST_AUTOMATION.name)
        await delay(500)
        let elements = await getAllFromTable(request, appId, table._id)
        // don't test it unless there are values to test
        if (elements.length > 1) {
          expect(elements.length).toEqual(5)
          expect(elements[0].name).toEqual("Test")
          expect(elements[0].description).toEqual("TEST")
          return
        }
      }
      throw "Failed to find the rows"
    })
  })

  describe("update", () => {
    it("updates a automations data", async () => {
      await createAutomation()
      automation._id = automation.id
      automation._rev = automation.rev
      automation.name = "Updated Name"
      automation.type = "automation"

      const res = await request
        .put(`/api/automations`)
        .set(defaultHeaders(appId))
        .send(automation)
        .expect('Content-Type', /json/)
        .expect(200)

        expect(res.body.message).toEqual(`Automation ${AUTOMATION_ID} updated successfully.`)
        expect(res.body.automation.name).toEqual("Updated Name")
    })
  })

  describe("fetch", () => {
    it("return all the automations for an instance", async () => {
      await createAutomation()
      const res = await request
        .get(`/api/automations`)
        .set(defaultHeaders(appId))
        .expect('Content-Type', /json/)
        .expect(200)

        expect(res.body[0]).toEqual(expect.objectContaining(TEST_AUTOMATION))
    })

    it("should apply authorization to endpoint", async () => {
      await builderEndpointShouldBlockNormalUsers({
        request,
        method: "GET",
        url: `/api/automations`,
        appId: appId,
      })
    })
  })

  describe("destroy", () => {
    it("deletes a automation by its ID", async () => {
      await createAutomation()
      const res = await request
        .delete(`/api/automations/${automation.id}/${automation.rev}`)
        .set(defaultHeaders(appId))
        .expect('Content-Type', /json/)
        .expect(200)

        expect(res.body.id).toEqual(TEST_AUTOMATION._id)
    })

    it("should apply authorization to endpoint", async () => {
      await createAutomation()
      await builderEndpointShouldBlockNormalUsers({
        request,
        method: "DELETE",
        url: `/api/automations/${automation.id}/${automation._rev}`,
        appId: appId,
      })
    })
  })
})
