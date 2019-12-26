import React, { Component } from "react";
import DropdownSchool from "./DropdownSchool.js";
import DropdownClub from "./DropdownClub.js";
import Header from "./Header";

class TeamEdit extends Component {
    constructor (props) {
        super(props);
        this.state = {
            team: {"team_id":null, "type":"", "team_name":null, "school_id":null, "club_id":null, "school_club_name":null, "street_address_1":null, "street_address_2":null, "city":null, "state":null, "zip":null},
            schoolClub: {},
            update_secondary: false,
            showAdd: false,
            error: false
        };
        this.fetchEndpointData = this.fetchEndpointData.bind(this);
        this.fetchSchoolClubData = this.fetchSchoolClubData.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.postData = this.postData.bind(this);
        this.postDeleteData = this.postDeleteData.bind(this);
        this.updateSchoolClub = this.updateSchoolClub.bind(this);
        this.updateVal = this.updateVal.bind(this);
    };
    // Retrieve team data on component load
    componentDidMount() {
        this.fetchEndpointData();
    }
    fetchEndpointData() {
        fetch("/endpoints/teams.json?id=" + this.props.match.params.id)
        .then(response => {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) 
                return response.json() 
            else
                return {data:[]};
        })
        .then(response => {
            if (response.data.length > 0) {     // Check if data was returned
                this.setState({
                    team: response.data[0]
                },()=>this.fetchSchoolClubData());
            }
            else {  // Otherwise no results found
                this.setState({
                    error: true
                });
            }
        });
    }
    fetchSchoolClubData() {
        const url = "/endpoints/" + (this.state.team.type === "Club" ? "clubs" : "schools") + ".json?id=" + (this.state.team.type === "Club" ? this.state.team.club_id : this.state.team.school_id);
        fetch(url)
        .then(response => {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) 
                return response.json() 
            else
                return {data:[]};
        })
        .then(response => {
            if (response.data.length > 0) {     // Check if data was returned
                this.setState({
                    schoolClub: response.data[0]
                });
            }
            else {  // Otherwise no results found
                this.setState({
                    schoolClub: {},
                    error: true
                });
            }
        });
    }
    handleDelete() {
        const doDelete = window.confirm("Are you sure you want to delete this team? This action can not be undone.")
        const props = this.state.team;
        if (doDelete) {
            const confirmDelete = window.prompt("To confirm deletion, type 'delete' in the box below.")
            if (confirmDelete.toLowerCase() === "delete") {
                if (props.type === "Club") {
                    this.postDeleteData({"entity":"team", "idname":"team_id", "id": props.team_id,"club_id":props.club_id},true);
                }
                else if (props.type === "School") {
                    this.postDeleteData({"entity":"team", "idname":"team_id", "id": props.team_id,"school_id":props.school_id,"team_id":props.team_id},true);
                }
            }
        }
    }
    postDeleteData(data,deleteSecondary) {
        console.log(data);
        fetch("/endpoints/delete", {
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
            else if (deleteSecondary) {
                if (data.school_id) {
                    this.postDeleteData({"entity":"school_coaches", "idname":"school_id", "id": data.school_id},false);
                }
                else if (data.club_id) {
                    this.postDeleteData({"entity":"club", "idname":"club_id", "id": data.club_id},false);
                }
            }
            else {
                window.open("/teams","_self")
            }
        }.bind(this))
        .catch(function(error) {
            console.log(error);
            alert("There was an error. Please try again in a moment.");
        });
    }
    handleSubmit(e) {
        const props = this.state.team;
        if (props.street_address_1 !== "" && props.city !== "" && props.state !== "" && props.city !== "" && ((props.type === "Club" && ((props.club_id !== "" !== "" && !props.state.showAdd) || (this.state.showAdd && props.school_club_name !== ""))) || (props.type === "School" && ((props.school_id !== "" && !props.state.showAdd) || (this.state.showAdd && props.school_club_name !== ""))))) {
            e.preventDefault();
            const props = this.state.team;
            props.update_secondary = this.state.update_secondary;
            this.postData(props, this.state.showAdd);
        }
    }
    postData(data, isNew) {
        const props = data;
        const url = (isNew ? "/endpoints/add-club-or-school" : "/endpoints/update-team");
        fetch(url, {
            method: "post",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(props)
        })
        .then(function(response) {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        })
        .then(function(response) {
            if (isNew) {
                if (props.type === "Club") {
                    props.club_id = response.insertId;
                    props.school_id = "";
                }
                else {
                    props.club_id = "";
                    props.school_id = response.insertId;
                }
                props.update_secondary = false;
                this.postData(props, false);
            }
            else if (props.update_secondary) {
                props.update_secondary = false;
                this.postData(props, false);
            }
            else {
                alert("Team has been updated!");
                window.open("/teams/" + props.team_id,"_self")
            }
        }.bind(this))
        .catch(function(error) {
            console.log(error);
            alert("There was an error. Please try again in a moment.");
        });
    }
    updateSchoolClub(e, isClub) {
        const value = e.target.value;
        const isBlank = value === "";
        const isOther = value === "other-value";
        const key = (isClub ? "club_id" : "school_id")
        this.setState(prevState => ({
            showAdd: isOther,
            team: {
                ...prevState.team,
                [key]: value
            }
        }),()=> {
            if (isBlank || isOther) {
                this.setState(prevState => ({
                    schoolClub: {},
                    team: {
                        ...prevState.team,
                        school_club_name: ""
                    }
                }));
            }
            else
                this.fetchSchoolClubData();
        });
    }
    updateVal(input, isSchoolOrClubData) {
        // update_secondary monitors whether the data updated is club or school data. This initiates an extra step in the submission
        this.setState(prevState => ({
            update_secondary: (isSchoolOrClubData || this.state.update_secondary),
            team: {
                ...prevState.team,
                [input.id]: input.value
            },
            schoolClub: {
              ...prevState.schoolClub,
              [input.id]: input.value
            }
        }), () => {
            if (input.id === "type") {
                this.fetchSchoolClubData();
            }
        });
    }
    render() {
        return (
        <div>
            <Header/>
            <section className="container">
                <h1>Edit Team</h1>
                <form>
                    <div className="form-group">
                        <label htmlFor="team_name">Team Name: </label>
                        <input onChange={(e) => this.updateVal(e.target, false)} id="team_name" name="team_name" type="text" value={this.state.team.team_name || ""} required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="type">Type: </label>
                        <select onChange={(e) => this.updateVal(e.target)} id="type" name="type" value={this.state.team.type || ""} required>
                            <option value="Club">Club</option>
                            <option value="School">School</option>
                        </select>
                    </div>
                    {this.state.team.type === "School" && <div className="form-group">
                        <label htmlFor="school_id">School: </label>
                        <DropdownSchool inputId="school_id" inputFor="school_id" onChangeValue={(e) => this.updateSchoolClub(e, false)} hide_first={true} value={this.state.team.school_id} other={true}/>
                    </div>}
                    {this.state.team.type === "Club" && <div className="form-group">
                        <label htmlFor="club_id">Club: </label>
                        <DropdownClub onChangeValue={(e) => this.updateSchoolClub(e, true)} hide_first={true} value={this.state.team.club_id} other={true}/>
                    </div>}
                    {this.state.showAdd && <div>
                        <div className="form-group">
                            <label htmlFor="school_club_name">{this.state.team.type + " "}Name: </label>
                            <input onChange={(e) => this.updateVal(e.target, true)} id="school_club_name" name="school_club_name" type="text" value={this.state.team.school_club_name || ""} required />
                        </div>
                    </div>}
                    <div className="form-group">
                        <label htmlFor="street_address_1">Address Line 1: </label>
                        <input onChange={(e) => this.updateVal(e.target, true)} id="street_address_1" name="street_address_1" type="text" value={this.state.schoolClub.street_address_1 || ""} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="street_address_2">Address Line 2: </label>
                        <input onChange={(e) => this.updateVal(e.target, true)} id="street_address_2" name="street_address_2" type="text" value={this.state.schoolClub.street_address_2 || ""} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="city">City: </label>
                        <input onChange={(e) => this.updateVal(e.target, true)} id="city" name="city" type="text" value={this.state.schoolClub.city || ""} required />
                    </div>
                    <div className="form-group">
                    <label htmlFor="state">State: </label>
                    <select onChange={(e) => this.updateVal(e.target, true)} id="state" name="state" value={this.state.schoolClub.state || ""} required>
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
                        <label htmlFor="zip">Zip Code: </label>
                        <input onChange={(e) => this.updateVal(e.target, true)} id="zip" name="zip" type="text" value={this.state.schoolClub.zip || ""}  required/>
                    </div>
                    <div className="form-buttons">
                        <button type="submit" id="recruit-update-submit" className="no-style button button-primary" onClick={(e) => this.handleSubmit(e)}>Update</button>
                        <button type="button" id="recruit-delete-submit" className="no-style button button-red" onClick={this.handleDelete}>Delete Team</button>
                    </div>
                </form>
            </section>
        </div>
        );
    }
}

export default TeamEdit;