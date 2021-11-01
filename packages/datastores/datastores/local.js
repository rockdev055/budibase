const { promisify } = require("util")
const fs = require("fs")
const { join } = require("path")

const readFile = promisify(fs.readFile)
const writeFile = (path, content, overwrite) =>
  promisify(fs.writeFile)(path, content, {
    encoding: "utf8",
    flag: overwrite ? "w" : "wx",
  })
const access = promisify(fs.access)
const mkdir = promisify(fs.mkdir)
const rmdir = promisify(fs.rmdir)
const unlink = promisify(fs.unlink)
const readdir = promisify(fs.readdir)
const rename = promisify(fs.rename)
const stat = promisify(fs.stat)

const updateFile = root => async (path, file) =>
  await writeFile(join(root, path), file, true)

const createFile = root => async (path, file) =>
  await writeFile(join(root, path), file, false)

const loadFile = root => async path => await readFile(join(root, path), "utf8")

const exists = root => async path => {
  try {
    await access(join(root, path))
  } catch (e) {
    return false
  }
  return true
}

const createFolder = root => async path => await mkdir(join(root, path))

const deleteFile = root => async path => await unlink(join(root, path))

module.exports.deleteFile = deleteFile

const deleteFolder = root => async path => await rmdir(join(root, path))

const readableFileStream = root => async path =>
  fs.createReadStream(join(root, path))

const writableFileStream = root => path =>
  new Promise((resolve, reject) => {
    const stream = fs.createWriteStream(join(root, path), "utf8")
    stream.on("open", () => resolve(stream))
    stream.on("error", reject)
  })

const getFolderContents = root => async path => await readdir(join(root, path))

const renameFile = root => async (oldPath, newPath) =>
  await rename(join(root, oldPath), join(root, newPath))

const getFileSize = root => async path => (await stat(join(root, path))).size

const datastoreFolder = (applicationId, instanceId) =>
  applicationId === "master" ? "master" : `app.${applicationId}.${instanceId}`

const createEmptyDb = rootConfig => async (applicationId, instanceId) => {
  const folder = datastoreFolder(applicationId, instanceId)
  const dbRootConfig = getDbRootConfig(rootConfig, applicationId, instanceId)
  await createFolder(dbRootConfig)(folder)
  return folder
}

const getDatastoreConfig = rootConfig => (applicationId, instanceId) =>
  join(rootConfig.rootPath, datastoreFolder(applicationId, instanceId))

const getMasterDbRootConfig = rootConfig => () => rootConfig.rootPath
const getInstanceDbRootConfig = rootConfig => (applicationId, instanceId) =>
  rootConfig.rootPath
const getDbRootConfig = (rootConfig, applicationId, instanceId) =>
  applicationId === "master"
    ? getMasterDbRootConfig(rootConfig)()
    : getInstanceDbRootConfig(rootConfig)(applicationId, instanceId)

module.exports.databaseManager = rootConfig => ({
  createEmptyDb: createEmptyDb(rootConfig),
  getDatastoreConfig: getDatastoreConfig(rootConfig),
  getMasterDbRootConfig: getMasterDbRootConfig(rootConfig),
  getInstanceDbRootConfig: getInstanceDbRootConfig(rootConfig),
})

module.exports.getDatastore = rootFolderPath => ({
  createFile: createFile(rootFolderPath),
  updateFile: updateFile(rootFolderPath),
  loadFile: loadFile(rootFolderPath),
  exists: exists(rootFolderPath),
  deleteFile: deleteFile(rootFolderPath),
  createFolder: createFolder(rootFolderPath),
  deleteFolder: deleteFolder(rootFolderPath),
  readableFileStream: readableFileStream(rootFolderPath),
  writableFileStream: writableFileStream(rootFolderPath),
  renameFile: renameFile(rootFolderPath),
  getFolderContents: getFolderContents(rootFolderPath),
  getFileSize: getFileSize(rootFolderPath),
  createEmptyDb: createEmptyDb(rootFolderPath),
  datastoreType: "local",
  datastoreDescription: rootFolderPath,
})

module.exports.configParameters = {
  rootPath: "Root Data Folder",
}
