import { type Integration } from "@sentry/types";
import type FrontPostHog from "posthog-js";
import type NodeJsPostHog from "posthog-node";

import { IS_MAIN } from "../../config";
import { type TrackEvent } from "../type";
import { type TrackArgs, TrackerProvider } from "./TrackerProvider";

const TRACKER_FAKE_HOST = (process.env.TRACKER_FAKE_HREF ?? "").split("//")[1]!;

const DEFAULT_$SET = {
  $current_url: process.env.TRACKER_FAKE_HREF,
  $host: TRACKER_FAKE_HOST,
  $pathname: "",
};
const DEFAULT_$SET_ONCE = {
  $initial_current_url: process.env.TRACKER_FAKE_HREF,

  $initial_pathname: "",
  $pathname: "",
};
export class PostHogProvider extends TrackerProvider<typeof FrontPostHog, NodeJsPostHog> {
  static trackerName = "posthog" as const;

  public inited = false;

  public async init(): Promise<void> {
    if (this.inited) {
      console.warn("[TrackerProvider][PostHogProvider] Already inited.", this.disabled);
    }
    if (IS_MAIN) {
      this.tracker = new (await import("posthog-node").default)(process.env.TRACKER_POSTHOG_API_KEY, {
        enable: !this.disabled,
        flushAt: 0,
        flushInterval: 0,
        host: process.env.TRACKER_POSTHOG_URL,
      });
      this.hijackPostHog(this.tracker);
      this.tracker.capture({
        distinctId: this.appId,
        event: "$identify",
      });
      this.inited = true;
    } else {
      return new Promise<void>(
        resolve =>
          void import("posthog-js").then(({ default: frontPostHog }) => {
            this.hijackPostHog(frontPostHog);
            frontPostHog.init(process.env.TRACKER_POSTHOG_API_KEY, {
              api_host: process.env.TRACKER_POSTHOG_URL,
              autocapture: false,
              capture_pageview: false,
              disable_session_recording: true,
              loaded: posthog => {
                this.tracker = posthog;
                this.tracker.identify(this.appId);
                this.inited = true;
                resolve();
              },
            });
          }),
      );
    }
  }

  public async uninit(): Promise<void> {
    console.info("[Tracker][PostHogProvider] Shutdown posthog");
    if (this.isMain(this.tracker)) {
      this.tracker.shutdown();
    }
    return super.uninit();
  }

  public getSentryIntegations(): Integration[] {
    if (this.tracker && !this.isMain(this.tracker)) {
      return [
        new this.tracker.SentryIntegration(
          this.tracker,
          process.env.SENTRY_ORG,
          +process.env.SENTRY_DSN.split("/").reverse()[0]!,
          process.env.SENTRY_URL,
        ),
      ];
    }
    return [];
  }

  public track<TEvent extends TrackEvent>(...args: TrackArgs<TEvent>): void {
    const [event, properties] = args;
    if (!this.tracker || this.disabled) return;
    if (this.isMain(this.tracker)) {
      this.tracker.capture({
        distinctId: this.appId,
        event,
        properties,
      });
    } else {
      this.tracker.capture(event, properties);
    }
  }

  public enable(): void {
    if (!this.tracker) return;
    if (!this.isMain(this.tracker)) {
      this.tracker.opt_in_capturing();
    }
    super.enable();
  }

  public disable(): void {
    if (!this.tracker) return;
    if (!this.isMain(this.tracker)) {
      this.tracker.opt_out_capturing();
    } else {
      this.tracker.shutdown();
    }
    super.disable();
  }

  private isMain(_: typeof this.tracker): _ is NodeJsPostHog {
    return IS_MAIN;
  }

  private hijackPostHog(posthog: NodeJsPostHog | typeof FrontPostHog) {
    const originalCaptureFn = posthog.capture.bind(posthog);
    const hijack = {
      $set: DEFAULT_$SET,

      $set_once: DEFAULT_$SET_ONCE,
      ...DEFAULT_$SET,
    };

    if (IS_MAIN) {
      (posthog as NodeJsPostHog).capture = ({ distinctId, event, properties, groups }) => {
        properties = {
          ...properties,
          ...hijack,
        };

        (originalCaptureFn as NodeJsPostHog["capture"])({
          distinctId,
          event,
          groups,
          properties,
        });
      };
    } else {
      (posthog as typeof FrontPostHog).capture = (eventName, properties?, options?) => {
        properties = {
          ...properties,
          ...hijack,
        };
        return (originalCaptureFn as (typeof FrontPostHog)["capture"])(eventName, properties, options);
      };
    }
  }
}
