import React from 'react';
import {Member} from './Member';
import Enzyme, {shallow} from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import {BrowserRouter} from 'react-router-dom';
import {Field} from "redux-form";

Enzyme.configure({adapter: new EnzymeAdapter()});

const mockMembers = [{"memberId": 1, "name": "King Gustaf VI Adolf"},
    {"memberId": 3, "name": "Prince Gustaf Adolf, Duke of Västerbotten"},
    {"memberId": 5, "name": "Princess Margaretha, Mrs. Ambler"}];
const mockLoginfn = jest.fn(() => Promise.resolve());

it('form should contain 5 fields', () => {
    const wrapper = shallow(<Member getMembers={mockLoginfn} handleSubmit={mockLoginfn} members={mockMembers}/>);
    expect(wrapper.find(Field).length).toBe(5);
});