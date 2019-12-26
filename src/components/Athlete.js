import React, { Component } from "react";
import Table1 from "./AthleteListing";
import Title from "./AthleteTitle";
import "./Athlete.css";

class Athlete extends Component {
  render() {
    return (
      <div>
        <Title />
        <Table1 />
      </div>
    );
  }
}

export default Athlete;
