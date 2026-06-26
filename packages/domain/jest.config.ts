export default {
  displayName: 'domain',
  preset: '../../jest.preset.js',
  rootDir: '.',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { useESM: true, tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
};
