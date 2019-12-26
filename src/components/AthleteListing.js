import React, { Component } from "react";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import "../../node_modules/react-bootstrap-table/css/react-bootstrap-table.css";
import "./AthleteListing.css";
import { BrowserRouter as Router, Link } from "react-router-dom";

class AthleteListing extends Component {
  state = {
    test: [
      {
        first_name: "Will",
        last_name: "Smith",
        height: "6.88",
        age: "18",
        grad: "2020",
        school: "Angel",
        hand: "Left"
      },
      {
        first_name: "Meng",
        last_name: "Yan",
        height: "6.58",
        age: "17",
        grad: "2019",
        position: "Forward"
      }
    ]
  };

  cellButton() {
    return (
      <button type="button">
        <Link to={"/athlete-details-individual"} className="nav-link-details">
          Details
        </Link>
      </button>
    );
  }

  render() {
    return (
      <div className="tableAthlete">
        <BootstrapTable data={this.state.test}>
          <TableHeaderColumn isKey dataField="first_name" width="12%">
            First Name
          </TableHeaderColumn>
          <TableHeaderColumn dataField="last_name" width="12%">
            Last Name
          </TableHeaderColumn>
          <TableHeaderColumn dataField="height" width="8%">
            Height
          </TableHeaderColumn>
          <TableHeaderColumn dataField="age" width="6%">
            Age
          </TableHeaderColumn>
          <TableHeaderColumn dataField="grad" width="10%">
            HS Grad Year
          </TableHeaderColumn>
          <TableHeaderColumn dataField="school" width="10%">
            School Name
          </TableHeaderColumn>
          <TableHeaderColumn dataField="position" width="10%">
            Position
          </TableHeaderColumn>
          <TableHeaderColumn dataField="hand" width="10%">
            Dominant Hand
          </TableHeaderColumn>
          <TableHeaderColumn
            dataField="button"
            width="12%"
            dataFormat={this.cellButton.bind(this)}
          >
            Others
          </TableHeaderColumn>
        </BootstrapTable>
      </div>
    );
  }
}

export default AthleteListing;
