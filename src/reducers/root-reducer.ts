import * as RealEstate from "reducers/real-estate";

import loading_state from "reducers/loading-state";
import icicle_state from "reducers/icicle-state";

import undo from "reducers/undo";

let realEstate = RealEstate.empty();

realEstate = RealEstate.compose(loading_state, realEstate);
realEstate = RealEstate.compose(icicle_state, realEstate);
realEstate = undo("undo", realEstate);

export default RealEstate.compile(realEstate);
