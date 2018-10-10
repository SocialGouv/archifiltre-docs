
import React from 'react'

import ReactDOM from 'react-dom'

import ErrorBoundary from 'components/error-boundary'
import MainSpace from 'components/main-space'
import Header from 'components/header'
import ANewVersionIsAvailable from 'components/a-new-version-is-available'

import WindowResize from 'components/window-resize'

import 'css/app.css'

import { generateRandomString } from 'random-gen'

import { Store } from 'reducers/store'

import version from 'version'
import pick from 'languages'









// import * as NodeFsUtil from 'util/node-fs-util'

// const Fs = require('fs')
// try {
//   Fs.rmdirSync('/home/jibe/Desktop/tmp')
// } catch(e) {}

// let count

// console.time('all')
// console.time('copy')
// count = 0
// NodeFsUtil.cp(()=>{
//   count++
//   console.log(count)
// // },'/home/jibe/Desktop/CHOMA2010','/home/jibe/Desktop/copy')
// },'/home/jibe/Desktop/folder','/home/jibe/Desktop/tmp/a1')
// console.timeEnd('copy')

// console.time('tar')
// count = 0
// NodeFsUtil.tar2(()=>{
//   count++
//   console.log(count)
// },'/home/jibe/Desktop/tmp/a1','/home/jibe/Desktop/tmp/a2.tar')
// .then(()=>{
//   console.timeEnd('tar')
//   console.time('gzip')
//   count = 0
//   NodeFsUtil.cp(()=>{},'/home/jibe/Desktop/input.json','/home/jibe/Desktop/tmp/a3/input.json')
//   // return NodeFsUtil.gzip('/home/jibe/Desktop/tmp/a2.tar','/home/jibe/Desktop/tmp/a3/a3.tar.gz')
// })
// .then(()=>{
//   console.timeEnd('gzip')
//   console.time('last step')
//   return NodeFsUtil.tar2(()=>{},'/home/jibe/Desktop/tmp/a3','/home/jibe/Desktop/tmp/a4.tar')
// })
// // .then(()=>{
// //   return NodeFsUtil.extractByName(
// //     'input.json',
// //     '/home/jibe/Desktop/tmp/a4.tar',
// //     '/home/jibe/Desktop/tmp'
// //   )
// // })
// .then(()=>{
//   console.log('ZZZZZZZZZZZZZZ')
//   return NodeFsUtil.packByName(
//     'ttttttttt',
//     'a3/input.json',
//     '/home/jibe/Desktop/tmp/a4.tar',
//     '/home/jibe/Desktop/tmp/a4.2.tar'
//   )
// })
// // .then(()=>{
// //   console.timeEnd('last step')
// //   console.log('AAAAAAAAAAAAAA')
// //   return NodeFsUtil.untar(()=>{},'/home/jibe/Desktop/tmp/a4.2.tar','/home/jibe/Desktop/tmp/a5')
// // })
// // .then(()=>{
// //   console.log('BBBBBBBBBBBBBB')
// //   return NodeFsUtil.gunzip('/home/jibe/Desktop/tmp/a5/a3.tar.gz','/home/jibe/Desktop/tmp/a6.tar')
// // })
// // .then(()=>{
// //   console.log('CCCCCCCCCCCCCC')
// //   return NodeFsUtil.untar(()=>{},'/home/jibe/Desktop/tmp/a6.tar','/home/jibe/Desktop/tmp/a7')
// // })
// // .then(()=>{
// //   console.timeEnd('all')
// // })






// import * as NodeFsUtil from 'util/node-fs-util'

// const Fs = require('fs')
// const Path = require('path')

// const Tar = require('tar-stream')

// const extractTest = () => {

//   const read_stream = Fs.createReadStream('/home/jibe/Desktop/folder.tar')

//   const extract = Tar.extract()
   
//   extract.on('entry', function(header, stream, next) {
//     // header is the tar header
//     // stream is the content body (might be an empty stream)
//     // call next when you are done with this entry

//     // console.log(header)

//     if (header.type === 'file' && header.name === 'input.txt') {
//       const path = '/home/jibe/Desktop/baba/'+header.name
//       NodeFsUtil.mkdir(Path.dirname(path))
//       const write_stream = Fs.createWriteStream(path)
//       stream.pipe(write_stream)
//     }

//     stream.on('end', function() {
//       next() // ready for next entry
//     })
   
//     stream.resume() // just auto drain the stream
//   })
   
//   extract.on('finish', function() {
//     // all entries read
//   })

//   console.time('tar')
//   read_stream.pipe(extract)
//   .on('finish',()=>console.timeEnd('tar'))
// }




// const packTest = () => {
//   const pack = Tar.pack()
//   const extract = Tar.extract()

//   const read_stream = Fs.createReadStream('/home/jibe/Desktop/folder.tar')

//   const write_stream = Fs.createWriteStream('/home/jibe/Desktop/baba.tar')

//   extract.on('entry', function(header, stream, callback) {
//     if (header.type === 'file' && header.name === 'input.txt') {
//       // let's prefix all names with 'tmp'
//       header.name = Path.join('tmp', header.name)
//       pack.entry(header,'tttttt', callback)
//     } else {
//       // write the new entry to the pack stream
//       stream.pipe(pack.entry(header, callback))
//     }
//   })
   
//   extract.on('finish', function() {
//     // all entries done - lets finalize it
//     pack.finalize()
//   })


//   console.time('pack')
//   read_stream.pipe(extract)
//   pack.pipe(write_stream)
//   .on('finish',()=>console.timeEnd('pack'))
// }



















document.title = pick({
  en:'icicle v'+version+' - archifiltre',
  fr:'stalactite v'+version+' - archifiltre',
})


// import Analytics from 'electron-ga' // development

// const analytics = new Analytics('UA-115293619-2') // development

// analytics.send('pageview',{ // development
//   dh:'https://archifiltre.electron/', // development
//   dp:'/electron/v9', // development
//   dt:'archifiltre', // development
// }) // development





const app = () => {
  let root_div = document.createElement('div')
  root_div.setAttribute('id','root')

  if (document.body !== null) {
    document.body.appendChild(root_div)
  }


  ReactDOM.render(
    <Store>
      {props => {
        const api = props.api
        return (
          <ErrorBoundary api={api}>
            <WindowResize/>
            <div className='grid-y grid-frame'>
              <div className='cell'>
                <ANewVersionIsAvailable/>
              </div>
              <div className='cell'>
                <Header api={api}/>
              </div>
              <div className='cell auto'>
                <MainSpace api={api}/>
              </div>
            </div>
          </ErrorBoundary>
        )
      }}
    </Store>
    ,
    root_div
  )
}

window.onload = app

document.ondragover = document.ondrop = (ev) => {
  ev.preventDefault()
  return false
}

window.ondragover = window.ondrop = (ev) => {
  ev.preventDefault()
  return false
}
