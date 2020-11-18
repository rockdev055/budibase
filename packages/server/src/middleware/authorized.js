const { BUILTIN_LEVEL_IDS } = require("../utilities/security/accessLevels")
const {
  PermissionTypes,
  doesHavePermission,
} = require("../utilities/security/permissions")
const env = require("../environment")
const { apiKeyTable } = require("../db/dynamoClient")
const { AuthTypes } = require("../constants")

const ADMIN_ACCESS = [BUILTIN_LEVEL_IDS.ADMIN, BUILTIN_LEVEL_IDS.BUILDER]

const LOCAL_PASS = new RegExp(["webhooks/trigger", "webhooks/schema"].join("|"))

module.exports = (permType, permLevel = null) => async (ctx, next) => {
  // webhooks can pass locally
  if (!env.CLOUD && LOCAL_PASS.test(ctx.request.url)) {
    return next()
  }
  if (env.CLOUD && ctx.headers["x-api-key"] && ctx.headers["x-instanceid"]) {
    // api key header passed by external webhook
    const apiKeyInfo = await apiKeyTable.get({
      primary: ctx.headers["x-api-key"],
    })

    if (apiKeyInfo) {
      ctx.auth = {
        authenticated: AuthTypes.EXTERNAL,
        apiKey: ctx.headers["x-api-key"],
      }
      ctx.user = {
        appId: ctx.headers["x-instanceid"],
      }
      return next()
    }

    ctx.throw(403, "API key invalid")
  }

  // don't expose builder endpoints in the cloud
  if (env.CLOUD && permType === PermissionTypes.BUILDER) return

  if (!ctx.auth.authenticated) {
    ctx.throw(403, "Session not authenticated")
  }

  if (!ctx.user) {
    ctx.throw(403, "User not found")
  }

  const accessLevel = ctx.user.accessLevel
  const permissions = ctx.user.permissions
  if (ADMIN_ACCESS.indexOf(accessLevel._id) !== -1) {
    return next()
  }

  if (permType === PermissionTypes.BUILDER) {
    ctx.throw(403, "Not Authorized")
  }

  if (!doesHavePermission(permType, permLevel, permissions)) {
    ctx.throw(403, "User does not have permission")
  }

  return next()
}
