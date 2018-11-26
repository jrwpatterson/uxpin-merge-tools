module.exports = {
  "moduleFileExtensions": [
    "js",
    "ts",
    "json",
  ],
  "modulePathIgnorePatterns": [
    "/node_modules/",
  ],
  "transform": {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  "testMatch": [
    "**/test/**/*.test.ts",
    "**/__tests__/*.test.ts",
  ],
  "testPathIgnorePatterns": [
    "<rootDir>/test/resources/",
  ],
  "testEnvironment": "node",
};
