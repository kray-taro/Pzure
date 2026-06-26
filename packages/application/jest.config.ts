export default {
  displayName: 'application',
  preset: '../../jest.preset.js',
  rootDir: '.',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { useESM: true, tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleNameMapper: {
    '^@pzure/domain$': '<rootDir>/../domain/src/index.ts',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};
