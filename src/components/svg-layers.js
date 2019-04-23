import React from "react";

class SvgLayers extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      layers: undefined
    };

    this.ref = this.ref.bind(this);
  }

  ref(dom_element) {
    if (dom_element) {
      const layers = dom_element.children;

      this.setState({
        layers
      });
    }
  }

  render() {
    const state = this.state;
    const layers = state.layers;
    const ref = this.ref;

    return (
      <g>
        <g ref={ref}>
          <g />
          <g />
          <g />
        </g>
        <g style={{ display: "none" }}>
          {layers && this.props.children(layers)}
        </g>
      </g>
    );
  }
}

export default SvgLayers;
