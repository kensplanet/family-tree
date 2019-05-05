import React, {Component} from "react";
import {Field, reduxForm} from "redux-form";
import Radio from "@material-ui/core/Radio";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import validate from "./validate";
import ConfirmationDialog from "../../utils/ConfirmatonDialog";
import {renderTextField, renderRadioGroup} from "./FormHelper";
import {connect} from "react-redux";
import {getMembers, getMember, deleteMember, createOrUpdateMember} from "../../actions";
import Select from 'react-select';
import Notification from '../../utils/Notification'
import _ from 'lodash';

export class Member extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            edit: false,
            members: [],
            memberId: null,
            selectedMember: null
        };
    }

    reloadMembers = () => {
        this.props.getMembers().then(() => {
            this.setState({
                members: this.props.members
            });
        });
    };

    // As soon as this component is mounted, it will fetch all the members from the server
    componentDidMount() {
        this.reloadMembers();
    }

    handleClose = () => {
        this.setState({open: false});
    };

    onSubmit = (formValues) => {
        const member = {
            memberId: this.state.memberId,
            name: formValues.name,
            birthYear: formValues.birthYear,
            deathYear: formValues.deathYear,
            birthPlace: formValues.birthPlace,
            sex: formValues.sex
        };
        if (_.isEqual(this.props.member, formValues)) {
            this.setState({
                message: 'Nothing to update'
            });
            return;
        }
        this.props.createOrUpdateMember(member).then(()=> {
            this.setState({
                memberId: null,
                edit: false,
                selectedMember: null,
                message: this.state.edit ? 'Successfully updated member.' : 'Successfully created member.'
            });
            this.props.reset();
            this.reloadMembers();
        });
    };

    delete = () => {
        this.props.deleteMember(this.state.memberId).then(() => {
            this.setState({
                memberId: null,
                open: false,
                edit: false,
                selectedMember: null,
                message: 'Successfully deleted member'
            });
            this.props.reset();
            this.reloadMembers();
        }).catch((error) => {
            this.setState({
                message: "This member cannot be deleted as it is related to other members.",
                selectedMember: null,
                open: false
            });
        });
    };

    // Opens the modal for user confirmation
    handleDelete = (memberId) => {
        this.setState({
            open: true,
            memberId: memberId
        });
    };

    handleClick = (selectedMember) => {
        
        this.setState({selectedMember});
        this.props.reset();
        this.setState({
            edit: false,
            memberId: null
        });

        if (selectedMember) {
            const memberId = selectedMember.value;
            this.props.getMember(memberId).then(() => {
                const {member} = this.props;
                Object.keys(member).forEach(key => {
                    this.props.change(key, member[key]);
                });
                this.setState({
                    edit: true,
                    memberId: memberId,
                    member: member
                });
            }).catch((error) => {
                this.setState({
                    message: "Error fetching details",
                    selectedMember: null
                });
            });
        }
    };

    cancel = () => {
        this.setState({
            edit: false,
            selectedMember: null,
            memberId: null
        });
        this.props.reset();
    };

    reset = () => {
        this.props.reset();
    };

    closeNotification = () => {
        this.setState({
            message: null
        });
    };

    render() {
        let options = this.state.members.map(member => ({
            value: member.memberId,
            label: member.name
        }));


        return (
            <div>
                <form
                    autoComplete="off"
                    onSubmit={this.props.handleSubmit(this.onSubmit)}
                >
                    <Grid container direction="row">
                        <Grid item xs={6}>
                            <div style={{padding: 50}}>
                                <Select
                                    isClearable={true}
                                    isSearchable={true}
                                    value={this.state.selectedMember}
                                    onChange={this.handleClick}
                                    options={options}
                                    placeholder="Select a member to modify..."
                                />
                            </div>
                        </Grid>
                        <Grid item xs={6} style={{padding: 50}}>
                            <Button
                                variant="contained"
                                color="secondary"
                                style={{marginBottom: 20, display: this.state.edit ? 'block' : 'none'}}
                                onClick={() => {
                                    this.handleDelete(this.state.memberId)
                                }}
                            >
                                Delete
                            </Button>
                            <Grid item xs={12}>
                                <Field
                                    name="name"
                                    component={renderTextField}
                                    label="Name *"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Field
                                    name="birthPlace"
                                    component={renderTextField}
                                    label="Place of birth *"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Field
                                    name="birthYear"
                                    component={renderTextField}
                                    label="Year of birth *"
                                    type="number"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Field
                                    name="deathYear"
                                    component={renderTextField}
                                    label="Year of death"
                                    type="number"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Field name="sex" component={renderRadioGroup}>
                                    <FormControlLabel
                                        value="F"
                                        control={<Radio />}
                                        label="Female"
                                    />
                                    <FormControlLabel
                                        value="M"
                                        control={<Radio />}
                                        label="Male"
                                    />
                                </Field>
                            </Grid>
                            <Grid >
                                <Button
                                    variant="contained"
                                    color="primary"
                                    disabled={this.props.pristine}
                                    type={'submit'}
                                >
                                    {this.state.edit ? "Update" : "Create"}
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    style={{margin: "20px"}}
                                    onClick={this.state.edit ? this.cancel : this.reset}
                                >
                                    {this.state.edit ? "Cancel" : "Reset"}
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>

                    <ConfirmationDialog
                        open={this.state.open}
                        handleClose={this.handleClose}
                        delete={this.delete}
                    />
                    <Notification message={this.state.message} closeNotification={this.closeNotification}/>
                </form>
            </ div >);
    }
}

const wrappedForm = reduxForm({
    form: "MemberForm",
    validate
})(Member);

const mapStateToProps = ({members, member}) => {
    return {members, member};
};

export default connect(
    mapStateToProps,
    {getMembers, getMember, deleteMember, createOrUpdateMember}
)(wrappedForm);