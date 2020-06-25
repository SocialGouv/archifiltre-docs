import Box from "@material-ui/core/Box";
import Grid, { GridProps } from "@material-ui/core/Grid";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { FaCircle } from "react-icons/fa";
import styled from "styled-components";
import { FilesAndFoldersMetadataMap } from "reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import { isFile } from "reducers/files-and-folders/files-and-folders-selectors";
import { FilesAndFolders } from "reducers/files-and-folders/files-and-folders-types";
import { getType } from "util/files-and-folders/file-and-folders-utils";
import CategoryTitle from "../common/category-title";
import {
  ENRICHMENT_COLORS,
  EnrichmentTypes,
} from "../main-space/icicle/icicle-enrichment";
import CommentCell from "../report/comment-cell";
import ElementCharacteristics from "../info-boxes/element-characteristics/element-characteristics";
import TagCell from "../tags/tag-cell-container";
import AllTagsButton from "./all-tags-button";
import InfoBoxPaper from "../info-boxes/common/info-box-paper";
import ElementCharacteristicsContainer from "../info-boxes/element-characteristics/element-characteristics-container";

interface EnrichmentProps {
  createTag;
  untag;
  updateComment;
  currentFileComment: string;
  tagsForCurrentFile;
  isCurrentFileMarkedToDelete: boolean;
  toggleCurrentFileDeleteState;
  nodeId: string;
  isActive: boolean;
  api: any;
}

const FullHeightGrid = styled(Grid)<GridProps>`
  height: 100%;
`;

const Enrichment: FC<EnrichmentProps> = ({
  createTag,
  untag,
  updateComment,
  currentFileComment,
  tagsForCurrentFile,
  isCurrentFileMarkedToDelete,
  toggleCurrentFileDeleteState,
  nodeId,
  isActive,
  api,
}) => {
  const { t } = useTranslation();

  return (
    <FullHeightGrid container spacing={1}>
      <Grid item xs={4}>
        <Box display="flex" flexDirection="column" height="100%">
          <Box>
            <CategoryTitle>
              {t("report.elementInfo")}&nbsp;
              <FaCircle
                style={{
                  color: ENRICHMENT_COLORS[EnrichmentTypes.ALIAS],
                  verticalAlign: "middle",
                }}
              />
            </CategoryTitle>
          </Box>
          <Box flexGrow={1}>
            <InfoBoxPaper>
              <Grid container>
                <Grid item>
                  <ElementCharacteristicsContainer />
                </Grid>
              </Grid>
            </InfoBoxPaper>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={4}>
        <Box display="flex" flexDirection="column" height="100%">
          <Box>
            <CategoryTitle>
              {t("report.comments")}&nbsp;
              <FaCircle
                style={{
                  color: ENRICHMENT_COLORS[EnrichmentTypes.COMMENT],
                  verticalAlign: "middle",
                }}
              />
            </CategoryTitle>
          </Box>
          <Box flexGrow={1}>
            <InfoBoxPaper>
              <Grid container>
                <Grid item xs={12}>
                  <CommentCell
                    isActive={isActive}
                    comment={currentFileComment}
                    updateComment={updateComment}
                  />
                </Grid>
              </Grid>
            </InfoBoxPaper>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={4}>
        <Box display="flex" flexDirection="column" height="100%">
          <Box display="flex" justifyContent="space-between">
            <CategoryTitle>
              {t("workspace.tags")}&nbsp;
              <FaCircle
                style={{
                  color: ENRICHMENT_COLORS[EnrichmentTypes.TAG],
                  verticalAlign: "middle",
                }}
              />
            </CategoryTitle>
            <AllTagsButton api={api} />
          </Box>
          <Box flexGrow={1}>
            <InfoBoxPaper>
              <Grid container>
                <Grid item xs={12}>
                  <TagCell
                    isActive={isActive}
                    isCurrentFileMarkedToDelete={isCurrentFileMarkedToDelete}
                    nodeId={nodeId}
                    tagsForCurrentFile={tagsForCurrentFile}
                    createTag={createTag}
                    untag={untag}
                    toggleCurrentFileDeleteState={toggleCurrentFileDeleteState}
                  />
                </Grid>
              </Grid>
            </InfoBoxPaper>
          </Box>
        </Box>
      </Grid>
    </FullHeightGrid>
  );
};

export default Enrichment;
