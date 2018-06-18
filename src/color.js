
import * as Loop from 'test/loop'



export const gradiant = (a, b) => (zero_to_one) => {
  const ans = a.map((a,i)=>a+(b[i]-a)*zero_to_one)
    .map((a,i)=>{
      if (i !== 3) {
        return Math.round(a)
      } else {
        return a
      }
    })

  return ans
}

export const arbitrary = () => {
  const arbitraryRgb = () => Math.round(Math.random()*255)
  const arbitraryA = () => Math.random()
  return [arbitraryRgb(),arbitraryRgb(),arbitraryRgb(),arbitraryA()]
}

export const setAlpha = (alpha,color) => {
  return color.slice(0,-1).concat([alpha])
}

export const toRgba = a => `rgba(${a[0]}, ${a[1]}, ${a[2]}, ${a[3]})`
export const fromRgba = a => a.split(/rgba\(|, |\)/).filter(a=>a!=='').map(Number)

export const toHex = a => {
  a = a.map(Number).map(a=>{
    a = a.toString(16)
    if (a.length < 2) {
      a = '0'+a
    }
    return a
  })
  return `#${a[0]}${a[1]}${a[2]}`
}
export const fromHex = a => {
  Loop.log(a,a.split(/#|([0-9a-f]{2})/).filter(a=>a&&a!==''))
  a = a.split(/#|([0-9a-f]{2})/).filter(a=>a&&a!=='').map(a=>parseInt(a, 16))
  const default_alpha = 1
  a.push(default_alpha)
  return a
}



export const mostRecentDate = () => [255, 153, 204, 1]
export const leastRecentDate = () => [51, 204, 255, 1]

export const duplicate = () => [255, 0, 0, 1]
export const different = () => [0, 0, 0, 0.5]

const colors = {
  presentation : '#f75b40',
  parent_folder : '#f99a0b',
  folder : '#fabf0b',
  spreadsheet : '#52d11a',
  email: '#13d6f3',
  doc : '#4c78e8',
  multimedia: '#b574f2',
  otherfiles: '#8a8c93',
  placeholder: '#8a8c93'
}

export const folder = () => colors.folder
export const parentFolder = () => colors.parent_folder

export const placeholder = () => colors.placeholder

export const fromFileName = (name) => {
  let m = name.match(/\.[^\.]*$/)

  if (m == null)
    m = ['']


  switch (m[0].toLowerCase()) {
    case '.xls': //formats Microsoft Excel
    case '.xlsx':
    case '.xlsm':
    case '.xlw': // dont les vieux
    case '.xlt':
    case '.xltx':
    case '.xltm':
    case '.csv': // format Csv
    case '.ods': //formats OOo/LO Calc
    case '.ots':
      return colors.spreadsheet;
    case '.doc':  //formats Microsoft Word
    case '.docx':
    case '.docm':
    case '.dot':
    case '.dotx':
    case '.dotm':
    case '.odt': // formats OOo/LO Writer
    case '.ott':
    case '.txt': // formats texte standard
    case '.rtf':
      return colors.doc;
    case '.ppt': // formats Microsoft PowerPoint
    case '.pptx':
    case '.pptm':
    case '.pps':
    case '.ppsx':
    case '.pot':
    case '.odp': // formats OOo/LO Impress
    case '.otp':
    case '.pdf': // On considère le PDF comme une présentation
      return colors.presentation;
    case '.eml': //formats d'email et d'archive email
    case '.msg':
    case '.pst':
      return colors.email;
    case '.jpeg': //formats d'image
    case '.jpg':
    case '.gif':
    case '.png':
    case '.bmp':
    case '.tiff':
    case '.mp3': //formats audio
    case '.wav':
    case '.wma':
    case '.avi':
    case '.wmv': //formats vidéo
    case '.mp4':
    case '.mov':
    case '.mkv':
      return colors.multimedia;
    default:
      return colors.otherfiles;
  }
}




