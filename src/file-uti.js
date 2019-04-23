export function readAsText(file) {
  return new Promise((resolve, reject) => {
    let file_reader = new FileReader();
    file_reader.onload = e => {
      resolve(e.currentTarget.result);
    };
    file_reader.readAsText(file);
  });
}

export function readAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    let file_reader = new FileReader();
    file_reader.onload = e => {
      resolve(e.currentTarget.result);
    };
    file_reader.readAsArrayBuffer(file);
  });
}
