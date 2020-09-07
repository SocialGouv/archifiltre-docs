import _ from "lodash";
import React, { FC } from "react";
import {
  AliasMap,
  CommentsMap,
} from "../../../reducers/files-and-folders/files-and-folders-types";
import { tagMapToArray } from "../../../reducers/tags/tags-selectors";
import { TagMap } from "../../../reducers/tags/tags-types";
import IcicleEnrichment, { OPACITY } from "./icicle-enrichment";
import { IcicleMouseHandler } from "./icicle-main";
import { DimsMap } from "./icicle";

type IcicleEnrichmentsProps = {
  aliases: AliasMap;
  comments: CommentsMap;
  tags: TagMap;
  elementsToDelete: string[];
  highlightedTagId: string;
  dims: DimsMap;
  onClick: IcicleMouseHandler;
  onDoubleClick: IcicleMouseHandler;
  onMouseOver: IcicleMouseHandler;
};

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

  return tags[higlightedTagId]?.ffIds.includes(ffId);
};

const removeEmptyValues = (elementMap) => _.pickBy(elementMap);

const IcicleEnrichments: FC<IcicleEnrichmentsProps> = ({
  aliases,
  comments,
  tags,
  highlightedTagId,
  dims,
  elementsToDelete,
  onClick,
  onDoubleClick,
  onMouseOver,
}) => {
  const isElementDisplayed = (ffId) => dims[ffId] !== undefined;
  const tagArray = tagMapToArray(tags);
  const taggedFiles = _(tagArray)
    .flatMap(({ ffIds }) => ffIds)
    .filter(isElementDisplayed)
    .uniq()
    .value();

  const displayedElementsToDelete = elementsToDelete.filter(isElementDisplayed);
  const filteredAliases = removeEmptyValues(aliases);
  const filteredComments = removeEmptyValues(comments);
  const enrichedElements = _.union(
    taggedFiles,
    displayedElementsToDelete,
    Object.keys(filteredAliases),
    Object.keys(filteredComments)
  );

  return (
    <g>
      {enrichedElements.map((ffId) => (
        <IcicleEnrichment
          key={`${ffId}-enrichment}`}
          ffId={ffId}
          dims={dims[ffId]}
          hasTag={taggedFiles.includes(ffId)}
          isToDelete={displayedElementsToDelete.includes(ffId)}
          hasAlias={ffId in filteredAliases}
          hasComment={ffId in filteredComments}
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
