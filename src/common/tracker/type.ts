/* eslint-disable @typescript-eslint/naming-convention */

import type { ExportType } from "../export/type";

export type TrackAppId = string & { readonly _trackAppId?: never };
// TODO: move when "save work" feature is done
export type TrackWorkHash = string & { readonly _trackWorkHash?: never };
// TODO: move when "sentry" feature is done
export type TrackErrorId = string & { readonly _trackErrorId?: never };

/**
 * Tracking Plan props representation.
 */
export interface TrackCoreEventProps {
  "App Closed": { date: Date };
  "App First Opened": {
    arch: string;
    date: Date;
    os: NodeJS.Platform;
    /** in Go */
    ram: number;
    version: string;
  };
  "App Opened": { date: Date; version: string };
  "App Updated": {
    currentVersion: string;
    oldVersion: string;
  };
  "Export Generated": {
    /** in Mo */
    size: number;
    /** in Octet */
    sizeRaw: number;
    type: ExportType;
  };
  "Folder Dropped": {
    fileCount: number;
    folderCount: number;
    loadTime: number;
    /** in Go */
    size: number;
    /** in Octet */
    sizeRaw: number;
  };
  "NPS Answered": {
    responseId?: string;
    userEmail: string;
  };
  "Work Reloaded": { workHash: TrackWorkHash };
  "Work Saved": { workHash: TrackWorkHash };
}

export type TrackNavMode = "color" | "sort" | "weight";
export interface TrackNavModeTypeMap {
  color: "date" | "type";
  sort: "alpha" | "date" | "size";
  weight: "count" | "size";
}
export interface TrackAppEventProps {
  "Feat(1.0) Nav Mode Changed": {
    [M in TrackNavMode]: {
      navMode: M;
      type: TrackNavModeTypeMap[M];
    };
  }[TrackNavMode];
  "Feat(2.0) Move Mode Toggled": {
    enabled: boolean;
  };
  "Feat(3.0) Element Moved": {
    /** in Mo */
    size: number;
    /** in Octet */
    sizeRaw: number;
  };
  "Feat(4.0) Element Marked To Delete": {
    fileCount: number;
    /** depending on the tab we're currently on */
    mode: "duplicate" | "enrichment";
    /** in Mo */
    size: number;
    /** in Octet */
    sizeRaw: number;
  };
  "Feat(5.0) Action History Moved": {
    type: "redo" | "undo";
  };
}

export type TrackEventProps = TrackAppEventProps & TrackCoreEventProps;
export type TrackEvent = keyof TrackEventProps;
