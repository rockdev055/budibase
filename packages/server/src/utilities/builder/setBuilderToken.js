const { BUILTIN_ROLE_IDS } = require("../security/roles")
const env = require("../../environment")
const CouchDB = require("../../db")
const jwt = require("jsonwebtoken")
const { DocumentTypes, SEPARATOR } = require("../../db/utils")
const { setCookie } = require("../index")
const APP_PREFIX = DocumentTypes.APP + SEPARATOR

module.exports = async (ctx, appId, version) => {
  const builderUser = {
    userId: "BUILDER",
    roleId: BUILTIN_ROLE_IDS.BUILDER,
    version,
  }
  if (env.BUDIBASE_API_KEY) {
    builderUser.apiKey = env.BUDIBASE_API_KEY
  }
  const token = jwt.sign(builderUser, ctx.config.jwtSecret, {
    expiresIn: "30 days",
  })

  // set the builder token
  setCookie(ctx, "builder", token)
  setCookie(ctx, "currentapp", appId)
  // need to clear all app tokens or else unable to use the app in the builder
  let allDbNames = await CouchDB.allDbs()
  allDbNames.map(dbName => {
    if (dbName.startsWith(APP_PREFIX)) {
      setCookie(ctx, dbName, "")
    }
  })
}
