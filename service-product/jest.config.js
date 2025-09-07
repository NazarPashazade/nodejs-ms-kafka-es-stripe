"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    preset: "ts-jest",
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: "coverage",
    coveragePathIgnorePatterns: ["/node_modules/", "/dist/"],
    moduleDirectories: ["node_modules", "src"],
    coverageProvider: "v8",
};
exports.default = config;
//# sourceMappingURL=jest.config.js.map