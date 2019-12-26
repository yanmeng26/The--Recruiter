import React, { Component } from "react";
import InputMask from 'react-input-mask';
import '../css/editform.css';
import DropdownSchool from "./DropdownSchool.js";
//import DropdownClub from "./DropdownClub.js";
import Header from "./Header";

class RecruitEdit extends Component {
  constructor (props) {
    super(props);
        this.state = { 
        recruit: {"recruit_id": "", "fname": "", "mname": "", "lname": "", "suffix": "", "dob": "", "height": "", "gender": "", "funnelstatus": "", "hsgradyear": "", "school_id": "", "position": "", "dominant_hand": "", "street_address_1": "", "street_address_2": "", "city": "", "state": "", "zip": "", "phone": "", "email": "", "twitter": "", "instagram": "", "snapchat": "", "facebook": "", "gpa": "", "fafsa_started": "", "fafsa_completed": "", "or_promise_started": "", "or_promise_completed": "", "osac_gen_schol_started": "", "osac_gen_schol_completed": "", "efc_received": "", "efc_num": "", "chafee_eligible": "", "picture": "", "age": "", "school_name": "", "school_address_1": "", "school_address_2": "", "school_city": "", "school_zip": ""},
        schoolCoaches: [],
        clubCoaches: [],
        clubs: [],
        guardians: null,
        calls: null,
        formattedDate: "",
        feet: 0,
        inches: 0,
        error: false
    };
    this.updateDOB = this.updateDOB.bind(this);
    this.updateVal = this.updateVal.bind(this);
    this.updateHeight = this.updateHeight.bind(this);
    this.updateSchool = this.updateSchool.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
          let feet = 0;
          let inches = 0;
          const recruitHeight = response.data[0].height;
          if (recruitHeight > 0) {
            feet = Math.floor(recruitHeight);
            inches = Math.floor((recruitHeight % 1) * 12);
          }
          if (response.data.length > 0) {     // Check if data was returned
            this.updateDOB(response.data[0].dob);
            this.setState({
                recruit: response.data[0],
                feet: feet,
                inches: inches
            });
          }
          else {  // Otherwise no results found
              this.setState({
                  error: true
              });
          }
      });
  }
  updateVal(input) {
    this.setState(prevState => ({
      recruit: {
        ...prevState.recruit,
        [input.id]: input.value,
      }
    }));
  }
  updateDOB(date) {
    if (date !== null && !date.includes("_")) {
      const dob = new Date(date);
      let month = "" + (dob.getMonth() + 1);
      let day = "" + dob.getDate();
      if ((dob.getMonth() + 1) < 10)
        month = "0" + month;
      if (dob.getDate() < 10)
        day = "0" + day;
      this.setState(prevState => ({
          formattedDate: month + "/" + day + "/" + dob.getUTCFullYear(),
          recruit: {
            ...prevState.recruit,
            dob: dob
          }
      }));
    }
    else {
      this.setState({
          formattedDate: date
      });
    }
  }
  updateHeight(feet, inches) {
    if (feet === null)
      feet = this.state.feet;
    if (inches === null)
      inches = this.state.inches;
    const calculated = Number(feet) + Number(inches / 12);
    this.setState(prevState => ({
        feet: feet,
        inches: inches,
        recruit: {
          ...prevState.recruit,
          height: Math.round(calculated * 100) / 100
        }
    }));
  }
  updateSchool(e) {
    const value = e.target.value;
    this.setState(prevState => ({
      recruit: {
        ...prevState.recruit,
        school_id: value
      }
    }));
  }
  handleDelete() {
    const doDelete = window.confirm("Are you sure you want to delete this recruit? This action can not be undone.")
    const recruit_id = this.state.recruit.recruit_id;
    if (doDelete) {
      const confirmDelete = window.prompt("To confirm deletion, type 'delete' in the box below.")
      console.log(confirmDelete.toLowerCase())
      if (confirmDelete.toLowerCase() === "delete") {
        const postBody = {"entity":"recruits", "idname":"recruit_id", "id": recruit_id}
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
              window.open("/recruits","_self")
            }
        }.bind(this))
        .catch(function(error) {
            console.log(error);
            alert("There was an error. Please try again in a moment.");
        });
      }
    }
  }
  handleSubmit(e) {
    e.preventDefault();
    const id = this.state.recruit.recruit_id;
    fetch("/endpoints/update-recruit", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this.state.recruit)
    })
    .then(function(response) {
      if (!response.ok) {
          throw Error(response.statusText);
      }
      return response;
    })
    .then(function(response) {
        alert("Recruit has been updated!");
        window.open("/recruits/" + id,"_self")
    })
    .catch(function(error) {
        console.log(error);
        alert("There was an error. Please try again in a moment.");
    });
  }
  /* TO DO: Update clubs
  clubClub(e) {
    this.setState(prevState => ({
      recruit: {
        ...prevState.recruit,
        school_id: e.target.value
      }
    }));
  }*/
  render() {
    return (
      <div>
        <Header/>
        <section className="container">
          <h1>Edit Recruit</h1>
          <div className="anchors">
            <a href="#basic-info">Basic Info</a>
            <a href="#school-info">School</a>
            <a href="#social-info">Social</a>
            <a href="#recruiting-info">Recruiting</a>
          </div>
          <form>
            <a name="basic-info"></a>
            <div className="form-group">
              <label htmlFor="fname">First Name: </label>
              <input onChange={(e) => this.updateVal(e.target)} id="fname" name="fname" type="text" value={this.state.recruit.fname} />
            </div>
            <div className="form-group">
              <label htmlFor="mname">Middle Name: </label>
              <input onChange={(e) => this.updateVal(e.target)} id="mname" name="mname" type="text" value={this.state.recruit.mname} />
            </div>
            <div className="form-group">
              <label htmlFor="lname">Last Name: </label>
              <input onChange={(e) => this.updateVal(e.target)} id="lname" name="lname" type="text" value={this.state.recruit.lname} />
            </div>
            <div className="form-group">
              <label htmlFor="suffix">Suffix: </label>
              <input onChange={(e) => this.updateVal(e.target)} id="suffix" name="suffix" type="text" value={this.state.recruit.suffix || ""} />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone: </label>
              <InputMask onChange={(e) => this.updateVal(e.target)} id="phone" name="phone" type="text" mask="999-999-9999" value={this.state.recruit.phone || ""} />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email: </label>
              <input onChange={(e) => this.updateVal(e.target)} id="email" name="email" type="email" value={this.state.recruit.email || ""} />
            </div>
            <div className="form-group">
              <label htmlFor="dob">Birthday: </label>
              <InputMask onChange={(e) => this.updateDOB(e.target.value)} id="dob" name="dob" mask="99/99/9999" value={this.state.formattedDate || ""} />
            </div>
            <div className="form-group">
              <label htmlFor="funnelstatus">Funnel Status: </label>
              <select onChange={(e) => this.updateVal(e.target)} id="funnelstatus" name="funnelstatus" value={this.state.recruit.funnelstatus || ""}>
                <option value="">Select a Status</option>
                <option value="Cold">Cold</option>
                <option value="Lukewarm">Lukewarm</option>
                <option value="Warm">Warm</option>
                <option value="Hot">Hot</option>
                <option value="Signed">Signed</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="gender">Gender: </label>
              <select onChange={(e) => this.updateVal(e.target)} id="gender" name="gender" value={this.state.recruit.gender || ""}>
                <option value="">Select a Gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </div>
            <div className="form-group">
              <p>Height</p>
              <label htmlFor="height">Feet: </label>
              <input onChange={(e) => this.updateHeight(e.target.value, null)} id="height-feet" name="height-feet" type="number" style={{marginRight: 10}} className="small-input" value={this.state.feet} min="0" max="8"/>
              <label htmlFor="height-inches">Inches: </label>
              <input onChange={(e) => this.updateHeight(null, e.target.value)} id="height-inches" name="height-inches" type="number" className="small-input" value={this.state.inches} min="0" max="11" />
            </div>
            <div className="form-group">
              <label htmlFor="dominant_hand">Gender: </label>
              <select onChange={(e) => this.updateVal(e.target)} id="dominant_hand" name="dominant_hand" value={this.state.recruit.dominant_hand || ""}>
                <option value="">Select a Hand</option>
                <option value="R">Right</option>
                <option value="L">Left</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="position">Position: </label>
              <input onChange={(e) => this.updateVal(e.target)} id="position" name="position" type="text" value={this.state.recruit.position || ""} />
            </div>
            <div className="form-group">
              <label htmlFor="street_address_1">Street Address: </label>
              <input onChange={(e) => this.updateVal(e.target)} id="street_address_1" name="street_address_1" value={this.state.recruit.street_address_1 || ""} />
            </div>
            <div className="form-group">
              <label htmlFor="street_address_2">Street Address 2: </label>
              <input onChange={(e) => this.updateVal(e.target)} id="street_address_2" name="street_address_2" value={this.state.recruit.street_address_2 || ""} />
            </div>
            <div className="form-group">
              <label htmlFor="city">City: </label>
              <input onChange={(e) => this.updateVal(e.target)} id="city" name="city" value={this.state.recruit.city || ""} />
            </div>
            <div className="form-group">
              <label htmlFor="state">State: </label>
              <select onChange={(e) => this.updateVal(e.target)} id="state" name="state" value={this.state.recruit.state || ""}>
                <option value="AL">Alabama</option>
                <option value="AK">Alaska</option>
                <option value="AZ">Arizona</option>
                <option value="AR">Arkansas</option>
                <option value="CA">California</option>
                <option value="CO">Colorado</option>
                <option value="CT">Connecticut</option>
                <option value="DE">Delaware</option>
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
              <label htmlFor="zip">Zip Code: </label>
              <input onChange={(e) => this.updateVal(e.target)} id="zip" name="zip" value={this.state.recruit.zip || ""} />
            </div>
            <a name="school-info"></a>
            <div className="form-group">
              <label htmlFor="school_id">School: </label>
              <DropdownSchool inputId="school_id" inputFor="school_id" onChangeValue={this.updateSchool} value={this.state.recruit.school_id}/>
            </div>
            <div className="form-group">
              <label htmlFor="hsgradyear">HS Graduation Year: </label>
              <InputMask onChange={(e) => this.updateDOB(e.target.value)} id="hsgradyear" name="hsgradyear" mask="9999" value={this.state.recruit.hsgradyear || ""} />
            </div>
            <div className="form-group">
              <label htmlFor="gpa">GPA: </label>
              <input onChange={(e) => this.updateVal(e.target)} id="gpa" name="gpa" type="text" value={this.state.recruit.gpa || ""} />
            </div>
            <a name="social-info"></a>
            <div className="form-group">
              <label htmlFor="twitter">Twitter Username: </label>
              <input onChange={(e) => this.updateVal(e.target)} id="twitter" name="twitter" value={this.state.recruit.twitter || ""} />
            </div>
            <div className="form-group">
              <label htmlFor="facebook">Facebook Username: </label>
              <input onChange={(e) => this.updateVal(e.target)} id="facebook" name="facebook" value={this.state.recruit.facebook || ""} />
            </div>
            <div className="form-group">
              <label htmlFor="instagram">Instagram Username: </label>
              <input onChange={(e) => this.updateVal(e.target)} id="instagram" name="instagram" value={this.state.recruit.instagram || ""} />
            </div>
            <div className="form-group">
              <label htmlFor="snapchat">Snapchat Username: </label>
              <input onChange={(e) => this.updateVal(e.target)} id="snapchat" name="snapchat" value={this.state.recruit.snapchat || ""} />
            </div>
            <a name="recruiting-info"></a>
            <div className="form-group">
              <label htmlFor="fafsa_started">FAFSA Started? </label>
              <select onChange={(e) => this.updateVal(e.target)} id="fafsa_started" name="fafsa_started" value={this.state.recruit.fafsa_started === null ? "" : this.state.recruit.fafsa_started}>
                <option value="">Unknown</option>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="fafsa_completed">FAFSA Completed? </label>
              <select onChange={(e) => this.updateVal(e.target)} id="fafsa_completed" name="fafsa_completed" value={this.state.recruit.fafsa_completed === null ? "" : this.state.recruit.fafsa_completed}>
                <option value="">Unknown</option>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="or_promise_started">OR Promise Started? </label>
              <select onChange={(e) => this.updateVal(e.target)} id="or_promise_started" name="or_promise_started" value={this.state.recruit.or_promise_started === null ? "" : this.state.recruit.or_promise_started}>
                <option value="">Unknown</option>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="or_promise_completed">OR Promise Completed? </label>
              <select onChange={(e) => this.updateVal(e.target)} id="or_promise_completed" name="or_promise_completed" value={this.state.recruit.or_promise_completed === null ? "" : this.state.recruit.or_promise_completed}>
                <option value="">Unknown</option>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="osac_gen_schol_started">OSAC Scholarship Started? </label>
              <select onChange={(e) => this.updateVal(e.target)} id="osac_gen_schol_started" name="osac_gen_schol_started" value={this.state.recruit.osac_gen_schol_started === null ? "" : this.state.recruit.osac_gen_schol_started}>
                <option value="">Unknown</option>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="osac_gen_schol_completed">OSAC Scholarship Completed? </label>
              <select onChange={(e) => this.updateVal(e.target)} id="osac_gen_schol_completed" name="osac_gen_schol_completed" value={this.state.recruit.osac_gen_schol_completed === null ? "" : this.state.recruit.osac_gen_schol_completed}>
                <option value="">Unknown</option>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="efc_received">OSAC Scholarship Completed? </label>
              <select onChange={(e) => this.updateVal(e.target)} id="efc_received" name="efc_received" value={this.state.recruit.efc_received === null ? "" : this.state.recruit.efc_received}>
                <option value="">Unknown</option>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="efc_num">EFC Number: </label>
              <input onChange={(e) => this.updateVal(e.target)} id="efc_num" name="efc_num" value={this.state.recruit.efc_num || ""} />
            </div>
            <div className="form-group">
              <label htmlFor="chafee_eligible">Chafee Eligible? </label>
              <select onChange={(e) => this.updateVal(e.target)} id="chafee_eligible" name="chafee_eligible" value={this.state.recruit.chafee_eligible === null ? "" : this.state.recruit.chafee_eligible}>
                <option value="">Unknown</option>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </div>
            <div className="form-buttons">
              <button type="submit" id="recruit-update-submit" className="no-style button button-primary" onClick={(e) => this.handleSubmit(e)}>Update</button>
              <button type="button" id="recruit-delete-submit" className="no-style button button-red" onClick={this.handleDelete}>Delete Recruit</button>
            </div>
          </form>
        </section>
      </div>
    );
  }
}

export default RecruitEdit;