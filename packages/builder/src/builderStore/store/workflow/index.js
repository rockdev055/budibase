import { writable } from "svelte/store"
import api from "../../api"
import Workflow from "./Workflow"

const workflowActions = store => ({
  fetch: async () => {
    const WORKFLOWS_URL = `/api/workflows`
    const workflowResponse = await api.get(WORKFLOWS_URL)
    const json = await workflowResponse.json()
    store.update(state => {
      state.workflows = json
      return state
    })
  },
  create: async ({ name }) => {
    const workflow = {
      name,
      definition: {
        steps: [],
      },
    }
    const CREATE_WORKFLOW_URL = `/api/workflows`
    const response = await api.post(CREATE_WORKFLOW_URL, workflow)
    const json = await response.json()
    store.update(state => {
      state.workflows = state.workflows.concat(json.workflow)
      state.currentWorkflow = new Workflow(json.workflow)
      return state
    })
  },
  save: async ({ workflow }) => {
    const UPDATE_WORKFLOW_URL = `/api/workflows`
    const response = await api.put(UPDATE_WORKFLOW_URL, workflow)
    const json = await response.json()
    store.update(state => {
      const existingIdx = state.workflows.findIndex(
        existing => existing._id === workflow._id
      )
      state.workflows.splice(existingIdx, 1, json.workflow)
      state.workflows = state.workflows
      state.currentWorkflow = new Workflow(json.workflow)
      return state
    })
  },
  update: async ({ workflow }) => {
    const UPDATE_WORKFLOW_URL = `/api/workflows`
    const response = await api.put(UPDATE_WORKFLOW_URL, workflow)
    const json = await response.json()
    store.update(state => {
      const existingIdx = state.workflows.findIndex(
        existing => existing._id === workflow._id
      )
      state.workflows.splice(existingIdx, 1, json.workflow)
      state.workflows = state.workflows
      return state
    })
  },
  delete: async ({ workflow }) => {
    const { _id, _rev } = workflow
    const DELETE_WORKFLOW_URL = `/api/workflows/${_id}/${_rev}`
    await api.delete(DELETE_WORKFLOW_URL)

    store.update(state => {
      const existingIdx = state.workflows.findIndex(
        existing => existing._id === _id
      )
      state.workflows.splice(existingIdx, 1)
      state.workflows = state.workflows
      state.currentWorkflow = null
      return state
    })
  },
  select: workflow => {
    store.update(state => {
      state.currentWorkflow = new Workflow(workflow)
      state.selectedWorkflowBlock = null
      return state
    })
  },
  addBlockToWorkflow: block => {
    store.update(state => {
      state.currentWorkflow.addBlock(block)
      state.selectedWorkflowBlock = block
      return state
    })
  },
  deleteWorkflowBlock: block => {
    store.update(state => {
      state.currentWorkflow.deleteBlock(block.id)
      state.selectedWorkflowBlock = null
      return state
    })
  },
})

export const getWorkflowStore = () => {
  const INITIAL_WORKFLOW_STATE = {
    workflows: [],
  }

  const store = writable(INITIAL_WORKFLOW_STATE)

  store.actions = workflowActions(store)

  return store
}
