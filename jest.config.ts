import type {Config} from '@jest/types';
const config: Config.InitialOptions = {
    preset: "ts-jest",
    verbose: true,
    roots: [
        "<rootDir>/src"
    ],
    testEnvironment: "node",
    collectCoverage: true,
    collectCoverageFrom: [
        "src/**/*.ts",
        "!src/**/*.d.ts"
    ],
    coverageThreshold: {
      global: {
          lines: 90,
          statements: 90
      }
    },
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
};

export default config;
