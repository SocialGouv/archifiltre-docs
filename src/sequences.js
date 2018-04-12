import { tr } from 'dict'

import d3 from 'd3'

export function plot(csv_string, setParentPath, parent_path) {

  d3.select("#chart").selectAll("svg").remove()
  d3.select("#sequence").selectAll("svg").remove()


  // Dimensions of sunburst.
  var width = 800;
  var height = 300;

  var font_width = 7;


  // Breadcrumb dimensions: width, height, spacing, width of tip/tail.
  var b = {
    w: 400, h: null, s: 0.25, t: 5, o: 20
  };

  // Mapping of step names to colors.
  var colors = {
    presentation : {label: tr("Presentation"), color:"#f75b40"},
    parent_folder : {label: tr("Root"), color: "#f99a0b"},
    folder : {label: tr("Folder"), color:"#fabf0b"},
    spreadsheet : {label: tr("Spreadsheet"), color:"#52d11a"},
    email: {label: tr("E-mail"), color:"#13d6f3"},
    doc : {label: tr("Document"), color:"#4c78e8"},
    multimedia: {label: tr("Multimedia"), color:"#b574f2"},
    otherfiles : {label: tr("Others"), color:"#8a8c93"}
  };



  function isAParentFolder(path) {
    if (path.length>parent_path.length) {
      return false
    } else {
      return path.map((val,i)=>val===parent_path[i])
          .reduce((acc,val)=>acc&&val,true)
    }
  }

  function colorOf(name, children, path) {
    
    if (children !== undefined) {
      if (isAParentFolder(path)) {
        return colors.parent_folder.color;
      } else {
        return colors.folder.color;
      }
    } else {
      var m = name.match(/\.[^\.]*$/)

      if (m == null)
        m = [""]


      switch(m[0].toLowerCase()){
        case ".xls": //formats Microsoft Excel
        case ".xlsx":
        case ".xlsm":
        case ".xlw": // dont les vieux
        case ".xlt":
        case ".xltx":
        case ".xltm":
        case ".csv": // format Csv
        case ".ods": //formats OOo/LO Calc
        case ".ots":
          return colors.spreadsheet.color;
        case ".doc":  //formats Microsoft Word
        case ".docx":
        case ".docm":
        case ".dot":
        case ".dotx":
        case ".dotm":
        case ".odt": // formats OOo/LO Writer
        case ".ott":
        case ".txt": // formats texte standard
        case ".rtf":
          return colors.doc.color;
        case ".ppt": // formats Microsoft PowerPoint
        case ".pptx":
        case ".pptm":
        case ".pps":
        case ".ppsx":
        case ".pot":
        case ".odp": // formats OOo/LO Impress
        case ".otp":
        case ".pdf": // On considère le PDF comme une présentation
          return colors.presentation.color;
        case ".eml": //formats d'email et d'archive email
        case ".msg":
        case ".pst":
          return colors.email.color;
        case ".jpeg": //formats d'image
        case ".jpg":
        case ".gif":
        case ".png":
        case ".bmp":
        case ".tiff":
        case ".mp3": //formats audio
        case ".wav":
        case ".wma":
        case ".avi":
        case ".wmv": //formats vidéo
        case ".mp4":
        case ".mov":
        case ".mkv":
          return colors.multimedia.color;
        default:
          return colors.otherfiles.color;
        }

      }
    }

  

  function remakePath(d) {
    if (d.parent) {
      return remakePath(d.parent).concat([d.name])
    } else {
      return []
    }
  }

  function pathToStr(p) {
    return p.join('/')
  }


  // Total size of all segments; we set this later, after loading the data.
  var totalSize = 0; 

  var vis = d3.select("#chart").append("svg:svg")
      .attr("xmlns", "http://www.w3.org/2000/svg")
      // .attr("viewBox", "0 0 900 500")
     .attr("viewBox", "0 0 "+width+" "+height)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .append("svg:g")
      .attr("id", "container");

  var partition = d3.layout.partition()
      .size([width, height])
      .value(function(d) { return d.size; });

  // Use d3.text and d3.csv.parseRows so that we do not need to have a header
  // row, and can receive the csv as an array of arrays.

  var csv = d3.csv.parseRows(csv_string);
  var json = buildHierarchy(csv);

  const chart_dims = {
    node_height:null,
    chart_depth:null
    }

  createVisualization(json);


  // Main function to draw and set up the visualization, once we have the data.
  function createVisualization(json) {

    // Bounding rect underneath the chart, to make it easier to detect
    // when the mouse leaves the parent g.
    vis.append("svg:rect")
      .attr("width", width)
      .attr("height", height)
      .style("opacity", 0);

    // For efficiency, filter nodes to keep only those large enough to see.
    var nodes = partition.nodes(json)
      .filter(function(d) {
      return (d.dx > 0.5);
      });

    chart_dims.node_height = nodes[0].dy
    chart_dims.chart_depth = nodes.reduce((acc,val) => {return (val.depth > acc ? val.depth : acc)}, 0)

    initializeBreadcrumbTrail()
    initializeReport()
    initializeRuler()

    var node = vis.data([json]).selectAll(".node")
      .data(nodes)
      .enter();

    node.append("rect")
      .attr("class", "node")
      .attr("x", function(d) { return d.x; })
      .attr("y", function(d) { return d.y; })
      .attr("width", function(d) { return d.dx; })
      .attr("height", function(d) { return d.dy; })
      .attr("display", function(d) { return d.depth ? null : "none"; })
      .style("fill", function(d) { return colorOf(d.name, d.children, remakePath(d)); })
      .style("opacity", 1)
      .on("mouseover", mouseover)
      // .on("dblclick", onDoubleClickHandler)
      .on("click", function(d){event.stopPropagation(); clickBalancer(d);});

    node.append("text")
      .attr("class", function(d) { return d.depth ? "node-text" : null; })
      .attr("x", function(d) { return d.x; })
      .attr("y", function(d) { return d.y; })
      .attr("dx", function(d) { return d.dx/2; })
      .attr("dy", function(d) { return d.dy/1.5; })
      .attr("text-anchor", "middle")
      .attr("stroke", "none")
      .attr("display", function(d) { return d.depth || parent_path.length ? null : "none"; })
      .attr("visibility", function(d) {
        if (width/10 < d.dx || d.name.length*5 < d.dx) {
          return "visible"
        } else {
          return "hidden"
        }
      })
      .style("font-size", function(d) { if(d.name.length*font_width < d.dx){ return "1em"; } else { return "0.7em"; } })
      .text(function(d) {if(d.name.length*font_width < d.dx){ return smartClip(d.name, d.dx, font_width); } else { return smartClip(d.name, d.dx, 5); } })
      // .on("dblclick", onDoubleClickHandler)
      .on("mouseover", mouseover)
      .on("click", function(d){event.stopPropagation(); clickBalancer(d);});



    // Add the mouseleave handler to the bounding rect.
    d3.select("#container")
      .on("mouseleave", mouseleave)
      .on("click", unlockNodes)

    // Get total size of the tree = value of root node from partition.
    totalSize = node.node().__data__.value;
   };


  // ################### AUXILIARY FUNCTIONS ##################

  function smartClip(s, w, fw){
    var target_size = Math.floor(w/fw)
    var slice = Math.floor(target_size/2)

    if(s.length > target_size){
      return s.substring(0, slice-2) + "..." + s.substring(s.length - slice + 2, s.length)
    }
    else{
      return s
    }
  }

  function octet2HumanReadableFormat(o) {
    let To = o/Math.pow(1000,4)
    if (To > 1) {
      return Math.round(To * 10)/10 + ' To'
    }
    let Go = o/Math.pow(1000,3)
    if (Go > 1) {
      return Math.round(Go * 10)/10 + ' Go'
    }
    let Mo = o/Math.pow(1000,2)
    if (Mo > 1) {
      return Math.round(Mo * 10)/10 + ' Mo'
    }
    let ko = o/1000
    if (ko > 1) {
      return Math.round(ko * 10)/10 + ' ko'
    }
    return o + ' o'
  }

  function precisionRound(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  }

  function makeSizeString(d){
    let sizeString = octet2HumanReadableFormat(d.value)

    var percentage = precisionRound((100 * d.value / totalSize),1);
    var percentageString = percentage + "%";
    if (percentage < 0.1) {
      percentageString = "< 0.1%";
    }

    return percentageString + " | " + sizeString
  }

  function computeRulerTextDisplayMode(candidate_position, text_length, w, fw){
    if(candidate_position < text_length*fw){
      return "LEFT"
    }
    else if(candidate_position > w - (text_length*fw)){
      return "RIGHT"
    }
    else{
      return "ORGANIC"
    }
  }

  // Given a node in a partition layout, return an array of all of its ancestor
  // nodes, highest first, but excluding the root.
  function getAncestors(node) {
    var path = [];
    var current = node;
    while (current.parent) {
      path.unshift(current);
      current = current.parent;
    }
    return path;
  }

  function computeBW(len) {
    return 300
  }

  function computeOpacity(d, nodeArray){
    // return Math.pow(d.depth / nodeArray.length, 1);
    return (d.depth === nodeArray.length ? 1 : 0);
  }

  function breadcrumbPoints(d, i, o, t, w, s) {
    //   var h = d.dy
    //   var y = d.y + i*s

    //   var points = [];
    //   points.push("0," + y);
    //   if (i > 0) { // Topmost breadcrumb; don't include upper notch.
    //     points.push(((w-o)/2) + "," + y);
    //     points.push((w/2) + "," + (y+t));
    //     points.push(((w+o)/2) + "," + y);
    //   }
    //   points.push(w + "," + y);
    //   points.push(w + "," + (y+h));

    //   if(d.children !== undefined){
    //     points.push(((w+o)/2) + "," + (y+h));
    //     points.push((w/2) + "," + (y+h+t)); // lower notch
    //     points.push(((w-o)/2) + "," + (y+h));
    //   }

    //   points.push("0," + (y+h));
    //   return points.join(" ");
    var h = d.dy
    var y = d.y + i*s
    var w2 = w/20

    var points = [];
    points.push("0," + y);
    if (i > 0) { // Topmost breadcrumb; don't include upper notch.
      points.push((w2/2) + "," + (y+t));
    }
    points.push(w2 + "," + y);
    points.push(w2 + "," + (y+h));

    if(d.children !== undefined){
      points.push((w2/2) + "," + (y+h+t)); // lower notch
    }

    points.push("0," + (y+h));
    return points.join(" ");
  }


  function buildHierarchy(csv) {
    // Take a 2-column Csv and transform it into a hierarchical structure suitable
    // for a partition layout. The first column is a sequence of step names, from
    // root to leaf, separated by hyphens. The second column is a count of how 
    // often that sequence occurred.
    var root = {"name": tr("Back to root"), "children": []};
    for (var i = 0; i < csv.length; i++) {
      var sequence = csv[i][0];
      var size = +csv[i][1];
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
    return root;
  };

  // ################### EVENT HANDLING ##################

  // ### CLICK EVENTS

  function onDoubleClickHandler (d) {
    unlockNodes(d)
    setParentPath(remakePath(d))
  }

  function onClickHandler (d) {
    if(d.depth){
      lockNode(d)
    }
  }

  var clickStack = 0

  function clickBalancer(d) {
    clickStack++;
    if(clickStack > 1){
      onDoubleClickHandler(d);
    }
    else{
      setTimeout(function(){
      if(clickStack <= 1){ onClickHandler(d); }
      clickStack = 0;}
      ,210)
    }

  }

  function lockNode(d){
    mouseover(d)

    d3.selectAll(".node, .node-text")
      .on("mouseover", function(d2){mouseoverAlt(d2, d)})
    d3.select("#container").on("mouseleave", function(d2){mouseleaveAlt(d2, d)});

    updateReport(d)
    updateRuler(d)
  }

  function unlockNodes(d){
    d3.selectAll(".node, .node-text")
      .on("mouseover", mouseover)
      .style("opacity", 1)
    d3.select("#container").on("mouseleave", mouseleave)
    d3.select("#container").on("mouseover", null);
    makeDummyReport()
    makeDummyBreadcrumbs()
    makeDummyRuler()
  }

  // ### MOUSE MOTION EVENTS


  // Fade all but the current sequence, and show it in the breadcrumb trail.
  function mouseover(d) {

    updateReport(d)
    

    var sequenceArray = getAncestors(d);
    updateBreadcrumbs(sequenceArray)
    updateRuler(sequenceArray)

    // Fade all the segments.
    d3.selectAll(".node, .node-text")
        .style("opacity", 0.3);

    // Then highlight only those that are an ancestor of the current segment.
    vis.selectAll(".node, .node-text")
        .filter(function(node) {
                  return (sequenceArray.indexOf(node) >= 0);
                })
        .style("opacity", 1);
  }

  function mouseoverAlt(d, locked_node) {
    var sequenceArray = getAncestors(d);

    vis.selectAll(".node, .node-text")
        .filter(function(node) {
                  return (getAncestors(locked_node).indexOf(node) < 0);
                })
        .style("opacity", 0.3);

    // highlight only those that are an ancestor of the current segment.
    vis.selectAll(".node, .node-text")
        .filter(function(node) {
                  return (sequenceArray.indexOf(node) >= 0 && getAncestors(locked_node).indexOf(node) < 0);
                })
        .style("opacity", 0.5);
  }


  // Restore everything to full opacity when moving off the visualization.
  function mouseleave(d) {
    // Hide the breadcrumb trail
    // fadeBreadCrumbs();

    // Transition each segment to full opacity and then reactivate it.
    // d3.selectAll(".node, .node-text")
    //     .style("opacity", 1)
  }

  function mouseleaveAlt(d, locked_node) {
    vis.selectAll(".node, .node-text")
        .filter(function(node) {
                  return (getAncestors(locked_node).indexOf(node) < 0);
                })
        .style("opacity", 0.3);
  }

  // ################### CREATE AND UPDATE UI FEEDBACK ##################

  function initializeBreadcrumbTrail() {
    // Add the svg area.
    var trail = d3.select("#sequence").append("svg:svg")
        // .attr("width", width)
        // .attr("height", 200)
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .attr("viewBox", "0 0 " + b.w + " " + height)
        .attr("id", "trail")

    makeDummyBreadcrumbs()

  }

  function initializeReport(){
    makeDummyReport()
  }

  function initializeRuler(){
    var ruler = d3.select("#ruler").append("svg:svg")
      .attr("xmlns", "http://www.w3.org/2000/svg")
      .attr("viewBox", "0 0 "+width+" "+height)
      .append("svg:g")
        .attr("id", "rulermarks")
        // .style("stroke", "none")
        .append("svg:text")
          .attr("id", "rulertext")
          .text("")
  }

  function makeDummyBreadcrumbs(){
    var dummy_bc = []
    var bc_height = chart_dims.node_height;
    var bc_depth = chart_dims.chart_depth;

    for(let i = 0; i < bc_depth; i++){
      dummy_bc.push({
        name:(i < bc_depth-1 ? tr("Folder") + " " + (i+1) : tr("File")),
        children:(i < bc_depth-1 ? [] : undefined),
        parent: (i ? dummy_bc[i-1] : null),
        depth:i+1,
        dx: 0,
        dy: bc_height,
        value: 0,
        x: 0,
        y: bc_height*(i+1)
        })

      for(let j = 0; j < i; j++){
        dummy_bc[j].children.push(dummy_bc[i])
      }
    }

    var g = d3.select("#trail")
        .selectAll("g")
        .data(dummy_bc, function(d) { return d.name + d.depth; });

    var entering = g.enter().append("svg:g");

    entering.append("svg:polygon")
        .attr("points", function(d, i) {return breadcrumbPoints(d, i, b.o, b.t, b.w, b.s)})
        .style("fill", colors.otherfiles.color);

      entering.append("svg:text")
    .attr("x", b.w/14)
    .attr("y", function(d) { return d.y; })
    .attr("dx", 0)
    .attr("dy", function(d, i) { return (d.dy/1.5 + i*b.s); })
    .attr("text-anchor", "left")
    .attr("stroke", "none")
    .style("font-weight", "bold")
    .text(function(d) {return d.name})

    // Remove exiting nodes.
    g.exit().remove();

    // Make the breadcrumb trail visible, if it's hidden.
    d3.select("#trail")
        .style("opacity", "0.3")
    
  }

  function makeDummyReport(){
    d3.select("#report")
      .style('opacity',0.3)

    d3.select("#report-icon")
      .text("perm_media")
      .style("color", colors.otherfiles.color)

    d3.select("#report-name")
      .text(tr("Folder of file's name"))

    d3.select("#report-size")
      .text(tr("Size") + " : " + tr("absolute") + " | " + tr("percentage of the whole"))
  }

  function makeDummyRuler(){
    updateRuler([])
  }



  // Update the breadcrumb trail to show the current sequence and percentage.
  function updateBreadcrumbs(nodeArray) {

    // Data join; key function combines name and depth (= position in sequence).
    var g = d3.select("#trail")
        .selectAll("g")
        .data(nodeArray, function(d) { return d.name + d.depth; });


    // Add breadcrumb and label for entering nodes.
    var entering = g.enter().append("svg:g");

    // entering.append("svg:rect")
    //   .attr("x", "0")
    //   .attr("y", function(d, i) { return d.y; })
    //   .attr("width", b.w)
    //   .attr("height", function(d) { return d.dy; })
    //   .style("fill", function(d) { return colorOf(d.name, d.children, remakePath(d)); })


    entering.append("svg:polygon")
        .attr("points", function(d, i) {return breadcrumbPoints(d, i, b.o, b.t, b.w, b.s)})
        .style("fill", function(d) { return colorOf(d.name, d.children, remakePath(d)); });

        entering.append("svg:text")
      .attr("x", b.w/14)
      .attr("y", function(d) { return d.y; })
      .attr("dx", 0)
      .attr("dy", function(d, i) { return (d.dy/1.5 + i*b.s); })
      .attr("text-anchor", "left")
      .attr("stroke", "none")
      .style("font-size", function(d) { if(d.name.length*font_width < b.w){ return "1em"; } else { return "0.7em"; } })
      .text(function(d) {if(d.name.length*font_width < b.w){ return smartClip(d.name, b.w*8/10, font_width); } else { return smartClip(d.name, b.w*8/10, 5); } })

    // Remove exiting nodes.
    g.exit().remove();

    // // Now move and update the percentage at the end.
    // d3.select("#trail").select("#endlabel")
    //     .attr("x", b.w/2)
    //     // .attr("x", (nodeArray.length + 0.5) * (b.w + b.s))
    //     .attr("y", 0)
    //     .attr("dy", "-0.35em")
    //     .attr("text-anchor", "middle")
    //     .text("");

    // Make the breadcrumb trail visible, if it's hidden.
    d3.select("#trail")
        .style("opacity", 1)

  }

  function updateReport(d){
    d3.select("#report")
      .style('opacity',1)

    d3.select("#report-icon")
      .text(d.children === undefined ? "insert_drive_file" : "folder")
      .style("color", colorOf(d.name, d.children, remakePath(d)))

    d3.select("#report-name")
      .text(d.name)

    d3.select("#report-size")
      .text(makeSizeString(d))
  }

  function updateRuler(nodeArray){



    var g = d3.select("#rulermarks")
      .selectAll("g")
      .style("opacity", function(d) {return computeOpacity(d, nodeArray)}) // Update existing nodes' opacity
      .data(nodeArray, function(d) { return d.name + d.depth; });

    // Add breadcrumb and label for entering nodes.
    var entering = g.enter().append("svg:g");

    entering.append("svg:rect")
      .attr("x", function(d) {return d.x; })
      .attr("y", "1.5em")
      .attr("width", function(d) { return d.dx; })
      .attr("height", "0.3em")
      .style("fill", function(d) { return colorOf(d.name, d.children, remakePath(d)); })
      .style("opacity", function(d) {return computeOpacity(d, nodeArray)})

    g.exit().remove();

    var leaf = nodeArray[nodeArray.length - 1]

    if(leaf !== undefined){
    var mode = computeRulerTextDisplayMode(leaf.x + leaf.dx/2, makeSizeString(leaf).length, width, font_width)
      d3.select("#rulertext")
        .attr("x", {"ORGANIC" : leaf.x + leaf.dx/2, "LEFT" : 5, "RIGHT" : width - 5}[mode])
        .attr("y", "3em")
        .attr("text-anchor", {"ORGANIC" : "middle", "LEFT" : "start", "RIGHT" : "end"}[mode])
        .text(makeSizeString(leaf))
    }
    else{
      d3.select("#rulertext").text("")
    }
  }
  

  function fadeBreadCrumbs(){
    d3.select("#trail")
      .style("opacity", 0.5)
  }

  function fadeReport(){
    d3.select("#report")
      .style('opacity',0.5)
  }

}
