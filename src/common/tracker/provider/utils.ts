import { type UnionConcat } from "../../utils/type";
import { DebugProvider } from "./DebugProvider";
import { NoopProvider } from "./NoopProvider";
import { PostHogProvider } from "./PostHogProvider";

export const providers = [PostHogProvider, NoopProvider, DebugProvider] as const;

export type ProviderName = (typeof providers)[number]["trackerName"];
export type DelegatingName = `delegating:${UnionConcat<ProviderName>}`;
export type ProviderType = DelegatingName | ProviderName;
