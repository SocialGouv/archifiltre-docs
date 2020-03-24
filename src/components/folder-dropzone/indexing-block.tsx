import React from "react";
import AreaTitle from "../area-components/area-title";
import Loader from "./loader";
import AreaMessage from "../area-components/area-message";
import { RoundedArea } from "../area-components/rounded-area";
import RoundedAreaInnerBlock from "../area-components/rounded-area-inner-block";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const LoaderBlockTitle = styled.div`
  display: flex;
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  font-size: 3em;
`;

const CounterContainer = styled.div`
  display: flex;
  justify-content: center;
`;

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
        <LoaderBlockTitle>
          <AreaTitle>Indexation</AreaTitle>
        </LoaderBlockTitle>
        <LoaderContainer>
          <Loader loading={loading} />
        </LoaderContainer>
        <CounterContainer>
          <AreaMessage>
            {fileCount.toLocaleString()} {t("folderDropzone.filesLoaded")}
          </AreaMessage>
        </CounterContainer>
      </RoundedAreaInnerBlock>
    </RoundedArea>
  );
};

export default IndexingBlock;
