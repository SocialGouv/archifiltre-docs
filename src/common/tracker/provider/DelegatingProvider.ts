import type { Integration } from "@sentry/types";

import type { Split, UnionConcat } from "../../utils/type";
import type { TrackAppId, TrackEvent } from "../type";
import type { TrackArgs } from "./TrackerProvider";
import { TrackerProvider } from "./TrackerProvider";
import type { ProviderName } from "./utils";

/**
 * Delegate the tracking behaviour to multiple configured sub provider.
 */
export class DelegatingProvider extends TrackerProvider {
  static trackerName = "delegating" as const;

  public inited = false;

  constructor(
    appId: TrackAppId,
    disabled: boolean,
    private readonly providers: TrackerProvider[]
  ) {
    console.log("[Tracker][DelegatingProvider]", { providers });
    super(appId, disabled);
  }

  public static parseQueryString<TQuery extends UnionConcat<ProviderName>>(
    query: `delegating:${TQuery}`
  ): Split<TQuery> {
    return query.split(":")[1]!.split(",") as Split<TQuery>;
  }

  public async init(): Promise<void> {
    await Promise.allSettled(
      this.providers.map(async (provider) => provider.init())
    );
    this.inited = this.providers.every((provider) => provider.inited);
  }

  public async uninit(): Promise<void> {
    await Promise.allSettled(
      this.providers.map(async (provider) => provider.uninit())
    );
    this.inited = this.providers.every((provider) => !provider.inited);
  }

  public getSentryIntegations(): Integration[] {
    return this.providers
      .map((provider) => provider.getSentryIntegations())
      .flat();
  }

  public track<TEvent extends TrackEvent>(...args: TrackArgs<TEvent>): void {
    this.providers.forEach((provider) => {
      provider.track(...(args as Parameters<typeof provider["track"]>));
    });
  }

  public enable(): void {
    this.providers.forEach((provider) => {
      provider.enable();
    });
    super.enable();
  }

  public disable(): void {
    this.providers.forEach((provider) => {
      provider.disable();
    });
    super.disable();
  }
}
