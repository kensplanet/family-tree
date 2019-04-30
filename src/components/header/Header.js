import React, {Component} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faUsers} from '@fortawesome/free-solid-svg-icons';
import {Link} from "react-router-dom";
import Button from "@material-ui/core/Button";

const styles = {
    root: {
        flexGrow: 1,
    },
    grow: {
        width: 300
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    }
};

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: 0
        };
    }

    handleChange = (event, value) => {
        this.setState({value});
    };

    logout = () => {
        window.location.href = 'login';
    };

    generateTabs = () => {
        const {userContext} = this.props,
            {value} = this.state;
        if (userContext === 'admin') {
            return (
                <Tabs value={value} onChange={this.handleChange}>
                    <Tab label="View Family Tree" component={Link} to="/familyTree"/>
                    <Tab label="Member Manager" component={Link} to="/member"/>
                    <Tab label="Relationship Manager" component={Link} to="/relationship"/>
                    <Tab label="Logout" component={Button} onClick={this.logout}/>
                </Tabs>
            )
        } else {
            return (
                <Tabs value={value} onChange={this.handleChange}>
                    <Tab label="View Family Tree" component={Link} to="/familyTree"/>
                    <Tab label="Logout" component={Button} onClick={this.logout}/>
                </Tabs>
            )
        }
    };

    render() {
        return (
            <div className={styles.root}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton styles={styles.menuButton} color="inherit" aria-label="Menu">
                            <FontAwesomeIcon icon={faUsers}/>
                        </IconButton>
                        <Typography variant="h6" color="inherit" style={styles.grow}>
                            Family Tree
                        </Typography>
                        {this.generateTabs()}
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

export default Header;
