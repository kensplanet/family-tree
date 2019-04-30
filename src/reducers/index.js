import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import MemberReducer from './MemberReducer';
import ParentReducer from './ParentReducer';
import FamilyTreeReducer from './FamilyTreeReducer';
import UserContextReducer from './UserContextReducer';

const rootReducer = combineReducers({
    form: formReducer,
    member: MemberReducer,
    familyTree: FamilyTreeReducer,
    members: MemberReducer,
    parents: ParentReducer,
    userContext: UserContextReducer
});

export default rootReducer;