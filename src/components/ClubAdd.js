import React, { Component } from "react";
import "../css/AthleteAdd.css";
import Header from "./Header";

import DropdownCoach from "./DropdownCoach.js";

class ClubAdd extends Component {
  constructor() {
    super();

    this.state = {
      name: "",
      coach_id:""
    };
  }

  changeHandler = e => this.setState({ [e.target.name]: e.target.value });
  
  handleChangeCoach = e => this.setState({ coach_id: e.target.value });

  submitHandler = e => {
    alert("Submit!");
    e.preventDefault();
    console.log(this.state);
    const data = {
      name: this.state.name,
      coach_id:this.state.coach_id
    };

    fetch("./endpoints/newclub", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
  };

  render() {
    const {
        name,
      coach_id
    } = this.state;
    return (
      <div>
        <Header/>
        <div className="container">
          <div className="formcontainer">
            <form className="Add-form" onSubmit={this.submitHandler}>
              <h2> New Team of Club</h2>
              <ul className="form-style-1">
                <li>
                  <label>
                    Club Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={this.changeHandler}
                    className="field-divided"
                  />
                </li>
                <br />
                
            
                <li>
                  <lable>
                    Coach Name
                  </lable>
                  <DropdownCoach
                    coach_id={this.state.coach_id}
                    onChangeValue={this.handleChangeCoach}
                  />
                </li>
                <br />
                <li>
                  <input type="submit" value="Submit" />
                </li>
              </ul>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default ClubAdd;
