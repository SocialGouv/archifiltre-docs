import React from "react";
import _ from "lodash";
import IcicleHightlightTag from "./icicle-highlight-tag";
import { tagMapToArray } from "../../reducers/tags/tags-selectors";

const HIGHLIGHTED_OPACITY = 1;
const NOT_HIGHLIGHTED_OPACITY = 0.2;

export default class IcicleTags extends React.PureComponent {
  constructor(props) {
    super(props);

    this.onClickFactory = this.onClickFactory.bind(this);
    this.onDoubleClickFactory = this.onDoubleClickFactory.bind(this);
    this.onMouseOverFactory = this.onMouseOverFactory.bind(this);
  }

  onClickFactory(id) {
    const props = this.props;

    const onClick = props.onClick;
    const dims = () => props.dims[id];

    return e => onClick({ id, dims }, e);
  }

  onDoubleClickFactory(id) {
    const props = this.props;

    const onDoubleClick = props.onDoubleClick;
    const dims = () => props.dims[id];

    return e => onDoubleClick({ id, dims }, e);
  }

  onMouseOverFactory(id) {
    const props = this.props;

    const onMouseOver = props.onMouseOver;
    const dims = () => props.dims[id];

    return e => onMouseOver({ id, dims }, e);
  }

  render() {
    const props = this.props;
    const { tags } = this.props;
    const dims = props.dims;
    const tag_id_to_highlight = props.tag_id_to_highlight;
    const onClickFactory = this.onClickFactory;
    const onDoubleClickFactory = this.onDoubleClickFactory;
    const onMouseOverFactory = this.onMouseOverFactory;

    const tagArray = tagMapToArray(tags);

    const ffIdsToHighlight = _.uniq(
      tagArray
        .filter(tag => tag_id_to_highlight === tag.id)
        .flatMap(({ ffIds }) => [...ffIds])
    );

    const notHighlightedFFids = _.uniq(
      tagArray
        .filter(tag => tag_id_to_highlight !== tag.id)
        .flatMap(({ ffIds }) => [...ffIds])
    );

    const highlightedComponents = ffIdsToHighlight
      .filter(ffId => dims[ffId])
      .map(ffId => (
        <IcicleHightlightTag
          key={ffId}
          opacity={HIGHLIGHTED_OPACITY}
          ffId={ffId}
          dims={dims[ffId]}
          onClickFactory={onClickFactory}
          onDoubleClickFactory={onDoubleClickFactory}
          onMouseOverFactory={onMouseOverFactory}
        />
      ));

    const notHighlightedComponents = notHighlightedFFids
      .filter(ffId => dims[ffId])
      .map(ffId => (
        <IcicleHightlightTag
          key={ffId}
          opacity={
            tag_id_to_highlight === ""
              ? HIGHLIGHTED_OPACITY
              : NOT_HIGHLIGHTED_OPACITY
          }
          ffId={ffId}
          dims={dims[ffId]}
          onClickFactory={onClickFactory}
          onDoubleClickFactory={onDoubleClickFactory}
          onMouseOverFactory={onMouseOverFactory}
        />
      ));

    return <g>{[...highlightedComponents, ...notHighlightedComponents]}</g>;
  }
}
