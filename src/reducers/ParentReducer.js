import {
    GET_COUPLES
} from '../actions/types';

export default (state = {}, action) => {
    switch (action.type) {
        case GET_COUPLES:
            return action.payload.data;
        default:
            return state;
    }
};