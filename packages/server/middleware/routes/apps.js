const Router = require("@koa/router");
const {
  getPackageForBuilder,
  getApps,
} = require("../../utilities/builder")


const router = Router();

router.get("/_builder/api/apps", async ctx => {
  ctx.body = await getApps(config, ctx.master)
  ctx.response.status = StatusCodes.OK
})

router.get("/_builder/api/:appname/appPackage", async ctx => {
  const application = await ctx.master.getApplicationWithInstances(
    ctx.params.appname
  )
  ctx.body = await getPackageForBuilder(config, application)
  ctx.response.status = StatusCodes.OK
})

router
  .post("/_builder/api/:appname/backend", async ctx => {
    await saveBackend(
      ctx.config,
      ctx.params.appname,
      ctx.request.body.appDefinition,
      ctx.request.body.accessLevels
    )
    ctx.master.deleteLatestPackageFromCache(ctx.params.appname)
    ctx.response.status = StatusCodes.OK
  })


module.exports = router