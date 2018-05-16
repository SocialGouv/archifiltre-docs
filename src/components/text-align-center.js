import React from 'react'


const style = {
  textAlign:'center'
}


export default function(props) {
  return (
    <div style={style}>
      {props.children}
    </div>
  )
}