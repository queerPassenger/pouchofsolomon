import { combineReducers } from 'redux';
import loadingReducer from './loadingReducer';
import userProfileReducer from './userProfileReducer';
import popUpReducer from './popUpReducer';

export default combineReducers({
    loading:loadingReducer,
    userProfile:userProfileReducer,
    popUp:popUpReducer
});