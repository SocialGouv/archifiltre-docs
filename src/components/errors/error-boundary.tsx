import { TFunction } from "i18next";
import React from "react";

import SaveButton, { ExportToJson } from "components/header/save-button";
import { reportError } from "logging/reporter";
import { ContactUs } from "./contact-us";
import Grid from "@material-ui/core/Grid";
import { withTranslation } from "react-i18next";
import styled from "styled-components";

type ErrorBoundaryProps = {
  t: TFunction;
  originalPath: string;
  sessionName: string;
  exportToJson: ExportToJson;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

const Wrapper = styled(Grid)`
  height: 100vh;
`;

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  componentDidCatch(error, info) {
    reportError({ error, info });
    this.setState({
      hasError: true,
    });
  }

  render() {
    const { t, originalPath, sessionName, exportToJson, children } = this.props;

    if (this.state.hasError) {
      return (
        <Wrapper
          container
          direction="column"
          justify="center"
          alignItems="center"
        >
          <Grid item>
            <h1>{t("common.somethingWentWrong")}</h1>
          </Grid>
          <Grid item>
            <h4>
              <ContactUs />
            </h4>
          </Grid>
          <Grid item>
            <SaveButton
              originalPath={originalPath}
              sessionName={sessionName}
              exportToJson={exportToJson}
            />
          </Grid>
        </Wrapper>
      );
    }
    return children;
  }
}

export default withTranslation()(ErrorBoundary);
