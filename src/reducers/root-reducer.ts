import * as RealEstate from "reducers/real-estate";

import loading_state from "reducers/loading-state";

let realEstate = RealEstate.empty();

realEstate = RealEstate.compose(loading_state, realEstate);

export default RealEstate.compile(realEstate);
