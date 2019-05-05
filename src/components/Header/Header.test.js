import React from 'react';
import Header from './Header';
import Enzyme, {render} from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import {BrowserRouter} from 'react-router-dom';

Enzyme.configure({adapter: new EnzymeAdapter()});

it('user role should show only 1 navigational link', () => {
    const wrapper = render(<BrowserRouter><Header userContext={'user'}/></BrowserRouter>);
    expect(wrapper.find('header').length).toBe(1);
    expect(wrapper.find('a').length).toBe(1);
});

it('admin role should show 3 navigational links', () => {
    const wrapper = render(<BrowserRouter><Header userContext={'admin'}/></BrowserRouter>);
    expect(wrapper.find('header').length).toBe(1);
    expect(wrapper.find('a').length).toBe(3);
});