import React from "react";
import pick from "languages";
import ArchifiltreMessage from "./archifiltre-message";

const errorMessage = {
  fr: "Oups ! Une erreur s'est produite.",
  en: "Oops ! An error occurred."
};

const ErrorScreen = () => (
  <ArchifiltreMessage>{pick(errorMessage)}</ArchifiltreMessage>
);

export default ErrorScreen;
