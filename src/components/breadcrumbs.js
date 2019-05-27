import React from "react";

import * as ObjectUtil from "util/object-util";

import BreadCrumbText from "components/breadcrumb-text";
import BreadCrumbPoly from "components/breadcrumb-poly";

import * as Color from "util/color-util";

import pick from "languages";

const file_text = pick({
  en: "File",
  fr: "Fichier"
});

const level_text = pick({
  en: "Level",
  fr: "Niveau"
});

const breadcrumb_dims = { w: 400, h: 300 };

const makeBreadKey = id => "breadcrumbc-" + id;
const removeRootId = arr => arr.slice(1);
const computeCumulative = array => {
  const ans = [0];
  for (let i = 0; i < array.length - 1; i++) {
    ans.push(array[i] + ans[i]);
  }
  return ans;
};

const computeDim = (y, height) => {
  const x_poly = 30;
  const y_poly = y;
  const width_poly = breadcrumb_dims.w / 20;
  const height_poly = height;

  const x_text = (breadcrumb_dims.w * 1) / 7;
  const y_text = y_poly;
  const width_text = (breadcrumb_dims.w * 6) / 7;
  const height_text = height_poly;

  return {
    x_poly,
    y_poly,
    width_poly,
    height_poly,

    x_text,
    y_text,
    width_text,
    height_text
  };
};

class Breadcrumbs extends React.PureComponent {
  constructor(props) {
    super(props);

    this.trueFHeight = this.trueFHeight.bind(this);
    this.computeDim = this.computeDim.bind(this);
  }

  trueFHeight(id) {
    const height = this.props.dy;
    return this.props.trueFHeight(height, id);
  }

  computeDim(y, height) {
    const props = this.props;
    const offset = 30;
    const x = props.x + offset;
    const dx = props.dx - offset;

    const x_poly = x;
    const y_poly = y;
    const width_poly = dx / 20;
    const height_poly = height;

    const remaining_space_dx = dx - width_poly;

    const x_text = x_poly + width_poly + (remaining_space_dx * 1) / 20;
    const y_text = y_poly;
    const width_text = (remaining_space_dx * 19) / 20;
    const height_text = height_poly;

    return {
      x_poly,
      y_poly,
      width_poly,
      height_poly,

      x_text,
      y_text,
      width_text,
      height_text
    };
  }

  render() {
    const trueFHeight = this.trueFHeight;

    const displayName = id => {
      const node = this.props.getFfByFfId(id);
      const n_name = node.get("name");

      const n_alias = node.get("alias");

      const display_name = n_alias === "" ? n_name : n_alias;

      return display_name;
    };

    let res = [];

    if (this.props.isFocused) {
      const breadcrumb_sequence = removeRootId(this.props.breadcrumb_sequence);

      const breadcrumb_sequence_height = breadcrumb_sequence.map(trueFHeight);
      const cumulated_breadcrumb_sequence_height = computeCumulative(
        breadcrumb_sequence_height
      );

      res = breadcrumb_sequence.map((node_id, i) => {
        const fill_color = this.props.fillColor(node_id);

        const display_name = displayName(node_id);

        const is_last = i === breadcrumb_sequence.length - 1;
        const is_first = i === 0;

        const dim = this.computeDim(
          cumulated_breadcrumb_sequence_height[i],
          breadcrumb_sequence_height[i]
        );

        return (
          <g key={makeBreadKey(node_id)}>
            <BreadCrumbPoly
              is_last={is_last}
              is_first={is_first}
              x={dim.x_poly}
              y={dim.y_poly}
              dx={dim.width_poly}
              dy={dim.height_poly}
              fill_color={fill_color}
            />
            <BreadCrumbText
              x={dim.x_text}
              y={dim.y_text}
              dx={dim.width_text}
              dy={dim.height_text}
              text={display_name}
              is_placeholder={false}
            />
          </g>
        );
      });
    } else {
      const height_child = trueFHeight(this.props.root_id);
      const i_max = Math.min(this.props.max_depth, 5);
      const fill_color = Color.placeholder();

      for (let i = 0; i < i_max; i++) {
        const is_last = i === i_max - 1;
        const is_first = i === 0;

        const dim = this.computeDim(i * height_child, height_child);

        let display_name;
        if (is_last) {
          display_name = file_text;
        } else if (i >= 2) {
          display_name = "...";
        } else {
          display_name = level_text + " " + (i + 1);
        }
        res.push(
          <g key={"breadcrumb" + i}>
            <BreadCrumbPoly
              is_last={is_last}
              is_first={is_first}
              x={dim.x_poly}
              y={dim.y_poly}
              dx={dim.width_poly}
              dy={dim.height_poly}
              fill_color={fill_color}
            />
            <BreadCrumbText
              x={dim.x_text}
              y={dim.y_text}
              dx={dim.width_text}
              dy={dim.height_text}
              text={display_name}
              is_placeholder={true}
            />
          </g>
        );
      }
    }

    return (
      <g style={{ opacity: this.props.isFocused ? 1 : 0.3, stroke: "#fff" }}>
        {res}
      </g>
    );
  }
}

export default function BreadcrumbsApiToProps(props) {
  const api = props.api;
  const icicle_state = api.icicle_state;
  const database = api.database;

  const breadcrumb_sequence = icicle_state.sequence();

  const getFfByFfId = database.getFfByFfId;

  const max_depth = database.maxDepth();

  props = ObjectUtil.compose(
    {
      breadcrumb_sequence,
      isFocused: icicle_state.isFocused(),
      max_depth,
      getFfByFfId,
      root_id: database.rootFfId()
    },
    props
  );

  return <Breadcrumbs {...props} />;
}
