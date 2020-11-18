import React, { FC, useState } from "react";
import { useDateInput } from "react-nice-dates";
import { Language, useLanguage } from "hooks/use-language";
import { de, enUS, fr } from "date-fns/locale";
import { fromUnixTime, getTime, getYear, isBefore, Locale } from "date-fns";
import { Input } from "@material-ui/core";
import { FaPen } from "react-icons/fa";
import InputAdornment from "@material-ui/core/InputAdornment";
import { compose } from "lodash/fp";
import { tap } from "util/functionnal-programming-utils";

const languagesMap = {
  [Language.FR]: fr,
  [Language.DE]: de,
  [Language.EN]: enUS,
};

const getLanguageLocale = (language: Language): Locale =>
  languagesMap[language];

type DateFieldProps = {
  date: number;
  onDateChange: (timestamp: number) => void;
};

// We assume that we cannot enter dates before 1970
const MIN_DATE_YEAR = 1970;

const DateField: FC<DateFieldProps> = ({ date, onDateChange }) => {
  const [isFocused, setFocus] = useState(false);
  const [language] = useLanguage();

  const dateChangeHandler = compose(onDateChange, getTime);

  const inputProps = useDateInput({
    date: fromUnixTime(date / 1000),
    locale: getLanguageLocale(language),
    onDateChange: dateChangeHandler,
    validate: (date) =>
      getYear(date) > MIN_DATE_YEAR && isBefore(date, new Date()),
  });

  const onFocus = compose(
    tap(() => setFocus(true)),
    inputProps.onFocus
  );

  const onBlur = compose(
    tap(() => setFocus(false)),
    inputProps.onBlur
  );

  return (
    <Input
      {...inputProps}
      startAdornment={
        <InputAdornment position="start">
          <FaPen />
        </InputAdornment>
      }
      disableUnderline={!isFocused}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
};

export default DateField;
