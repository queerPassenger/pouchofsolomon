import {loading} from './initialState';

export default (state = loading, action) => {
    switch (action.type) {
        case 'enableLoading':
            return true;
        case 'disableLoading':
            return false;
        default:
            return state
    }
}