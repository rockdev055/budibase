const { resolve, join } = require("path");
const constructHierarchy = require("./constructHierarchy");
const { common } = require("budibase-core");
const { getRuntimePackageDirectory } = require("../utilities/runtimePackages");
const injectPlugins = require("./injectedPlugins");
const { cwd } = require("process"); 

const createAppPackage = (context, appPath) => {

    const appDefModule = require(
        join(appPath, "appDefinition.json"));

    const pluginsModule = require(
        join(appPath, "plugins.js"));

    const accessLevels = require(
        join(appPath, "access_levels.json")
    );
        
    return ({
        appDefinition: appDefModule,
        behaviourSources: pluginsModule(context),
        appPath,
        accessLevels
    })
}

const appPackageFolder = (config, appname) => 
    resolve(cwd(), config.latestPackagesFolder, appname);

module.exports.appPackageFolder = appPackageFolder;

module.exports.masterAppPackage = (context) => {
    const { config } = context;
    const standardPackage = createAppPackage(
        context, "../appPackages/master");

    const customizeMaster = config && config.customizeMaster 
                            ? config.customizeMaster
                            : a => a;

    const appDefinition = common.$(standardPackage.appDefinition, [
        customizeMaster,
        constructHierarchy
    ]);

    const plugins = standardPackage.behaviourSources;

    return ({
        appDefinition,
        behaviourSources: config && config.extraMasterPlugins
                          ? {...plugins, ...config.extraMasterPlugins}
                          : plugins,
        appPath: standardPackage.appPath
    });
}
    
module.exports.applictionVersionPackage = async (context, appname, versionId, instanceKey) => {
    const pkg = createAppPackage(
        context,
        join("..", getRuntimePackageDirectory(appname, versionId))
    );
    pkg.appDefinition = constructHierarchy(pkg.appDefinition);
    await injectPlugins(
        pkg,
        context.master,
        appname,
        instanceKey);
    return pkg;
}
