import React, { Component } from "react";
import "../css/AthleteAdd.css";
import ReactDOM from "react-dom";
import { Route, withRouter } from "react-router-dom";

class DropdownSchool extends Component {
  constructor() {
    super();
    this.state = {
      schools: [],
      selectvalue: ""
    };
  }

  componentDidMount() {
    let initialschools = [];
    fetch("/endpoints/schools.json?"+ (this.props.query || ""))
      .then(response => {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) 
          return response.json() 
        else
          return {data:[]};
      })
      .then(response => {
        if (response.data.length) {
          this.setState({
            schools: response.data.sort((a,b) => {
              const x = a.school_name.toLowerCase();
              const y = b.school_name.toLowerCase();
              if (x < y)
                  return -1;
              if (x > y)
                  return 1;
              return 0;
              })
          });
        }
      });
  }

  render() {
    return (
      <div>
        <select
          className="school"
          id={this.props.inputId || ""}
          value={this.props.value || ""}
          onChange={this.props.onChangeValue} required={this.props.required}
        >
          <option value="">Select a School</option>
          {this.state.schools.map(school => (
            <option key={school.school_id} value={school.school_id}>
              {school.school_name}
            </option>
          ))}
          {this.props.other && <option value="other-value">Other...</option>}
        </select>
      </div>
    );
  }
}
export default DropdownSchool;
