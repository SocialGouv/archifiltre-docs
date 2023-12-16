import Grid from "@material-ui/core/Grid";
import type { TFunction } from "i18next";
import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import styled from "styled-components";

import { SaveButton } from "../../components/header/save-button";
import type { ExportToJson } from "../../exporters/json/json-exporter";
import { reportError } from "../../logging/reporter";
import { ContactUs } from "./contact-us";

export interface ErrorBoundaryProps {
  exportToJson: ExportToJson;
  originalPath: string;
  sessionName: string;
  t: TFunction;
}

export interface ErrorBoundaryState {
  hasError: boolean;
}

const Wrapper = styled(Grid)`
  height: 100vh;
`;

class ErrorBoundaryComponent extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  componentDidCatch(error: unknown, info: unknown) {
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
          justifyContent="center"
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

export const ErrorBoundary = withTranslation()(ErrorBoundaryComponent);
