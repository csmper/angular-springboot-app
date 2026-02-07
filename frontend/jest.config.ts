import { createCjsPreset } from 'jest-preset-angular/presets/index.js';
import type { Config } from 'jest';

const config: Config = {
  ...createCjsPreset(),
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testEnvironment: 'jsdom',
  
  // --- Add Coverage Settings Here ---
  collectCoverage: true,
  coverageDirectory: 'coverage', // Where the report will be saved
  coverageReporters: ['html', 'text-summary'], // Generates HTML and a terminal summary
  collectCoverageFrom: [
    'src/app/**/*.ts', // Only include app source files
    '!src/app/**/*.spec.ts', // Exclude test files
    '!src/app/main.ts',
  ],
  // ----------------------------------

  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  moduleNameMapper: {
    '^jest-preset-angular/setup-env/(.*)$': '<rootDir>/node_modules/jest-preset-angular/setup-env/$1',
  },
};

export default config;