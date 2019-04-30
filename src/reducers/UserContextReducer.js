import {
    GET_USER_CONTEXT,
} from '../actions/types';

export default (state = {}, action) => {
    switch (action.type) {
        case GET_USER_CONTEXT:
            return action.payload.data;
        default:
            return state;
    }
};