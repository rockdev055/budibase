const StatusCodes = require("../../utilities/statusCodes")

module.exports = async ctx => {
  ctx.body = await ctx.instance.authApi.getAccessLevels()
  ctx.response.status = StatusCodes.OK
}
