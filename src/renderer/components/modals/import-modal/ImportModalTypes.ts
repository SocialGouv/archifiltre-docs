import type { LoadCsvFileToArrayOptions } from "@common/utils/csv";

export type ImportModalState = "initial" | "preview";

export type OptionChangeHandler = <T extends keyof LoadCsvFileToArrayOptions>(
  label: T,
  value: LoadCsvFileToArrayOptions[T]
) => void;

export type PathChangeHandler = (path: string) => void;
