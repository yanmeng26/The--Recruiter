import React, { Component } from "react";
import "../css/AthleteAdd.css";
import DropdownCoach from "./DropdownCoach.js";
import Header from "./Header";

class SchoolAdd extends Component {
  constructor() {
    super();

    this.state = {
      school_name: "",
      coach_id:"",
      street_address_1: "",
      street_address_2: "",
      city: "",
      state: "",
      zip: ""
    };
  }

  changeHandler = e => this.setState({ [e.target.name]: e.target.value });
  handleChangeCoach = e => this.setState({ coach_id: e.target.value });

  handleStateChange = e => this.setState({ state: e.target.value });


  submitHandler = e => {
   
    alert("Submit!");
    e.preventDefault();
    console.log(this.state);
    const data = {
      school_name: this.state.school_name,
      coach_id:this.state.coach_id,
      street_address_1: this.state.street_address_1,
      street_address_2: this.state.street_address_2,
      city: this.state.city,
      state: this.state.state,
      zip: this.state.zip
    };

    fetch("./endpoints/newschool", {
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
      street_address_1,
      street_address_2,
      city,
      zip,
      school_name
    } = this.state;
    return (
      <div>
        <Header/>
        <section className="container">
          <div className="formcontainer">
            <form className="Add-form" onSubmit={this.submitHandler}>
              <h2> New Team of School</h2>
              <ul className="form-style-1">
                <li>
                  <label>
                    School Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="school_name"
                    value={school_name}
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
                  <label>School Address</label>
                  <input
                    type="text"
                    name="street_address_1"
                    value={street_address_1}
                    onChange={this.changeHandler}
                    className="field-divided"
                    placeholder="street_address_1"
                  />
                </li>
                <br />
                <li>
                  <input
                    type="text"
                    name="street_address_2"
                    value={street_address_2}
                    onChange={this.changeHandler}
                    className="field-divided"
                    placeholder="street_address_2"
                  />
                </li>
                <br />
                <li>
                  <input
                    type="text"
                    name="city"
                    value={city}
                    onChange={this.changeHandler}
                    className="field-divided"
                    placeholder="City"
                  />
                </li>
                <br />
                <li>
                  <select
                    name="state"
                    className="state"
                    value={this.state.state}
                    onChange={this.handleStateChange}
                  >
                    <option value="selected">Select a State</option>
                    <option value="AL">Alabama</option>
                    <option value="AK">Alaska</option>
                    <option value="AZ">Arizona</option>
                    <option value="AR">Arkansas</option>
                    <option value="CA">California</option>
                    <option value="CO">Colorado</option>
                    <option value="CT">Connecticut</option>
                    <option value="DE">Delaware</option>
                    <option value="DC">District Of Columbia</option>
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
                  <input
                    type="text"
                    name="zip"
                    value={zip}
                    onChange={this.changeHandler}
                    className="field-divided-zip"
                    placeholder="zip"
                  />
                </li>
                <br />
                <br />
                <li>
                  <input type="submit" value="Submit" />
                </li>
              </ul>
            </form>
          </div>
        </section>
      </div>
    );
  }
}

export default SchoolAdd;