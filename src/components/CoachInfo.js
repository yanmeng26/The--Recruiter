import React, { Component } from "react";
import '../css/coach.css';
import Header from "./Header";
import AddClubForm from "./AddClubForm.js";
import AddSchoolForm from "./AddSchoolForm.js";

class CoachInfo extends Component {
    constructor (props) {
        super(props);
            this.state = { 
            coach: {},
            clubs: [],
            schools: [],
            addClub: false,
            addSchool: false,
            error: false
        };
        this.toggleAddClub = this.toggleAddClub.bind(this);
        this.toggleAddSchool = this.toggleAddSchool.bind(this);
    };
    // Retrieve coach data on component load
    componentDidMount() {
        fetch("/endpoints/coaches.json?id=" + this.props.match.params.id)
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
                    coach: response.data[0]
                });
            }
            else {  // Otherwise no results found
                this.setState({
                    error: true
                });
            }
        });
        fetch("/endpoints/teams.json?coach_id=" + this.props.match.params.id)
        .then(response => {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) 
              return response.json() 
            else
              return {data:[]};
        })
        .then(response => {
            let clubs = [];
            let schools = [];
            if (response.data.length > 0) {     // Check if data was returned
                for (let i = 0;i<response.data.length;i++) {
                    if (response.data[i].type === "Club") {
                        clubs.push(response.data[i])
                    }
                    else if (response.data[i].type === "School") {
                        schools.push(response.data[i])
                    }
                }
                this.setState({
                    clubs: clubs,
                    schools: schools
                });
            }
        });
    }
    handleSchoolDelete(school_id) {
        const doDelete = window.confirm("Are you sure you want to remove this school?");
        if (doDelete) {
            const postBody = {"entity":"school_coaches", "idname":"school_id", "id": school_id, "idname2":"coach_id","id2":this.state.coach.coach_id}
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
                    window.open(window.location.href,"_self")
                }
            })
            .catch(function(error) {
                console.log(error);
                alert("There was an error. Please try again in a moment.");
            });
        }
    }
    handleClubDelete(club_id) {
        const doDelete = window.confirm("Are you sure you want to remove this club?");
        if (doDelete) {
            const postBody = {"entity":"club_coaches", "idname":"club_id", "id": club_id, "idname2":"coach_id","id2":this.state.coach.coach_id}
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
                    window.open(window.location.href,"_self")
                }
            })
            .catch(function(error) {
                console.log(error);
                alert("There was an error. Please try again in a moment.");
            });
        }
    }
    toggleAddClub(e) {
      e.preventDefault();
      this.setState({
        addClub: !this.state.addClub
      });
    }
    toggleAddSchool(e) {
      e.preventDefault();
      this.setState({
        addSchool: !this.state.addSchool
      });
    }
    render() {
        let schoolsRendered = this.state.schools.map((item) => <div className="coach-item" key={"school"+item.school_id}><h3><a className="team-name" href={"/teams/" + item.team_id}>{item.team_name}</a></h3><p>{item.school_club_name} <button type="button" title="Remove School" className="no-style inline button button-red button-sm" onClick={()=> this.handleSchoolDelete(item.school_id)}>×<span className="off-screen"> Remove School</span></button> <br />{item.street_address_1} <br /> {item.street_address_2 ? <span>{item.street_address_2} <br /></span> : ""} {item.city + ", " + item.state + ", " + item.zip}</p></div>);
        let clubsRendered = this.state.clubs.map((item) => <div className="coach-item" key={"club"+item.club_id}><h3><a className="team-name" href={"/teams/"+item.team_id}>{item.team_name}</a></h3><p>{item.school_club_name} <button type="button" title="Remove Club" className="no-style inline button button-red button-sm" onClick={()=> this.handleClubDelete(item.club_id)}>×<span className="off-screen"> Remove Club</span></button> <br />{item.street_address_1} <br /> {item.street_address_2 ? <span>{item.street_address_2} <br /></span> : ""} {item.city + ", " + item.state + ", " + item.zip}</p></div>);
        return (
            <div>
                <Header/>
                <div className="container">
                    {!this.state.error && <div>
                        <div className="heading-with-button">
                            <h1>Coach {this.state.coach.fname} {this.state.coach.mname ? this.state.coach.mname + " " : ""}{this.state.coach.lname}{this.state.coach.suffix ? ", " + this.state.coach.suffix : ""}</h1>
                            <a className="button button-primary" href={"/coaches/" + this.state.coach.coach_id + "/edit"}>Edit <i style={{marginLeft: 5}} className="fa fa-edit" /></a>
                        </div>
                        <section>
                            <div className="heading-with-button">
                                <h2>Schools</h2>
                                {!this.state.addSchool && <button className="no-style button button-primary" onClick={this.toggleAddSchool}>Quick Add <i style={{marginLeft: 5}} className="fa fa-plus" /></button>}
                                {this.state.addSchool && <button className="no-style button button-secondary" onClick={this.toggleAddSchool}>Cancel</button>}
                            </div>
                            {this.state.addSchool && <AddSchoolForm coach_id={this.state.coach.coach_id} url={"/coaches/"+ this.state.coach.coach_id} other={true} showDropdown={true} addRecruit={false} addCoach={true}/>}
                            {this.state.schools.length > 0 && <ul className="no-padding flex-list-dt">
                                {schoolsRendered}
                            </ul>}
                            {this.state.schools.length < 1 && <p>Does not coach for any schools.</p>}
                        </section>
                        <section>
                            <div className="heading-with-button">
                                <h2>Clubs</h2>
                                {!this.state.addClub && <button className="no-style button button-primary" onClick={this.toggleAddClub}>Quick Add <i style={{marginLeft: 5}} className="fa fa-plus" /></button>}
                                {this.state.addClub && <button className="no-style button button-secondary" onClick={this.toggleAddClub}>Cancel</button>}
                            </div>
                            {this.state.addClub && <AddClubForm coach_id={this.state.coach.coach_id} url={"/coaches/"+ this.state.coach.coach_id} other={true} showDropdown={true} addCoach={true}/>}
                            {this.state.clubs.length > 0 && <ul className="no-padding flex-list-dt">
                                {clubsRendered}
                            </ul>}
                            {this.state.clubs.length < 1 && <p>Does not coach for any clubs.</p>}
                        </section>
                    </div>}
                    {this.state.error && <h1>Error: Coach not found.</h1>}
                </div>
            </div>
        )
    }
}

export default CoachInfo;