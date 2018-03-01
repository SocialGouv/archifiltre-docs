

function files2CSV(files) {
  var treeString
  var index
  var filepath

  for (index = 0; index < files.length; ++index) {
    filepath = files[index].webkitRelativePath.replace(/-/g, '_').replace(/[\/\\]/g, '-')
    treeString += filepath + "," + files[index].size + "\n"
  }

  return treeString
}
