import React, { FC, useEffect, useRef } from "react";
import * as d3 from "d3";
import {
  FilesAndFolders,
  FilesAndFoldersMap,
} from "reducers/files-and-folders/files-and-folders-types";
import { ROOT_FF_ID } from "reducers/files-and-folders/files-and-folders-selectors";
import { FilesAndFoldersMetadataMap } from "reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import { FOLDER_COLOR, fromFileName } from "util/color/color-util";

type Dimensions = {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
};

type IciclesProps = {
  filesAndFolders: FilesAndFoldersMap;
  filesAndFoldersMetadata: FilesAndFoldersMetadataMap;
};

const viewboxWidth = 1000;
const viewboxHeight = 300;
const TRANSITION_DURATION = 750;

const Icicles: FC<IciclesProps> = ({
  filesAndFolders,
  filesAndFoldersMetadata,
}) => {
  const iciclesRef = useRef(null);

  const format = d3.format(",d");

  const getRectangleHeight = ({ x0, x1 }): number => {
    return x1 - x0 - Math.min(1, (x1 - x0) / 2);
  };

  const isLabelVisible = ({ x0, x1, y0, y1 }): boolean => {
    return y1 <= viewboxWidth && y0 >= 0 && x1 - x0 > 16;
  };

  const partition = () => {
    const root = d3
      .hierarchy<FilesAndFolders>(
        filesAndFolders[ROOT_FF_ID],
        (element) =>
          element?.children.map((childId) => filesAndFolders[childId]) ?? []
      )
      .sum((d) => d?.file_size ?? 0);

    return d3
      .partition<FilesAndFolders>()
      .size([viewboxHeight, ((root.height + 1) * viewboxWidth) / 10])(root);
  };

  const root = partition();

  let focus = root;

  useEffect(() => {
    const onClicked = (event, p) => {
      focus = focus === p ? (p = p.parent) : p;

      const dimensionsTarget: Record<string, Dimensions> = {};

      const getDimensions = (dimensions) =>
        dimensionsTarget[dimensions.data.id];

      root.each((dimensions) => {
        dimensionsTarget[dimensions.data.id] = {
          x0: ((dimensions.x0 - p.x0) / (p.x1 - p.x0)) * viewboxHeight,
          x1: ((dimensions.x1 - p.x0) / (p.x1 - p.x0)) * viewboxHeight,
          y0: dimensions.y0 - p.y0,
          y1: dimensions.y1 - p.y0,
        };
      });

      const transition = cell
        .transition()
        .duration(TRANSITION_DURATION)
        .attr(
          "transform",
          (d: any) => `translate(${getDimensions(d).y0},${getDimensions(d).x0})`
        );

      rect
        .transition(transition)
        .attr("height", (d: any) => getRectangleHeight(getDimensions(d)));
      text
        .transition(transition)
        .attr("fill-opacity", (d: any) => +isLabelVisible(getDimensions(d)));
      tspan
        .transition(transition)
        .attr(
          "fill-opacity",
          (d: any) => +isLabelVisible(getDimensions(d)) * 0.7
        );
    };

    const svg = d3
      .select(iciclesRef.current)
      .append("svg")
      .attr("viewBox", [0, 0, viewboxWidth, viewboxHeight].join(" "))
      .style("font", "10px Quicksand");

    const cell = svg
      .selectAll("g")
      .data(root.descendants())
      .join("g")
      .attr("transform", ({ x0, y0 }) => `translate(${y0},${x0})`);

    const rect = cell
      .append("rect")
      .attr("width", ({ y0, y1 }) => y1 - y0 - 1)
      .attr("height", (d) => getRectangleHeight(d))
      .attr("fill-opacity", 0.6)
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
      .on("click", onClicked);

    const text = cell
      .append("text")
      .style("user-select", "none")
      .attr("pointer-events", "none")
      .attr("x", 4)
      .attr("y", 13)
      .attr("fill-opacity", (d) => +isLabelVisible(d));

    text.append("tspan").text((d: any) => d.data.name);

    const tspan = text
      .append("tspan")
      .attr("fill-opacity", (d: any) => (isLabelVisible(d) ? 0.7 : 0))
      .text((d: any) => ` ${format(d.value)}`);

    cell.append("title").text(
      (d: any) =>
        `${d
          .ancestors()
          .map((d: any) => d.data.name)
          .reverse()
          .join("/")}\n${format(d.value)}`
    );
  }, []);

  return <svg ref={iciclesRef} width="100%" height="80%" />;
};

export default Icicles;
