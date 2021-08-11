import {combineReducers} from 'redux'
import {expertAuthReducer} from './expertAuthReducer'
import {expertDashReducer} from './expertDashReducer'
import {talentsReducer} from './talentsReducer'


const rootReducer = combineReducers({
  expertAuth: expertAuthReducer,
  expertDash: expertDashReducer,
  talents: talentsReducer
})

export default rootReducer