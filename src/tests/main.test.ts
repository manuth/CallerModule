import Assert = require("assert");
import { GetCallerModule } from "..";

suite("CallerModule", () =>
{
    test(
        "Determining the caller of `testCallerModule`…",
        function testCallerModule()
        {
            Assert.strictEqual(GetCallerModule(testCallerModule).name, "mocha");
        });

    test(
        "Determining the caller of the current context…",
        () =>
        {
            Assert.strictEqual(GetCallerModule().name, "caller-module");
        });
});
