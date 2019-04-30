// This component is the skeleton of the entire application.
// On a high level, it is divided into Header, View, and Footer.

import React, {Component} from 'react';
import './App.css';
import Member from './containers/Member/Member';
import Header from './components/Header/Header';
import Relationship from './containers/Relationship/Relationship';
import FamilyTree from './containers/FamilyTree/FamilyTree';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import ErrorBoundary from './utils/ErrorBoundary'
import {connect} from "react-redux";
import {getUserContext} from "./actions";

class App extends Component {

    constructor() {
        super();
        this.state = {
            userContext: ''
        }
    }

    componentDidMount() {
        this.props.getUserContext().then(() => {
            this.setState({
                userContext: this.props.userContext
            });
        });
    }

    generateSwitch() {
        const {userContext} = this.state;
        if (userContext === 'admin') {
            return (
                <Switch>
                    <Route path='/familyTree' component={FamilyTree}/>
                    <Route path='/member' component={Member}/>
                    <Route path='/relationship' component={Relationship}/>
                    <Route exact path='/' component={FamilyTree}/>
                </Switch>
            )
        } else {
            return (
                <Switch>
                    <Route exact path='/' component={FamilyTree}/>
                    <Route path='/familyTree' component={FamilyTree}/>
                </Switch>
            )
        }
    }

    render() {
        return (
            <ErrorBoundary>
                <div>
                    <BrowserRouter>
                        {/* Header component for displaying navigational links and brand information */}
                        <Header userContext={this.state.userContext}/>

                        {/* Route information */}
                        {this.generateSwitch()}
                    </BrowserRouter>
                </div>
            </ErrorBoundary>
        );
    }
}


const mapStateToProps = ({userContext}) => {
    return {userContext};
};

export default connect(mapStateToProps,
    {getUserContext})(App);
