import { writable } from "svelte/store"
import api from "../api"

export const getBackendUiStore = () => {
  const INITIAL_BACKEND_UI_STATE = {
    breadcrumbs: [],
    models: [],
    views: [],
    users: [],
    selectedDatabase: {},
    selectedModel: {},
  }

  const store = writable(INITIAL_BACKEND_UI_STATE)

  store.actions = {
    database: {
      select: async db => {
        const modelsResponse = await api.get(`/api/${db.id}/models`)
        const viewsResponse = await api.get(`/api/${db.id}/views`)
        const models = await modelsResponse.json()
        const views = await viewsResponse.json()
        store.update(state => {
          state.selectedDatabase = db
          state.breadcrumbs = [db.name]
          state.models = models
          state.views = views;
          return state
        })
      }
    },
    records: {
      delete: () =>
        store.update(state => {
          state.selectedView = state.selectedView
          return state
        }),
      view: record =>
        store.update(state => {
          state.breadcrumbs = [state.selectedDatabase.name, record.id]
          return state
        }),
      select: record =>
        store.update(state => {
          state.selectedRecord = record
          return state
        }),
    },
    models: {
      create: model => store.update(state => {
        state.models.push(model)
        state.models = state.models
        return state
      })
    },
    views: {
      select: view =>
        store.update(state => {
          state.selectedView = view
          return state
        }),
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

// Store Actions
export const createDatabaseForApp = store => appInstance => {
  store.update(state => {
    state.appInstances.push(appInstance)
    return state
  })
}

export const saveBackend = async state => {
  await api.post(`/_builder/api/${state.appname}/backend`, {
    appDefinition: {
      hierarchy: state.hierarchy,
      actions: state.actions,
      triggers: state.triggers,
    },
    accessLevels: state.accessLevels,
  })
}