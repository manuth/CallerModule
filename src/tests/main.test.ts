import * as assert from "assert";
import * as callerModule from "..";

describe("CallerModule", () =>
{
  it("Determining the caller of `testCallerModule`... (exceptiong `mocha`)", function testCallerModule()
  {
    assert.strictEqual(callerModule.GetCallerModule(testCallerModule).name, "mocha");
  });
  it ("Determining the caller of the current context... (excepting `caller-module`)", () =>
  {
    assert.strictEqual(callerModule.GetCallerModule().name, "caller-module");
  });
});