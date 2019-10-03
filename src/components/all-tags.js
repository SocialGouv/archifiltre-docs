import React from "react";

import TagListItem from "components/all-tags-item";
import TextAlignCenter from "components/text-align-center";

import * as Color from "util/color-util";

import pick from "languages";
import { sortTags, getTagSize } from "../reducers/tags/tags-selectors.ts";

const all_tags = pick({
  en: "All tags",
  fr: "Tous les tags"
});

const no_tags = pick({
  en: "No tags at the moment.",
  fr: "Aucun tag pour l'instant."
});

const content_style = {
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
    const props = this.props;
    const { tags, filesAndFolders } = props;
    const tag_id_to_highlight = props.tag_id_to_highlight;
    const total_volume = props.total_volume;
    const focused_node_id = props.focused_node_id;

    const state = this.state;

    const editing_tag_id = state.editing_tag_id;

    const startEditingTagFactory = this.startEditingTagFactory;
    const stopEditingTag = this.stopEditingTag;

    const component_style = {
      opacity: tags.length > 0 ? 1 : 0.5,
      background: "white",
      height: "100%",
      borderRadius: "1em",
      padding: "0.5em 0 1em 0"
    };

    let tags_content;

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
    if (tags.length === 0) {
      tags_content = (
        <div
          className="grid-y grid-frame align-center"
          style={{ height: "75%" }}
        >
          <div className="cell">
            <TextAlignCenter>
              <i
                className="fi-pricetag-multiple"
                style={{
                  color: Color.placeholder(),
                  fontSize: "4em",
                  lineHeight: 0
                }}
              />
            </TextAlignCenter>
          </div>
          <div className="cell">
            <TextAlignCenter>
              <em>{no_tags}</em>
            </TextAlignCenter>
          </div>
        </div>
      );
    } else {
      const tags_list = sortTags(Object.values(tags), {})
        .map(tag => {
          const size = getTagSize(tag, filesAndFolders);

          const opacity = computeOpacity(tag.id);

          const percentage = Math.floor((size / total_volume) * 100);

          const editing = editing_tag_id === tag.id;
          const shoud_display_count = focused_node_id === undefined;
          const node_has_tag = tag.ffIds.has(focused_node_id);

          return (
            <TagListItem
              key={tag.id}
              tag={tag.name}
              opacity={opacity}
              editing={editing}
              percentage={percentage}
              shoud_display_count={shoud_display_count}
              node_has_tag={node_has_tag}
              tag_number={tag.ffIds.length}
              highlightTag={props.highlightTag(tag.id)}
              stopHighlightingTag={props.stopHighlightingTag}
              startEditingTag={startEditingTagFactory(tag.id)}
              stopEditingTag={stopEditingTag}
              deleteTag={props.onDeleteTag(tag.id)}
              renameTag={props.onRenameTag(tag.id)}
              addTagToNode={props.onAddTagged(focused_node_id, tag.id)}
              removeTagFromNode={props.onDeleteTagged(focused_node_id, tag.id)}
            />
          );
        })
        .reduce((acc, val) => [...acc, val], []);

      tags_content = (
        <div style={content_style} onMouseLeave={props.stopHighlightingTag}>
          {tags_list}
        </div>
      );
    }

    return (
      <div style={component_style}>
        <div className="grid-y" style={{ height: "100%" }}>
          <div className="cell shrink">
            <TextAlignCenter>
              <b>{all_tags}</b>
            </TextAlignCenter>
          </div>
          <div className="cell auto">{tags_content}</div>
        </div>
      </div>
    );
  }
}

export default ({ api, tags }) => {
  const icicle_state = api.icicle_state;
  const database = api.database;

  const filesAndFolders = api.database.getFilesAndFolders();

  const total_volume = database.volume();

  const sequence = icicle_state.sequence();
  const focused_node_id = sequence[sequence.length - 1];

  const tag_id_to_highlight = icicle_state.tagIdToHighlight();

  const highlightTag = tag_id => () => {
    icicle_state.setTagIdToHighlight(tag_id);
  };

  const stopHighlightingTag = () => {
    icicle_state.setNoTagIdToHighlight();
  };

  const onRenameTag = tag_id => name => {
    database.renameTag(name, tag_id);
    api.undo.commit();
  };

  const onDeleteTag = tag_id => () => {
    database.deleteTag(tag_id);
    icicle_state.setNoTagIdToHighlight();
    api.undo.commit();
  };

  const onAddTagged = (ff_id, tag_id) => () => {
    if (ff_id !== undefined) {
      database.addTagged(ff_id, tag_id);
      api.undo.commit();
    }
  };

  const onDeleteTagged = (ff_id, tag_id) => () => {
    if (ff_id !== undefined) {
      database.deleteTagged(ff_id, tag_id);
      api.undo.commit();
    }
  };

  return (
    <AllTags
      tag_id_to_highlight={tag_id_to_highlight}
      focused_node_id={focused_node_id}
      total_volume={total_volume}
      getTagByTagId={database.getTagByTagId}
      highlightTag={highlightTag}
      stopHighlightingTag={stopHighlightingTag}
      onRenameTag={onRenameTag}
      onDeleteTag={onDeleteTag}
      onAddTagged={onAddTagged}
      onDeleteTagged={onDeleteTagged}
      tags={tags}
      filesAndFolders={filesAndFolders}
    />
  );
};
