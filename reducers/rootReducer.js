import {combineReducers} from 'redux'
import {expertAuthReducer} from './expertAuthReducer'
import {expertDashReducer} from './expertDashReducer'
import {talentsReducer} from './talentsReducer'
import {clientAuthReducer} from './clientAuthReducer'

const rootReducer = combineReducers({
  expertAuth: expertAuthReducer,
  expertDash: expertDashReducer,
  talents: talentsReducer,
  client: clientAuthReducer
})

export default rootReducer