const { appPackageFolder, appsFolder } = require("../createAppPackage")
const {
  readJSON,
  writeJSON,
  readdir,
  stat,
  ensureDir,
  rename,
  unlink,
  rmdir,
} = require("fs-extra")
const { join, dirname } = require("path")
const { $ } = require("@budibase/core").common
const { keyBy, intersection, map, values, flatten } = require("lodash/fp")
const { merge } = require("lodash")

const { componentLibraryInfo } = require("./componentLibraryInfo")
const savePagePackage = require("./savePagePackage")
const buildPage = require("./buildPage")

module.exports.savePagePackage = savePagePackage

const getAppDefinition = async appPath =>
  await readJSON(`${appPath}/appDefinition.json`)

module.exports.getPackageForBuilder = async (config, appname) => {
  const appPath = appPackageFolder(config, appname)

  const pages = await getPages(appPath)

  return {
    appDefinition: await getAppDefinition(appPath),

    accessLevels: await readJSON(`${appPath}/access_levels.json`),

    pages,

    components: await getComponents(appPath, pages),
  }
}

module.exports.getApps = async (config, master) => {
  const dirs = await readdir(appsFolder(config))

  return $(master.listApplications(), [map(a => a.name), intersection(dirs)])
}

const getPages = async appPath => {
  const pages = {}

  const pageFolders = await readdir(join(appPath, "pages"))
  for (let pageFolder of pageFolders) {
    try {
      pages[pageFolder] = await readJSON(
        join(appPath, "pages", pageFolder, "page.json")
      )
    } catch (_) {
      // ignore error
    }
  }

  return pages
}

const screenPath = (appPath, pageName, name) =>
  join(appPath, "pages", pageName, "screens", name + ".json")

module.exports.listScreens = async (config, appname, pagename) => {
  const appPath = appPackageFolder(config, appname)
  return keyBy("name")(await fetchscreens(appPath, pagename))
}

module.exports.saveScreen = async (config, appname, pagename, screen) => {
  const appPath = appPackageFolder(config, appname)
  const compPath = screenPath(appPath, pagename, screen.name)
  await ensureDir(dirname(compPath))
  if (screen._css) {
    delete screen._css
  }
  await writeJSON(compPath, screen, {
    encoding: "utf8",
    flag: "w",
    spaces: 2,
  })
}

module.exports.renameScreen = async (
  config,
  appname,
  pagename,
  oldName,
  newName
) => {
  const appPath = appPackageFolder(config, appname)

  const oldComponentPath = screenPath(appPath, pagename, oldName)

  const newComponentPath = screenPath(appPath, pagename, newName)

  await ensureDir(dirname(newComponentPath))
  await rename(oldComponentPath, newComponentPath)
}

module.exports.deleteScreen = async (config, appname, pagename, name) => {
  const appPath = appPackageFolder(config, appname)
  const componentFile = screenPath(appPath, pagename, name)
  await unlink(componentFile)

  const dir = dirname(componentFile)
  if ((await readdir(dir)).length === 0) {
    await rmdir(dir)
  }
}

module.exports.savePage = async (config, appname, pagename, page) => {
  const appPath = appPackageFolder(config, appname)
  const pageDir = join(appPath, "pages", pagename)

  await ensureDir(pageDir)
  await writeJSON(join(pageDir, "page.json"), page, {
    encoding: "utf8",
    flag: "w",
    space: 2,
  })
  const appDefinition = await getAppDefinition(appPath)
  await buildPage(config, appname, appDefinition, pagename, page)
}

module.exports.componentLibraryInfo = async (config, appname, lib) => {
  const appPath = appPackageFolder(config, appname)
  return await componentLibraryInfo(appPath, lib)
}

const getComponents = async (appPath, pages, lib) => {
  let libs
  if (!lib) {
    pages = pages || (await getPages(appPath))

    if (!pages) return []

    libs = $(pages, [values, map(p => p.componentLibraries), flatten])
  } else {
    libs = [lib]
  }

  const components = {}
  const generators = {}

  for (let l of libs) {
    const info = await componentLibraryInfo(appPath, l)
    merge(components, info.components)
    merge(generators, info.generators)
  }

  if (components._lib) delete components._lib
  if (components._generators) delete components._generators

  return { components, generators }
}

const fetchscreens = async (appPath, pagename, relativePath = "") => {
  const currentDir = join(appPath, "pages", pagename, "screens", relativePath)

  const contents = await readdir(currentDir)

  const screens = []

  for (let item of contents) {
    const itemRelativePath = join(relativePath, item)
    const itemFullPath = join(currentDir, item)
    const stats = await stat(itemFullPath)

    if (stats.isFile()) {
      if (!item.endsWith(".json")) continue

      const component = await readJSON(itemFullPath)

      component.name = itemRelativePath
        .substring(0, itemRelativePath.length - 5)
        .replace(/\\/g, "/")

      component.props = component.props || {}

      screens.push(component)
    } else {
      const childComponents = await fetchscreens(
        appPath,
        join(relativePath, item)
      )

      for (let c of childComponents) {
        screens.push(c)
      }
    }
  }

  return screens
}

module.exports.getComponents = getComponents
