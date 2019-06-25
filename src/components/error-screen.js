import React from "react";
import pick from "languages";
import ArchifiltreMessage from "./archifiltre-message";

const grid_style = {
  padding: "0em 5em",
  height: "100%"
};

const errorMessage = {
  fr: "Oups ! Une erreur s'est produite.",
  en: "Oops ! An error occurred."
};

const imgStyle = {
  width: "150px",
  height: "150px"
};

const ErrorScreen = () => (
  <ArchifiltreMessage>{pick(errorMessage)}</ArchifiltreMessage>
);

export default ErrorScreen;
