import Grid from "@material-ui/core/Grid";
import React, { FC } from "react";

import Tag from "components/tags/tag";
import MultiLinesInput from "components/tags/multi-lines-input";
import { FaTrash, FaTimes, FaPlus, FaPen } from "react-icons/fa";
import styled from "styled-components";
import { empty } from "../../util/function-util";

const CellShrink = styled(Grid)`
  padding: 0 0.1em;
`;

const Container = styled.div`
  position: relative;
  width: 100%;
  background: none;
  margin: 0;
  padding: 4px 0.5em;
`;

const Item = styled(Grid)`
  opacity: ${({ opacity }) => opacity};
  position: relative;
  z-index: 1;
`;

const Background = styled.div`
  transition: all 0.4s;
  -webkit-transition: all 0.4s;
  height: 100%;
  width: ${({ percentage }) => percentage}%;
  opacity: 0.2;
  background-color: rgb(10, 50, 100);
`;

interface AllTagsItemProps {
  tag;
  opacity: number;
  percentage: number;
  deleteTag: any;
  shoud_display_count: boolean;
  tag_number: number;
  node_has_tag: boolean;
  removeTagFromNode: any;
  addTagToNode: any;
  editing: boolean;
  renameTag: any;
  stopEditingTag: any;
  startEditingTag: any;
  highlightTag: any;
}

const AllTagsItem: FC<AllTagsItemProps> = ({
  tag,
  opacity,
  percentage,
  deleteTag,
  shoud_display_count,
  tag_number,
  node_has_tag,
  removeTagFromNode,
  addTagToNode,
  editing,
  renameTag,
  stopEditingTag,
  startEditingTag,
  highlightTag,
}) => {
  const deleteBubble = (
    <div className="tags_bubble tags_cross" onClick={deleteTag}>
      <FaTrash style={{ width: "50%", height: "50%" }} />
    </div>
  );

  const countOrActionBubble = shoud_display_count ? (
    <div className="tags_bubble tags_count">{tag_number}</div>
  ) : node_has_tag ? (
    <div className="tags_bubble tags_cross" onClick={removeTagFromNode}>
      <FaTimes style={{ width: "50%", height: "50%" }} />
    </div>
  ) : (
    <div className="tags_bubble tags_add" onClick={addTagToNode}>
      <FaPlus style={{ width: "50%", height: "50%" }} />
    </div>
  );

  let tagPill;
  if (editing) {
    tagPill = (
      <MultiLinesInput
        value={tag}
        onFinish={(value) => {
          if (value !== "") {
            renameTag(value);
          }
          stopEditingTag();
        }}
        autofocus={true}
      />
    );
  } else {
    tagPill = (
      <Tag
        text={tag}
        editing={false}
        clickHandler={startEditingTag}
        removeHandler={empty}
        custom_style=""
      />
    );
  }

  const pencil = editing ? (
    <span />
  ) : (
    <FaPen
      className="edit_hover_pencil"
      style={{ opacity: "0.3", paddingLeft: "0.4em" }}
    />
  );

  return (
    <Container
      container
      className="edit_hover_container"
      onMouseEnter={highlightTag}
    >
      <Item container opacity={opacity}>
        <CellShrink item>{deleteBubble}</CellShrink>
        <CellShrink item>{countOrActionBubble}</CellShrink>
        <CellShrink item>{tagPill}</CellShrink>
        <CellShrink item>{pencil}</CellShrink>
      </Item>
      <Background className="background" percentage={percentage} />
    </Container>
  );
};

export default AllTagsItem;
