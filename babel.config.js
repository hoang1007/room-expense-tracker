module.exports = {
  presets: [
    ['module:metro-react-native-babel-preset', { allowDeclareFields: true }],
    ['@babel/preset-flow', { allowDeclareFields: true }]
  ],
  plugins: [
    'react-native-reanimated/plugin',
  ],
};
