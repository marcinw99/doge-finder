// eslint-disable-next-line functional/immutable-data
module.exports = {
  clearMocks: true,

  collectCoverage: true,

  coverageDirectory: 'coverage',

  coverageProvider: 'v8',

  preset: 'ts-jest/presets/default-esm',

  testEnvironment: 'jest-environment-jsdom',
};
