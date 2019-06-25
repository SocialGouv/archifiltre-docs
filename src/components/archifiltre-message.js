import React from "react";

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

const ArchifiltreMessage = ({ children }) => (
  <div
    className="grid-y grid-padding-x align-spaced align-middle"
    style={grid_style}
  >
    <img style={imgStyle} alt="archifiltre-logo" src="imgs/archifiltre.png" />
    <h3>{children}</h3>
  </div>
);

export default ArchifiltreMessage;
