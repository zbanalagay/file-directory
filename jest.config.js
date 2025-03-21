module.exports = {
    preset: 'ts-jest', // Use ts-jest to run TypeScript files directly
    testEnvironment: 'jest-environment-jsdom', // Simulate a browser environment
    setupFilesAfterEnv: ['@testing-library/jest-dom'],
    moduleFileExtensions: ['ts', 'js', 'json'], // Allow both TypeScript and JavaScript files
    transform: {
      '^.+\\.ts$': 'ts-jest', // Transform TypeScript files using ts-jest
    },
    moduleNameMapper: {
      '^(\\.{1,2}/.*)\\.js$': '$1', // Map .js imports to .ts files in tests
    },
    roots: ['<rootDir>/src'], // Only run tests in `src/`
  };
