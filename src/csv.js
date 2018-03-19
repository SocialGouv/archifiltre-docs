
import { Set } from 'immutable'
import FileSaver from 'file-saver'


export function exportCsv(csv,optional_name) {
  var blob = new Blob([csv], {type: "text/plain;charset=utf-8"})
  if (optional_name===undefined) {
    optional_name = Set(
        csv.split('\n')
        .map(s=>s.match(/^.*?\//))
        .filter(e=>e!==null)
        .map(e=>e[0].replace('/',''))
      )
      .toArray()
      .join('_')
  }
  FileSaver.saveAs(blob, 'icicle_'+optional_name+'.csv')
}

export function toCsvLine(str_arr) {
  return str_arr.map(a=>`"${a}"`).join(',') + '\n'
}

export function fromCsvLine(csv_line) {
  let arr =
    csv_line.match(/(".*?")|([^,"\s]*)/g)
            .filter(a=>a!=="")
            .map(a=>a.replace(/"/g,''))
  return arr
}
