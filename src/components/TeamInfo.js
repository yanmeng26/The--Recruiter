import React, { Component } from "react";
import Header from "./Header";
import DropdownRecruit from "./DropdownRecruit";
import AddCoachForm from "./AddCoachForm";

class TeamInfo extends Component {
    constructor (props) {
        super(props);
        this.state = { 
            team: {},
            recruits: [],
            coaches: [],
            error: false,
            pageLoad: false,
            recruit_id: "",
            addRecruit: false,
            addCoach: false,
            coach_id: ""
        };
        this.toggleAddRecruit = this.toggleAddRecruit.bind(this);
        this.toggleAddCoach = this.toggleAddCoach.bind(this);
        this.fetchCoachData = this.fetchCoachData.bind(this);
        this.handleCoachChange = this.handleCoachChange.bind(this);
        this.handleRecruitSubmit = this.handleRecruitSubmit.bind(this);
        this.handleRecruitChange = this.handleRecruitChange.bind(this);
        this.handleRecruitDelete = this.handleRecruitDelete.bind(this);
        this.fetchRecruitData = this.fetchRecruitData.bind(this);
        this.submissionCallback = this.submissionCallback.bind(this);
    };
    // Retrieve team data on component load
    componentDidMount() {
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
                    team: response.data[0],
                    pageLoad: true
                },()=>this.fetchCoachData());
            }
            else {  // Otherwise no results found
                this.setState({
                    error: true,
                    pageLoad: true
                });
            }
        });
        this.fetchRecruitData();
    }
    
    fetchRecruitData() {
        fetch("/endpoints/recruits.json?team_id=" + this.props.match.params.id)
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
                    recruits: response.data.sort((a,b) => {
                        if (a.lname< b.lname)
                            return -1;
                        if (a.lname > b.lname)
                            return 1;
                        return 0;
                    })
                });
            }
        });
    }
    fetchCoachData() {
        const team = this.state.team;
        if (team !== {}) {
            const queryString = (team.type === "Club" ? "?club_id="+team.club_id : "?school_id="+team.school_id)
            fetch("/endpoints/coaches.json" + queryString)
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
                        coaches: response.data.sort((a,b) => {
                            if (a.lname< b.lname)
                                return -1;
                            if (a.lname > b.lname)
                                return 1;
                            return 0;
                        })
                    });
                }
            });
        }
    }
    handleCoachDelete(coach) {
        const doDelete = window.confirm("Are you sure you want to remove this coach?")
        if (doDelete) {
            let postBody = {};
            if (this.state.team.type === "School")
                postBody = {"entity":"school_coaches", "idname":"school_id", "id": this.state.team.school_id, "idname2":"coach_id","id2":coach};
            else if (this.state.team.type === "Club")
                postBody = {"entity":"club_coaches", "idname":"club_id", "id": this.state.team.club_id, "idname2":"coach_id","id2":coach};
            if (postBody !== {}) {
                fetch("/endpoints/delete", {
                    method: "post",
                    headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                    },
                    body: JSON.stringify(postBody)
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
                    else {
                        alert("Coach has been removed.")
                        window.open("/teams/"+ this.state.team.team_id,"_self");
                    }
                }.bind(this))
                .catch(function(error) {
                    console.log(error);
                    alert("There was an error. Please try again in a moment.");
                });
            }
        }
    }
    handleCoachChange(e) {
        this.setState({
            coach_id: e.target.value
        });
    }
    handleRecruitChange(e) {
        this.setState({
            recruit_id: e.target.value
        });
    }
    handleRecruitSubmit(e) {
        let postBody = {};
        if (this.state.team.type === "Club")
            postBody = {"club_id":this.state.team.club_id,"recruit_id":this.state.recruit_id};
        else if (this.state.team.type === "School")
            postBody = {"school_id":this.state.team.school_id,"recruit_id":this.state.recruit_id};
        if (this.state.recruit_id !== "" && postBody !== {}) {
            e.preventDefault();
            fetch("/endpoints/add-team-recruit", {
                method: "post",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(postBody)
            })
            .then(function(response) {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response.json();
            })
            .then(function(response) {
                alert("Recruit has been added!")
                window.open(window.location.href,"_self")
            })
            .catch(function(error) {
                console.log(error);
                alert("There was an error. Please try again in a moment.");
            });
        }
    }
    handleRecruitDelete(id) {
        const doDelete = window.confirm("Are you sure you want to remove this recruit?");
        if (doDelete && this.state.team.type === "Club") {
            const postBody = {"entity":"club_recruits", "idname":"recruit_id", "id": id, "idname2":"club_id","id2":this.state.team.club_id};
            fetch("/endpoints/delete", {
                method: "post",
                headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
                },
                body: JSON.stringify(postBody)
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
                else {
                    alert("Recruit has been removed.")
                    window.open("/teams/"+ this.state.team.team_id,"_self");
                }
            }.bind(this))
            .catch(function(error) {
                console.log(error);
                alert("There was an error. Please try again in a moment.");
            });
        }
    }
    toggleAddCoach() {
        this.setState({
          addCoach: !this.state.addCoach
        });
    }
    toggleAddRecruit(e) {
        e.preventDefault();
        this.setState({
          addRecruit: !this.state.addRecruit
        });
    }
    submissionCallback() {
        this.fetchCoachData();
        this.toggleAddCoach()
    }
    render() {
        let query = "";
        if (this.state.team.type !== "")
            query = (this.state.team.type === "Club" ? "not_club_id="+this.state.team.club_id : "not_school_id="+this.state.team.school_id)
        let recruitsRendered = this.state.recruits.map((item) => <li key={"recruit"+item.recruit_id}><a href={"/recruits/" + item.recruit_id}>{item.fname} {item.mname ? item.mname + " " : ""} {item.lname}</a> {this.state.team.type ==="Club" && <button type="button" className="no-style button button-red button-sm" onClick={()=> this.handleRecruitDelete(item.recruit_id)} title="Remove Recruit">×<span className="off-screen"> Remove Recruit</span></button>}{this.state.team.type ==="School" && <a className="button button-primary button-md" href={"/recruits/"+item.recruit_id+"/edit"}>Edit</a>}</li>);
        const coachesRendered = this.state.coaches.map(coach => <li key={"team-coach"+coach.coach_id}><a href={"/coaches/" + coach.coach_id}>{coach.fname + " " + coach.lname}</a> <button type="button" className="no-style button button-red button-sm" onClick={()=> this.handleCoachDelete(coach.coach_id)} title="Remove Coach">×<span className="off-screen"> Remove Coach</span></button></li>);
        return (
            <div>
                <Header/>
                <section className="container">
                    {!this.state.error && this.state.pageLoad && <div>
                        <div className="heading-with-button">
                            <h1>{this.state.team.team_name}</h1> 
                            <a className="button button-primary" href={"/teams/" + this.state.team.team_id + "/edit"}>Edit <i style={{marginLeft: 5}} className="fa fa-edit" /></a>
                        </div>
                        <section>
                            <p>Type: {this.state.team.type}</p>
                            <h2 style={{marginBottom:0}}>{this.state.team.school_club_name}</h2>
                            <p style={{marginTop:5}}>{this.state.team.street_address_1} <br />
                            {this.state.team.street_address_2 ? <span>{this.state.team.street_address_2 + " "} <br /></span> : ""}
                            {this.state.team.city}, {this.state.team.state} {this.state.team.zip}
                            </p>
                        </section>
                        <section>
                            <div className="heading-with-button">
                            <h2>Coaches</h2>
                                {!this.state.addCoach && <button className="no-style button button-primary" onClick={this.toggleAddCoach}>Quick Add <i style={{marginLeft: 5}} className="fa fa-plus" /></button>}
                                {this.state.addCoach && <button className="no-style button button-secondary" onClick={this.toggleAddCoach}>Cancel</button>}
                            </div>
                            {this.state.addCoach && <form>
                                <AddCoachForm query={query} callback={this.submissionCallback} clubId={this.state.team.club_id} schoolId={this.state.team.school_id} showDropdown={true} other={true}/>
                            </form>}
                            {this.state.coaches.length > 0 && <ul>
                                {coachesRendered}
                            </ul>}
                            {this.state.coaches.length < 1 && <p>No coaches are on file for this team.</p>}
                        </section>
                        <section>
                            <div className="heading-with-button">
                                <h2>Recruits</h2>
                                {!this.state.addRecruit && <button className="no-style button button-primary" onClick={this.toggleAddRecruit}>Quick Add <i style={{marginLeft: 5}} className="fa fa-plus" /></button>}
                                {this.state.addRecruit && <button className="no-style button button-secondary" onClick={this.toggleAddRecruit}>Cancel</button>}
                            </div>
                            {this.state.addRecruit && <form>
                                <DropdownRecruit value={this.state.recruit_id} not_club_id={this.state.team.club_id} not_school_id={this.state.team.school_id} onChangeValue={this.handleRecruitChange} required={true}/>
                                <div className="form-group">
                                    <button type="submit" className="submit no-style button button-primary" onClick={(e) => this.handleRecruitSubmit(e)}>Add Recruit</button>
                                </div>
                            </form>}
                            {this.state.recruits.length > 0 && <ul>
                                {recruitsRendered}
                            </ul>}
                            {this.state.recruits.length < 1 && <p>No recruits under this team.</p>}
                        </section>
                    </div>}
                    {this.state.error && <h1>Error: Team not found.</h1>}
                </section>
            </div>
        )
    }
}

export default TeamInfo;