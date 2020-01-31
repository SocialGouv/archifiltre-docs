import React from "react";

import SaveButton from "components/buttons/save-button";
import { reportError } from "../../logging/reporter.ts";
import { ContactUs } from "./contact-us";
import { withTranslation } from "react-i18next";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  componentDidCatch(error, info) {
    reportError({ error, info });
    this.setState({
      hasError: true
    });
  }

  render() {
    const { t, originalPath, sessionName, exportToJson } = this.props;

    if (this.state.hasError) {
      return (
        <div className="grid-y grid-frame align-center">
          <div
            className="cell small-1"
            style={{
              textAlign: "center"
            }}
          >
            <h1>{t("common.somethingWentWrong")}</h1>
            <h4>
              <ContactUs />
            </h4>
            <SaveButton
              originalPath={originalPath}
              sessionName={sessionName}
              exportToJson={exportToJson}
            />
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default withTranslation()(ErrorBoundary);
