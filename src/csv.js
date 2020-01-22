import dateFormat from "dateformat";

export const epochToFormattedUtcDateString = a => dateFormat(a, "dd/mm/yyyy");
