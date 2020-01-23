import dateFormat from "dateformat";

export const epochToFormattedUtcDateString = (date: number): string =>
  dateFormat(date, "dd/mm/yyyy");
