
import * as RealEstate from 'reducers/real-estate'

import app_state from 'reducers/app-state'
import icicle_state from 'reducers/icicle-state'
import report_state from 'reducers/report-state'
import tag_list_state from 'reducers/tag-list-state'

import undo from 'reducers/undo'

let real_estate = RealEstate.empty()

real_estate = RealEstate.compose(app_state,real_estate)
real_estate = RealEstate.compose(icicle_state,real_estate)
real_estate = RealEstate.compose(report_state,real_estate)
real_estate = RealEstate.compose(tag_list_state,real_estate)

real_estate = undo(real_estate)

export default RealEstate.compile(real_estate)
