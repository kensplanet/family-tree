// Provide brief messages about app processes through a message - at the top right of the screen.
import React, {Component} from "react";
import Snackbar from '@material-ui/core/Snackbar';

class Notification extends Component {

    render() {
        return (
            <Snackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={!!this.props.message}
                autoHideDuration={5000}
                onClose={this.props.closeNotification}
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">{this.props.message}</span>}
            />
        )
    }
}

export default Notification;