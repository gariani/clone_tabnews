const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  moduleDirectories: ["node_modules", "<rootDir>"],

  // moduleNameMapper: {
  //   "^infra/(.*)$": "<rootDir>/infra/$1",
  //   "^models/(.*)$": "<rootDir>/models/$1",
  // },
};

module.exports = createJestConfig(customJestConfig);
