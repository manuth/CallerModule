declare module "v8-callsites"
{
    import { CallSite } from "callsite";

    /**
     * Captures a specific callstack.
     *
     * @param origin
     * The method to start to record.
     *
     * @returns
     * The captured callstack.
     */
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
    function stack(frames: number, origin: () => any): CallSite[];

    export = stack;
}
