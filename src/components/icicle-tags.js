import React from 'react'


export default class IcicleTags extends React.PureComponent {
  constructor(props) {
    super(props)

    this.onClickFactory = this.onClickFactory.bind(this)
    this.onDoubleClickFactory = this.onDoubleClickFactory.bind(this)
    this.onMouseOverFactory = this.onMouseOverFactory.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    const ans = {}
    for (let key in this.props) {
      if (prevProps[key] !== this.props[key]) {
        ans[key] = [prevProps[key], this.props[key]]
      }
    }
    if (Object.keys(ans).length > 0) {
      console.log(ans)
    }
  }

  onClickFactory(id) {
    const props = this.props

    const onClick = props.onClick
    const dims = ()=>props.dims[id]

    return e=>onClick({id,dims},e)
  }

  onDoubleClickFactory(id) {
    const props = this.props

    const onDoubleClick = props.onDoubleClick
    const dims = ()=>props.dims[id]

    return e=>onDoubleClick({id,dims},e)
  }

  onMouseOverFactory(id) {
    const props = this.props

    const onMouseOver = props.onMouseOver
    const dims = ()=>props.dims[id]

    return e=>onMouseOver({id,dims},e)
  }

  render() {
    const props = this.props

    const tag_ids = props.tag_ids
    const getTagByTagId = props.getTagByTagId
    const dims = props.dims
    const tag_id_to_highlight = props.tag_id_to_highlight

    const onClickFactory = this.onClickFactory
    const onDoubleClickFactory = this.onDoubleClickFactory
    const onMouseOverFactory = this.onMouseOverFactory


    let components = {}

    tag_ids.forEach(tag_id=>{
      const highlight = tag_id_to_highlight === tag_id
      
      const tag = getTagByTagId(tag_id)
      const ff_ids = tag.get('ff_ids')

      ff_ids.forEach(ff_id=>{
        if (components[ff_id]) {
          components[ff_id] = components[ff_id] || highlight
        } else {
          components[ff_id] = highlight
        }
      })
    })

    for (let key in components) {
      let opacity = 1
      if (tag_id_to_highlight !== '' && components[key] === false) {
        opacity = 0.2
      }

      if (dims[key]) {
        const {x,dx,y,dy} = dims[key]

        components[key] = (
          <rect
            key={key}
            x={x + 1}
            y={y + 1}
            width={dx - 2}
            height='6'
            style={{fill: 'rgb(10, 50, 100)', stroke:'none', opacity}}
            onClick={onClickFactory(key)}
            onDoubleClick={onDoubleClickFactory(key)}
            onMouseOver={onMouseOverFactory(key)}
          />
        )
      }
    }

    return (
      <g>
        {Object.values(components)}
      </g>
    )
  }
}

