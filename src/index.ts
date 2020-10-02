import { lstatSync, readdirSync } from "fs";
import { CallSite } from "callsite";
import { basename, dirname, join, normalize, resolve, sep } from "upath";
import StackTrace = require("v8-callsites");

/**
 * Gets the module that called a specified method at a specified stacktrace-level.
 *
 * @param level
 * The stacktrace-level whose caller is to be determined.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export function GetCallerModule(level?: number): CallerModule;

/**
 * Gets the module that called a specified method at a specified stacktrace-level.
 *
 * @param method
 * The method whose caller is to be determined.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export function GetCallerModule(method: () => any): CallerModule;

/**
 * Gets the module that called a specified method at a specified stacktrace-level.
 *
 * @param method
 * The method whose caller is to be determined.
 *
 * @param level
 * The stacktrace-level whose caller is to be determined.
 *
 * @returns
 * The caller-module.
 */
export function GetCallerModule(method?: number | (() => any), level?: number): CallerModule
{
    let origin: () => any;
    let frames: number;
    let stack: CallSite[] = [];
    let result: CallerModule;
    let pathTree: string[];

    if (typeof method === "number")
    {
        origin = GetCallerModule;
        frames = method;
    }
    else if (method)
    {
        origin = method;
        frames = level;
    }

    stack = StackTrace(frames, origin);
    result = new CallerModule(stack[stack.length - 1]);
    pathTree = normalize(result.path).split(sep);

    /* if the caller isn't a module */
    if (result.path === basename(result.path))
    {
        result.name = result.path;
        result.root = result.callSite.isNative() ? "V8" : "node";
    }
    else
    {
        /* if the caller isn't a dependency */
        if (!pathTree.includes("node_modules"))
        {
            let root = dirname(result.path);

            let isModuleRoot = (fileName: string): boolean =>
            {
                let files = readdirSync(fileName).filter(
                    (value, index, array) =>
                    {
                        return !lstatSync(join(fileName, value)).isDirectory();
                    });

                return files.includes("package.json");
            };

            while (!isModuleRoot(root))
            {
                root = resolve(root, "..");
            }

            result.root = root;
        }
        /* if the caller is a submodule */
        else
        {
            let moduleFolderIndex = pathTree.indexOf("node_modules");
            result.root = pathTree.slice(0, moduleFolderIndex + 2).join(sep);
        }

        // eslint-disable-next-line @typescript-eslint/no-var-requires
        result.name = require(join(result.root, "package.json")).name;
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
     *
     * @returns
     * A string that represents the object.
     */
    public toString(): string
    {
        return `${this.path}:${this.callSite.getLineNumber()}:${this.callSite.getColumnNumber()}`;
    }
}
