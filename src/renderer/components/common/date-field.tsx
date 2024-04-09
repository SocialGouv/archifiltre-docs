import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { de, enUS, fr, fromUnixTime, getYear, isBefore } from "date-fns";
import React, { useState } from "react";
import { FaPen } from "react-icons/fa";

import { useGetUserSettings } from "../../hooks/use-user-settings";
import { Language } from "../../utils/language/types";

const languagesMap = {
  [Language.FR]: fr,
  [Language.DE]: de,
  [Language.EN]: enUS,
};

export interface DateFieldProps {
  date: number;
  onDateChange: (timestamp: number) => void;
}

// We assume that we cannot enter dates before 1970
const MIN_DATE_YEAR = 1970;

export const DateField: React.FC<DateFieldProps> = ({ date, onDateChange }) => {
  const { userSettings } = useGetUserSettings();
  const [selectedDate, setSelectedDate] = useState<Date | null>(fromUnixTime(date / 1000));

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      onDateChange(date.getTime()); // Assuming onDateChange expects a timestamp in milliseconds
    }
  };

  const validateDate = (date: Date) => {
    return getYear(date) > MIN_DATE_YEAR && isBefore(date, new Date());
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={languagesMap[userSettings.language as Language]}>
      <DatePicker
        value={selectedDate}
        onChange={handleDateChange}
        renderInput={params => (
          <TextField
            {...params}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaPen />
                </InputAdornment>
              ),
            }}
            fullWidth
          />
        )}
        shouldDisableDate={validateDate}
      />
    </LocalizationProvider>
  );
};
