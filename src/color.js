


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




