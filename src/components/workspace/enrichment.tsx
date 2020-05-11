import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import AllTagsButton from "../buttons/all-tags-button";
import CommentsCell from "../report/report-cell-comments";
import TagsCell from "../tags/report-cell-tags";
import styled from "styled-components";

const StyledGrid = styled(Grid)`
  padding: 10px;
`;

const CategoryTitle = styled.h3`
  margin: 5px 0;
`;

const cellsStyle = {
  borderRadius: "1em",
  padding: "0.6em 1em 0 1em",
  fontSize: "0.8em",
  height: "8em",
  boxSizing: "border-box",
};

interface EnrichmentProps {
  createTag;
  untag;
  updateComment;
  currentFileComment;
  tagsForCurrentFile;
  isCurrentFileMarkedToDelete;
  toggleCurrentFileDeleteState;
  nodeId: string;
  filesAndFoldersId: string;
  isLocked: boolean;
  isActive: boolean;
  api: any;
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
}) => {
  const { t } = useTranslation();

  return (
    <Grid container spacing={1}>
      <StyledGrid item xs={4}>
        <CategoryTitle>{t("report.elementInfo")}</CategoryTitle>
        <Paper>
          <p>TEST</p>
        </Paper>
      </StyledGrid>
      <StyledGrid item xs={4}>
        <Box display="flex" justifyContent="space-between">
          <CategoryTitle>{t("workspace.tags")}</CategoryTitle>
          <AllTagsButton api={api} />
        </Box>
        <Paper>
          <TagsCell
            is_dummy={!isActive}
            isLocked={isLocked}
            isCurrentFileMarkedToDelete={isCurrentFileMarkedToDelete}
            cells_style={cellsStyle}
            nodeId={nodeId}
            tagsForCurrentFile={tagsForCurrentFile}
            filesAndFoldersId={filesAndFoldersId}
            createTag={createTag}
            untag={untag}
            toggleCurrentFileDeleteState={toggleCurrentFileDeleteState}
          />
        </Paper>
      </StyledGrid>
      <StyledGrid item xs={4}>
        <CategoryTitle>{t("report.comments")}</CategoryTitle>
        <Paper>
          <CommentsCell
            is_dummy={!isActive}
            cells_style={cellsStyle}
            comments={currentFileComment}
            filesAndFoldersId={filesAndFoldersId}
            updateComment={updateComment}
          />
        </Paper>
      </StyledGrid>
    </Grid>
  );
};

export default Enrichment;
