import Assert = require("assert");
import { Package } from "@manuth/package-json-editor";
import { join } from "upath";
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
            Assert.strictEqual(GetCallerModule().name, new Package(join(__dirname, "..", "..", "package.json")).Name);
        });
});
