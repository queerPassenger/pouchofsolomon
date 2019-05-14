import { combineReducers } from 'redux';
import loadingReducer from './loadingReducer';
import userProfileReducer from './userProfileReducer';

export default combineReducers({
    loading:loadingReducer,
    userProfile:userProfileReducer
});