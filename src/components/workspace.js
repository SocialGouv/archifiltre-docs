import React from "react";

import * as Color from "util/color-util";
import * as ObjectUtil from "util/object-util";
import * as Cache from "util/cache-util";

import Icicle from "components/icicle/icicle-container";

import Report from "components/report";
import AllTags from "components/all-tags";
import NavigationBar from "components/navigation-bar";

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

  componentDidUpdate(prevProps, prevState) {
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
    const name = node.get("name");

    if (node.get("children").size) {
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
    const root_node = this.props.getFfByFfId(this.props.root_id);
    const max_time = root_node.get("last_modified_max");
    const min_time = root_node.get("last_modified_min");
    const zeroToOne = id => {
      const node = this.props.getFfByFfId(id);
      const time = node.get("last_modified_average");
      return (time - min_time) / (max_time - min_time);
    };

    return Color.toRgba(
      Color.gradient(Color.leastRecentDate(), Color.mostRecentDate())(
        zeroToOne(id)
      )
    );
  }

  getChildrenIdFromId(id) {
    const node = this.props.getFfByFfId(id);
    const children = node.get("children");
    if (this.props.change_skin) {
      const sort_by_date_index = node
        .get("sort_by_date_index")
        .map(a => children.get(a));

      return sort_by_date_index.toJS();
    } else {
      const sort_by_size_index = node
        .get("sort_by_size_index")
        .map(a => children.get(a));

      return sort_by_size_index.toJS();
    }
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

export default props => {
  const api = props.api;
  const icicle_state = api.icicle_state;
  const database = api.database;

  props = ObjectUtil.compose(
    {
      getFfByFfId: database.getFfByFfId,
      display_root: icicle_state.display_root(),
      root_id: database.rootFfId(),
      change_skin: icicle_state.changeSkin()
    },
    props
  );

  return <Workspace {...props} />;
};
