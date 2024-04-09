import dateFormat from "dateformat";

export const epochToFormattedUtcDateString = (date: number): string => dateFormat(date, "dd/mm/yyyy"); // TODO: use "new Intl.DateTimeFormat(lang).format(date);" instead
