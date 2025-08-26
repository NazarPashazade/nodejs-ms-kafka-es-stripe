import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: ["/node_modules/", "/dist/"],
  moduleDirectories: ["node_modules", "src"],
  coverageProvider: "v8",
};

export default config;
