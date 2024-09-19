/** @type {import('ts-jest').JestConfigWithTsJest} **/

module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
  globalSetup: "./jest.global-setup.js",
  globalTeardown: "./jest.global-teardown.js",
};
