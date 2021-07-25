import {combineReducers} from 'redux'
import {hostingAuthReducer} from './hostingAuthReducer'


const rootReducer = combineReducers({
  hostingAuth: hostingAuthReducer
})

export default rootReducer