import React, { Component } from "react";
import DropdownSchool from "./DropdownSchool.js";
import DropdownClub from "./DropdownClub.js";
import Header from "./Header";
import AddClubForm from "./AddClubForm.js";
import AddTeamForm from "./AddTeamForm.js";

class TeamAdd extends Component {
    constructor (props) {
        super(props);
        this.state = {
            team: {"type":""},
            error: false
        };
        this.updateVal = this.updateVal.bind(this);
    };
    updateVal(input) {
        this.setState(prevState => ({
            team: {
                ...prevState.team,
                [input.id]: input.value
            }
        }));
    }
    render() {
        return (
        <div>
            <Header/>
            <section className="container">
                <h1>Add Team</h1>
                <form>
                    <AddTeamForm showTypeSelect={true} showDropdown={false} />
                </form>
            </section>
        </div>
        );
    }
}

export default TeamAdd;