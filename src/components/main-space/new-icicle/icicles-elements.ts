import { ROOT_FF_ID } from "reducers/files-and-folders/files-and-folders-selectors";
import { FilesAndFolders } from "reducers/files-and-folders/files-and-folders-types";
import { fromFileName } from "./../../../util/color/color-util";
import {
  getRectangleHeight,
  isLabelVisible,
  format,
  VIEWBOX_WIDTH,
  VIEWBOX_HEIGHT,
  handleZoom,
} from "./icicles-utils";
import { FOLDER_COLOR } from "util/color/color-util";
import * as d3 from "d3";

export const createPartition = (filesAndFolders) => {
  const root = d3
    .hierarchy<FilesAndFolders>(
      filesAndFolders[ROOT_FF_ID],
      (element) =>
        element?.children.map((childId) => filesAndFolders[childId]) ?? []
    )
    .sum((d) => d?.file_size ?? 0);
  return d3
    .partition<FilesAndFolders>()
    .size([VIEWBOX_HEIGHT, ((root.height + 1) * VIEWBOX_WIDTH) / 10])(root);
};

export const createSvg = (ref) =>
  d3
    .select(ref.current)
    .append("svg")
    .attr("viewBox", [0, 0, VIEWBOX_WIDTH, VIEWBOX_HEIGHT].join(" "))
    .style("font", "10px Quicksand");

export const createCell = (svg, root) => {
  return svg
    .selectAll("g")
    .data(root.descendants())
    .join("g")
    .attr("transform", ({ x0, y0 }) => `translate(${y0},${x0})`);
};

export const createRect = (cell, elements) => {
  return cell
    .append("rect")
    .attr("width", ({ y0, y1 }) => y1 - y0 - 1)
    .attr("height", (d) => getRectangleHeight(d))
    .attr("fill-opacity", 0.5)
    .attr("fill", (d: any) => {
      if (!d.depth) {
        return "#ccc";
      }
      if (d.data.children.length > 0) {
        return FOLDER_COLOR;
      }
      return fromFileName(d.data.name);
    })
    .style("cursor", "pointer")
    .on("dblclick", (_, currentRect) => handleZoom(_, currentRect, elements));
};

export const createTitle = (cellElement) => {
  const cell = cellElement
    .append("text")
    .style("user-select", "none")
    .attr("pointer-events", "none")
    .attr("x", 4)
    .attr("y", 13)
    .attr("fill-opacity", (d) => +isLabelVisible(d))
    .append("tspan")
    .text((d: any) => d.data.name);

  cell.append("title").text(
    (d: any) =>
      `${d
        .ancestors()
        .map((d: any) => d.data.name)
        .reverse()
        .join("/")}\n${format(d.value)}`
  );
  return cell;
};

export const createSubtitle = (title) => {
  return title
    .append("tspan")
    .attr("fill-opacity", (d: any) => (isLabelVisible(d) ? 0.7 : 0))
    .text((d: any) => ` ${format(d.value)}`);
};
