// @flow

import { Map, Record } from 'immutable'
import { generateRandomString } from 'random-gen'
import duck from 'reducers/duck'

import { toCsvLine, fromCsvLine } from 'csv'

import { tr } from 'dict'

const type = 'cheapExp/database'


function csvLineToVal(csv_line) {
  let arr = fromCsvLine(csv_line)
  if (arr.length === 2) {
    return {
      path:arr[0].split('/'),
      size:arr[1]
    }
  } else {
    return {
      path:arr.slice(0,-1).join('').split('/'),
      size:arr.slice(-1)
    }
  }
}

function filterPath(parent,curr) {
  let ans
  if (parent.length > curr.length) {
    ans = false
  } else if (parent.length===curr.length) {
    ans = curr.map((val,i)=>val===parent[i])
      .reduce((acc,val)=>acc && val,true)
  } else {
    ans = curr.slice(0,parent.length-curr.length)
      .map((val,i)=>val===parent[i])
      .reduce((acc,val)=>acc && val,true)
  }
  return ans
}

function computeSizes(root) {
  let children = root["children"]

  if(children){
    let res = 0
    for (var k = 0; k < children.length; k++) {
      computeSizes(children[k])
      res += children[k]["size"]
    }
    root["size"] = res
  }
}

function sortSizes(root){
  if(root["children"]){
    root["children"] = root["children"].sort((a,b) => {return (a.size < b.size) ? 1 : ((b.size < a.size) ? -1 : 0);} );

    for (var k = 0; k < root["children"].length; k++) {
      sortSizes(root["children"][k])
    }
  }
}


function buildHierarchy(csv) {
  let csv_arr = csv.split('\n')
    .map((row) => {
      return row.split(',').map((cell) => {
        return cell.replace(/"/g, '');
      });
    })

  let id = 0;

  var root = {"name": tr("Back to root"), "children": [], "size": 0, "depth": 0, "id":id};
  for (var i = 0; i < csv_arr.length; i++) {
    var sequence = csv_arr[i][0];
    var size = +csv_arr[i][1];
    if (isNaN(size)) { // e.g. if this is a header row
      continue;
    }
    var parts = sequence.split("/");
    var currentNode = root;
    for (var j = 0; j < parts.length; j++) {
      var children = currentNode["children"]
      var nodeName = parts[j];
      var childNode;
      if (j + 1 < parts.length) {
   // Not yet at the end of the sequence; move down the tree.
  var foundChild = false;
  for (var k = 0; k < children.length; k++) {
    if (children[k]["name"] == nodeName) {
      childNode = children[k];
      foundChild = true;
      break;
    }
  }
  // If we don't already have a child node for this branch, create it.
  if (!foundChild) {
    id++
    childNode = {"name": nodeName, "children": [], "size": 0, "depth": (currentNode["depth"] + 1), "id":id};
    children.push(childNode);
  }
  currentNode = childNode;
      } else {
  // Reached the end of the sequence; create a leaf node.
  id++
  childNode = {"name": nodeName, "size": size,  "depth": (currentNode["depth"] + 1), "id":id};
  children.push(childNode);
  // currentNode["size"] += childNode["size"]
      }
    }
  }

  computeSizes(root)
  sortSizes(root)

  console.log("Built database hierarchy")

  return root;
};



const State = Record({
  map:Map(),
  parent_path:[],
})


function mkS(state) {
  const map = state.get('map')
  const parent_path = state.get('parent_path')
  return {
    toCsv: () => map.reduce((acc,val) => {
      if (filterPath(parent_path, val.path)) {
        return acc + toCsvLine([val.path.join('/'), val.size])
      } else {
        return acc
      }
    },''),
    toCsvNoFilter: () => map.reduce((acc,val) =>
      acc + toCsvLine([val.path.join('/'), val.size])
    ,''),
    size: () => map.size,
    parent_path: () => parent_path.slice(),
    jsObject: () => buildHierarchy(map.reduce((acc,val) => {
      if (filterPath(parent_path, val.path)) {
        return acc + toCsvLine([val.path.join('/'), val.size])
      } else {
        return acc
      }
    },''))
  }
}

const initialState = new State()

const { mkA, reducer } = duck(type, initialState, mkS)

export default reducer

export const create = mkA((path,size) => state => {
  state = state.update('map', a=>a.set(mkId(), {
    path:path.split('/'),
    size
  }))
  return state
})

export const fromCsv = mkA((csv) => state => {
  state = state.update('map', a=>a.withMutations(map => 
    csv.split('\n').forEach(line => map.set(mkId(), csvLineToVal(line)))
  ))
  return state
})

export const reInit = mkA(() => state => initialState)

export const setParentPath = mkA((parent_path) => state => {
  state = state.update('parent_path', ()=>parent_path.slice())
  return state
})

const mkId = () => generateRandomString(40)
