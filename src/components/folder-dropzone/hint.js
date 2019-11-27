import React, { useState, useEffect, useCallback } from "react";

import pick from "languages";
import AreaEmphasized from "../area-components/area-emphasized";
import RefreshButton from "../buttons/refresh-button";

const NEW_HINT_INTERVAL = 15000;

const didYouKnowText = pick({
  en: "Did you know ?",
  fr: "Le saviez-vous ?"
});

const hintsContainerStyle = {
  position: "relative",
  display: "flex",

  minHeight: "150px",

  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",

  textAlign: "center"
};

const hintsTextContainerStyle = {
  marginLeft: "120px",
  marginRight: "120px"
};

const refreshButtonContainerStyle = {
  position: "absolute",

  right: 0,

  fontSize: "36px"
};

/**
 * Displays a slideshow of various hints.
 * @param hints - The list of displayed hints
 * @returns {React.Component}
 */
const Hint = ({ hints = [] }) => {
  const [hintIndex, setHintIndex] = useState(0);

  const nextHint = useCallback(() => {
    setHintIndex((hintIndex + 1) % hints.length);
  }, [hintIndex, hints.length, setHintIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      nextHint();
    }, NEW_HINT_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, [hintIndex, hints.length, nextHint]);

  return (
    <div style={hintsContainerStyle}>
      <div style={hintsTextContainerStyle}>
        <div>
          <AreaEmphasized>{didYouKnowText}</AreaEmphasized>
        </div>
        <div>{hints[hintIndex]}</div>
      </div>
      <div style={refreshButtonContainerStyle}>
        <RefreshButton onClick={nextHint} />
      </div>
    </div>
  );
};

export default Hint;
