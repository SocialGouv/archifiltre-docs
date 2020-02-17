import React from "react";

import TagListItem from "components/tags/all-tags-item";
import TextAlignCenter from "components/common/text-align-center";

import * as Color from "util/color-util";

import {
  getTagSize,
  sortTags,
  tagHasFfId,
  tagMapHasTags,
  tagMapToArray
} from "../../reducers/tags/tags-selectors";
import { useSelector } from "react-redux";
import { getFilesAndFoldersFromStore } from "../../reducers/files-and-folders/files-and-folders-selectors";
import { getFilesAndFoldersMetadataFromStore } from "../../reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import { withTranslation } from "react-i18next";
import { FaTags } from "react-icons/fa";

const contentStyle = {
  fontSize: "0.8em",
  overflowY: "auto",
  overflowX: "hidden",
  height: "100%"
};

class AllTags extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editing_tag_id: ""
    };

    this.startEditingTagFactory = this.startEditingTagFactory.bind(this);
    this.stopEditingTag = this.stopEditingTag.bind(this);
  }

  startEditingTagFactory(editing_tag_id) {
    return () =>
      this.setState({
        editing_tag_id
      });
  }

  stopEditingTag() {
    this.setState({
      editing_tag_id: ""
    });
  }

  render() {
    const {
      tags,
      filesAndFolders,
      filesAndFoldersMetadata,
      tag_id_to_highlight,
      total_volume,
      focused_node_id,
      highlightTag,
      stopHighlightingTag,
      onDeleteTag,
      onRenameTag,
      onAddTagged,
      onDeleteTagged
    } = this.props;

    const { editing_tag_id } = this.state;

    const { startEditingTagFactory, stopEditingTag } = this;

    const componentStyle = {
      opacity: Object.keys(tags).length > 0 ? 1 : 0.5,
      background: "white",
      height: "100%",
      borderRadius: "5px",
      padding: "0.5em 0 1em 0"
    };

    let tagsContent;

    const computeOpacity = tag_id => {
      if (editing_tag_id.length > 0) {
        if (editing_tag_id === tag_id) {
          return 1;
        } else {
          return 0.2;
        }
      } else {
        if (tag_id_to_highlight.length > 0) {
          if (tag_id_to_highlight === tag_id) {
            return 1;
          } else {
            return 0.2;
          }
        } else {
          return 1;
        }
      }
    };

    // Dummy display for when there aren't any tags yet
    if (!tagMapHasTags(tags)) {
      tagsContent = (
        <div
          className="grid-y grid-frame align-center"
          style={{ height: "75%" }}
        >
          <div className="cell">
            <TextAlignCenter>
              <FaTags
                style={{
                  color: Color.placeholder(),
                  fontSize: "3em",
                  lineHeight: 0
                }}
              />
            </TextAlignCenter>
          </div>
          <div className="cell">
            <TextAlignCenter>
              <em>{this.props.t("workspace.noTags")}</em>
            </TextAlignCenter>
          </div>
        </div>
      );
    } else {
      const tagsList = sortTags(tagMapToArray(tags))
        .map(tag => {
          const size = getTagSize(
            tag,
            filesAndFolders,
            filesAndFoldersMetadata
          );

          const opacity = computeOpacity(tag.id);
          const percentage = Math.floor((size / total_volume) * 100);
          const editing = editing_tag_id === tag.id;
          const shouldDisplayCount = focused_node_id === undefined;
          const nodeHasTag = tagHasFfId(tag, focused_node_id);

          return (
            <TagListItem
              key={tag.id}
              tag={tag.name}
              opacity={opacity}
              editing={editing}
              percentage={percentage}
              shoud_display_count={shouldDisplayCount}
              node_has_tag={nodeHasTag}
              tag_number={tag.ffIds.length}
              highlightTag={highlightTag(tag.id)}
              stopHighlightingTag={stopHighlightingTag}
              startEditingTag={startEditingTagFactory(tag.id)}
              stopEditingTag={stopEditingTag}
              deleteTag={onDeleteTag(tag.id)}
              renameTag={onRenameTag(tag.id)}
              addTagToNode={onAddTagged(focused_node_id, tag.id)}
              removeTagFromNode={onDeleteTagged(focused_node_id, tag.id)}
            />
          );
        })
        .reduce((acc, val) => [...acc, val], []);

      tagsContent = (
        <div style={contentStyle} onMouseLeave={stopHighlightingTag}>
          {tagsList}
        </div>
      );
    }

    return (
      <div style={componentStyle}>
        <div className="grid-y" style={{ height: "100%" }}>
          <div className="cell shrink">
            <TextAlignCenter>
              <b>{this.props.t("workspace.allTags")}</b>
            </TextAlignCenter>
          </div>
          <div className="cell auto">{tagsContent}</div>
        </div>
      </div>
    );
  }
}

const AllTagsApiToProps = ({
  api,
  tags,
  renameTag,
  deleteTag,
  deleteTagged,
  addTagged,
  t
}) => {
  const { icicle_state } = api;
  const filesAndFolders = useSelector(getFilesAndFoldersFromStore);
  const filesAndFoldersMetadata = useSelector(
    getFilesAndFoldersMetadataFromStore
  );

  const rootElementId = "";
  const total_volume = filesAndFoldersMetadata[rootElementId].childrenTotalSize;

  const sequence = icicle_state.sequence();
  const focused_node_id = sequence[sequence.length - 1];

  const tag_id_to_highlight = icicle_state.tagIdToHighlight();

  const highlightTag = tag_id => () => {
    icicle_state.setTagIdToHighlight(tag_id);
  };

  const stopHighlightingTag = () => {
    icicle_state.setNoTagIdToHighlight();
  };

  const onRenameTag = tagId => name => {
    renameTag(tagId, name);
    api.undo.commit();
  };

  const onDeleteTag = tagId => () => {
    deleteTag(tagId);
    icicle_state.setNoTagIdToHighlight();
    api.undo.commit();
  };

  const onAddTagged = (ffId, tagId) => () => {
    if (ffId !== undefined) {
      addTagged(tagId, ffId);
      api.undo.commit();
    }
  };

  const onDeleteTagged = (ffId, tagId) => () => {
    if (ffId !== undefined) {
      deleteTagged(tagId, ffId);
      api.undo.commit();
    }
  };

  return (
    <AllTags
      tag_id_to_highlight={tag_id_to_highlight}
      focused_node_id={focused_node_id}
      total_volume={total_volume}
      highlightTag={highlightTag}
      stopHighlightingTag={stopHighlightingTag}
      onRenameTag={onRenameTag}
      onDeleteTag={onDeleteTag}
      onAddTagged={onAddTagged}
      onDeleteTagged={onDeleteTagged}
      tags={tags}
      filesAndFolders={filesAndFolders}
      filesAndFoldersMetadata={filesAndFoldersMetadata}
      t={t}
    />
  );
};

export default withTranslation()(AllTagsApiToProps);
