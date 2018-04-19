// @flow

import { Map } from 'immutable'
import { generateRandomString } from 'random-gen'
import duck from 'reducers/duck'

import { toCsvLine, fromCsvLine } from 'csv'

import { tr } from 'dict'


const type = 'cheapExp/database'

const key = Symbol()


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


function buildHierarchy(csv) {
  console.log(csv)
  let csv_arr = csv.split("\n").map(function(row){return row.split(",");})
  console.log(csv_arr)
    // Take a 2-column Csv and transform it into a hierarchical structure suitable
    // for a partition layout. The first column is a sequence of step names, from
    // root to leaf, separated by hyphens. The second column is a count of how 
    // often that sequence occurred.
    var root = {"name": tr("Back to root"), "children": []};
    for (var i = 0; i < csv_arr.length; i++) {
      var sequence = csv_arr[i][0];
      var size = +csv_arr[i][1];
      if (isNaN(size)) { // e.g. if this is a header row
        continue;
      }
      var parts = sequence.split("/");
      var currentNode = root;
      for (var j = 0; j < parts.length; j++) {
        var children = currentNode["children"];
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
      childNode = {"name": nodeName, "children": []};
      children.push(childNode);
    }
    currentNode = childNode;
        } else {
    // Reached the end of the sequence; create a leaf node.
    childNode = {"name": nodeName, "size": size};
    children.push(childNode);
        }
      }
    }
    console.log(root)
    return root;
  };


function mkS(map,parent_path) {
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
    [key]: {
      map,
      parent_path
    },
    jsObject: () => buildHierarchy(map.reduce((acc,val) => {
      if (filterPath(parent_path, val.path)) {
        return acc + toCsvLine([val.path.join('/'), val.size])
      } else {
        return acc
      }
    },''))
  }
}

const initialState = mkS(Map(),[])

const { mkA, reducer } = duck(type, initialState)

export default reducer

export const create = mkA((path,size) => state =>
  mkS(state[key].map.set(mkId(), {
    path:path.split('/'),
    size
  }), state[key].parent_path)
)

export const fromCsv = mkA((csv) => state =>
  mkS(state[key].map.withMutations(map => 
    csv.split('\n').forEach(line => map.set(mkId(), csvLineToVal(line)))
  ), state[key].parent_path)
)

export const reInit = mkA(() => state => initialState)

export const setParentPath = mkA((parent_path) => state =>
  mkS(state[key].map, parent_path.slice())
)

const mkId = () => generateRandomString(40)
