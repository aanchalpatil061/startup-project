module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Reanimated v4 uses react-native-worklets/plugin (replaces react-native-reanimated/plugin)
      'react-native-worklets/plugin',
    ],
  };
};
