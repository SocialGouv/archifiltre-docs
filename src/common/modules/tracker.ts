import { FORCE_TRACKING, IS_MAIN, IS_PACKAGED } from "../config";
import { ipcMain, ipcRenderer } from "../ipc";
import { DelegatingProvider } from "../tracker/provider/DelegatingProvider";
import { NoopProvider } from "../tracker/provider/NoopProvider";
import type { TrackerProvider } from "../tracker/provider/TrackerProvider";
import type { DelegatingName, ProviderType } from "../tracker/provider/utils";
import { providers } from "../tracker/provider/utils";
import { get as getConfig } from "./new-user-config";

let enableTracking = FORCE_TRACKING || IS_PACKAGED();

export async function initTracking(): Promise<void> {
  await getTrackerProvider().init();
  if (IS_MAIN) {
    ipcMain.on("tracking.toggle", (_, enable) => {
      toggleTracking((enableTracking = enable as boolean));
    });
  }
}

export function toggleTracking(enable = !enableTracking): void {
  enableTracking = enable;
  getTrackerProvider()[enableTracking ? "enable" : "disable"]();
  if (!IS_MAIN) {
    ipcRenderer.send("tracking.toggle", enable);
  }
}

let provider: TrackerProvider | null = null;
function findProvider(name?: ProviderType): TrackerProvider {
  const appId = getConfig("appId");
  const disabled = !enableTracking;
  if (name?.startsWith("delegating")) {
    const names = DelegatingProvider.parseQueryString(name as DelegatingName);

    return new DelegatingProvider(
      appId,
      disabled,
      names.map((n) => findProvider(n))
    );
  }
  return new (providers.find((p) => p.trackerName === name) ?? NoopProvider)(
    appId,
    disabled
  ) as TrackerProvider;
}

export function getTrackerProvider(): TrackerProvider {
  if (provider) {
    return provider;
  }

  provider = findProvider(process.env.TRACKER_PROVIDER as ProviderType);
  return provider;
}
