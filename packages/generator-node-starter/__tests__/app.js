"use strict";
const path = require("node:path");
const assert = require("yeoman-assert");
const helpers = require("yeoman-test");

describe("@lwz/generator-node-starter", () => {
  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, "../app"))
      .withPrompts({ someAnswer: true });
  });

  it("creates files", () => {
    assert.file(["tsconfig.json"]);
  });
});
