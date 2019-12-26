import React, { Component } from "react";
import "./AthleteTitle.css";
import { BrowserRouter as Router, Link } from "react-router-dom";

class AthleteTitle extends Component {
  render() {
    return (
      <div className="Athlete-Table-Title">
        Athlete List
        <button type="button" className="button-addnew">
          <Link to={"/athlete-adding"} className="nav-link-addnew">
            + New
          </Link>
        </button>
      </div>
    );
  }
}

export default AthleteTitle;
