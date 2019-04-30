import {
    GET_FAMILY_TREE,
} from '../actions/types';

export default (state = {}, action) => {
    switch (action.type) {
        case GET_FAMILY_TREE:
            return action.payload.data;
        default:
            return state;
    }
};