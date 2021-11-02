const { existsSync, readFile, writeFile, ensureDir } = require("fs-extra")
const { join, resolve } = require("./centralPath")
const Sqrl = require("squirrelly")
const uuid = require("uuid")

module.exports = async opts => {
  await ensureDir(opts.dir)
  await setCouchDbUrl(opts)

  // need an env file to create the client database
  await createDevEnvFile(opts)
  await createClientDatabase(opts)

  // need to recreate the env file, as we only now have a client id
  // quiet flag will force overwrite of config
  opts.quiet = true
  await createDevEnvFile(opts)
}

const setCouchDbUrl = async opts => {
  if (!opts.couchDbUrl) {
    const dataDir = join(opts.dir, ".data")
    await ensureDir(dataDir)
    opts.couchDbUrl =
      dataDir + (dataDir.endsWith("/") || dataDir.endsWith("\\") ? "" : "/")
  }
}

const createDevEnvFile = async opts => {
  const destConfigFile = join(opts.dir, "./.env")
  let createConfig = !existsSync(destConfigFile) || opts.quiet
  if (createConfig) {
    const template = await readFile(
      resolve(__dirname, "..", "..", ".env.template"),
      {
        encoding: "utf8",
      }
    )
    opts.cookieKey1 = opts.cookieKey1 || uuid.v4()
    const config = Sqrl.Render(template, opts)
    await writeFile(destConfigFile, config, { flag: "w+" })
  }
}

const createClientDatabase = async opts => {
  // cannot be a top level require as it
  // will cause environment module to be loaded prematurely
  const clientDb = require("../db/clientDb")

  if (!opts.clientId || opts.clientId === "new") {
    opts.clientId = uuid.v4()
  }

  await clientDb.create(opts.clientId)
}
