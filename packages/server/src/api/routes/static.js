const Router = require("@koa/router")
const controller = require("../controllers/static")
const { budibaseTempDir } = require("../../utilities/budibaseDir")
const env = require("../../environment")
const authorized = require("../../middleware/authorized")
const { BUILDER } = require("../../utilities/security/permissions")
const usage = require("../../middleware/usageQuota")
const joiValidator = require("../../middleware/joi-validator")
const Joi = require("joi")

function generateCssValidator() {
  return joiValidator.body(
    Joi.object({
      _id: Joi.string().required(),
      _rev: Joi.string().required(),
      props: Joi.object()
        .required()
        .unknown(true),
    })
      .required()
      .unknown(true)
  )
}

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
  .post(
    "/api/css/generate",
    authorized(BUILDER),
    generateCssValidator(),
    controller.generateCss
  )
  .post(
    "/api/attachments/process",
    authorized(BUILDER),
    controller.performLocalFileProcessing
  )
  .post("/api/attachments/upload", usage, controller.uploadFile)
  .get("/componentlibrary", controller.serveComponentLibrary)
  .get("/assets/:file*", controller.serveAppAsset)
  .get("/attachments/:file*", controller.serveAttachment)
  .get("/:appId/:path*", controller.serveApp)

module.exports = router
