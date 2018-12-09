import * as assert from "assert";
import * as callerModule from "..";

suite("CallerModule", () =>
{
    test(
        "Determining the caller of `testCallerModule`…",
        function testCallerModule()
        {
            assert.strictEqual(callerModule.GetCallerModule(testCallerModule).name, "mocha");
        });

    test(
        "Determining the caller of the current context…",
        () =>
        {
            assert.strictEqual(callerModule.GetCallerModule().name, "caller-module");
        });
});