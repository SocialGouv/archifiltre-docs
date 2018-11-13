import React from 'react'
const FS = require('fs')
const JSZip = require('jszip')

import { mkB } from 'components/button'

// import * as Csv from 'csv'
import { save, makeNameWithExt } from 'save'
import { recTraverseFileTreeForHook } from 'traverse-file-tree'

import pick from 'languages'

const label = 'SEDA'

const SedaButton = props => {
  const api = props.api
  const database = api.database
  // const getStrList2 = database.toStrList2
  const getManifestStr = database.toManifestStr
  const getSessionName = database.getSessionName
  const getOriginalPath = database.getOriginalPath

  // const manifest_name = () => makeNameWithExt(getSessionName(),'xml')
  const manifest_name = () => makeNameWithExt('manifest','xml')

  const makeSIP = () => {
    let original_path = getOriginalPath()

    let sip = new JSZip()

    sip.file('manifest.xml', getManifestStr())

    let content = sip.folder('content')
    let addToContent = (filename, data) => {
      content.file(filename.replace(/[^a-zA-Z0-9.\\-\\/+=@_]+/g, '_'), data)
    }

    recTraverseFileTreeForHook(addToContent, original_path)

    // sip.generateNodeStream({type:'nodebuffer',streamFiles:true})
    //  .pipe(FS.createWriteStream(original_path + '/../' + getSessionName() + '.zip'))
    //  // .pipe(FS.createWriteStream(original_path + '/../SIP.zip'))
    //  .on('finish', function () {
    //      console.log("SIP zip written.");
    //   });

    sip.generateAsync({type: 'nodebuffer'})
      .then((data) => {
        FS.writeFileSync(original_path + '/../' + getSessionName() + '.zip', data)
        console.log("SIP zip written.")
      })
    
  }

  return mkB(
    ()=>{
      console.log('to SEDA')
      makeSIP()
    },
    label,
    true,
    '#4d9e25',
    {width:'90%'}
  )
}

export default SedaButton

    // STRAY CODE
    
    // let content_path = original_path + '/../Content'
    // let manifest_path = original_path + '/../' + manifest_name()


    // make content folder :
    // if (!FS.existsSync(content_path)) FS.mkdirSync(content_path);
    // else {
    //   // handle if a content folder already exists
    // }

    // copy files to content folder, flat :


    // make xml manifest :
    // FS.writeFileSync(manifest_path, getManifestStr()) // don't let the user select the location

    // zip content folder and manifest together :