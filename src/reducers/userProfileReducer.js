import {userProfile} from './initialState';

export default (state = userProfile, action) => {
    switch (action.type) {
        case 'updateUserProfile':
            return {
                name:action.val.name,
                photo:action.val.photo
            }
        default:
            return state
    }
}