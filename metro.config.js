const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const {
    wrapWithReanimatedMetroConfig,
  } = require('react-native-reanimated/metro-config');
/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */

const config = mergeConfig(
    getDefaultConfig(__dirname),
    {} // your custom settings can go here later
  );
  
  // Wrap with Reanimated config (REQUIRED)
  module.exports = wrapWithReanimatedMetroConfig(config);
