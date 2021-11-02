const Router = require("@koa/router")
const controller = require("../controllers/static")
const { budibaseTempDir } = require("../../utilities/budibaseDir")
const env = require("../../environment")

const router = Router()

router.param("file", async (file, ctx, next) => {
  ctx.file = file && file.includes(".") ? file : "index.html"

  // Serving the client library from your local dir in dev
  if (ctx.isDev && ctx.file.startsWith("budibase-client")) {
    ctx.devPath = budibaseTempDir()
  }

  await next()
})

if (env.NODE_ENV !== "production") {
  router.get("/_builder/:file*", controller.serveBuilder)
}

router
  .get("/componentlibrary", controller.serveComponentLibrary)
  .get("/assets/:file*", controller.serveAppAsset)
  .get("/:appId/:path*", controller.serveApp)

module.exports = router
