declare module "v8-callsites"
{
    function stack(origin?: () => any): CallSite[];

    /**
     * Captures a specific callstack.
     *
     * @param frames
     * The number of frames to capture.
     *
     * @param origin
     * The method to start to record.
     *
     * @returns
     * The captured callstack.
     */
    function stack(frames: number | (() => any), origin: () => any): CallSite[];

    import { CallSite } from "callsite";

    export = stack;
}