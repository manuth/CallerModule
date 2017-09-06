import { CallSite } from "callsite";
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
let stackTrace = require('v8-callsites');

/**
 * Gets the module that called a specified method at a specified stacktrace-level.
 */
export function GetCallerModule(): CallerModule;

/**
 * Gets the module that called a specified method at a specified stacktrace-level.
 * 
 * @param level
 * The stacktrace-level whose caller is to be determined.
 */
export function GetCallerModule(level: number): CallerModule;

/**
 * Gets the module that called a specified method at a specified stacktrace-level.
 * 
 * @param method
 * The method whose caller is to be determined.
 */
export function GetCallerModule(method: Function): CallerModule;

/**
 * Gets the module that called a specified method at a specified stacktrace-level.
 * 
 * @param method
 * The method whose caller is to be determined.
 * 
 * @param level
 * The stacktrace-level whose caller is to be determined.
 */
export function GetCallerModule(method?: Function | number, level?: number): CallerModule
{
    let stack: CallSite[] = [];
    let result: CallerModule;

    switch (arguments.length)
    {
        case 0:
            stack = stackTrace(1, GetCallerModule);
            break;
        case 1:
            stack = stackTrace(method);
            break;
        case 2:
            stack = stackTrace(level, method);
            break;
    }

    result = new CallerModule(stack[stack.length - 1]);

    /* if the caller isn't a module */
    if (result.path == path.basename(result.path))
    {
        result.name = result.path;
        result.root = result.callSite.isNative() ? 'V8' : 'node';
    }
    /* if the caller is the topmost module */
    else
    {
        if (result.path.split(path.sep).indexOf('node_modules') < 0)
        {
            let root = path.dirname(result.path);
            let isModuleRoot: Function = (fileName: string) =>
            {
                let files: string[] = fs.readdirSync(fileName).filter(
                    (value, index, array) =>
                    {
                        return !fs.lstatSync(path.join(fileName, value)).isDirectory();
                    });
                return files.indexOf('package.json') > 0;
            }

            while (!isModuleRoot(root))
            {
                root = path.resolve(root, '..');
            }

            result.root = root;
        }
        /* if the caller is a submodule */
        else
        {
            let pathTree = result.path.split(path.sep);
            let moduleFolderIndex = pathTree.indexOf('node_modules') + 1;

            result.root = pathTree.slice(0, moduleFolderIndex + 1).join(path.sep);
        }

        result.name = require(path.join(result.root, 'package.json')).name;
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
    public name: string;

    /**
     * The path of the root of the module.
     */
    public root: string;

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
        return this.path + ':' + this.callSite.getLineNumber() + ':' + this.callSite.getColumnNumber();
    }
}