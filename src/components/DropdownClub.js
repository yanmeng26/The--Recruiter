import React, { Component } from "react";
import "../css/AthleteAdd.css";
import ReactDOM from "react-dom";
import { Route, withRouter } from "react-router-dom";

class DropdownClub extends Component {
  constructor() {
    super();
    this.state = {
      clubs: [],
      selectvalue: ""
    };
  }

  componentDidMount() {
    let initialclubs = [];
    fetch("/endpoints/clubs.json"+ (this.props.query || ""))
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
            clubs: response.data.sort((a,b) => {
              const x = a.club_name.toLowerCase();
              const y = b.club_name.toLowerCase();
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
          className="club"
          value={this.props.value || ""}
          onChange={this.props.onChangeValue}
          required={this.props.required}
        >
          <option value="">Select a club</option>
          {this.state.clubs.map(club => (
            <option key={club.club_id} value={club.club_id}>
              {club.club_name}
            </option>
          ))}
          {this.props.other && <option value="other-value">Other...</option>}
        </select>
      </div>
    );
  }
}
export default DropdownClub;
