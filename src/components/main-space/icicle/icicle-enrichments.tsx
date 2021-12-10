import _ from "lodash";
import React from "react";

import type {
    AliasMap,
    CommentsMap,
} from "../../../reducers/files-and-folders/files-and-folders-types";
import { tagMapToArray } from "../../../reducers/tags/tags-selectors";
import type { TagMap } from "../../../reducers/tags/tags-types";
import type { SimpleObject } from "../../../util/object/object-util";
import type { DimsMap } from "./icicle";
import { IcicleEnrichment, OPACITY } from "./icicle-enrichment";
import type { IcicleMouseHandler } from "./icicle-main";

export interface IcicleEnrichmentsProps {
    aliases: AliasMap;
    comments: CommentsMap;
    tags: TagMap;
    elementsToDelete: string[];
    highlightedTagId: string;
    dims: DimsMap;
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
const isHighlighted = (ffId: string, tags: TagMap, higlightedTagId: string) => {
    if (higlightedTagId === "") {
        return true;
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return tags[higlightedTagId]?.ffIds.includes(ffId);
};

const removeEmptyValues = (elementMap: SimpleObject) => _.pickBy(elementMap);

export const IcicleEnrichments: React.FC<IcicleEnrichmentsProps> = ({
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
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const isElementDisplayed = (ffId: string) => dims[ffId] !== undefined;
    const tagArray = tagMapToArray(tags);
    const taggedFiles = _(tagArray)
        .flatMap(({ ffIds }) => ffIds)
        .filter(isElementDisplayed)
        .uniq()
        .value();

    const displayedElementsToDelete =
        elementsToDelete.filter(isElementDisplayed);
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
