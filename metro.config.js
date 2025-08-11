// // Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

// /** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// module.exports = config;


// metro.config.js
const {
  wrapWithAudioAPIMetroConfig,
} = require('react-native-audio-api/metro-config');

// const config = {
  // Your existing Metro configuration options
// };

module.exports = wrapWithAudioAPIMetroConfig(config);