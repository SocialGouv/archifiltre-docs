import type { MouseEventHandler } from "react";
import React, { useCallback } from "react";
import styled from "styled-components";

import { CopyToClipboard } from "../../common/copy-to-clipboard";
import type { Dims, DimsAndId } from "../icicle/icicle-rect";
import { BreadcrumbPoly } from "./breadcrumb-poly";
import { BreadcrumbText } from "./breadcrumb-text";

interface BreadcrumbWrapperProps {
    active: boolean;
}

const BreadcrumbWrapper = styled.div<BreadcrumbWrapperProps>`
    width: 100%;
    height: 100%;
    display: flex;
    cursor: ${({ active }) => (active ? "pointer" : "unset")};
    opacity: ${({ active }) => (active ? 1 : 0.3)};
`;

interface CopyToClipboardProps {
    active: boolean;
}

const CopyToClipboardWrapper = styled.div<CopyToClipboardProps>`
    visibility: hidden;
    ${BreadcrumbWrapper}:hover & {
        visibility: ${({ active }) => (active ? "visible" : "hidden")};
    }
`;

const BreadcrumbPolyWrapper = styled.div`
    display: flex;
    width: 5%;
    flex-shrink: 0;
`;

const BreadcrumbTextWrapper = styled.div`
    max-width: 90%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    flex-shrink: 1;
`;

const Spacer = styled.div`
    width: 5%;
    flex-shrink: 0;
`;

const SmallSpacer = styled.div`
    width: 0.3em;
    flex-shrink: 2;
`;

export enum BreadcrumbOpacity {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    LOCKED = 1,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    HOVERED = 0.4,
}

const emptyDims: Dims = {
    dx: 0,
    dy: 0,
    x: 0,
    y: 0,
};

/**
 * Dummy getter as we cannot know dims from the breadcrumbs
 */
const dimsGetter = (): Dims => emptyDims;

export interface BreadcrumbProps {
    active: boolean;
    opacity: BreadcrumbOpacity;
    color: string;
    isFirst: boolean;
    isLast: boolean;
    name: string;
    alias: string | null;
    path: string;
    id: string;
    onBreadcrumbClick: (dimsAndId: DimsAndId, event: React.MouseEvent) => void;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
    active,
    isFirst,
    isLast,
    opacity,
    color,
    name,
    alias,
    path,
    id,
    onBreadcrumbClick,
}) => {
    const onClick: MouseEventHandler = useCallback(
        (event) => {
            if (!active) {
                return;
            }
            onBreadcrumbClick({ dims: dimsGetter, id }, event);
        },
        [onBreadcrumbClick, id, active]
    );
    return (
        <BreadcrumbWrapper onClick={onClick} active={active}>
            <BreadcrumbPolyWrapper>
                <BreadcrumbPoly
                    isFirst={isFirst}
                    isLast={isLast}
                    opacity={opacity}
                    color={color}
                />
            </BreadcrumbPolyWrapper>
            <Spacer />
            <BreadcrumbTextWrapper>
                <BreadcrumbText name={name} alias={alias} />
            </BreadcrumbTextWrapper>
            <SmallSpacer />
            <CopyToClipboardWrapper active={active}>
                <CopyToClipboard stringToCopy={path} />
            </CopyToClipboardWrapper>
        </BreadcrumbWrapper>
    );
};
