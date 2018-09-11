
import React from 'react'
import * as ArrayUtil from 'util/array-util'
import * as ObjectUtil from 'util/object-util'


export default class IcicleRecursive extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  makeKey(id) {
    return 'icicle-recursive-'+id
  }

  mapper(shouldRenderChild,x,width,y,height,componentsPropsEnhancer,Components,id) {
    const should_render_child = shouldRenderChild(x, width, id)
    if (should_render_child === false) {
      return false
    }

    const current_components_props = ObjectUtil.compose({
      x,
      y,
      dx:width,
      dy:height, 
    },componentsPropsEnhancer({
      id,
      x,
      y,
      dx:width,
      dy:height, 
    }))

    return <Components {...current_components_props}/>
  }

  render() {
    const props = this.props

    const layers = props.layers
    // const Components = props.Components
    // const componentsPropsEnhancer = props.componentsPropsEnhancer
    // const shouldRenderChild = props.shouldRenderChild

    const id = props.id
    const x = props.x
    const width = props.width
    const y = props.y
    const height = props.height

    const getChildrenIdFromId = props.getChildrenIdFromId
    const fWidth = props.fWidth
    const normalizeWidth = props.normalizeWidth
    const trueFHeight = props.trueFHeight

    const makeKey = this.makeKey

    const computeCumulative = ArrayUtil.computeCumulative

    const mapper = this.mapper


    const children = getChildrenIdFromId(id)
    const children_width = normalizeWidth(children.map(fWidth)).map(a=>a*width)
    const cumulated_children_width = computeCumulative(children_width)

    const children_height = children.map(trueFHeight)

    const children_component = children.map((child_id,i) => {
      const x_child = x + cumulated_children_width[i]
      const width_child = children_width[i]

      const y_child = y
      const height_child = children_height[i]

      const components = layers.map(({shouldRender,Components,propsEnhancer},i) => (
        <g key={i}>
          {
            mapper(
              shouldRender,
              x_child,
              width_child,
              y_child,
              height_child,
              propsEnhancer,
              Components,
              child_id
            )
          }
        </g>
      ))

      const shouldContinue = components.reduce((acc,val)=>acc||val!==false,false)


      const x_prime = x_child
      const width_prime = width_child
      const y_prime = y_child + height_child
      const height_prime = height - height_child

      return (
        <g key={makeKey(child_id)}>
          {shouldContinue &&
            <g>
              {components}
              <IcicleRecursive
                x={x_prime}
                y={y_prime}
                width={width_prime}
                height={height_prime}
                id={child_id}

                fWidth={fWidth}
                normalizeWidth={normalizeWidth}
                trueFHeight={trueFHeight}
                getChildrenIdFromId={getChildrenIdFromId}

                layers={layers}
              />
            </g>
          }
        </g>
      )
    })

    return (
      <g>
        {children_component}
      </g>
    )
  }
}




