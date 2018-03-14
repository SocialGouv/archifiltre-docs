

onmessage = function(e) {
  console.log(e)

  postMessage(JSON.parse(JSON.stringify(e)))
}
