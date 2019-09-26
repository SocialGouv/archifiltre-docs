import React from "react";
import AreaTitle from "./AreaComponents/area-title";
import Loader from "./loader";
import AreaMessage from "./AreaComponents/area-message";
import RoundedArea from "./AreaComponents/rounded-area";
import RoundedAreaInnerBlock from "./AreaComponents/rounded-area-inner-block";
import pick from "../languages";

const loaderBlockTitleStyle = {
  display: "flex"
};

const loaderContainerStyle = {
  display: "flex",
  justifyContent: "center",
  fontSize: "3em"
};

const counterContainerStyle = {
  display: "flex",
  justifyContent: "center"
};

const filesLoadedText = pick({
  en: "files loaded",
  fr: "fichiers indexés"
});

/**
 * Block displaying content file count while content is indexing
 * @param fileCount
 * @param loading
 */
const IndexingBlock = ({ fileCount = 0, loading }) => (
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
          {fileCount.toLocaleString()} {filesLoadedText}
        </AreaMessage>
      </div>
    </RoundedAreaInnerBlock>
  </RoundedArea>
);

export default IndexingBlock;
