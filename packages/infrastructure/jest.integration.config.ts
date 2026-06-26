export default {
  displayName: 'infrastructure-integration',
  preset: '../../jest.preset.js',
  rootDir: '.',
  testEnvironment: 'node',
  testMatch: ['**/*.integration.spec.ts'],
  moduleNameMapper: {
    '^@pzure/application$': '<rootDir>/../application/src/index.ts',
    '^@pzure/domain$': '<rootDir>/../domain/src/index.ts',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};
