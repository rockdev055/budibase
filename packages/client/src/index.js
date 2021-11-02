import { createApp } from "./createApp"
import { builtins, builtinLibName } from "./render/builtinComponents"
import { parseAppIdFromCookie } from "./render/getAppId"

/**
 * create a web application from static budibase definition files.
 * @param  {object} opts - configuration options for budibase client libary
 */
export const loadBudibase = async opts => {
  const _window = (opts && opts.window) || window
  // const _localStorage = (opts && opts.localStorage) || localStorage
  const appId = parseAppIdFromCookie(_window.document.cookie)
  const frontendDefinition = _window["##BUDIBASE_FRONTEND_DEFINITION##"]

  const user = {}

  const componentLibraryModules = (opts && opts.componentLibraries) || {}

  const libraries = frontendDefinition.libraries || []

  for (let library of libraries) {
    // fetch the JavaScript for the component libraries from the server
    componentLibraryModules[library] = await import(
      `/componentlibrary?library=${encodeURI(library)}`
    )
    // componentLibraryModules[library] = await import(`/assets/componentlibrary/${library}/dist/index.js`)
  }

  componentLibraryModules[builtinLibName] = builtins(_window)

  const {
    initialisePage,
    screenStore,
    pageStore,
    routeTo,
    rootNode,
  } = createApp({
    componentLibraries: componentLibraryModules,
    frontendDefinition,
    user,
    window: _window,
  })

  const route = _window.location
    ? _window.location.pathname.replace(`${appId}/`, "").replace(appId, "")
    : ""

  initialisePage(frontendDefinition.page, _window.document.body, route)

  return {
    screenStore,
    pageStore,
    routeTo,
    rootNode,
  }
}

if (window) {
  window.loadBudibase = loadBudibase
}
