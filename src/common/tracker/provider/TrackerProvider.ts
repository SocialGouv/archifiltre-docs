import { type Integration } from "@sentry/types";

import { type Nothing } from "../../utils/type";
import { type TrackAppId, type TrackEvent, type TrackEventProps } from "../type";

export type TrackArgs<TEvent extends TrackEvent> = TrackEventProps[TEvent] extends Nothing
  ? [event: TEvent]
  : [event: TEvent, props: TrackEventProps[TEvent]];

/**
 * A tracker provider is an isomorphic wrapper around
 * any tracking library.
 *
 * The provider should handle `main` AND `renderer` tracking
 * as it will be instanciated in both processes.
 */
export abstract class TrackerProvider<TFrontTracker = undefined, TBackTracker = undefined> {
  /**
   * Expose the provider name to match the config.
   *
   * **SHOULD** be overrided.
   */
  static trackerName: string;

  /**
   * The actual internal tracker. Either typed as `main` tracker
   * or `renderer` tracker.
   */
  protected tracker?: TBackTracker | TFrontTracker;

  /**
   * Define if the provider is inited or not.
   *
   * Used to know when the internal library is
   * ready to be used (e.g. after an identify).
   */
  public abstract inited: boolean;

  constructor(
    protected appId: TrackAppId,
    protected disabled: boolean,
  ) {}

  /**
   * If revelent, return custom Sentry integrations to
   * connect the tracking system to Sentry.
   */
  public getSentryIntegations(): Integration[] {
    return [];
  }

  /**
   * Uninit a tracking system when
   * the app closes. (e.g. to flush pending request,
   * or "log out" the current user)
   */
  public async uninit(): Promise<void> {
    this.inited = false;
    return Promise.resolve();
  }

  public enable(): void {
    this.disabled = false;
  }

  public disable(): void {
    this.disabled = true;
  }

  /**
   * Init a tracking system (e.g. start the library,
   * identify a user)
   */
  public abstract init(): Promise<void>;

  /**
   * Track an event described by the tracking plan.
   */
  public abstract track<TEvent extends TrackEvent>(...args: TrackArgs<TEvent>): void;
}
