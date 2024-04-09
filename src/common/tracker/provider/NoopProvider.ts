import { type TrackEvent } from "../type";
import { type TrackArgs, TrackerProvider } from "./TrackerProvider";

/**
 * Fallback provider that act as "noop" functions when no
 * provider is set or found with the associated config.
 */
export class NoopProvider extends TrackerProvider {
  static trackerName = "noop" as const;

  public inited = true;

  private flagConsole = false;

  public async init(): Promise<void> {
    return Promise.resolve();
  }

  public track<TEvent extends TrackEvent>(..._args: TrackArgs<TEvent>): void {
    this.warn();
  }

  private warn() {
    if (!this.flagConsole) {
      console.warn(`[Tracker] No tracker set or found (${process.env.TRACKER_PROVIDER})`);
      this.flagConsole = true;
    }
  }
}
