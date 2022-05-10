import type { UnionConcat } from "../../utils/type";
import { DebugProvider } from "./DebugProvider";
import { NoopProvider } from "./NoopProvider";
import { PosthogProvider } from "./PosthogProvider";

export const providers = [
  PosthogProvider,
  NoopProvider,
  DebugProvider,
] as const;

export type ProviderName = typeof providers[number]["trackerName"];
export type DelegatingName = `delegating:${UnionConcat<ProviderName>}`;
export type ProviderType = DelegatingName | ProviderName;
