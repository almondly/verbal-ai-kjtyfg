
const { getDefaultConfig } = require('expo/metro-config');
const { FileStore } = require('metro-cache');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Enable package exports for Expo SDK 53 - CRITICAL for autolinking
config.resolver.unstable_enablePackageExports = true;

// Ensure proper resolution of expo internal modules
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Let Metro handle expo internal modules with package exports
  if (moduleName.startsWith('expo/')) {
    return context.resolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

// Use turborepo to restore the cache when possible
config.cacheStores = [
  new FileStore({ root: path.join(__dirname, 'node_modules', '.cache', 'metro') }),
];

module.exports = config;
