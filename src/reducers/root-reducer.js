import * as RealEstate from "reducers/real-estate";

import loading_state from "reducers/loading-state";
import icicle_state from "reducers/icicle-state";

import database from "reducers/database";

import undo from "reducers/undo";

let real_estate = RealEstate.empty();

real_estate = RealEstate.compose(
  loading_state,
  real_estate
);
real_estate = RealEstate.compose(
  icicle_state,
  real_estate
);

real_estate = RealEstate.compose(
  database,
  real_estate
);

real_estate = undo("undo", real_estate);

export default RealEstate.compile(real_estate);
