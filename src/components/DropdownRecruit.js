import React, { Component } from "react";

class DropdownRecruit extends Component {
    constructor() {
        super();
        this.state = {
            recruits: [],
        selectvalue: ""
        };
    }
    componentDidMount() {
        fetch("/endpoints/recruits.json?" + (this.props.not_school_id ? "not_school_id="+ this.props.not_school_id : "") + (this.props.not_club_id ? "not_club_id="+ this.props.not_club_id : "")) 
        .then(response => {
            return response.json();
        })
        .then(response => {
            this.setState({
                recruits: response.data.sort((a,b) => {
                if (a.lname< b.lname)
                    return -1;
                if (a.lname > b.lname)
                    return 1;
                return 0;
                })
            });
        });
    }

    render() {
        return (
        <div>
            <select value={this.props.value || ""} onChange={this.props.onChangeValue} required={this.props.required}>
                <option value="">Select a Recruit</option>
                {this.state.recruits.map(recruit => (
                    <option key={"recruit"+recruit.recruit_id} value={recruit.recruit_id}>
                    {recruit.fname} {(recruit.mname ? recruit.mname + " " : "")} {recruit.lname}
                    </option>
                ))}
                {this.props.other && <option value="other-value">Other...</option>}
            </select>
        </div>
        );
    }
}
export default DropdownRecruit;