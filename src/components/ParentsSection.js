import React, { Component } from "react";

class ParentsSection extends Component {
  constructor (props) {
    super(props);
    this.state = { 
        recruit_id: this.props.recruit_id,
        recruit_parents: null,
        guardians: [],
        showForm: false,
        showInputs: false,
        newParentId: null,
        postBody: {"recruit_id": this.props.recruit_id, "parent_id": "", type: "add", "fname": "", "lname":"", "mname":"", "relationship":""}
    };
    this.toggleGuardianForm = this.toggleGuardianForm.bind(this);
    this.handleParentDropdown = this.handleParentDropdown.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.postData = this.postData.bind(this);
    this.getGuardianData = this.getGuardianData.bind(this);
  };
  componentDidMount() {
    this.getGuardianData();
  }
  getGuardianData() {
    fetch("/endpoints/guardians.json?id=" + this.props.recruit_id)
    .then(response => {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) 
          return response.json() 
        else
          return {};
    })
    .then(response => {
        if (response.hasOwnProperty("data")) {     // Check if data was returned
            const guardiansJsx = response.data.map((guardian) => {
                return <li key={"guardian"+guardian.parent_id}>{guardian.fname + " " + (guardian.mname!==null ? guardian.mname:"") + " " + guardian.lname}{guardian.relation ? " (" + guardian.relation + ")" : ""} <button type="button" title="Remove Guardian" className="no-style button button-red button-sm" onClick={()=> this.handleDelete(guardian.parent_id)}>×<span className="off-screen"> Remove Guardian</span></button></li>
            });
            this.setState({
                recruit_parents: (response.data.length ? guardiansJsx : <li>No guardians or parents are on record.</li>)
            });
        }
    });
    fetch("/endpoints/guardians.json?notid=" + this.state.recruit_id)
    .then(response => {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) 
          return response.json() 
        else
          return {};
    })
    .then(response => {
        if (response.hasOwnProperty("data")) {     // Check if data was returned
            this.setState({
                guardians: response.data
            });
        }
    });
  }
  handleParentDropdown(e) {
      const value = e.target.value;
      if (value === "other-guardian") {
        this.setState(prevState => ({
            showInputs: true,
            postBody: {
                ...prevState.postBody,
                parent_id: value
            }
        }));
      }
      else {
        this.setState(prevState => ({
            showInputs: false,
            postBody: {
              ...prevState.postBody,
              parent_id: value
            }
        }));
      }
  }
  postData(toSend, type, parent_id) {
    if (parent_id !== null)
        toSend.parent_id = parent_id;
    toSend.type = type;
    fetch("/endpoints/guardian-post", {
        method: "post",
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
        },
        body: JSON.stringify(toSend)
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
        else if (type === "new") {
            this.postData(toSend, "add", response.insertId, null);   // Make another post call to add recruit-parent relationship
        }
        else {
            window.open("/recruits/" + this.state.recruit_id,"_self");
        }
    }.bind(this))
    .catch(function(error) {
        console.log(error);
        alert("There was an error. Please try again in a moment.");
    });
  }
  handleSubmit(e) {
    if (this.state.postBody.relationship !== "" || ((this.state.showForm && (this.state.postBody.fname !== "" && this.state.postBody.lname !== "")) || (!this.state.showForm && this.state.postBody.parent_id !== ""))) {
        e.preventDefault();
        const toSend = this.state.postBody;
        if (this.state.showInputs) {
            this.postData(toSend, "new", null);
        }
        else {
            this.postData(toSend, "add", null);
        }
    }
  }
  toggleGuardianForm(e) {
    e.preventDefault();
    this.setState({
        showForm: !this.state.showForm
    });
  }
  updateVal(input) {
    this.setState(prevState => ({
      postBody: {
        ...prevState.postBody,
        [input.id]: input.value,
      }
    }));
  }
  handleDelete(parent_id) {
      const doDelete = window.confirm("Are you sure you want to remove this guardian?")
      if (doDelete) {
        const postBody = {"entity":"recruit_parent", "idname":"recruit_id", "id": this.state.recruit_id, "idname2":"parent_id","id2":parent_id}
        fetch("/endpoints/delete?entity=recruit_parent&idname=recruit_id&id="+this.state.recruit_id+"&idname2=parent_id&id2="+parent_id, {
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
            console.log(response)
            if (response.errno) {
                alert("There was an error. Please try again in a moment.");
                console.log(response);
            }
            else {
                this.getGuardianData();
            }
        }.bind(this))
        .catch(function(error) {
            console.log(error);
            alert("There was an error. Please try again in a moment.");
        });
    }
  }
  render() {
    const guardiansOptions = this.state.guardians.map(guardian => <option key={"guardian" + guardian.parent_id} value={guardian.parent_id}>{guardian.fname} {guardian.mname ? guardian.mname + " " : ""}{guardian.lname}</option>)
    return (
        <div className="guardians-list">
            <div className="heading-with-button"><h2>Parents/Guardians</h2><button className={this.state.showForm ? "no-style button button-secondary" : "no-style button button-primary"} type="button" onClick={(e) => this.toggleGuardianForm(e)}>{this.state.showForm ? "Cancel" : <span>Quick Add <i style={{marginLeft: 5}} className="fa fa-plus" /></span>}</button></div>
            {this.state.showForm && <form>
                <select className="parent-dropdown" onChange={(e) => this.handleParentDropdown(e)} value={this.state.postBody.parent_id} required>
                    <option value="">Select a Guardian</option>
                    {guardiansOptions}
                    <option value="other-guardian">Other...</option>
                </select>
                {this.state.showInputs && <div>
                    <div className="form-group">
                        <label htmlFor="fname">First Name: <span className="required">*</span></label>
                        <input onChange={(e) => this.updateVal(e.target)} id="fname" name="fname" type="text" required value={this.state.postBody.fname || ""}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="mname">Middle Name: </label>
                        <input onChange={(e) => this.updateVal(e.target)} id="mname" name="mname" type="text" value={this.state.postBody.mname || ""}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="lname">Last Name: <span className="required">*</span> </label>
                        <input onChange={(e) => this.updateVal(e.target)} id="lname" name="lname" type="text" required value={this.state.postBody.lname || ""}/>
                    </div>
                </div>}
                <div className="form-group">
                    <label htmlFor="relationship">Relationship: <span className="required">*</span> </label>
                    <input onChange={(e) => this.updateVal(e.target)} id="relationship" name="relationship" type="text" required value={this.state.postBody.relationship || ""}/>
                </div>
                <div>
                    <button type="submit" className="no-style button button-primary" onClick={(e) => this.handleSubmit(e)}>Add</button>
                </div>
            </form>}
            <ul>
                {this.state.recruit_parents}
            </ul>
        </div>
    );
  }
}

export default ParentsSection;