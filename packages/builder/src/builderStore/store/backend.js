import { writable } from "svelte/store"
import { cloneDeep } from "lodash/fp"
import api from "../api"

const INITIAL_BACKEND_UI_STATE = {
  models: [],
  views: [],
  users: [],
  selectedDatabase: {},
  selectedModel: {},
  draftModel: {},
}

export const getBackendUiStore = () => {
  const store = writable({ ...INITIAL_BACKEND_UI_STATE })

  store.actions = {
    reset: () => store.set({ ...INITIAL_BACKEND_UI_STATE }),
    database: {
      select: async db => {
        const modelsResponse = await api.get(`/api/models`)
        const models = await modelsResponse.json()
        store.update(state => {
          state.selectedDatabase = db
          state.models = models
          return state
        })
      },
    },
    records: {
      save: () =>
        store.update(state => {
          state.selectedView = state.selectedView
          return state
        }),
      delete: () =>
        store.update(state => {
          state.selectedView = state.selectedView
          return state
        }),
      select: record =>
        store.update(state => {
          state.selectedRecord = record
          return state
        }),
    },
    models: {
      fetch: async () => {
        const modelsResponse = await api.get(`/api/models`)
        const models = await modelsResponse.json()
        store.update(state => {
          state.models = models
          return state
        })
      },
      select: model =>
        store.update(state => {
          state.selectedModel = model
          state.draftModel = cloneDeep(model)
          state.selectedView = { name: `all_${model._id}` }
          return state
        }),
      save: async model => {
        const updatedModel = cloneDeep(model)

        // update any renamed schema keys to reflect their names
        for (let key in updatedModel.schema) {
          const field = updatedModel.schema[key]
          // field has been renamed
          if (field.name && field.name !== key) {
            updatedModel.schema[field.name] = field
            updatedModel._rename = { old: key, updated: field.name }
            delete updatedModel.schema[key]
          }
        }

        const SAVE_MODEL_URL = `/api/models`
        const response = await api.post(SAVE_MODEL_URL, updatedModel)
        const savedModel = await response.json()
        await store.actions.models.fetch()
        store.actions.models.select(savedModel)
        return savedModel
      },
      delete: async model => {
        await api.delete(`/api/models/${model._id}/${model._rev}`)
        store.update(state => {
          state.models = state.models.filter(
            existing => existing._id !== model._id
          )
          state.selectedModel = state.models[0] || {}
          return state
        })
      },
      saveField: ({ originalName, field }) => {
        store.update(state => {
          // delete the original if renaming
          if (originalName) {
            delete state.draftModel.schema[originalName]
            state.draftModel._rename = {
              old: originalName,
              updated: field.name,
            }
          }

          state.draftModel.schema[field.name] = cloneDeep(field)

          store.actions.models.save(state.draftModel)
          return state
        })
      },
      deleteField: field => {
        store.update(state => {
          delete state.draftModel.schema[field.name]
          store.actions.models.save(state.draftModel)
          return state
        })
      },
    },
    views: {
      select: view =>
        store.update(state => {
          state.selectedView = view
          state.selectedModel = {}
          return state
        }),
      delete: async view => {
        await api.delete(`/api/views/${view}`)
        await store.actions.models.fetch()
      },
      save: async view => {
        const response = await api.post(`/api/views`, view)
        const json = await response.json()

        const viewMeta = {
          name: view.name,
          ...json,
        }

        store.update(state => {
          const viewModel = state.models.find(
            model => model._id === view.modelId
          )

          if (view.originalName) delete viewModel.views[view.originalName]
          viewModel.views[view.name] = viewMeta

          state.models = state.models
          state.selectedView = viewMeta
          return state
        })
      },
    },
    users: {
      create: user =>
        store.update(state => {
          state.users.push(user)
          state.users = state.users
          return state
        }),
    },
  }

  return store
}
