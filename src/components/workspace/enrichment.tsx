import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { FaCircle } from "react-icons/fa";
import { FilesAndFoldersMetadataMap } from "../../reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import { isFile } from "../../reducers/files-and-folders/files-and-folders-selectors";
import { FilesAndFolders } from "../../reducers/files-and-folders/files-and-folders-types";
import { getType } from "../../util/files-and-folders/file-and-folders-utils";
import {
  ENRICHMENT_COLORS,
  EnrichmentTypes,
} from "../main-space/icicle/icicle-enrichment";
import CommentCell from "../report/comment-cell";
import ElementCharacteristics from "../report/element-characteristics/element-characteristics";
import AllTagsButton from "./all-tags-button";
import TagsCell from "../tags/report-cell-tags";
import styled from "styled-components";
import InfoBoxPaper from "../info-boxes/common/info-box-paper";

const CategoryTitle = styled.h4`
  margin: 5px 0;
  font-weight: bold;
`;

interface EnrichmentProps {
  createTag;
  untag;
  updateComment;
  currentFileComment: string;
  tagsForCurrentFile;
  isCurrentFileMarkedToDelete: boolean;
  toggleCurrentFileDeleteState;
  nodeId: string;
  filesAndFoldersId: string;
  isLocked: boolean;
  isActive: boolean;
  api: any;
  currentFilesAndFolders: FilesAndFolders | null;
  filesAndFoldersMetadata: FilesAndFoldersMetadataMap;
  currentFileAlias: string;
  currentFileHash: string;
  onChangeAlias: (newAlias: string) => void;
}

const Enrichment: FC<EnrichmentProps> = ({
  createTag,
  untag,
  updateComment,
  currentFileComment,
  tagsForCurrentFile,
  isCurrentFileMarkedToDelete,
  toggleCurrentFileDeleteState,
  nodeId,
  filesAndFoldersId,
  isLocked,
  isActive,
  api,
  currentFilesAndFolders,
  filesAndFoldersMetadata,
  currentFileAlias,
  currentFileHash,
  onChangeAlias,
}) => {
  const { t } = useTranslation();

  const isFolder = currentFilesAndFolders
    ? !isFile(currentFilesAndFolders)
    : false;

  const elementSize = currentFilesAndFolders
    ? filesAndFoldersMetadata[filesAndFoldersId].childrenTotalSize
    : 0;

  const maxLastModifiedTimestamp = currentFilesAndFolders
    ? filesAndFoldersMetadata[filesAndFoldersId].maxLastModified
    : 0;

  const minLastModifiedTimestamp = currentFilesAndFolders
    ? filesAndFoldersMetadata[filesAndFoldersId].minLastModified
    : 0;

  const medianLastModifiedTimestamp = currentFilesAndFolders
    ? filesAndFoldersMetadata[filesAndFoldersId].medianLastModified
    : 0;

  const type = getType(currentFilesAndFolders);

  const nodeName = isActive ? currentFilesAndFolders?.name : "";
  const elementAlias = isActive ? currentFileAlias : "";

  return (
    <Grid container spacing={1}>
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
                  <ElementCharacteristics
                    elementName={nodeName || ""}
                    elementAlias={elementAlias}
                    elementSize={elementSize}
                    hash={currentFileHash}
                    isFolder={isFolder}
                    onElementNameChange={onChangeAlias}
                    minLastModifiedTimestamp={minLastModifiedTimestamp}
                    maxLastModifiedTimestamp={maxLastModifiedTimestamp}
                    medianLastModifiedTimestamp={medianLastModifiedTimestamp}
                    type={type}
                  />
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
                <Grid item>
                  <TagsCell
                    is_dummy={!isActive}
                    isLocked={isLocked}
                    isCurrentFileMarkedToDelete={isCurrentFileMarkedToDelete}
                    nodeId={nodeId}
                    tagsForCurrentFile={tagsForCurrentFile}
                    filesAndFoldersId={filesAndFoldersId}
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
    </Grid>
  );
};

export default Enrichment;
