import React, { Component } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import "../css/recruit.css";
import "font-awesome/css/font-awesome.min.css";
import Header from "./Header";
import RecruitEvaluations from "../components/RecruitEvaluations";
import ParentsSection from "./ParentsSection.js";
import AddClubForm from "./AddClubForm.js";

class RecruitInfo extends Component {
    constructor (props) {
        super(props);
            this.state = { 
            recruit: {},
            schoolCoaches: [],
            clubCoaches: [],
            clubs: [],
            coaches: [],
            school: {},
            calls: null,
            formattedDate: "",
            addClub: false,
            error: false
        };
        this.toggleAddClub = this.toggleAddClub.bind(this);
        this.getTeamData = this.getTeamData.bind(this);
        this.handleClubDelete = this.handleClubDelete.bind(this);
        this.getCallLogData = this.getCallLogData.bind(this);
    };
    // Retrieve recruit data on component load
    componentDidMount() {
        fetch("/endpoints/recruits.json?id=" + this.props.match.params.id)
        .then(response => {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) 
              return response.json() 
            else
              return {data:[]};
        })
        .then(response => {
            if (response.data.length > 0) {     // Check if data was returned
                const dob = new Date(response.data[0].dob);
                this.setState({
                    formattedDate: (dob.getMonth() + 1) + "/" + dob.getDate() + "/" + dob.getUTCFullYear(),
                    recruit: response.data[0]
                });
            }
            else {  // Otherwise no results found
                this.setState({
                    error: true
                });
            }
        });
        fetch("/endpoints/coaches.json?school_id=" + this.props.match.params.id)
        .then(response => {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) 
              return response.json() 
            else
              return {};
        })
        .then(response => {
            if (response.hasOwnProperty("data")) {     // Check if data was returned
                this.setState({
                    schoolCoaches: response.data
                });
            }
        });
        this.getTeamData();
        this.getCallLogData();
    }
    getCallLogData() {
        fetch("/endpoints/calls.json?id=" + this.props.match.params.id)
        .then(response => {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) 
              return response.json() 
            else
              return {};
        })
        .then(response => {
            if (response.hasOwnProperty("data")) {     // Check if data was returned
                const sorted = response.data.sort((a,b) => {
                    if (a.time > b.time)
                        return -1;
                    if (a.time < b.time)
                        return 1;
                    return 0;
                });
                const callsJsx = sorted.map((call) => {
                    let date = new Date(call.time);
                    let min = "" + date.getMinutes();
                    if (date.getMinutes() < 10)
                        min = "0" + min;
                    let dateFormat = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
                    let today = new Date();
                    let difference = Math.floor((today-date)/(1000 * 60 * 60 * 24)) + 1;
                    let timeFormat = (date.getHours() > 12 ? date.getHours() - 12 : date.getHours()) + ":" + min + " " + (date.getHours() >= 12 ? "pm" : "am");
                    return <li key={"call"+call.call_id}>{dateFormat} {timeFormat} ({difference} day{difference !== 1 ? "s" : ""} ago) <button type="button" title="Remove Call" className="no-style inline button button-red button-sm" onClick={()=> this.handleCallDelete(call.call_id)}>×<span className="off-screen"> Remove Call</span></button></li>
                });
                this.setState({
                    calls: (response.data.length ? callsJsx : <li>There are no recent calls logged.</li>)
                });
            }
        });
    }
    getTeamData() {
        fetch("/endpoints/teams.json?recruit_id=" + this.props.match.params.id)
        .then(response => {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) 
              return response.json() 
            else
              return {};
        })
        .then(response => {
            if (response.hasOwnProperty("data")) {     // Check if data was returned
                let clubs = [];
                for (let i=0;i<response.data.length;i++) {
                    if (response.data[i].type === "Club") {
                        let club = response.data[i];
                        clubs.push(club);
                    }
                    else if (response.data[i].type === "School") {
                        this.setState({
                            school: response.data[i]
                        });
                    }
                };
                this.setState({
                   clubs: clubs
                },() => {
                    for (let i=0;i<this.state.clubs.length;i++) {
                        fetch("/endpoints/coaches.json?club_id=" + this.state.clubs[i].club_id)
                        .then(response => {
                            const contentType = response.headers.get("content-type");
                            if (contentType && contentType.indexOf("application/json") !== -1) 
                                return response.json() 
                            else
                                return {data:[]};
                        })
                        .then(response => {
                            if (response.hasOwnProperty("data")) {     // Check if data was returned
                                let newArray = this.state.coaches;
                                newArray.push(response.data)
                                this.setState({
                                    coaches: newArray
                                });
                            }
                        });
                    }
                });
            }
        });
    }
    handleClubDelete(club_id) {
        const doDelete = window.confirm("Are you sure you want to remove this club?")
        if (doDelete) {
            const postBody = {"entity":"club_recruits", "idname":"recruit_id", "id": this.state.recruit.recruit_id, "idname2":"club_id","id2":club_id};
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
                    this.getTeamData();
                }
            }.bind(this))
            .catch(function(error) {
                console.log(error);
                alert("There was an error. Please try again in a moment.");
            });
      }
    }
    handleCallDelete(id) {
        const doDelete = window.confirm("Are you sure you want to remove this call?")
        if (doDelete) {
            const postBody = {"entity":"call_log", "idname":"call_id", "id": id}
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
                    this.getCallLogData();
                }
            }.bind(this))
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
    render() {
        const clubsSection = this.state.clubs.map((club, index) => {
            const coaches = this.state.coaches;
            let coachesList = [];
            if (coaches[index]) {
                coachesList = coaches[index].map(coach => <li key={"club-coach-"+club.club_id+"-"+coach.coach_id}><a key={"club-coach-link-"+club.club_id+"-"+coach.coach_id} href={"/coaches/" + coach.coach_id}>{coach.fname + " " + coach.lname}</a></li>);
            }
            return (<div key={"club-"+club.club_id}>
                <div className="club-info">
                    <p className="inline" key={"club"+club.club_id}><a className="team-name" href={"/teams/"+club.team_id}>{club.team_name}</a> <br/> {club.school_club_name} <br /> {club.street_address_1} <br/> {club.city + ", " + club.state + " " + club.zip}</p>
                    <button type="button" title="Remove Club" className="no-style inline button button-red button-sm" onClick={()=> this.handleClubDelete(club.club_id)}>×<span className="off-screen"> Remove Club</span></button>
                </div>
                {coachesList.length > 0 && <ul className="club-coach-info" key={"club-ul-"+club.club_id}>
                    {coachesList}
                </ul>}
            </div>) 
        });   
        let schoolCoachesRendered = this.state.schoolCoaches.map((coach) => {
            return <li key={"schoolcoach"+coach.coach_id}><a href={"/coaches/" + coach.coach_id}>{coach.fname + " " + coach.lname}</a></li>
        });
        return (
            <div>
                <Header/>
                <section className="container">
                    {!("recruit_id" in this.state.recruit) && this.state.error && <h1>Error: Recruit could not be found.</h1>}
                    {"recruit_id" in this.state.recruit && <div className="heading-with-button"><h1>{this.state.recruit.fname + " " + this.state.recruit.lname}</h1> <a className="button button-primary" href={"/recruits/" + this.state.recruit.recruit_id + "/edit"}>Edit <i style={{marginLeft: 5}} className="fa fa-edit" /></a></div>}
                    <div className="recruit-info">
                        {"recruit_id" in this.state.recruit && <Tabs>
                            <TabList>
                                <Tab>Personal Information</Tab>
                                <Tab>School and Clubs</Tab>
                                <Tab>Evaluations</Tab>
                                <Tab>Call Log</Tab>
                            </TabList>

                            <TabPanel>
                                <h2>Basic Information</h2>
                                {this.state.recruit.phone && <p><strong>Phone:</strong> <a href={"tel:" + this.state.recruit.phone} target="_blank" rel="noopener noreferrer">{this.state.recruit.phone}</a></p>}
                                {this.state.recruit.email && <p><strong>Email:</strong> <a href={"mailto:" + this.state.recruit.email} target="_blank" rel="noopener noreferrer">{this.state.recruit.email}</a></p>}
                                {this.state.recruit.age && <p><strong>Birthday:</strong> {this.state.formattedDate} (age: {Math.floor(this.state.recruit.age)})</p>}
                                {(this.state.recruit.street_address_1 || this.state.recruit.city || this.state.recruit.state || this.state.recruit.zip) && <p><strong>Address: </strong><br />
                                {this.state.recruit.street_address_1} <br />
                                {this.state.recruit.street_address_2 && <span>{this.state.recruit.street_address_2} <br /></span>}
                                {this.state.recruit.city ? this.state.recruit.city + "," : ""} {this.state.recruit.state} {this.state.recruit.zip}</p>}
                                <table border="0" cellPadding="0" cellSpacing="0" className="recruit-info-list">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Started</th>
                                            <th>Completed</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th className="left">FAFSA</th>
                                            <td>{this.state.recruit.fafsa_started === 1 ? "X" : ""}</td>
                                            <td>{this.state.recruit.fafsa_completed === 1 ? "X" : ""}</td>
                                        </tr>
                                        <tr>
                                            <th className="left">OR Promise</th>
                                            <td>{this.state.recruit.or_promise_started === 1 ? "X" : ""}</td>
                                            <td>{this.state.recruit.or_promise_completed === 1 ? "X" : ""}</td>
                                        </tr>
                                        <tr>
                                            <th className="left">OSAC Scholarship</th>
                                            <td>{this.state.recruit.osac_gen_schol_started === 1 ? "X" : ""}</td>
                                            <td>{this.state.recruit.osac_gen_schol_completed === 1 ? "X" : ""}</td>
                                        </tr>
                                        <tr>
                                            <th className="left">EFC {this.state.recruit.efc_num ? "(#: " + this.state.recruit.efc_num + ")" : ""}</th>
                                            <td>{this.state.recruit.efc_received === 1 ? "X" : ""}</td>
                                            <td>{this.state.recruit.efc_received === 1 ? "X" : ""}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="recruit-social-icons">
                                    {this.state.recruit.twitter && <a href={"https://twitter.com/" + this.state.recruit.twitter} target="_blank" rel="noopener noreferrer"><img alt="View on Twitter" src="/assets/icons/icon-twitter.png" /></a>}
                                    {this.state.recruit.instagram && <a href={"https://www.instagram.com/" + this.state.recruit.instagram} target="_blank" rel="noopener noreferrer"><img alt="View on Instagram" src="/assets/icons/icon-instagram.png" /></a>}{this.state.recruit.facebook && <a href={"https://www.facebook.com/" + this.state.recruit.facebook} target="_blank" rel="noopener noreferrer"><img alt="View on Facebook" src="/assets/icons/icon-facebook.png" /></a>}{this.state.recruit.snapchat && <a href={"https://snapchat.com/add/" + this.state.recruit.snapchat} target="_blank" rel="noopener noreferrer"><img alt="View on Snapchat" src="/assets/icons/icon-snapchat.png" /></a>}
                                </div>
                                <ParentsSection recruit_id={this.state.recruit.recruit_id}/>
                            </TabPanel>
                            <TabPanel>
                                <h2>Current School</h2>
                                <p><a className="team-name" href={"/teams/" + this.state.school.team_id}>{this.state.recruit.school_name}</a> <br />
                                {this.state.recruit.school_address_1} <br />
                                {this.state.recruit.school_address_2 ? this.state.recruit.school_address_2 + "<br /> ": ""}{this.state.recruit.school_city}, {this.state.recruit.school_state} {this.state.recruit.school_zip}</p>
                                <h3>Coaches</h3>
                                {this.state.schoolCoaches.length > 0 ? <ul>{schoolCoachesRendered}</ul> : "No School Coaches Found."}
                                <div className="heading-with-button">
                                    <h2>Current Club(s)</h2>
                                    {!this.state.addClub && <button className="no-style button button-primary" onClick={this.toggleAddClub}>Quick Add <i style={{marginLeft: 5}} className="fa fa-plus" /></button>}
                                    {this.state.addClub && <button className="no-style button button-secondary" onClick={this.toggleAddClub}>Cancel</button>}
                                </div>
                                {this.state.addClub && <AddClubForm recruit_id={this.state.recruit.recruit_id} url={"/recruits/"+ this.state.recruit.recruit_id} other={true} add_recruit={true} showDropdown={true} />}
                                {clubsSection}
                            </TabPanel>
                            <TabPanel>
                                <RecruitEvaluations id={this.state.recruit.recruit_id}/>
                            </TabPanel>
                            <TabPanel>
                                <div className="heading-with-button"><h2>Call Log</h2><a className="button button-primary" href={"/recruits/" + this.state.recruit.recruit_id + "/add-call"}>Add New <i style={{marginLeft: 5}} className="fa fa-plus" /></a></div>
                                <ul>
                                    {this.state.calls}
                                </ul>
                                <p>Note: all dates/times are in PST.</p>
                            </TabPanel>
                        </Tabs>}
                    </div>
                </section>
            </div>
        );
    }
}

export default RecruitInfo;