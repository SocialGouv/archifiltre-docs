import React from "react";

export function mkRB(click_action, label, enabled, color, custom_style = {}) {
  const defaultButtonStyle = {
    backgroundColor: color ? color : "#4d9e25",
    borderRadius: "50%",
    marginBottom: 0,
  };

  const buttonStyle = { ...defaultButtonStyle, ...custom_style };

  if (enabled) {
    return (
      <button
        type="button"
        className="button active_button"
        onClick={click_action}
        style={buttonStyle}
      >
        {label}
      </button>
    );
  } else {
    return (
      <button
        type="button"
        className="button"
        onClick={click_action}
        style={buttonStyle}
        disabled
      >
        {label}
      </button>
    );
  }
}

export function mkTB(click_action, label, enabled, color, custom_style) {
  const defaultButtonStyle = {
    color: color ? color : "#4d9e25",
    backgroundColor: enabled
      ? "rgba(249, 154, 11, 0)"
      : "rgba(249, 154, 11, 0.2)",
    opacity: enabled ? 1 : 0.7,
    transition: "all 0.2s ease-out",
    WebkitTransition: "all 0.2s ease-out",
    cursor: enabled ? "pointer" : "default",
  };

  const buttonStyle = { ...defaultButtonStyle, ...custom_style };

  if (enabled) {
    return (
      <button
        className="clear button active_button"
        onClick={click_action}
        style={buttonStyle}
      >
        {label}
      </button>
    );
  } else {
    return (
      <a className="clear button" style={buttonStyle}>
        {label}
      </a>
    );
  }
}
