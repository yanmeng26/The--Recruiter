import React, { Component } from "react";

class HomeForm extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      message: "",
      formError: false
    };
  }

  getName = e => {
    let username = e.target.value;
    this.setState({
      name: username
    });
    console.log(this.state.name);
  };

  getEmail = e => {
    let userEmail = e.target.value;

    if (
      userEmail.match(
        /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
      )
    ) {
      this.setState({
        email: userEmail
      });
    } else {
      this.setState({
        email: ""
      });
      console.log("Incorrect Email, must match Expression");
    }

    console.log(this.state.email);
  };

  getDescription = e => {
    let userMessage = e.target.value;
    this.setState({
      message: userMessage
    });
    console.log(this.state.message);
  };
  //send the form
  submitForm = e => {
    e.preventDefault();

    if (
      this.state.name === "" ||
      this.state.email === "" ||
      this.state.message === ""
    ) {
      this.setState({
        formError: true
      });
      return false;
    } else {
      this.setState({
        formError: false
      });
      console.log(`UserData: {
            Username: ${this.state.name},
            Email: ${this.state.email},
            Message: ${this.state.message}
        }`);

      console.log("form sent");
    }
  };

  render() {
    return (
      <form>
        {/* I am just sending a basic error message */}
        {this.state.formError && (
          <p className="error">Please complete all input fields.</p>
        )}
        <p>Want to get in touch? Fill out the form below!</p>
        <div>
          <label htmlFor="name">Name</label>
          <input required
            type="text"
            name="name"
            onChange={this.getName}
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input required
            type="email"
            name="email"
            onChange={this.getEmail}
          />
        </div>
        <div className="text-area">
          <label htmlFor="name">Message</label>
          <textarea onChange={this.getDescription} maxLength="450" />
        </div>
        <div>
          <p className="submit-section">We will reach out to you as soon as possible.</p>
          <input
            type="submit"
            name="submit"
            value="Send"
            onClick={this.submitForm}
          />
        </div>
      </form>
    );
  }
}

export default HomeForm;
