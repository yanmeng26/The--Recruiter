import React, { Component } from "react";
import DropdownSchool from "./DropdownSchool.js";
import DropdownClub from "./DropdownClub.js";
import Header from "./Header";

class CoachEdit extends Component {
    constructor (props) {
        super(props);
        this.state = {
            coach: {"coach_id":"","fname":"","mname":"","lname":"","suffix":""},
            error: false
        };
        this.fetchEndpointData = this.fetchEndpointData.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.postData = this.postData.bind(this);
        this.updateVal = this.updateVal.bind(this);
    };
    // Retrieve coach data on component load
    componentDidMount() {
        this.fetchEndpointData();
    }
    fetchEndpointData() {
        fetch("/endpoints/coaches.json?id=" + this.props.match.params.id)
        .then(response => {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) 
                return response.json() 
            else
                return {data:[]};
        })
        .then(response => {
            if (response.data.length > 0) {     // Check if data was returned
                this.setState({
                    coach: response.data[0]
                });
            }
            else {  // Otherwise no results found
                this.setState({
                    error: true
                });
            }
        });
    }
    handleDelete() {
        const doDelete = window.confirm("Are you sure you want to delete this coach? This action can not be undone.")
        const coach_id = this.state.coach.coach_id;
        if (doDelete) {
            const confirmDelete = window.prompt("To confirm deletion, type 'delete' in the box below.")
            if (confirmDelete.toLowerCase() === "delete") {
                const postBody = {"entity":"coaches", "idname":"coach_id", "id": coach_id}
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
                        window.open("/coaches","_self")
                    }
                })
                .catch(function(error) {
                    console.log(error);
                    alert("There was an error. Please try again in a moment.");
                });
            }
        }
    }
    handleSubmit(e) {
        const props = this.state.coach;
        if (props.fname != "" && props.lname != "") {
            e.preventDefault();
            const props = this.state.coach;
            this.postData(props);
        }
    }
    postData(data) {
        let props = data;
        props.update_secondary = true;
        props.type = "School";
        fetch("/endpoints/update-coach", {
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
                alert("There was an error. Please try again in a moment.");
                console.log(response);
            }
            else {
                alert("Coach has been updated!");
                window.open("/coaches/" + props.coach_id,"_self")
            }
        }.bind(this))
        .catch(function(error) {
            console.log(error);
            alert("There was an error. Please try again in a moment.");
        });
    }
    updateVal(input) {
        this.setState(prevState => ({
            coach: {
                ...prevState.coach,
                [input.id]: input.value
            }
        }));
    }
    render() {
        return (
        <div>
            <Header/>
            <section className="container">
                <h1>Edit Coach</h1>
                <form>
                    <div className="form-group">
                        <label htmlFor="fname">First Name: </label>
                        <input onChange={(e) => this.updateVal(e.target)} id="fname" name="fname" type="text" required value={this.state.coach.fname || ""}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="mname">Middle Name: </label>
                        <input onChange={(e) => this.updateVal(e.target)} id="mname" name="mname" type="text" value={this.state.coach.mname || ""}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="lname">Last Name: </label>
                        <input onChange={(e) => this.updateVal(e.target)} id="lname" name="lname" type="text" required value={this.state.coach.lname || ""}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="suffix">Suffix: </label>
                        <input onChange={(e) => this.updateVal(e.target)} id="suffix" name="suffix" type="text" value={this.state.coach.suffix || ""}/>
                    </div>
                    <div className="form-buttons">
                        <button type="submit" id="recruit-update-submit" className="no-style button button-primary" onClick={(e) => this.handleSubmit(e)}>Update</button>
                        <button type="button" id="recruit-delete-submit" className="no-style button button-red" onClick={this.handleDelete}>Delete Coach</button>
                    </div>
                </form>
            </section>
        </div>
        );
    }
}

export default CoachEdit;