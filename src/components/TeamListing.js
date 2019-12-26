import React, { Component } from "react";
import Header from "./Header";

class TeamListing extends Component {
  constructor (props) {
    super(props);
    this.state = { 
      items: [],
      sortAsc: true,
      sortOn: null,
      type: "",
      teamname: "",
      org: ""
    };
    this.handleFilter = this.handleFilter.bind(this);
    this.getAllTeams = this.getAllTeams.bind(this);
    this.resetFilter = this.resetFilter.bind(this);
    this.sortItems = this.sortItems.bind(this);
  };

  // Retrieve all team data on component load
  componentDidMount() {
    this.getAllTeams();
  }

  // Retrieve all team data
  getAllTeams() {
    fetch("/endpoints/teams.json")
    .then(response => {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) 
        return response.json() 
      else
        return {data:[]};
    })
    .then(response => {
      this.setState({
        items: response.data
      });
    });
  }

  // Retrieve new teams data based on filtered data
  handleFilter(e) {
    e.preventDefault();
    let url = "/endpoints/teams.json?teamname=" + this.state.teamname + "&type=" + this.state.type + "&org=" + this.state.org;
    fetch(url)
      .then(response => {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          return response.json()
          .then(response => this.setState({items: response.data}));
        }
      })
  }

  // Clear form filters
  resetFilter() {
    this.setState({
      type: "",
      teamname: "",
      ageto: "",
      agefrom: ""
    });
    this.getAllTeams();
  }

  // Sort items array and toggle ascending vs descending sort
  sortItems(value) {
    let isAsc = true;
    if (value === this.state.sortOn) 
      isAsc = !this.state.sortAsc;
    function compare(a,b) {
      const x = (a[value] ? a[value].toLowerCase() : null);
      const y = (b[value] ? b[value].toLowerCase() : null);
      if (isAsc) {
        if (x === null) {
          return 1;
        }
        else if (y === null) {
            return -1;
        }
        else if (x === y) {
            return 0;
        }
        else {
            return x < y ? -1 : 1;
        }
      }
      else {
        if (x === null) {
          return -1;
        }
        else if (y === null) {
            return 1;
        }
        else if (x === y) {
            return 0;
        }
        else {
            return x > y ? -1 : 1;
        }
      }
    }
    this.setState({
      items: this.state.items.sort(compare),
      sortOn: value,
      sortAsc: isAsc
    })
  }

  render() {
    // Get rendering of all teams table rows
    let itemsRendered = this.state.items.map((item) => {
      return <tr key={item.team_id}>
        <td>{item.type}</td>
        <td>{item.team_name}</td>
        <td>{item.school_club_name}</td>
        <td>{item.city}</td>
        <td>{item.state}</td>
        <td>{item.zip}</td>
        <td><a className="button button-primary" href={"/teams/" + item.team_id}>View</a></td>
        <td><a className="button button-secondary" href={"/teams/" + item.team_id + "/edit"}>Edit</a></td>
      </tr>;
    });
    return (
      <div>
        <Header/>
        <div className="container">
          <section>
            <div className="heading-with-button">
              <h1>Teams</h1>
              <a className="button button-primary" href={"/add-team"}>Add New Team<i style={{marginLeft: 5}} className="fa fa-plus" /></a>
              </div>
              <form>
                <div className="form-inputs">
                  <div className="form-input">
                    <label htmlFor="coach-form-type">Type</label>
                    <select id="coach-form-type" name="coach-form-type" onChange={ (event) => {this.setState({type: event.target.value}) } } >
                      <option value="">Select a Team Type</option>
                      <option value="Club">Club</option>
                      <option value="School">School</option>
                    </select>
                  </div>
                  <div className="form-input">
                    <label htmlFor="coach-form-teamname">Team Name</label>
                    <input id="coach-form-teamname" name="coach-form-teamname" onChange={(event) => this.setState({teamname: event.target.value}) } />
                  </div>
                  <div className="form-input range">
                  </div>
                  <div className="form-input">
                    <label htmlFor="coach-form-org">Organization</label>
                    <input id="coach-form-org" name="coach-form-org" onChange={(event) => this.setState({org: event.target.value}) } />
                  </div>
                </div>
                <div className="form-buttons">
                  <button type="submit" id="coach-form-submit" className="no-style button button-primary" onClick={this.handleFilter}>Search</button>
                  <button type="reset" id="coach-form-reset" className="no-style button button-secondary" onClick={this.resetFilter}>Reset</button>
                
                </div>
              </form>
            </section>
            <div className="coachs-listing listing">
              <table cellPadding="0" cellSpacing="0">
                <tbody>
                  <tr>
                    <th><button className={this.state.sortAsc && this.state.sortOn === "type" ? "no-style desc" : "no-style"} type="button" onClick={() => this.sortItems("type")}><span className="off-screen">Sort by </span>Type</button></th>
                    <th><button className={this.state.sortAsc && this.state.sortOn === "team_name" ? "no-style desc" : "no-style"} type="button" onClick={() => this.sortItems("team_name")}><span className="off-screen">Sort by </span>Team Name</button></th>
                    <th><button className={this.state.sortAsc && this.state.sortOn === "school_club_name" ? "no-style desc" : "no-style"} type="button" onClick={() => this.sortItems("school_club_name")}><span className="off-screen">Sort by </span>Organization</button></th>
                    <th><button className={this.state.sortAsc && this.state.sortOn === "city" ? "no-style desc" : "no-style"} type="button" onClick={() => this.sortItems("city")}><span className="off-screen">Sort by </span>City</button></th>
                    <th><button className={this.state.sortAsc && this.state.sortOn === "state" ? "no-style desc" : "no-style"} type="button" onClick={() => this.sortItems("state")}><span className="off-screen">Sort by </span>State</button></th>
                    <th><button className={this.state.sortAsc && this.state.sortOn === "zip" ? "no-style desc" : "no-style"} type="button" onClick={() => this.sortItems("zip")}><span className="off-screen">Sort by </span>Zipcode</button></th>
                    <th className="list-buttons"><span className="off-screen">View Info</span></th>
                    <th className="list-buttons"><span className="off-screen">Edit Info</span></th>
                  </tr>
                  {itemsRendered}
                  {this.state.items.length < 1 && <tr><td colSpan="10">No results found.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
    );
  }
}

export default TeamListing;
