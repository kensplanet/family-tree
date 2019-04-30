import api from '../apis/api';
import {
    GET_MEMBER,
    CREATE_OR_UPDATE_MEMBER,
    DELETE_MEMBER,
    GET_MEMBERS,
    ADD_SPOUSAL_RELATIONSHIP,
    GET_COUPLES,
    GET_FAMILY_TREE,
    ADD_PARENTAL_RELATIONSHIP,
    GET_USER_CONTEXT
} from './types';

export const getMember = (memberId) => async dispatch => {
    const response = await api.get('/members/' + memberId);
    dispatch({
        type: GET_MEMBER,
        payload: response
    })
};

export const createOrUpdateMember = (member) => async dispatch => {
    const response = await api.post('/members', member);
    dispatch({
        type: CREATE_OR_UPDATE_MEMBER,
        payload: response
    })
};

export const deleteMember = (memberId) => async dispatch => {
    const response = await api.delete('/members/' + memberId);
    dispatch({
        type: DELETE_MEMBER,
        payload: response
    })
};

export const getMembers = () => async dispatch => {
    const response = await api.get('/members');
    dispatch({
        type: GET_MEMBERS,
        payload: response
    })
};

export const addParent = (member) => async dispatch => {
    const response = await api.post('/parents/addParent', member);
    dispatch({
        type: ADD_PARENTAL_RELATIONSHIP,
        payload: response
    })
};

export const addCouple = (couple) => async dispatch => {
    const response = await api.post('/parents', couple);
    dispatch({
        type: ADD_SPOUSAL_RELATIONSHIP,
        payload: response
    })
};

export const getParents = () => async dispatch => {
    const response = await api.get('/parents');
    dispatch({
        type: GET_COUPLES,
        payload: response
    })
};

export const getFamilyTree = (memberId) => async dispatch => {
    const response = await api.get('/familyTree/' + memberId);
    dispatch({
        type: GET_FAMILY_TREE,
        payload: response
    })
};

export const getUserContext= () => async dispatch => {
    const response = await api.get('/userContext');
    dispatch({
        type: GET_USER_CONTEXT,
        payload: response
    })
};