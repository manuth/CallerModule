import { strictEqual } from "assert";
import { Package } from "@manuth/package-json-editor";
import { join } from "upath";
import { GetCallerModule } from "..";

suite(
    "CallerModule", () =>
    {
        test(
                "Checking whether caller-modules are detected correctly…",
                function test()
                {
                    strictEqual(GetCallerModule(test).name, "mocha");
                    strictEqual(GetCallerModule().name, new Package(join(__dirname, "..", "..", "package.json")).Name);
                });
    });
