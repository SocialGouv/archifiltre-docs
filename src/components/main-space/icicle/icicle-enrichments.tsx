import _ from "lodash";
import React, { FC } from "react";
import { tagMapToArray } from "../../../reducers/tags/tags-selectors";
import { TagMap } from "../../../reducers/tags/tags-types";
import IcicleEnrichment, { OPACITY } from "./icicle-enrichment";
import { IcicleMouseHandler } from "./icicle-main";

interface IcicleEnrichmentsProps {
  tags: TagMap;
  elementsToDelete: string[];
  highlightedTagId: string;
  dims: any;
  onClick: IcicleMouseHandler;
  onDoubleClick: IcicleMouseHandler;
  onMouseOver: IcicleMouseHandler;
}

/**
 * Determines if the IcicleEnrichment should be highlighted
 * @param ffId
 * @param tags
 * @param higlightedTagId
 */
const isHighlighted = (ffId, tags, higlightedTagId) => {
  if (higlightedTagId === "") {
    return true;
  }

  return tags[higlightedTagId].ffIds.includes(ffId);
};

const IcicleEnrichments: FC<IcicleEnrichmentsProps> = ({
  tags,
  highlightedTagId,
  dims,
  elementsToDelete,
  onClick,
  onDoubleClick,
  onMouseOver
}) => {
  const isElementDisplayed = ffId => dims[ffId] !== undefined;
  const tagArray = tagMapToArray(tags);
  const taggedFiles = _(tagArray)
    .flatMap(({ ffIds }) => ffIds)
    .filter(isElementDisplayed)
    .uniq()
    .value();

  const displayedElementsToDelete = elementsToDelete.filter(isElementDisplayed);

  const enrichedElements = _.union(taggedFiles, displayedElementsToDelete);

  return (
    <g>
      {enrichedElements.map(ffId => (
        <IcicleEnrichment
          key={`${ffId}-enrichment}`}
          ffId={ffId}
          dims={dims[ffId]}
          hasTag={taggedFiles.includes(ffId)}
          isToDelete={displayedElementsToDelete.includes(ffId)}
          opacity={
            isHighlighted(ffId, tags, highlightedTagId)
              ? OPACITY.HIGHLIGHTED
              : OPACITY.NOT_HIGHLIGHTED
          }
          onClick={onClick}
          onDoubleClick={onDoubleClick}
          onMouseOver={onMouseOver}
        />
      ))}
    </g>
  );
};

export default IcicleEnrichments;
