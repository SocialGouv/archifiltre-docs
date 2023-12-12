import type { TrackEvent } from "../type";
import type { TrackArgs } from "./TrackerProvider";
import { TrackerProvider } from "./TrackerProvider";

/**
 * Enable a Debug tracker which will "dry run" log every track requests made.
 */
export class DebugProvider extends TrackerProvider {
  static trackerName = "debug" as const;

  public inited = true;

  public async init(): Promise<void> {
    return Promise.resolve();
  }

  public track<TEvent extends TrackEvent>(...args: TrackArgs<TEvent>): void {
    const [event, props] = args;
    console.info("[DebugProvider] Track", { event, props });
  }
}
