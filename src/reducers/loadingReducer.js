export default (state = {}, action) => {
    switch (action.type) {
        case 'enableLoading':
            return true;
        case 'disableLoading':
            return false;
        default:
            return state
    }
}