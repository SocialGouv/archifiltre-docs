import React from "react";
import { useSelector } from "react-redux";
import * as ObjectUtil from "util/object-util";
import { StoreState } from "../../reducers/store";
import IcicleMain from "./icicle-main";

export default function IcicleApiToProps({
  api,
  fillColor,
  getChildrenIdFromId
}) {
  const icicle_state = api.icicle_state;
  const database = api.database;

  const lockSequence = icicle_state.lock_sequence();
  const isLocked = lockSequence.length > 0;
  const tags = useSelector((state: StoreState) => state.tags.tags);

  return (
    <IcicleMain
      api={api}
      display_root={icicle_state.display_root()}
      fillColor={fillColor}
      getChildrenIdFromId={getChildrenIdFromId}
      getFfByFfId={database.getFfByFfId}
      getFfIdPath={database.getFfIdPath}
      hover_sequence={icicle_state.hover_sequence()}
      isLocked={isLocked}
      lock={(...args) => {
        icicle_state.lock(...args);
        api.undo.commit();
      }}
      max_depth={database.maxDepth()}
      root_id={database.rootFfId()}
      sequence={icicle_state.sequence()}
      setDisplayRoot={icicle_state.setDisplayRoot}
      setFocus={icicle_state.setFocus}
      setNoFocus={icicle_state.setNoFocus}
      setNoHover={icicle_state.setNoHover}
      tags={tags}
      unlock={icicle_state.unlock}
    />
  );
}
