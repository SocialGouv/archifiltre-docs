import React from "react";

import * as Color from "util/color-util";

import Icicle from "components/main-space/icicle/icicle-container";
import Report from "components/report/report-container";
import AllTags from "components/tags/all-tags-container";
import NavigationBar from "components/workspace/navigation-bar/navigation-bar";

class Workspace extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      prev_display_root: props.display_root
    };

    this.fillColorFactory = this.fillColorFactory.bind(this);
    this.fillColorType = this.fillColorType.bind(this);
    this.fillColorDate = this.fillColorDate.bind(this);
    this.getChildrenIdFromId = this.getChildrenIdFromId.bind(this);
  }

  componentDidUpdate() {
    const props = this.props;
    const display_root = props.display_root;

    const state = this.state;
    const prev_display_root = state.prev_display_root;

    if (display_root !== prev_display_root) {
      this.setState({
        prev_display_root: display_root
      });
    }
  }

  fillColorFactory() {
    const props = this.props;
    const change_skin = props.change_skin;
    const display_root = props.display_root;

    const state = this.state;
    const prev_display_root = state.prev_display_root;

    if (change_skin) {
      return this.fillColorDate;
    } else {
      if (display_root !== prev_display_root) {
        return (...args) => this.fillColorType(...args);
      } else {
        return this.fillColorType;
      }
    }
  }

  fillColorType(id) {
    const node = this.props.getFfByFfId(id);
    const name = node.name;

    if (node.children.length) {
      if (this.props.display_root.includes(id)) {
        return Color.parentFolder();
      } else {
        return Color.folder();
      }
    } else {
      return Color.fromFileName(name);
    }
  }

  fillColorDate(id) {
    const rootNode = this.props.getFfByFfId(this.props.root_id);
    const maxTime = rootNode.maxLastModified;
    const minTime = rootNode.minLastModified;
    const zeroToOne = id => {
      const node = this.props.getFfByFfId(id);
      const time = node.averageLastModified;
      return (time - minTime) / (maxTime - minTime);
    };

    return Color.toRgba(
      Color.gradient(
        Color.leastRecentDate(),
        Color.mostRecentDate()
      )(zeroToOne(id))
    );
  }

  // TODO: Move this, as this has nothing to do here
  getChildrenIdFromId(id) {
    const node = this.props.getFfByFfId(id);
    const children = node.children;
    const orderArray = this.props.change_skin
      ? node.sortByDateIndex
      : node.sortBySizeIndex;
    return orderArray.map(childIndex => children[childIndex]);
  }

  render() {
    const api = this.props.api;

    const fillColor = this.fillColorFactory();
    return (
      <div className="grid-y grid-frame">
        <div className="cell">
          <div className="grid-x">
            <div className="cell small-10" style={{ paddingRight: ".9375em" }}>
              <Report fillColor={fillColor} api={api} />
            </div>
            <div className="cell small-2">
              <AllTags api={api} />
            </div>
          </div>
        </div>

        <div className="cell">
          <div className="grid-x align-center">
            <div className="cell shrink">
              <NavigationBar api={api} />
            </div>
          </div>
        </div>

        <div className="cell auto">
          <Icicle
            fillColor={fillColor}
            getChildrenIdFromId={this.getChildrenIdFromId}
            api={api}
          />
        </div>
      </div>
    );
  }
}

const WorkspaceApiToProps = props => {
  const api = props.api;
  const icicle_state = api.icicle_state;
  const database = api.database;

  const childProps = {
    ...props,
    getFfByFfId: props.getFfByFfId,
    display_root: icicle_state.display_root(),
    root_id: database.rootFfId(),
    change_skin: icicle_state.changeSkin(),
    width_by_size: icicle_state.widthBySize()
  };

  return <Workspace {...childProps} />;
};

export default WorkspaceApiToProps;
