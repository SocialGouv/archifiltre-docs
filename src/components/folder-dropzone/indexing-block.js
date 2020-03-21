import React from "react";
import AreaTitle from "../area-components/area-title";
import Loader from "./loader";
import AreaMessage from "../area-components/area-message";
import RoundedArea from "../area-components/rounded-area";
import RoundedAreaInnerBlock from "../area-components/rounded-area-inner-block";
import { useTranslation } from "react-i18next";

const loaderBlockTitleStyle = {
  display: "flex",
};

const loaderContainerStyle = {
  display: "flex",
  justifyContent: "center",
  fontSize: "3em",
};

const counterContainerStyle = {
  display: "flex",
  justifyContent: "center",
};

/**
 * Block displaying content file count while content is indexing
 * @param fileCount
 * @param loading
 */
const IndexingBlock = ({ fileCount = 0, loading }) => {
  const { t } = useTranslation();
  return (
    <RoundedArea>
      <RoundedAreaInnerBlock>
        <div style={loaderBlockTitleStyle}>
          <AreaTitle>Indexation</AreaTitle>
        </div>
        <div style={loaderContainerStyle}>
          <Loader loading={loading} />
        </div>
        <div style={counterContainerStyle}>
          <AreaMessage>
            {fileCount.toLocaleString()} {t("folderDropzone.filesLoaded")}
          </AreaMessage>
        </div>
      </RoundedAreaInnerBlock>
    </RoundedArea>
  );
};

export default IndexingBlock;
