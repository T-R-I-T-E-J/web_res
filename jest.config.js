module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
    collectCoverageFrom: ['src/**/*.ts'],
    coveragePathIgnorePatterns: ['/node_modules/'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    verbose: true,
    testTimeout: 10000
};
