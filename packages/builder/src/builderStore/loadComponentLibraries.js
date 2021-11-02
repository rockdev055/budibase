import { get } from "builderStore/api"

/**
 * Fetches the definitions for component library components. This includes
 * their props and other metadata from components.json.
 * @param {string} appId - ID of the currently running app
 */
export const fetchComponentLibDefinitions = async appId => {
  const LIB_DEFINITION_URL = `/${appId}/components/definitions`
  try {
    const libDefinitionResponse = await get(LIB_DEFINITION_URL)
    return await libDefinitionResponse.json()
  } catch (err) {
    console.error(`Error fetching component definitions for ${appId}`, err)
  }
}

/**
 * Loads the JavaScript files for app component libraries and returns a map of their modules.
 * @param {object} application - package definition
 */
export const fetchComponentLibModules = async application => {
  const allLibraries = {}
  for (let libraryName of application.componentLibraries) {
    const LIBRARY_URL = `/${application._id}/componentlibrary?library=${libraryName}`
    allLibraries[libraryName] = await import(LIBRARY_URL)
  }
  return allLibraries
}
