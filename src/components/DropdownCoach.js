import React, { Component } from "react";
import "../css/AthleteAdd.css";
import ReactDOM from "react-dom";
import { Route, withRouter } from "react-router-dom";

class DropdownCoach extends Component {
  constructor() {
    super();
    this.state = {
      coaches: [],
      selectvalue: ""
    };
  }

  componentDidMount() {
    let initialcoaches = [];
    fetch("/endpoints/coaches.json?"+ (this.props.query || ""))
      .then(response => {
        return response.json();
      })
      .then(data => {
        initialcoaches = data.data.map(coach => {
          return coach;
        });
        console.log(initialcoaches);
        this.setState({
          coaches: initialcoaches.sort((a,b) => {
            const x = a.lname.toLowerCase();
            const y = b.lname.toLowerCase();
            if (x < y)
                return -1;
            if (x > y)
                return 1;
            return 0;
            })
        });
      });
  }

  render() {
    return (
      <div>
        <select className="coach" id={this.props.inputId} value={this.props.value || ""} onChange={this.props.onChangeValue} required={this.props.required}>
          <option value="">Select a Coach</option>
          {this.state.coaches.map(coach => (
            <option key={coach.coach_id} value={coach.coach_id}>
              {coach.fname + " " + coach.lname}
            </option>
          ))}
          {this.props.other && <option value="other-value">Other...</option>}
        </select>
      </div>
    );
  }
}
export default DropdownCoach;