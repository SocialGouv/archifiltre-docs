import React from "react";
import * as ObjectUtil from "util/object-util";
import IcicleMain from "./icicle-main";

export default function IcicleApiToProps(props) {
  const api = props.api;
  const icicle_state = api.icicle_state;
  const database = api.database;

  const lock_sequence = icicle_state.lock_sequence();
  const isLocked = lock_sequence.length > 0;

  props = ObjectUtil.compose(
    {
      getFfByFfId: database.getFfByFfId,
      root_id: database.rootFfId(),
      display_root: icicle_state.display_root(),
      getFfIdPath: database.getFfIdPath,
      max_depth: database.maxDepth(),
      isLocked,
      sequence: icicle_state.sequence(),
      hover_sequence: icicle_state.hover_sequence(),
      setNoHover: icicle_state.setNoHover,
      setFocus: icicle_state.setFocus,
      setNoFocus: icicle_state.setNoFocus,
      lock: (...args) => {
        icicle_state.lock(...args);
        api.undo.commit();
      },
      unlock: icicle_state.unlock,
      setDisplayRoot: icicle_state.setDisplayRoot
    },
    props
  );

  return <IcicleMain {...props} />;
}
