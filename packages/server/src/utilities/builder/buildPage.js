const { appPackageFolder } = require("../createAppPackage")
const {
  constants,
  copyFile,
  writeFile,
  readFile,
  writeJSON,
} = require("fs-extra")
const { join, resolve } = require("path")
const sqrl = require("squirrelly")
const { convertCssToFiles } = require("./convertCssToFiles")
const publicPath = require("./publicPath")
const deleteCodeMeta = require("./deleteCodeMeta")

module.exports = async (config, appId, pageName, pkg) => {
  const appPath = appPackageFolder(config, appId)

  pkg.screens = pkg.screens || []

  await convertCssToFiles(publicPath(appPath, pageName), pkg)

  await buildIndexHtml(config, appId, pageName, appPath, pkg)

  await buildFrontendAppDefinition(config, appId, pageName, pkg, appPath)

  await copyClientLib(appPath, pageName)

  await savePageJson(appPath, pageName, pkg)
}

const rootPath = (config, appname) =>
  config.useAppRootPath ? `/${appname}` : ""

const copyClientLib = async (appPath, pageName) => {
  const sourcepath = require.resolve("@budibase/client")
  const destPath = join(publicPath(appPath, pageName), "budibase-client.js")

  await copyFile(sourcepath, destPath, constants.COPYFILE_FICLONE)

  await copyFile(
    sourcepath + ".map",
    destPath + ".map",
    constants.COPYFILE_FICLONE
  )
}

const buildIndexHtml = async (config, appId, pageName, appPath, pkg) => {
  const appPublicPath = publicPath(appPath, pageName)
  const appRootPath = appId

  const stylesheetUrl = s =>
    s.startsWith("http") ? s : `/${rootPath(config, appId)}/${s}`

  const templateObj = {
    title: pkg.page.title || "Budibase App",
    favicon: `${appRootPath}/${pkg.page.favicon || "/_shared/favicon.png"}`,
    stylesheets: (pkg.page.stylesheets || []).map(stylesheetUrl),
    screenStyles: pkg.screens.filter(s => s._css).map(s => s._css),
    pageStyle: pkg.page._css,
    appRootPath,
  }

  const indexHtmlTemplate = await readFile(
    resolve(__dirname, "index.template.html"),
    "utf8"
  )

  const indexHtmlPath = join(appPublicPath, "index.html")

  const indexHtml = sqrl.Render(indexHtmlTemplate, templateObj)

  await writeFile(indexHtmlPath, indexHtml, { flag: "w+" })
}

const buildFrontendAppDefinition = async (config, appId, pageName, pkg) => {
  const appPath = appPackageFolder(config, appId)
  const appPublicPath = publicPath(appPath, pageName)
  const appRootPath = rootPath(config, appId)

  const filename = join(appPublicPath, "clientFrontendDefinition.js")

  if (pkg.page._css) {
    delete pkg.page._css
  }

  for (let screen of pkg.screens) {
    if (screen._css) {
      delete pkg.page._css
    }
  }

  const clientUiDefinition = JSON.stringify({
    appRootPath: appRootPath,
    page: pkg.page,
    screens: pkg.screens,
    libraries: [
      "@budibase/materialdesign-components",
      "@budibase/standard-components",
    ],
  })

  await writeFile(
    filename,
    `
     window['##BUDIBASE_FRONTEND_DEFINITION##'] = ${clientUiDefinition};
     window['##BUDIBASE_FRONTEND_FUNCTIONS##'] = ${pkg.uiFunctions};
    `
  )
}

const savePageJson = async (appPath, pageName, pkg) => {
  const pageFile = join(appPath, "pages", pageName, "page.json")

  if (pkg.page._css) {
    delete pkg.page._css
  }

  if (pkg.page.name) {
    delete pkg.page.name
  }

  if (pkg.page._screens) {
    delete pkg.page._screens
  }

  deleteCodeMeta(pkg.page.props)

  await writeJSON(pageFile, pkg.page, {
    spaces: 2,
  })
}
