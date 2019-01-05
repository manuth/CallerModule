import Assert = require("assert");
import CallerModule = require("..");

suite("CallerModule", () =>
{
    test(
        "Determining the caller of `testCallerModule`…",
        function testCallerModule()
        {
            Assert.strictEqual(CallerModule.GetCallerModule(testCallerModule).name, "mocha");
        });

    test(
        "Determining the caller of the current context…",
        () =>
        {
            Assert.strictEqual(CallerModule.GetCallerModule().name, "caller-module");
        });
});