import type { AnyFunction } from "@common/utils/function";
import { tap } from "@common/utils/functionnal-programming";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import type { Locale } from "date-fns";
// eslint-disable-next-line import/no-duplicates
import { fromUnixTime, getTime, getYear, isBefore } from "date-fns";
// eslint-disable-next-line import/no-duplicates
import { de, enUS, fr } from "date-fns/locale";
import compose from "lodash/fp/compose";
import React, { useState } from "react";
import { FaPen } from "react-icons/fa";
import { useDateInput } from "react-nice-dates";

import { useLanguage } from "../../hooks/use-language";
import { Language } from "../../utils/language/types";

const languagesMap = {
  [Language.FR]: fr,
  [Language.DE]: de,
  [Language.EN]: enUS,
};

const getLanguageLocale = (language: Language): Locale =>
  languagesMap[language];

export interface DateFieldProps {
  date: number;
  onDateChange: (timestamp: number) => void;
}

// We assume that we cannot enter dates before 1970
const MIN_DATE_YEAR = 1970;

export const DateField: React.FC<DateFieldProps> = ({ date, onDateChange }) => {
  const [isFocused, setFocus] = useState(false);
  const [language] = useLanguage();

  const dateChangeHandler = compose(onDateChange, getTime);

  const inputProps: { onBlur: AnyFunction; onFocus: AnyFunction } =
    useDateInput({
      // TODO: don't use react-nice-dates
      date: fromUnixTime(date / 1000),
      locale: getLanguageLocale(language),
      onDateChange: dateChangeHandler,
      validate: (dateToValidate) =>
        getYear(dateToValidate) > MIN_DATE_YEAR &&
        isBefore(dateToValidate, new Date()),
    });

  const onFocus = compose(
    tap(() => {
      setFocus(true);
    }),
    inputProps.onFocus
  );

  const onBlur = compose(
    tap(() => {
      setFocus(false);
    }),
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
