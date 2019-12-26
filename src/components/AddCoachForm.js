import React, { Component } from "react";
import InputMask from 'react-input-mask';
import DropdownClub from "./DropdownClub.js";
import DropdownCoach from "./DropdownCoach";

class AddCoachForm extends Component {
    constructor() {
        super();
        this.state = {
            coach_val: "",
            coach: {"fname":"","mname":"","lname":"","suffix":""},
            data: {
                "club_id": "",
                "school_id": "",
                "coach_id": "",
                "type": ""
            }
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateVal = this.updateVal.bind(this);
    }
    componentDidMount() {
        let id = "", type = "";
        if (this.props.clubId) {
            type = "Club";
        }
        else if (this.props.schoolId) {
            type = "School";
        }
        this.setState({
            data: {
                club_id: this.props.clubId,
                school_id: this.props.schoolId,
                coach_id: this.state.coach_val,
                type: type
            }
        });
    }
    handleSubmit(e) {
        const props = this.state.coach;
        if (this.state.coach_val === "other-value" && props.fname !== "" && props.lname !== "") {
            e.preventDefault();
            props.type = this.state.data.type;
            this.postData(props, "/endpoints/add-coach", true);
        }
        else if (this.state.coach_val !== "other-value" && this.state.coach_val.length > 0) {
            e.preventDefault();
            this.setState(prevState=>({
                data: {
                    ...prevState.data,
                    coach_id: this.state.coach_val
                }
            }),()=>{
                this.postData(this.state.data, "/endpoints/add-team-coach", false);
            });
        }
    }
    postData(data, url, isNew) {
        fetch(url, {
            method: "post",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(function(response) {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        })
        .then(function(response) {
            if (response.errno) {
                alert("There was an error. Please try again in a moment.");
                console.log(response);
            }
            else if (isNew) {
                this.setState(prevState=>({
                    data: {
                        ...prevState.data,
                        coach_id: response.insertId
                    }
                }),()=>{
                    this.postData(this.state.data, "/endpoints/add-team-coach", false);
                });
            }
            else {
                alert("Coach has been added!");
                if (this.props.callback) {
                    this.props.callback();
                }
                else 
                    window.open(window.location.href,"_self")
            }
        }.bind(this))
        .catch(function(error) {
            console.log(error);
            alert("There was an error. Please try again in a moment.");
        });
    }
    updateCoach(e) {
        const isOther = (e.target.value === "other-value");
        const value = e.target.value;
        this.setState(prevState => ({
            coach_val: value
        }));
    }
    updateVal(input, isSchoolOrClubData) {
        this.setState(prevState => ({
            coach: {
                ...prevState.coach,
                [input.id]: input.value
            }
        }));
    }
    render() {
        return (
            <div>
                {this.props.showDropdown && <div className="form-group">
                    <label htmlFor="coach_id">Coach: </label>
                    <DropdownCoach query={this.props.query} inputId="coach_id" inputFor="coach_id" value={this.state.coach_val} onChangeValue={(e) => this.updateCoach(e)} required={true} other={this.props.other}/>
                </div>}
                {this.state.coach_val === "other-value" && <div>
                    <div className="form-group">
                        <label htmlFor="fname">First Name: </label>
                        <input onChange={(e) => this.updateVal(e.target)} id="fname" name="fname" type="text" required value={this.state.coach.fname || ""}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="mname">Middle Name: </label>
                        <input onChange={(e) => this.updateVal(e.target)} id="mname" name="mname" type="text" value={this.state.coach.mname || ""}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="lname">Last Name: </label>
                        <input onChange={(e) => this.updateVal(e.target)} id="lname" name="lname" type="text" required value={this.state.coach.lname || ""}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="suffix">Suffix: </label>
                        <input onChange={(e) => this.updateVal(e.target)} id="suffix" name="suffix" type="text" value={this.state.coach.suffix || ""}/>
                    </div>
                </div>}
                <div className="form-group">
                    <button type="submit" id="recruit-update-submit" className="no-style button button-primary" onClick={(e) => this.handleSubmit(e)}>Add</button>
                </div>
            </div>
        );
    }
}
export default AddCoachForm;