module.exports = {
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  testEnvironment: 'node',  // Set test environment to node
  globals: {
    'jest': {
      // Enable Node's ESM support
      esm: true,
    },
  },
};
