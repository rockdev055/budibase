const { resolve, join } = require("path")
const { homedir } = require("os")

module.exports.serverFileName = relativePath =>
  resolve(__dirname, "..", "node_modules", "@budibase", "server", relativePath)

// module.exports.getAppContext = async ({ configName, masterIsCreated }) => {
//   if (configName) {
//     if (!configName.endsWith(".js")) {
//       configName = `config.${configName}.js`
//     }
//   } else {
//     configName = "config.js"
//   }

//   const config = require(resolve(cwd(), configName))()
//   return await buildAppContext(config, masterIsCreated)
// }

module.exports.xPlatHomeDir = dir => dir.startsWith("~") ? join(homedir(), dir.substring(1)) : dir;
