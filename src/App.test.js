import React from 'react';
import {App} from './App';
import Enzyme, {shallow} from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import {BrowserRouter, Switch, Route} from 'react-router-dom';

Enzyme.configure({adapter: new EnzymeAdapter()});

const mockLoginfn = jest.fn(() => Promise.resolve());

it('user role should have 2 Routes', async () => {
    const wrapper = shallow(<App getUserContext={mockLoginfn} userContext="user"/>);
    await mockLoginfn;
    wrapper.update();
    expect(wrapper.find(Route).length).toBe(2);
});

it('admin role should have 4 Routes', async () => {
    const wrapper = shallow(<App getUserContext={mockLoginfn} userContext="admin"/>);
    await mockLoginfn;
    wrapper.update();
    expect(wrapper.find(Route).length).toBe(4);
});

