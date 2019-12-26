import React, { Component } from 'react';
import '../css/listings.css';
import Header from "./Header";

class CoachesListing extends Component {
    constructor (props) {
      super(props);
      this.state = { 
        items: [],
        sortAsc: true,
        sortOn: null,
        fname: "",
        lname: "",
        schools: "",
        clubs: ""
      };
      this.handleFilter = this.handleFilter.bind(this);
      this.getAllCoaches = this.getAllCoaches.bind(this);
      this.resetFilter = this.resetFilter.bind(this);
      this.sortItems = this.sortItems.bind(this);
    };

    // Retrieve all coaches data on component load
    componentDidMount() {
      this.getAllCoaches();
    }

    // Retrieve all coaches data
    getAllCoaches() {
      fetch("/endpoints/coaches.json")
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

    // Retrieve new coaches data based on filtered data
    handleFilter(e) {
      e.preventDefault();
      let url = "/endpoints/coaches.json?fname=" + this.state.fname + "&lname=" + this.state.lname + "&schools=" + this.state.schools + "&clubs=" + this.state.clubs;
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
        fname: "",
        lname: "",
        ageto: "",
        agefrom: ""
      });
      this.getAllCoaches();
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
      // Get rendering of all coaches table rows
      let itemsRendered = this.state.items.map((item) => {
        return <tr key={item.coach_id}>
          <td>{item.fname}</td>
          <td>{item.lname}</td>
          <td>{item.schools}</td>
          <td>{item.clubs}</td>
          <td><a className="button button-primary" href={"/coaches/" + item.coach_id}>View</a></td>
          <td><a className="button button-secondary" href={"/coaches/" + item.coach_id + "/edit"}>Edit</a></td>
        </tr>;
      });
      return (
        <div>
          <Header/>
          <div className="container">
            <section>
            <div className="heading-with-button">
              <h1>Coaches</h1>
              <a className="button button-primary" href={"/add-coach"}>Add New <i style={{marginLeft: 5}} className="fa fa-plus" /></a>
              </div>
              <form>
                <div className="form-inputs">
                  <div className="form-input">
                    <label htmlFor="coach-form-fname">First Name</label>
                    <input id="coach-form-fname" name="coach-form-fname" onChange={ (event) => this.setState({fname: event.target.value}) } />
                  </div>
                  <div className="form-input">
                    <label htmlFor="coach-form-lname">Last Name</label>
                    <input id="coach-form-lname" name="coach-form-lname" onChange={(event) => this.setState({lname: event.target.value}) } />
                  </div>
                  <div className="form-input range">
                  </div>
                  <div className="form-input">
                    <label htmlFor="coach-form-schools">Schools</label>
                    <input id="coach-form-schools" name="coach-form-schools" onChange={(event) => this.setState({schools: event.target.value}) } />
                  </div>
                  <div className="form-input">
                    <label htmlFor="coach-form-clubs">Clubs</label>
                    <input id="coach-form-clubs" name="coach-form-clubs" onChange={(event) => this.setState({clubs: event.target.value}) } />
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
                    <th><button className={this.state.sortAsc && this.state.sortOn === "fname" ? "no-style desc" : "no-style"} type="button" onClick={() => this.sortItems("fname")}><span className="off-screen">Sort by </span>First Name</button></th>
                    <th><button className={this.state.sortAsc && this.state.sortOn === "lname" ? "no-style desc" : "no-style"} type="button" onClick={() => this.sortItems("lname")}><span className="off-screen">Sort by </span>Last Name</button></th>
                    <th><button className={this.state.sortAsc && this.state.sortOn === "schools" ? "no-style desc" : "no-style"} type="button" onClick={() => this.sortItems("schools")}><span className="off-screen">Sort by </span>Schools</button></th>
                    <th><button className={this.state.sortAsc && this.state.sortOn === "clubs" ? "no-style desc" : "no-style"} type="button" onClick={() => this.sortItems("clubs")}><span className="off-screen">Sort by </span>Clubs</button></th>
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

export default CoachesListing;