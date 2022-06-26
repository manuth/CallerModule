import { strictEqual } from "node:assert";
import { fileURLToPath } from "node:url";
import { Package } from "@manuth/package-json-editor";
import upath from "upath";
import { GetCallerModule } from "../index.js";

const { join } = upath;

suite(
    "CallerModule",
    () =>
    {
        test(
            "Checking whether caller-modules are detected correctly…",
            function test()
            {
                strictEqual(GetCallerModule(test).name, "mocha");
                strictEqual(GetCallerModule().name, new Package(join(fileURLToPath(new URL(".", import.meta.url)), "..", "..", "package.json")).Name);
            });
    });
