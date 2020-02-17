import React, { useState } from "react";

/**
 * Simple component for element moving testing. Will be eventually removed before merging into master.
 */
const MoveElement = ({ moveElement }) => {
  const [parentId, setParentId] = useState("");
  const [movedElementId, setMovedElementId] = useState("");

  return (
    <div>
      <input
        value={parentId}
        onChange={e => setParentId(e.target.value)}
        placeholder="Next Parent ID"
      />
      <input
        value={movedElementId}
        onChange={e => setMovedElementId(e.target.value)}
        placeholder="Moved element ID"
      />
      <button onClick={() => moveElement(movedElementId, parentId)}>
        MoveElement
      </button>
    </div>
  );
};

export default MoveElement;
