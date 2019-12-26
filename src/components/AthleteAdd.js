import React, { Component } from "react";
import "../css/AthleteAdd.css";
import DropdownSchool from "./DropdownSchool.js";
import DropdownClub from "./DropdownClub.js";
import InputMask from 'react-input-mask';
import Header from "./Header";

class AthleteAdd extends Component {
  constructor() {
    super();    
    this.state = {"recruit_id": "", "fname": "", "mname": "", "lname": "", "suffix": "", "dob": "", "height": "", "gender": "", "funnelstatus": "", "hsgradyear": "", "school_id": "", "position": "", "dominant_hand": "", "street_address_1": "", "street_address_2": "", "city": "", "state": "", "zip": "", "phone": "", "email": "", "twitter": "", "instagram": "", "snapchat": "", "facebook": "", "gpa": "", "fafsa_started": "", "fafsa_completed": "", "or_promise_started": "", "or_promise_completed": "", "osac_gen_schol_started": "", "osac_gen_schol_completed": "", "efc_received": "", "efc_num": "", "chafee_eligible": "", "picture": "", "age": "", "school_name": "", "school_address_1": "", "school_address_2": "", "school_city": "", "school_zip": "", "feet": "","inches": "", "club_id":""
    };
    this.updateHeight = this.updateHeight.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.handleChangeSchool = this.handleChangeSchool.bind(this);
  }  
  changeHandler = e => this.setState({ [e.target.name]: e.target.value });
  handleGenderChange = e => this.setState({ gender: e.target.value });
  handleHandChange = e => this.setState({ dominant_hand: e.target.value });
  handlePositionChange = e => this.setState({ position: e.target.value });
  handleStateChange = e => this.setState({ state: e.target.value });
  handleChangeSchool = e => this.setState({ school_id: e.target.value });
  submitHandler = e => {
    const props = this.state;
    if (props.school_id != "" && props.fname != "" && props.lname != "" && props.email != "" && props.height != "" && props.gender != "" && props.funnelstatus != "") {
      e.preventDefault();
      if (!props.dob.includes("_") && props.dob != "") {
        let date = props.dob.split("/");
        props.dob = date[2] + "-" + date[0] + "-" + date[1]
      }
      fetch("/endpoints/newrecruit", {
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
            alert("Recruit has been added!");
            window.open("/recruits/" + response.insertId,"_self")
          }
      })
      .catch(function(error) {
          console.log(error);
          alert("There was an error. Please try again in a moment.");
      });
    }
  };  
  updateHeight(feet, inches) {
    if (feet === null)
      feet = this.state.feet;
    if (inches === null)
      inches = this.state.inches;
    const calculated = Number(feet) + Number(inches / 12);
    this.setState({
        feet: feet,
        inches: inches,
        height: Math.round(calculated * 100) / 100
    });
  }
  render() {
    return (
      <div>
        <Header/>
        <div className="container">
          <h1>Add New Recruit</h1>
          <div>
            <form>
                <div className="form-group">
                  <label htmlFor="fname">
                    First Name <span className="required">*</span>:
                  </label>
                  <input required id="fname"
                    type="text"
                    name="fname"
                    value={this.state.fname}
                    onChange={this.changeHandler}                
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="mname">
                    Middle Name:
                  </label>
                  <input id="mname"
                    type="text"
                    name="mname"
                    value={this.state.mname}
                    onChange={this.changeHandler}                
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lname">
                    Last Name <span className="required">*</span>:
                  </label>
                  <input required id="lname"
                    type="text"
                    name="lname"
                    value={this.state.lname}
                    onChange={this.changeHandler}                
                  />
                </div>   
                <div className="form-group">
                  <label htmlFor="phone">Phone: </label>
                  <InputMask onChange={this.changeHandler} id="phone" name="phone" type="text" mask="999-999-9999" value={this.state.phone} />
                </div>
                <div className="form-group">
                  <label htmlFor="email">
                    Email <span className="required">*</span>:
                  </label>
                  <input required id="email"
                    type="email"
                    name="email"
                    value={this.state.email}
                    onChange={this.changeHandler}                
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="funnelstatus">Funnel Status: <span className="required">*</span></label>
                  <select required onChange={this.changeHandler} id="funnelstatus" name="funnelstatus" value={this.state.funnelstatus || ""}>
                    <option value="">Select a Status</option>
                    <option value="Cold">Cold</option>
                    <option value="Lukewarm">Lukewarm</option>
                    <option value="Warm">Warm</option>
                    <option value="Hot">Hot</option>
                    <option value="Signed">Signed</option>
                  </select>
                </div>             
                <div className="form-group">
                  <label htmlFor="gender">Gender: <span className="required">*</span></label>
                  <select id="gender" required
                    name="gender"
                    className="school"
                    value={this.state.gender}
                    onChange={this.handleGenderChange}
                  >
                    <option value="selected">Select a Gender</option>
                    <option value="M">M</option>
                    <option value="F">F</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="dob">Date of Birth:</label>
                  <InputMask onChange={this.changeHandler} id="dob" name="dob" mask="99/99/9999" value={this.state.dob} />
                </div>
                <div className="form-group">
                  <label htmlFor="domhand">Dominant Hand:</label>
                  <select id="domhand"
                    name="gender"
                    className="school"
                    value={this.state.dominant_hand}
                    onChange={this.handleHandChange}
                  >
                    <option value="selected">Select Dominant Hand</option>
                    <option value="L">L</option>
                    <option value="R">R</option>
                  </select>
                </div>
                <div className="form-group">
                  <p>Height<span className="required">*</span></p>
                  <label htmlFor="height">Feet: </label>
                  <input onChange={(e) => this.updateHeight(e.target.value, null)} id="height-feet" name="height-feet" type="number" style={{marginRight: 10}} className="small-input" value={this.state.feet} min="0" max="8" required/>
                  <label htmlFor="height-inches">Inches: </label>
                  <input onChange={(e) => this.updateHeight(null, e.target.value)} id="height-inches" name="height-inches" type="number" className="small-input" value={this.state.inches} min="0" max="11"/>
                </div>
                <div className="form-group">
                  <label htmlFor="position">Position:</label>
                  <input id="position"
                    name="position"
                    type="text"
                    className="school"
                    value={this.state.position}
                    onChange={this.handlePositionChange}/>
                </div>
                <div className="form-group">
                  <label htmlFor="school_id">
                    School Name<span className="required">*</span>:
                  </label>
                  <DropdownSchool inputISd="school_id" value={this.state.school_id} required={true}
                    school_id={this.state.school_id}
                    onChangeValue={(e) => this.handleChangeSchool(e)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="hsgradyear">HS Graduation Year: </label>
                  <InputMask onChange={this.changeHandler} id="hsgradyear" name="hsgradyear" mask="9999" value={this.state.hsgradyear} />
                </div>
                <div className="form-group">
                  <label htmlFor="gpa">GPA: </label>
                  <input onChange={this.changeHandler} id="gpa" name="gpa" type="text" value={this.state.gpa || ""} />
                </div>
                <div className="form-group">
                  <label htmlFor="street_address_1">Street Address 1:</label>
                  <input id="street_address_1"
                    type="text"
                    name="street_address_1"
                    value={this.state.street_address_1}
                    onChange={this.changeHandler}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="street_address_2">Street Address 2:</label>
                  <input id="street_address_2"
                    type="text"
                    name="street_address_2"
                    value={this.state.street_address_2}
                    onChange={this.changeHandler}                
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="city">City:</label>
                  <input id="city"
                    type="text"
                    name="city"
                    value={this.state.city}
                    onChange={this.changeHandler}                
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="state">State:</label>
                  <select id="state"
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
                </div>
                <div className="form-group">
                  <label htmlFor="zip">Zip Code:</label>
                  <InputMask id="zip"
                    type="text"
                    name="zip"
                    value={this.state.zip}
                    onChange={this.changeHandler}
                    mask="99999"
                  />
                </div><div className="form-group"> 
              <label htmlFor="twitter">Twitter Username: </label>
                <input onChange={this.changeHandler} id="twitter" name="twitter" value={this.state.twitter || ""} />
              </div>
              <div className="form-group">
                <label htmlFor="facebook">Facebook Username: </label>
                <input onChange={this.changeHandler} id="facebook" name="facebook" value={this.state.facebook || ""} />
              </div>
              <div className="form-group">
                <label htmlFor="instagram">Instagram Username: </label>
                <input onChange={this.changeHandler} id="instagram" name="instagram" value={this.state.instagram || ""} />
              </div>
              <div className="form-group">
                <label htmlFor="snapchat">Snapchat Username: </label>
                <input onChange={this.changeHandler} id="snapchat" name="snapchat" value={this.state.snapchat || ""} />
              </div>
              <a name="recruiting-info"></a>
              <div className="form-group">
                <label htmlFor="fafsa_started">FAFSA Started? </label>
                <select onChange={this.changeHandler} id="fafsa_started" name="fafsa_started" value={this.state.fafsa_started === null ? "" : this.state.fafsa_started}>
                  <option value="">Unknown</option>
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="fafsa_completed">FAFSA Completed? </label>
                <select onChange={this.changeHandler} id="fafsa_completed" name="fafsa_completed" value={this.state.fafsa_completed === null ? "" : this.state.fafsa_completed}>
                  <option value="">Unknown</option>
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="or_promise_started">OR Promise Started? </label>
                <select onChange={this.changeHandler} id="or_promise_started" name="or_promise_started" value={this.state.or_promise_started === null ? "" : this.state.or_promise_started}>
                  <option value="">Unknown</option>
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="or_promise_completed">OR Promise Completed? </label>
                <select onChange={this.changeHandler} id="or_promise_completed" name="or_promise_completed" value={this.state.or_promise_completed === null ? "" : this.state.or_promise_completed}>
                  <option value="">Unknown</option>
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="osac_gen_schol_started">OSAC Scholarship Started? </label>
                <select onChange={this.changeHandler} id="osac_gen_schol_started" name="osac_gen_schol_started" value={this.state.osac_gen_schol_started === null ? "" : this.state.osac_gen_schol_started}>
                  <option value="">Unknown</option>
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="osac_gen_schol_completed">OSAC Scholarship Completed? </label>
                <select onChange={this.changeHandler} id="osac_gen_schol_completed" name="osac_gen_schol_completed" value={this.state.osac_gen_schol_completed === null ? "" : this.state.osac_gen_schol_completed}>
                  <option value="">Unknown</option>
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="efc_received">OSAC Scholarship Completed? </label>
                <select onChange={this.changeHandler} id="efc_received" name="efc_received" value={this.state.efc_received === null ? "" : this.state.efc_received}>
                  <option value="">Unknown</option>
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="efc_num">EFC Number: </label>
                <input onChange={this.changeHandler} id="efc_num" name="efc_num" value={this.state.efc_num || ""} />
              </div>
              <div className="form-group">
                <label htmlFor="chafee_eligible">Chafee Eligible? </label>
                <select onChange={this.changeHandler} id="chafee_eligible" name="chafee_eligible" value={this.state.chafee_eligible === null ? "" : this.state.chafee_eligible}>
                  <option value="">Unknown</option>
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </div>
                <div className="form-group">
                  <button onClick={(e) => this.submitHandler(e)} className="no-style button button-primary" type="submit">Add Recruit</button>
                </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default AthleteAdd;