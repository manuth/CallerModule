import { Package } from "@manuth/package-json-editor";
import { CallSite } from "callsite";
import pkgUp = require("pkg-up");
import { basename, dirname } from "upath";
import stack = require("v8-callsites");

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
 *
 * @returns
 * The caller-module.
 */
export function GetCallerModule(method?: number | (() => any), level?: number): CallerModule
{
    let origin: () => any;
    let frames: number;
    let stackTrace: CallSite[] = [];
    let result: CallerModule;

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

    stackTrace = stack(frames, origin);
    result = new CallerModule(stackTrace[stackTrace.length - 1]);

    /* if the caller isn't a module */
    if (result.path === basename(result.path))
    {
        result.name = result.path;
        result.root = result.callSite.isNative() ? "V8" : "node";
    }
    else
    {
        let packagePath = pkgUp.sync(
            {
                cwd: dirname(result.path)
            });

        result.root = dirname(packagePath);
        result.name = new Package(packagePath).Name;
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
