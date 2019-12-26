import React, { Component } from "react";
import DropdownClub from "./DropdownClub.js";
import DropdownSchool from "./DropdownSchool.js";
import InputMask from 'react-input-mask';

class AddTeamForm extends Component {
    constructor() {
        super();
        this.state = {
            recruits: [],
            club_id: null,
            selectvalue: "",
            team: {"team_id":null, "type":"", "team_name":null, "school_id":null, "club_id":null, "school_club_name":null, "street_address_1":null, "street_address_2":null, "city":null, "state":null, "zip":null,"update_secondary":false},
            schoolClub: {},
            update_secondary: false,
            showAdd: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateVal = this.updateVal.bind(this);
    }
    componentDidMount() {
        if (!this.props.showDropdown) {
            this.setState({
                showAdd: true,
            });
        }
    }
    handleSubmit(e) {
        const props = this.state.team;
        if ((this.state.showAdd && (props.team_name != "" && props.school_club_name != "" && props.type && props.street_address_1 !== null && props.city !== null && props.state !== null && props.city !== null && props.zip !== null)) || (!this.state.showAdd && this.state.team.club_id) || (!this.state.showAdd && this.state.team.school_id)) {
            e.preventDefault();
            if (this.state.showAdd) 
                this.postData(this.state.team, "/endpoints/add-club-or-school", true, this.props.add_recruit);
            else if (this.state.team.type === "Club")
                this.postData({"club_id":this.state.team.club_id,"recruit_id":this.props.recruit_id}, "/endpoints/add-team-recruit", false, this.props.add_recruit);
            else
                this.postData({"school_id":this.state.team.school_id,"recruit_id":this.props.recruit_id}, "/endpoints/add-team-recruit", false, this.props.add_recruit);
        }
    }
    postData(data, url, isNew, updateRecruit) {
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
                if (data.type === "Club")
                    data.club_id = response.insertId;
                else if (data.type === "School")
                    data.school_id = response.insertId;
                data.update_secondary = true;
                this.postData(data, "/endpoints/add-team", false, updateRecruit);
            }
            else if (data.update_secondary && updateRecruit) {
                data.update_secondary = false;
                if (data.type === "Club")
                    this.postData({"club_id":data.club_id,"recruit_id":this.props.recruit_id}, "/endpoints/add-team-recruit", false, updateRecruit);
                else if (data.type === "School")
                    this.postData({"school_id":data.school_id,"recruit_id":this.props.recruit_id}, "/endpoints/add-team-recruit", false, updateRecruit);
            }
            else {
                if (updateRecruit)
                    alert("Team has been added to this recruit.");
                else
                    alert("Team has been added!")
                window.open(this.props.url || "/teams/" + response.insertId,"_self")
            }
        }.bind(this))
        .catch(function(error) {
            console.log(error);
            alert("There was an error. Please try again in a moment.");
        });
    }
    updateClub(e) {
        const isOther = (e.target.value === "other-value");
        const value = e.target.value;
        this.setState(prevState => ({
            showAdd: (isOther || !this.props.showDropdown),
            team: {
                ...prevState.team,
                update_secondary: isOther,
                club_id: value,
                school_id: null
            }
        }));
    }
    updateSchool(e) {
        const isOther = (e.target.value === "other-value");
        const value = e.target.value;
        this.setState(prevState => ({
            showAdd: (isOther || !this.props.showDropdown),
            team: {
                ...prevState.team,
                update_secondary: isOther,
                school_id: value,
                club_id: null
            }
        }));
    }
    updateVal(input, isSchoolOrClubData) {
        this.setState(prevState => ({
            team: {
                ...prevState.team,
                [input.id]: input.value,
            }
        }));
    }
    render() {
        return (
            <div>
                {this.props.showTypeSelect && <div className="form-group">
                    <label htmlFor="type">Type: <span className="required">*</span></label>
                    <select onChange={(e) => this.updateVal(e.target)} id="type" name="type" value={this.state.team.type || ""} required>
                        <option value="">Select a Type</option>
                        <option value="Club">Club</option>
                        <option value="School">School</option>
                    </select>
                </div>}
                {this.props.showDropdown && this.state.team.type === "Club" && <div className="form-group">
                    <label htmlFor="club_id">Club: </label>
                    <DropdownClub inputId="club_id" inputFor="club_id" query={"?not_recruit_id="+this.props.recruit_id} value={this.state.club_id} onChangeValue={(e) => this.updateClub(e)} required={true} other={this.props.other}/>
                </div>}
                {this.props.showDropdown && this.state.team.type === "School" && <div className="form-group">
                    <label htmlFor="school_id">School: </label>
                    <DropdownSchool inputId="school_id" inputFor="school_id" query={"?not_recruit_id="+this.props.recruit_id} value={this.state.school_id} onChangeValue={(e) => this.updateSchool(e)} required={true} other={this.props.other}/>
                </div>}
                <div>
                    <div className="form-group">
                        <label htmlFor="team_name">Team Name: <span className="required">*</span> </label>
                        <input onChange={(e) => this.updateVal(e.target, false)} id="team_name" name="team_name" type="text" value={this.state.team.team_name || ""} required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="school_club_name">{this.state.team.type !== "" ? this.state.team.type + " " : ""}Name: <span className="required">*</span> </label>
                        <input onChange={(e) => this.updateVal(e.target, true)} id="school_club_name" name="school_club_name" type="text" value={this.state.team.school_club_name || ""} required />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="street_address_1">Address Line 1: <span className="required">*</span> </label>
                    <input onChange={(e) => this.updateVal(e.target, true)} id="street_address_1" name="street_address_1" type="text" value={this.state.team.street_address_1 || ""} required />
                </div>
                <div className="form-group">
                    <label htmlFor="street_address_2">Address Line 2: </label>
                    <input onChange={(e) => this.updateVal(e.target, true)} id="street_address_2" name="street_address_2" type="text" value={this.state.team.street_address_2 || ""} />
                </div>
                <div className="form-group">
                    <label htmlFor="city">City: <span className="required">*</span> </label>
                    <input onChange={(e) => this.updateVal(e.target, true)} id="city" name="city" type="text" value={this.state.team.city || ""} required />
                </div>
                <div className="form-group">
                <label htmlFor="state">State: <span className="required">*</span> </label>
                    <select onChange={(e) => this.updateVal(e.target, true)} id="state" name="state" value={this.state.team.state || ""} required>
                        <option value="">Select a State</option>
                        <option value="AL">Alabama</option>
                        <option value="AK">Alaska</option>
                        <option value="AZ">Arizona</option>
                        <option value="AR">Arkansas</option>
                        <option value="CA">California</option>
                        <option value="CO">Colorado</option>
                        <option value="CT">Connecticut</option>
                        <option value="DE">Delaware</option>
                        <option value="DC">District of Columbia</option>
                        <option value="FL">Florida</option>
                        <option value="GA">Georgia</option>
                        <option value="HI">Hawaii</option>
                        <option value="ID">Idaho</option>
                        <option value="IL">Illinois</option>
                        <option value="IN">Indiana</option>
                        <option value="IA">Iowa</option>
                        <option value="KS">Kansas</option>
                        <option value="KY">Kentucky</option>
                        <option value="LA">Louisiana</option>
                        <option value="ME">Maine</option>
                        <option value="MD">Maryland</option>
                        <option value="MA">Massachusetts</option>
                        <option value="MI">Michigan</option>
                        <option value="MN">Minnesota</option>
                        <option value="MS">Mississippi</option>
                        <option value="MO">Missouri</option>
                        <option value="MT">Montana</option>
                        <option value="NE">Nebraska</option>
                        <option value="NV">Nevada</option>
                        <option value="NH">New Hampshire</option>
                        <option value="NJ">New Jersey</option>
                        <option value="NM">New Mexico</option>
                        <option value="NY">New York</option>
                        <option value="NC">North Carolina</option>
                        <option value="ND">North Dakota</option>
                        <option value="OH">Ohio</option>
                        <option value="OK">Oklahoma</option>
                        <option value="OR">Oregon</option>
                        <option value="PA">Pennsylvania</option>
                        <option value="RI">Rhode Island</option>
                        <option value="SC">South Carolina</option>
                        <option value="SD">South Dakota</option>
                        <option value="TN">Tennessee</option>
                        <option value="TX">Texas</option>
                        <option value="UT">Utah</option>
                        <option value="VT">Vermont</option>
                        <option value="VA">Virginia</option>
                        <option value="WA">Washington</option>
                        <option value="WV">West Virginia</option>
                        <option value="WI">Wisconsin</option>
                        <option value="WY">Wyoming</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="zip">Zip Code: <span className="required">*</span> </label>
                    <InputMask onChange={(e) => this.updateVal(e.target)} id="zip" name="zip" type="text" mask="99999" value={this.state.team.zip || ""} required />
                </div>
                <div className="form-group">
                    <button type="submit" id="recruit-update-submit" className="no-style button button-primary" onClick={(e) => this.handleSubmit(e)}>Add</button>
                </div>
            </div>
        );
    }
}
export default AddTeamForm;