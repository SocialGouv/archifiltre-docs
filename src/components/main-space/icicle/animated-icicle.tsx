import React, {
  FC,
  useCallback,
  useRef,
  useState,
  memo,
  MouseEventHandler,
} from "react";
import { animateSvgDomElement } from "animation-daemon";
import { generateRandomString } from "util/random-gen-util";
import Icicle, { IcicleProps } from "./icicle";
import { addTracker } from "logging/tracker";
import { ActionTitle, ActionType } from "logging/tracker-types";
import { IcicleMouseActionHandler } from "./icicle-types";

type AnimatedIcicleProps = IcicleProps & {
  onIcicleMouseLeave: MouseEventHandler<SVGGElement>;
};

const ANIMATION_DURATION = 1000;

const AnimatedIcicle: FC<AnimatedIcicleProps> = (props) => {
  const { onIcicleRectDoubleClickHandler, x, y, dx, dy } = props;
  const [previousDisplayMode, setPreviousDisplayMode] = useState("none");
  const [previousProps, setPreviousProps] = useState(props);
  const animatedPreviousElementRef = useRef<SVGGElement>(null);
  const animatedCurrentElementRef = useRef<SVGGElement>(null);
  const svgId = generateRandomString(40);

  const onIcicleRectDoubleClick: IcicleMouseActionHandler = useCallback(
    ({ dims, id }, event) => {
      addTracker({
        title: ActionTitle.ICICLE_ZOOM,
        type: ActionType.TRACK_EVENT,
      });

      setPreviousProps(props);
      setPreviousDisplayMode("inherit");

      onIcicleRectDoubleClickHandler({ dims, id }, event);

      const { x: targetX, dx: targetDx } = props;
      const { x: dimX, dx: dimDx } = dims();

      if (
        !animatedPreviousElementRef.current ||
        !animatedCurrentElementRef.current
      ) {
        return;
      }

      Promise.all([
        animateSvgDomElement(
          animatedPreviousElementRef.current,
          false,
          targetX,
          targetDx,
          dimX,
          dimDx,
          ANIMATION_DURATION
        ),
        animateSvgDomElement(
          animatedCurrentElementRef.current,
          true,
          dimX,
          dimDx,
          targetX,
          targetDx,
          ANIMATION_DURATION
        ),
      ]).then(() => {
        setPreviousDisplayMode("none");
      });
    },
    [
      onIcicleRectDoubleClickHandler,
      props,
      previousDisplayMode,
      setPreviousDisplayMode,
      setPreviousProps,
      animatedPreviousElementRef,
      animatedCurrentElementRef,
    ]
  );
  return (
    <>
      <clipPath id={svgId}>
        <rect x={x} y={y} width={dx} height={dy} />
      </clipPath>
      <g
        x={0}
        y={0}
        clipPath={`url(#${svgId})`}
        onMouseLeave={props.onIcicleMouseLeave}
      >
        <g>
          <g
            style={{ display: previousDisplayMode }}
            ref={animatedPreviousElementRef}
          >
            {previousDisplayMode !== "none" && <Icicle {...previousProps} />}
          </g>
          <g ref={animatedCurrentElementRef}>
            <Icicle
              {...props}
              onIcicleRectDoubleClickHandler={onIcicleRectDoubleClick}
            />
          </g>
        </g>
      </g>
    </>
  );
};

export default memo(AnimatedIcicle);
