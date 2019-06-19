import {popUp} from './initialState';

export default (state = popUp, action) => {
    switch (action.type) {
        case 'enablePopUp':
            return action.val;
        case 'disablePopUp':
            return popUp;
        default:
            return state;
    }
}