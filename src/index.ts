import { CallSite } from "callsite";
import FileSystem = require("fs");
import Path = require("path");
import { isNullOrUndefined } from "util";
import StackTrace = require("v8-callsites");

/**
 * Gets the module that called a specified method at a specified stacktrace-level.
 *
 * @param level
 * The stacktrace-level whose caller is to be determined.
 */
export function GetCallerModule(level?: number): CallerModule;

/**
 * Gets the module that called a specified method at a specified stacktrace-level.
 *
 * @param method
 * The method whose caller is to be determined.
 */
export function GetCallerModule(method: () => any): CallerModule;

/**
 * Gets the module that called a specified method at a specified stacktrace-level.
 *
 * @param method
 * The method whose caller is to be determined.
 *
 * @param level
 * The stacktrace-level whose caller is to be determined.
 */
export function GetCallerModule(method?: number | (() => any), level?: number): CallerModule
{
    let origin: () => any;
    let frames: number;
    let stack: CallSite[] = [];
    let result: CallerModule;

    if (typeof method === "number")
    {
        origin = GetCallerModule;
        frames = method;
    }
    else if (!isNullOrUndefined(method))
    {
        origin = method;
        frames = level;
    }

    stack = StackTrace(frames, origin);

    result = new CallerModule(stack[stack.length - 1]);

    /* if the caller isn't a module */
    if (result.path === Path.basename(result.path))
    {
        result.name = result.path;
        result.root = result.callSite.isNative() ? "V8" : "node";
    }
    /* if the caller is the topmost module */
    else
    {
        if (result.path.split(Path.sep).indexOf("node_modules") < 0)
        {
            let root = Path.dirname(result.path);
            let isModuleRoot = (fileName: string) =>
            {
                let files = FileSystem.readdirSync(fileName).filter(
                    (value, index, array) =>
                    {
                        return !FileSystem.lstatSync(Path.join(fileName, value)).isDirectory();
                    });
                return files.indexOf("package.json") > 0;
            };

            while (!isModuleRoot(root))
            {
                root = Path.resolve(root, "..");
            }

            result.root = root;
        }
        /* if the caller is a submodule */
        else
        {
            let pathTree = result.path.split(Path.sep);
            let moduleFolderIndex = pathTree.indexOf("node_modules") + 1;

            result.root = pathTree.slice(0, moduleFolderIndex + 1).join(Path.sep);
        }

        result.name = require(Path.join(result.root, "package.json")).name;
    }

    return result;
}

/**
 * Represents a module.
 */
export class CallerModule
{
    /**
     * The name of the module.
     */
    public name = "";

    /**
     * The path of the root of the module.
     */
    public root = "";

    /**
     * The CallSite of the caller.
     */
    public callSite: CallSite;

    /**
     * Initializes a new instance of the CallerModule class.
     *
     * @param callSite
     * The CallSite of the caller.
     */
    public constructor(callSite: CallSite)
    {
        this.callSite = callSite;
    }

    /**
     * The path of the caller file.
     */
    public get path(): string
    {
        return this.callSite.getFileName();
    }

    /**
     * Gets a string that represents the object.
     */
    public toString()
    {
        return `${this.path}:${this.callSite.getLineNumber()}:${this.callSite.getColumnNumber()}`;
    }
}