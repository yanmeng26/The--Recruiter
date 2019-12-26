import React, { Component } from "react";
import "../css/AthleteAdd.css";
import Header from "./Header";

import DropdownClub from "./DropdownClub.js";

class CoachAdd extends Component {
  constructor() {
    super();

    this.state = {
      fname: "",
      mname: "",
      lname: "",
      suffix:""
    };
  }

  changeHandler = e => this.setState({ [e.target.name]: e.target.value });
  
  handleChangeClub = e => this.setState({ club_id: e.target.value });

  submitHandler = e => {
    const props = this.state
    if (props.fname != "" && props.lname != "") {
      e.preventDefault();
      fetch("/endpoints/newcoach", {
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
          if (response.errno) {
            console.log(response);
            alert("There was an error. Please try again in a moment.");
          }
          else {
            alert("New coach has been added!");
            window.open("/coaches/" + response.insertId,"_self")
          }
      })
      .catch(function(error) {
          console.log(error);
          alert("There was an error. Please try again in a moment.");
      });
    }
  };  

  render() {
    const {
      fname,
      mname,
      lname,
      suffix
    } = this.state;
    return (
      <div>
        <Header/>
        <div className="container">
          <h1> Add New Coach</h1>
            <form>
                <div className="form-group">
                    <label htmlFor="fname">First Name: <span className="required">*</span></label>
                    <input onChange={this.changeHandler} id="fname" name="fname" type="text" required value={fname}/>
                </div>
                <div className="form-group">
                    <label htmlFor="mname">Middle Name: </label>
                    <input onChange={this.changeHandler} id="mname" name="mname" type="text" value={mname}/>
                </div>
                <div className="form-group">
                    <label htmlFor="lname">Last Name: <span className="required">*</span></label>
                    <input onChange={this.changeHandler} id="lname" name="lname" type="text" required value={lname}/>
                </div>
                <div className="form-group">
                    <label htmlFor="suffix">Suffix: </label>
                    <input onChange={this.changeHandler} id="suffix" name="suffix" type="text" value={suffix}/>
                </div>
                <div className="form-group">
                  <button onClick={(e) => this.submitHandler(e)} className="no-style button button-primary" type="submit">Add Coach</button>
                </div>
            </form>
        </div>
      </div>
    );
  }
}

export default CoachAdd;
