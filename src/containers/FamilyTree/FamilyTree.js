import React, {Component} from "react";
import Grid from "@material-ui/core/Grid";
import {connect} from "react-redux";
import {getMembers, getFamilyTree} from "../../actions";
import Select from 'react-select';
import _ from 'lodash';
import dTree from 'd3-dtree';
import './FamilyTree.css';
import * as FamilyTreeHelper from '../../utils/FamilyTreeHelper';
import $ from 'jquery';

class FamilyTree extends Component {
    constructor(props) {
        super(props);
        this.state = {
            members: [],
            selectedMember: null
        };
        window._ = _;
    }

    // As soon as this component is mounted, it will fetch all the members from the server
    componentDidMount() {
        this.props.getMembers().then(() => {
            this.setState({
                members: this.props.members
            });
        });
    }

    handleClick = (selectedMember) => {
        this.setState({selectedMember});
        $('#graph').html('');
        if (selectedMember) {
            this.props.getFamilyTree(selectedMember.value).then(() => {
                const {familyTree} = this.props,
                    memberId = selectedMember.value;

                let generateNodes = (memberId) => {
                    let member = FamilyTreeHelper.getObject(familyTree, 'memberId', memberId);
                    let spouses = (member.spouses || [])
                        .map(spouse => spouse.parentId)
                        .map((parentId) => {
                            let parent = FamilyTreeHelper.getObjects(familyTree, 'parentId', parentId),
                                parentObject = {};
                            parent.forEach(parent => {
                                parentObject.parentId = parent.parentId;
                                if (parent.members) {
                                    parentObject.members = parent.members;
                                }
                                if (parent.children) {
                                    parentObject.children = parent.children;
                                }
                            });
                        return parentObject;
                    }).map(parent => ({spouse: parent.members.filter(spouse => spouse.memberId !== member.memberId)[0], children: parent.children}));

                    return [{
                        name: member.name,
                        class: 'sex' + (member.sex || ''),
                        marriages: spouses.map(relation => {
                            return ({
                                spouse: {
                                    name: relation.spouse.name,
                                    class: 'sex' + (relation.spouse.sex || ''),
                                    extra: _.pick(relation.spouse, ['memberId'])
                                },
                                children: (relation.children || [])
                                    .map(child => (generateNodes(child.memberId)[0]))
                            })
                        }),
                        extra: _.pick(member, ['memberId'])
                    }];
                };


                let generateFamilyTree = (memberId) => {
                    const member = FamilyTreeHelper.getObject(familyTree, 'memberId', memberId);
                    if (member.parent) {
                        let parentIds = FamilyTreeHelper.getObjects(familyTree, 'parentId', _.get(member, 'parent.parentId'))
                            .filter(couple => couple.members)
                            .map(member => member.members)[0]
                            .map(member => member.memberId);
                        return generateNodes(parentIds[0]);
                    }  else {
                        return generateNodes(memberId);
                    }
                };

                let that = this;

                // Configuration required for generating family tree using D3 dtree.
                const config = {
                    target: '#graph',
                    debug: false,
                    height: 2000,
                    width: 1800,
                    callbacks: {
                        nodeClick: function (name, extra) {
                            if (_.get(extra, 'memberId')) {
                                that.handleClick({value: extra.memberId, label: name});
                            }
                        },
                        textRenderer: function (name, extra) {
                            extra = extra || {};
                            extra = FamilyTreeHelper.getObject(familyTree, 'memberId', extra.memberId);
                            return `<p align="center" class="nodeText">
                            ${name}<br/>
                            ${[extra.birthYear, extra.deathYear].filter(year => year).join(' - ')}
                            <br/>
                            ${extra.birthPlace}
                            </p>`;
                        }
                    },
                    margin: {
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0
                    },
                    nodeWidth: 200,
                    styles: {
                        node: 'node',
                        linage: 'linage',
                        marriage: 'marriage',
                        text: 'nodeText'
                    }
                };

                const ancestorConfig = $.extend(true, {}, config);
                ancestorConfig.styles.node = 'disabled';
                ancestorConfig.height = 200;

                let node = generateFamilyTree(memberId);
                let displayedNodes = FamilyTreeHelper.getObjects(node, 'name', '').map(member => member.extra.memberId);
                let ancestors = [{name: 'Possible Ancestors -->', class: 'ancestorHeading'}];

                 [...new Set(FamilyTreeHelper.getObjects(familyTree, 'memberId', '')
                    .filter(member => !member.parent)
                    .map(member => member.memberId)
                    .filter(memberId => {
                         return !_.includes(displayedNodes, memberId)}))]
                    .map(memberId => FamilyTreeHelper.getObject(familyTree, 'memberId', memberId))
                    .forEach(member => {
                        ancestors.push({
                            name: member.name,
                            class: 'sex' + (member.sex || '') + ' disabled',
                            extra: _.pick(member, ['memberId'])
                        })
                    });

                dTree.init(ancestors, ancestorConfig);
                dTree.init(node, config);

            });
        }
    };

    render() {
        const {members, selectedMember} = this.state;

        let options = members.map(member => ({
            value: member.memberId,
            label: member.name
        }));


        return (
            <div>
                <Grid container direction="row">
                    <Grid item xs={12}>
                        <div style={{padding: 50}}>
                            <Select
                                isClearable={true}
                                isSearchable={true}
                                value={selectedMember}
                                onChange={this.handleClick}
                                autoFocus={true}
                                options={options}
                                placeholder="Select a member to to show the family tree..."
                            />
                        </div>
                        <div id="graph"></div>
                    </Grid>
                </Grid>
            </ div >
        );
    }
}

const mapStateToProps = ({members, familyTree}) => {
    return {members, familyTree};
};

export default connect(
    mapStateToProps,
    {getMembers, getFamilyTree}
)(FamilyTree);