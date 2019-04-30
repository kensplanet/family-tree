import {
    GET_MEMBER,
    GET_MEMBERS,
} from '../actions/types';

export default (state = {}, action) => {
    switch (action.type) {
        case GET_MEMBER:
            return action.payload.data;
        case GET_MEMBERS:
            return action.payload.data;
        default:
            return state;
    }
};