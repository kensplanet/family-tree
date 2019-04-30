import React, {Component} from "react";
import Grid from "@material-ui/core/Grid";
import {connect} from "react-redux";
import {getMembers, addCouple, getParents, getFamilyTree, addParent} from "../../actions";
import Button from "@material-ui/core/Button";
import _ from 'lodash';
import Select from 'react-select';
import makeAnimated from 'react-select/lib/animated';
import Notification from '../../utils/Notification';
import * as FamilyTreeHelper from '../../utils/FamilyTreeHelper';

class Relationship extends Component {
    constructor(props) {
        super(props);
        this.state = {
            members: [],
            parents: [],
            relationship: {},
            member: {},
            selectedOptions: null,
            selectedMember: null
        };
    }

    loadMembers = () => {
        this.props.getMembers().then(() => {
            this.setState({
                members: this.props.members
            });
        });
    };

    // As soon as this component is mounted, it will fetch all the members from the server
    componentDidMount() {
        this.loadMembers();
    }

    handleClick = (selectedOptions) => {
        if (selectedOptions.length === 0) {
            this.loadMembers();
        }

        if (selectedOptions.length === 1) {
            this.props.getFamilyTree(selectedOptions[0].memberId).then(() => {
                let list = FamilyTreeHelper.getObjects(this.props.familyTree, 'memberId', '')
                    .map(member => member.memberId);
                this.setState({
                    members: this.state.members.filter(member => !_.includes(list, member.memberId))
                })
            });
        }

        if (selectedOptions.length <= 2) {
            this.setState({selectedOptions});
        }
    };

    handleMemberClick = (selectedMember) => {
        this.setState({selectedMember});
        if (_.get(selectedMember, 'memberId')) {
            let {memberId} = selectedMember;
            this.props.getParents().then(()=> {
                this.props.getFamilyTree(memberId).then(() => {
                    var list = FamilyTreeHelper.getObjects(this.props.familyTree, 'parentId', '')
                        .map(parent => parent.parentId)
                        .filter(parentIds => parentIds);
                    this.setState({
                        parents: this.props.parents.filter(parent => !_.includes(list, parent.parentId))
                    })
                })
            });

        } else {
            this.loadMembers();
        }
    };

    handleParentClick = (selectedParent) => {
        this.setState({selectedParent});
    };

    closeNotification = () => {
        this.setState({
            message: null
        });
    };

    addParent = () => {
        const {selectedMember, selectedParent} = this.state;
        let member = {
          memberId: selectedMember.memberId,
            parent: {
              parentId: selectedParent.parentId
            }
        };
        var that = this;
        this.props.addParent(member).then(()=> {
            that.setState({
                message: "Parental relationship successfully added.",
                selectedMember: null,
                selectedParent:[]
            });
        });
    };


    addCouple = () => {
        let parent = {
            members: []
        };
        const {selectedOptions} = this.state;
        selectedOptions.forEach((option) => {
            parent.members.push(option);
        });

        var that = this;
        this.props.addCouple(parent)
            .then((response) => {
                that.setState({
                    message: "Spousal relationship successfully added."
                });
            });
        this.setState({
            selectedOptions: null
        });
    };

    render() {
        const {members, parents, selectedMember, selectedOptions, selectedParent} = this.state;

        let options = [];
        members.map(member => {
            options.push(
                {
                    memberId: member.memberId,
                    value: member.memberId,
                    label: member.name
                }
            )
        });

        let parentOptions = [];
        parents.map(parent => {
            let labelArray = [];
            parent.members.forEach((member) => {
                labelArray.push(member.name);
            });
            let label = labelArray.join(' & ');
            parentOptions.push(
                {
                    parentId: parent.parentId,
                    value: parent.parentId,
                    label: label
                }
            )
        });

        return (
            <div>
                <Grid container direction="row">
                    <Grid item xs={6}>
                        <div style={{padding: 50}}>
                            <Button style={{margin: 10}}
                                    variant="contained"
                                    color="primary"
                                    disabled={_.isEmpty(selectedOptions) || _.get(selectedOptions, 'length') !== 2}
                                    onClick={this.addCouple}>
                                Create Spousal Relationship
                            </Button>
                            <Select
                                isClearable={true}
                                isSearchable={true}
                                value={this.state.selectedOptions}
                                onChange={this.handleClick}
                                options={options}
                                isMulti
                                components={makeAnimated()}
                                closeMenuOnSelect={false}
                                placeholder="Select 2 members..."
                            />
                        </div>
                    </Grid>

                    <Grid item xs={6}>
                        <div style={{padding: 50}}>
                            <Button style={{margin: 10}}
                                    variant="contained"
                                    color="primary"
                                    disabled={_.isEmpty(selectedParent)}
                                    onClick={this.addParent}>
                                Update Parental Relationship
                            </Button>
                            <Select
                                isClearable={true}
                                isSearchable={true}
                                value={selectedMember}
                                onChange={this.handleMemberClick}
                                options={options}
                                closeMenuOnSelect={true}
                                placeholder="Select a member..."
                            />
                            <p></p>
                            <Select
                                isClearable={true}
                                value={selectedParent}
                                onChange={this.handleParentClick}
                                options={parentOptions}
                                closeMenuOnSelect={true}
                                isSearchable={true}
                                placeholder="Select a parent..."
                            />
                        </div>
                    </Grid>
                </Grid>

                <Notification message={this.state.message} closeNotification={this.closeNotification}/>
            </div>
        );
    }
}

const mapStateToProps = ({members, relationship, parents, familyTree}) => {
    return {members, relationship, parents, familyTree};
};

export default connect(
    mapStateToProps,
    {getMembers, addParent, getParents, getFamilyTree, addCouple}
)(Relationship);