import useReducer from './user'
import exChangeReducer from './exchange'
import themeReducer from './theme'
import { combineReducers } from "redux";
const rootReducer = combineReducers({
    useReducer: useReducer,
    exChangeReducer: exChangeReducer,
    theme: themeReducer,
})
export default  rootReducer;