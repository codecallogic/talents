import {combineReducers} from 'redux'
import {expertAuthReducer} from './expertAuthReducer'
import {expertDashReducer} from './expertDashReducer'


const rootReducer = combineReducers({
  expertAuth: expertAuthReducer,
  expertDash: expertDashReducer
})

export default rootReducer