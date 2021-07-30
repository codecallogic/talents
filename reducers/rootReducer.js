import {combineReducers} from 'redux'
import {hostingAuthReducer} from './hostingAuthReducer'
import {hostingDashReducer} from './hostingDashReducer'


const rootReducer = combineReducers({
  hostingAuth: hostingAuthReducer,
  hostingDash: hostingDashReducer
})

export default rootReducer