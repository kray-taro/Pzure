export default {
  displayName: 'application',
  preset: '../../jest.preset.js',
  rootDir: '.',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@pzure/domain$': '<rootDir>/../domain/src/index.ts',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};
