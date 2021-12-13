import {
    getInitialUserSettings,
    initUserSettings,
} from "../../persistence/persistent-settings";
import { translations } from "../../translations/translations";

export const setupLanguage = (): void => {
    initUserSettings();
    void translations.changeLanguage(getInitialUserSettings().language);
};
