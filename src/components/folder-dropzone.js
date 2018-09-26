import React from 'react'

import AsyncHandleDrop from 'async-handle-drop'

import TextAlignCenter from 'components/text-align-center'

import pick from 'languages'




import { traverseFileTree, isJsonFile, readFileSync, copyFileTree, zipFileTree } from 'traverse-file-tree'
import FileSaver from 'file-saver'





const placeholder = pick({
  en: 'Drop a directory here!',
  fr: 'Glissez-déposez un répertoire ici !',
})

const placeholder_st = pick({
  en: 'You may also drop a JSON file previously exported from Icicle.',
  fr: 'Vous pouvez aussi déposer un fichier JSON précédement exporté depuis Stalactite.',
})

const disclaimer = pick({
  en:(
    <em><br />
      {'Compatible with Firefox and Chrome.'}<br />
      {'Your data won\'t leave your computer. Only you can see what happens in this app.'}
    </em>
  ),
  fr:(
    <em><br />
      Compatible avec Firefox et Chrome.<br />
      Vos données ne quittent pas votre ordinateur ;
      seul•e vous pouvez voir ce qui se passe dans cette application.
    </em>
  ),
})



export default class FolderDropzone extends React.Component {
  constructor(props) {
    super(props)

    this.style_dropzone = {
      border: '0.2em dashed #868686',
      borderRadius: '3em',
    }

    this.style_placeholder = {
      fontSize: '3em',
    }

    this.handleDrop = this.handleDrop.bind(this)
  }

  handleDragover (e) {
    e.preventDefault()
  }

  handleDrop (e) {
    e.preventDefault()




    // console.time('copy') ////////////////////////////////////////
    // let count = 0
    // copyFileTree(()=>{
    //   count++
    //   console.log(count)
    // },e.dataTransfer.files[0].path)
    // console.timeEnd('copy')


    // console.time('zip') ////////////////////////////////////////
    // zipFileTree(()=>{},e.dataTransfer.files[0].path).then((content) => {
    //   FileSaver.saveAs(content, 'example.zip')
    // })
    // console.timeEnd('zip')





    const hook = (a) => {
      this.props.api.loading_state.setStatus(a.status)
      if (a.count) {
        this.props.api.loading_state.setCount(a.count)
      }
    }

    this.props.api.loading_state.startToLoadFiles()
    AsyncHandleDrop(hook,e.dataTransfer.files[0].path)
      .then(vfs => {
        console.log(vfs.toJS())
        this.props.api.database.set(vfs)

        this.props.api.loading_state.finishedToLoadFiles()
        this.props.api.undo.commit()
        console.log('finish handle drop')
      })
  }

  render() {
    return (
      <div
        className='grid-y grid-frame align-center'
        onDragOver={this.handleDragover}
        onDrop={this.handleDrop}
        style={this.style_dropzone}
      >
        <div className='cell'>
          <TextAlignCenter>
            <div style={this.style_placeholder}>{placeholder}</div>
          </TextAlignCenter>
        </div>
        <div className='cell'>
          <TextAlignCenter>
            <div>{placeholder_st}</div>
          </TextAlignCenter>
        </div>
        <div className='cell'>
          <TextAlignCenter>
            <div>{disclaimer}</div>
          </TextAlignCenter>
        </div>
      </div>
    )
  }
}

