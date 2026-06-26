export default {
  displayName: 'domain',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: { '^.+\\.ts$': ['ts-jest', { useESM: true }] },
};
