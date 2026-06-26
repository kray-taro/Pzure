export default {
  displayName: 'application',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: { '^.+\\.ts$': ['ts-jest', { useESM: true }] },
};
