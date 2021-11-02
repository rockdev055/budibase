const CouchDB = require("../../db")
const { resolve, join } = require("../../utilities/centralPath")
const {
  budibaseTempDir,
  budibaseAppsDir,
} = require("../../utilities/budibaseDir")

exports.fetchAppComponentDefinitions = async function(ctx) {
  const appId = ctx.params.appId || ctx.appId
  const db = new CouchDB(appId)
  const app = await db.get(appId)

  ctx.body = app.componentLibraries.reduce((acc, componentLibrary) => {
    let appDirectory = resolve(budibaseAppsDir(), appId, "node_modules")

    if (ctx.isDev) {
      appDirectory = budibaseTempDir()
    }

    const componentJson = require(join(
      appDirectory,
      componentLibrary,
      ctx.isDev ? "" : "package",
      "manifest.json"
    ))

    const result = {}

    // map over the components.json and add the library identifier as a key
    // button -> @budibase/standard-components/button
    for (let key of Object.keys(componentJson)) {
      const fullComponentName = `${componentLibrary}/${key}`.toLowerCase()
      result[fullComponentName] = {
        component: fullComponentName,
        ...componentJson[key],
      }
    }

    return {
      ...acc,
      ...result,
    }
  }, {})
}
