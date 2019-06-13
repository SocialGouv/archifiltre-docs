import React from "react";

import * as Color from "util/color-util";
import * as ObjectUtil from "util/object-util";

const least_rgba = Color.toRgba(Color.leastRecentDate());
const medium_rgba = Color.toRgba(Color.mediumDate());
const most_rgba = Color.toRgba(Color.mostRecentDate());

class TimeGradient extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      svg_width: 100,
      svg_height: 5
    };
  }

  render() {
    const svg_width = this.state.svg_width;
    const svg_height = this.state.svg_height;

    const cursor_width = svg_width * 0.0075;

    const root_node = this.props.getFfByFfId(this.props.root_id);

    const max_time = root_node.get("last_modified_max");
    const min_time = root_node.get("last_modified_min");
    const zeroToOne = (prop_name, id) => {
      const node = this.props.getFfByFfId(id);

      const time = node.get("last_modified_" + prop_name);
      return (time - min_time) / (max_time - min_time);
    };

    let cursor_array = [];
    if (this.props.id) {
      cursor_array = ["min", "median", "max"];
      cursor_array = cursor_array.map(prop_name => {
        return (
          <g key={prop_name}>
            <rect
              x={
                zeroToOne(prop_name, this.props.id) * svg_width -
                cursor_width / 2
              }
              y={0}
              width={cursor_width}
              height={svg_height}
              fill="black"
            />
          </g>
        );
      });

      cursor_array.push(
        <g key={"average"}>
          <circle
            cx={zeroToOne("average", this.props.id) * svg_width}
            cy={svg_height / 2}
            r={cursor_width}
            fill="red"
          />
        </g>
      );
    }

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={"0 0 " + svg_width + " " + svg_height}
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        ref={this.ref}
      >
        <g>
          <defs>
            <linearGradient
              id="time-gradient-grad1"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" style={{ stopColor: least_rgba }} />
              <stop offset="100%" style={{ stopColor: most_rgba }} />
            </linearGradient>
          </defs>
          <rect
            x={0}
            y={0}
            width={svg_width}
            height={svg_height}
            fill="url(#time-gradient-grad1)"
          />
          {cursor_array}
        </g>
      </svg>
    );
  }
}

export default props => {
  const api = props.api;
  const icicle_state = api.icicle_state;
  const database = api.database;

  const sequence = icicle_state.sequence();

  const id = sequence.slice(-1)[0];

  props = ObjectUtil.compose(
    {
      getFfByFfId: database.getFfByFfId,
      root_id: database.rootFfId(),
      id
    },
    props
  );

  return <TimeGradient {...props} />;
};
