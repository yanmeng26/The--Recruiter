import React, { Component } from 'react';
import '../css/listings.css';
import Header from "./Header";

class RecruitsListing extends Component {
    constructor (props) {
      super(props);
      this.state = { 
        items: [],
        sortAsc: true,
        sortOn: null,
        fname: "",
        lname: "",
        ageto: "",
        agefrom: "",
        position: "",
        positions: []
      };
      this.handleFilter = this.handleFilter.bind(this);
      this.getAllRecruits = this.getAllRecruits.bind(this);
      this.resetFilter = this.resetFilter.bind(this);
      this.sortItems = this.sortItems.bind(this);
    };

    // Retrieve all recruits data on component load
    componentDidMount() {
      this.getAllRecruits();
    }

    // Retrieve all recruits data
    getAllRecruits() {
      fetch("/endpoints/recruits.json?fname=")
      .then(response => {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) 
          return response.json() 
        else
          return {data:[]};
      })
      .then(response => {
        // Get and sort list of all positions
        let allPositions = response.data.map((item) => item.position);
        allPositions.sort();
        
        // Set positions state to unique array of options and items to sql results
        let id = 0;
        let uniquePos = [];
        this.setState({
          items: response.data,
          positions: allPositions.map((item) => {
            if (item != "" && item != null && uniquePos.indexOf(item) < 0) {
              uniquePos.push(item);
              return (<option key={"pos" + id++} value={item}>{item}</option>);
            }
          })
        });
      });
    }

    // Retrieve new recruits data based on filtered data
    handleFilter(e) {
      e.preventDefault();
      let url = "/endpoints/recruits.json?fname=" + this.state.fname + "&lname=" + this.state.lname + "&agefrom=" + this.state.agefrom + "&ageto=" + this.state.ageto + "&position=" + this.state.position;
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
      this.getAllRecruits();
    }

    // Sort items array and toggle ascending vs descending sort
    sortItems(value) {
      let isAsc = true;
      if (value === this.state.sortOn) 
        isAsc = !this.state.sortAsc;
      function compare(a,b) {
        if (isAsc) {
          if (a[value]< b[value])
            return -1;
          if (a[value] > b[value])
            return 1;
          return 0;
        }
        else {
          if (a[value] > b[value])
            return -1;
          if (a[value] < b[value])
            return 1;
          return 0;
        }
      }
      this.setState({
        items: this.state.items.sort(compare),
        sortOn: value,
        sortAsc: isAsc
      })
    }

    render() {
      // Get rendering of all recruit table rows
      let itemsRendered = this.state.items.map((item) => {
        let bday = new Date(item.dob);
        let formattedbday = "";
        if (!isNaN(bday.getMonth()))
          formattedbday = (bday.getMonth() + 1) + "/" + bday.getDate() + "/" + bday.getFullYear();
        let height = "";
        if (item.height !== null && item.height != 0) {
          let feet = Math.floor(item.height);
          height = feet + "'" + Math.round((item.height - feet) * 12) + "\"";
        }
        return <tr key={item.recruit_id}>
          <td>{item.fname}</td>
          <td>{item.lname}</td>
          <td>{item.funnelstatus}</td>
          <td>{formattedbday}</td>
          <td>{height}</td>
          <td>{item.position}</td>
          <td>{item.school_name}</td>
          {/*<td>{item.city}</td>
          <td>{item.state}</td>*/}
          <td>{item.phone}</td>
          <td><a href={"mailto:"+item.email} target="_blank" rel="noopener noreferrer">{item.email}</a></td>
          <td><a className="button button-primary" href={"/recruits/" + item.recruit_id}>View</a></td>
          <td><a className="button button-secondary" href={"/recruits/" + item.recruit_id + "/edit"}>Edit</a></td>
        </tr>;
      });
      return (
        <div>
          <Header />
          <div className="container">
            <section>
            <div className="heading-with-button">
              <h1>Recruits</h1>
              <a className="button button-primary" href={"/add-recruit"}>Add New <i style={{marginLeft: 5}} className="fa fa-plus" /></a>
              </div>
              <form>
                <div className="form-inputs">
                  <div className="form-input">
                    <label htmlFor="recruit-form-fname">First Name</label>
                    <input id="recruit-form-fname" name="recruit-form-fname" onChange={ (event) => this.setState({fname: event.target.value}) } />
                  </div>
                  <div className="form-input">
                    <label htmlFor="recruit-form-lname">Last Name</label>
                    <input id="recruit-form-lname" name="recruit-form-lname" onChange={(event) => this.setState({lname: event.target.value}) } />
                  </div>
                  <div className="form-input range">
                    <label className="inline" htmlFor="recruit-form-agefrom">Age<br/><span className="no-weight">From</span></label>
                    <input className="inline" type="number" id="recruit-form-agefrom" name="recruit-form-agefrom" onChange={(event) => this.setState({agefrom: event.target.value}) } />
                    <label className="inline no-weight" htmlFor="recruit-form-ageto">To</label>
                    <input type="number" className="inline" id="recruit-form-ageto" name="recruit-form-ageto" onChange={(event) => this.setState({ageto: event.target.value}) } />
                  </div>
                  <div className="form-input">
                    <label htmlFor="recruit-form-position">Position</label>
                    <select type="number" id="recruit-form-position" name="recruit-form-position" onChange={(event) => this.setState({position: event.target.value}) } >
                      <option value="">Filter by Position</option>
                      {this.state.positions}
                    </select>
                  </div>
                </div>
                <div className="form-buttons">
                  <button type="submit" id="recruit-form-submit" className="no-style button button-primary" onClick={this.handleFilter}>Search</button>
                  <button type="reset" id="recruit-form-reset" className="no-style button button-secondary" onClick={this.resetFilter}>Reset</button>
                  
                </div>
              </form>
            </section>
            <div className="recruits-listing listing">
              <table cellPadding="0" cellSpacing="0">
                <tbody>
                  <tr>
                    <th><button className={this.state.sortAsc && this.state.sortOn === "fname" ? "no-style desc" : "no-style"} type="button" onClick={() => this.sortItems("fname")}><span className="off-screen">Sort by </span>First Name</button></th>
                    <th><button className={this.state.sortAsc && this.state.sortOn === "lname" ? "no-style desc" : "no-style"} type="button" onClick={() => this.sortItems("lname")}><span className="off-screen">Sort by </span>Last Name</button></th>
                    <th><button className={this.state.sortAsc && this.state.sortOn === "funnelstatus" ? "no-style desc" : "no-style"} type="button" onClick={() => this.sortItems("funnelstatus")}><span className="off-screen">Sort by </span>Status</button></th>
                    <th><button className={this.state.sortAsc && this.state.sortOn === "dob" ? "no-style desc" : "no-style"} type="button" onClick={() => this.sortItems("dob")}><span className="off-screen">Sort by </span>DOB</button></th>
                    <th><button className={this.state.sortAsc && this.state.sortOn === "height" ? "no-style desc" : "no-style"} type="button" onClick={() => this.sortItems("height")}><span className="off-screen">Sort by </span>Height</button></th>
                    <th><button className={this.state.sortAsc && this.state.sortOn === "position" ? "no-style desc" : "no-style"} type="button" onClick={() => this.sortItems("position")}><span className="off-screen">Sort by </span>Position</button></th>
                    <th><button className={this.state.sortAsc && this.state.sortOn === "school_name" ? "no-style desc" : "no-style"} type="button" onClick={() => this.sortItems("school_name")}><span className="off-screen">Sort by </span>School</button></th>
                    {/*<th><button className={this.state.sortAsc && this.state.sortOn === "city" ? "no-style desc" : "no-style"} type="button" onClick={() => this.sortItems("city")}><span className="off-screen">Sort by </span>City</button></th>
                    <th><button className={this.state.sortAsc && this.state.sortOn === "state" ? "no-style desc" : "no-style"} type="button" onClick={() => this.sortItems("state")}><span className="off-screen">Sort by </span>State</button></th>*/}
                    <th><button className={this.state.sortAsc && this.state.sortOn === "phone" ? "no-style desc" : "no-style"} type="button" onClick={() => this.sortItems("phone")}><span className="off-screen">Sort by </span>Phone</button></th>
                    <th><button className={this.state.sortAsc && this.state.sortOn === "email" ? "no-style desc" : "no-style"} type="button" onClick={() => this.sortItems("email")}><span className="off-screen">Sort by </span>Email</button></th>
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

export default RecruitsListing;