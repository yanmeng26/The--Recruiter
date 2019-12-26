import React, { Component } from "react";
import Header from "./Header";
import InputMask from 'react-input-mask';

class CallAdd extends Component {
    constructor (props) {
        super(props);
        this.state = { 
            recruit: {},
            call: {"caller": 10, "time": "", "phone_number": "", "duration": "", "recruit_id": null},
            error: false,
            eval_date: ""
        };
    };
    // Retrieve recruit's data on component load
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
            if (response.data.length > 0) {     // Check if data was returned
                const now = new Date();
                let month = "" + (now.getMonth() + 1);
                let day = "" + now.getDate();
                if ((now.getMonth() + 1) < 10)
                    month = "0" + month;
                if (now.getDate() < 10)
                    day = "0" + day;
                let formatted = now.getFullYear() + "-" + month + "-" + day + "T" + (now.getHours() < 10 ? "0" + now.getHours(): now.getHours()) + ":" + (now.getMinutes() < 10 ? "0" + now.getMinutes(): now.getMinutes()); // Needs to be yyyy-MM-ddThh:mm
                this.setState(prevState => ({
                    recruit: response.data[0],
                    call: {
                        ...prevState.call,
                        time: formatted,
                        phone_number: response.data[0].phone
                    }
                }));
            }
            else {  // Otherwise no results found
                this.setState({
                    error: true
                });
            }
        });
    }
    handleSubmit(e) {
        if (this.state.call.duration !== "") {
            e.preventDefault();
            const id = this.props.match.params.id;
            const date = this.state.call.time;
            this.setState(prevState => ({
                call: {
                    ...prevState.call,
                    time: date + ":00.000Z",
                    recruit_id: this.state.recruit.recruit_id
                }
            }),()=> {   // Wait until state is updated before posting
                fetch("/endpoints/add-call-log", {
                    method: "post",
                    headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                    },
                    body: JSON.stringify(this.state.call)
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
                        alert("Call has been added to the log!")
                    }
                    window.open("/recruits/" + id,"_self")
                })
                .catch(function(error) {
                    console.log(error);
                    alert("There was an error. Please try again in a moment.");
                });
            })
        }
    }
    updateVal(input) {
        const value = input.value;
        this.setState(prevState => ({
            call: {
                ...prevState.call,
                [input.id]: value
            }
        }));
    }
    render() {
        return ( 
            <div>
                <Header/>
                <section className="container">
                    <h1>Add Call for {this.state.recruit.fname + " " + this.state.recruit.lname}</h1>
                    <p style={{marginBottom:40}}>Note: all dates/times should be entered in PST.</p>
                    <form>
                        <div className="form-group">
                            <label htmlFor="time">Call Date: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="time" name="time" type="datetime-local" value={this.state.call.time || ""} />
                        </div>
                        {/* TODO: Add user information from cognito here
                        <div className="form-group">
                            <label htmlFor="caller">Caller: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="caller" name="caller" type="text" required/>
                        </div>*/}
                        <div className="form-group">
                            <label htmlFor="phone_number">Phone Number Called: </label>
                            <InputMask onChange={(e) => this.updateVal(e.target)} id="phone_number" name="phone_number" type="text" mask="999-999-9999" value={this.state.call.phone_number || ""} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="duration">Duration (Hours): </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="duration" name="duration" type="number" step="0.1" min="0" required/>
                        </div>
                        <div className="form-buttons">
                            <button type="submit" id="recruit-update-submit" className="no-style button button-primary" onClick={(e) => this.handleSubmit(e)}>Add</button>
                        </div>
                    </form>
                </section>
            </div>
        );
    }
}

export default CallAdd;