import React, { Component } from "react";
import Header from "./Header";

class EvaluationAdd extends Component {
    constructor (props) {
        super(props);
        this.state = { 
            recruit: {},
            evaluation: {"recruit_id": null, "eval_type": "", "eval_date": "", "eval_opponent": "", "jump_shooting": "", "dribble_pull_up": "", "driving_finish": "", "both_hands": null, "free_throw_shooting": "", "has_post_moves": null, "rh_jump_hook": "", "lh_jump_hook": "", "rh_step_through": "", "lh_step_through": "", "rh_drop_step": "", "lh_drop_step": "", "rh_drop_step_counter": "", "lh_drop_step_counter": "", "rh_fadeaway": "", "lh_fadeaway": "", "post_spin": "", "post_face_up": "", "speed": "", "quickness": "", "lateral_quickness": "", "stance": "", "initiates_contact": "", "bounce": "", "second_bounce": "", "closeout": "", "anticipation": "", "rh_ball_handling": "", "lh_ball_handling": "", "front_x_over": "", "middle_x_over": "", "back_x_over": "", "passing": "", "pivots": "", "rebound_outside_zone": "", "rebound_anticipation": "", "rebound_physicality": "", "talk": "", "moving_on_air_time": "", "eval_rating": null, "notes":""},
            error: false,
            eval_date: ""
        };
    };
    // Retrieve recruit's evaluation data on component load
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
                this.setState({
                    recruit: response.data[0]
                },() => {
                    this.setState(prevState => ({
                        evaluation: {
                            ...prevState.evaluation,
                            eval_date: formatted,
                            recruit_id: this.props.match.params.id
                        }
                    }))
                });
            }
            else {  // Otherwise no results found
                this.setState({
                    error: true
                });
            }
        });
    }
    handleSubmit(e) {
        if (this.state.evaluation.eval_type !== "" && this.state.evaluation.eval_opponent !== "") {
            e.preventDefault();
            const id = this.props.match.params.id;
            const date = this.state.evaluation.eval_date;
            this.setState(prevState => ({
                evaluation: {
                    ...prevState.evaluation,
                    eval_date: date + ":00.000Z"
                }
            }),()=> {   // Wait until state is updated before posting
                fetch("/endpoints/add-evaluation", {
                    method: "post",
                    headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                    },
                    body: JSON.stringify(this.state.evaluation)
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
                        alert("Evaluation has been added!");
                        window.open("/recruits/" + id,"_self");
                    }
                })
                .catch(function(error) {
                    console.log(error);
                    alert("There was an error. Please try again in a moment.");
                });
            })
        }
    }
    updateVal(input) {
        let value = input.value.replace(/\n/g,"<br/>");
        this.setState(prevState => ({
            evaluation: {
                ...prevState.evaluation,
                [input.id]: value,
            }
        }));
    }
    render() {
        return ( 
            <div>
                <Header/>
                <section className="container">
                    <h1>Add Evaluation for {this.state.recruit.fname + " " + this.state.recruit.lname}</h1>
                    <form>
                        <div className="form-group">
                            <label htmlFor="eval_date">Evaluation Date: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="eval_date" name="eval_date" type="datetime-local" value={this.state.evaluation.eval_date || ""} />
                        </div>
                        {/*<div className="form-group">
                            <label htmlFor="recruit_id">Recruit ID: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="recruit_id" name="recruit_id" type="text" />
                        </div>*/}
                        <div className="form-group">
                            <label htmlFor="eval_type">Evaluation Type: </label>
                            <select onChange={(e) => this.updateVal(e.target)} id="eval_type" name="eval_type" value={this.state.recruit.eval_type} required>
                                <option value="">Select a Type</option>
                                <option value="All Star Game">All Star Game</option>
                                <option value="Club Game">Club Game</option>
                                <option value="Film">Film</option>
                                <option value="HS Game">High School Game</option>
                                <option value="Workout">Workout</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="eval_opponent">Evaluation Opponent: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="eval_opponent" name="eval_opponent" type="text" required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="jump_shooting">Jump Shooting: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="jump_shooting" name="jump_shooting" type="number" step="0.01" min="0"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="dribble_pull_up">Dribble Pull Up: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="dribble_pull_up" name="dribble_pull_up" type="number" step="0.01" min="0"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="driving_finish">Driving Finish: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="driving_finish" name="driving_finish" type="number" step="0.01" min="0"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="both_hands">Both Hands? </label>
                            <select onChange={(e) => this.updateVal(e.target)} id="both_hands" name="both_hands">
                                <option value="">Unknown</option>
                                <option value="1">Yes</option>
                                <option value="0">No</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="free_throw_shooting">Free Throw Shooting: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="free_throw_shooting" name="free_throw_shooting" type="number" step="0.01" min="0"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="has_post_moves">Has Post Moves: </label>
                            <select onChange={(e) => this.updateVal(e.target)} id="has_post_moves" name="has_post_moves">
                                <option value="">Unknown</option>
                                <option value="1">Yes</option>
                                <option value="0">No</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="rh_jump_hook">RH Jump Hook: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="rh_jump_hook" name="rh_jump_hook" type="number" step="0.01" min="0"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="lh_jump_hook">LH Jump Hook: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="lh_jump_hook" name="lh_jump_hook" type="number" step="0.01" min="0"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="rh_step_through">RH Step Through: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="rh_step_through" name="rh_step_through" type="number" step="0.01" min="0"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="lh_step_through">LH Step Through: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="lh_step_through" name="lh_step_through" type="number" step="0.01" min="0"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="rh_drop_step">RH Drop Step: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="rh_drop_step" name="rh_drop_step" type="number" step="0.01" min="0"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="lh_drop_step">LH Drop Step: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="lh_drop_step" name="lh_drop_step" type="number" step="0.01" min="0"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="rh_drop_step_counter">RH Drop Step Counter: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="rh_drop_step_counter" name="rh_drop_step_counter" type="number" step="0.01" min="0"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="lh_drop_step_counter">LH Drop Step Counter: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="lh_drop_step_counter" name="lh_drop_step_counter" type="number" step="0.01" min="0"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="rh_fadeaway">RH Fadeaway: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="rh_fadeaway" name="rh_fadeaway" type="number" step="0.01" min="0"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="lh_fadeaway">LH Fadeaway: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="lh_fadeaway" name="lh_fadeaway" type="number" step="0.01" min="0"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="post_spin">Post Spin: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="post_spin" name="post_spin" type="number" step="0.01" min="0"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="post_face_up">Post Face Up: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="post_face_up" name="post_face_up" type="number" step="0.01" min="0"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="speed">Speed: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="speed" name="speed" type="number" step="0.01" min="0"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="quickness">Quickness: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="quickness" name="quickness" type="number" step="0.01" min="0"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="lateral_quickness">Lateral Quickness: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="lateral_quickness" name="lateral_quickness" type="number" step="0.01" min="0"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="stance">Stance: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="stance" name="stance" type="number" step="0.01" min="0"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="initiates_contact">Initiates Contact: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="initiates_contact" name="initiates_contact" type="number" step="0.01" min="0"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="bounce">Bounce: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="bounce" name="bounce" type="number" step="0.01" min="0"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="second_bounce">Second Bounce: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="second_bounce" name="second_bounce" type="number" step="0.01" min="0"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="closeout">Closeout: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="closeout" name="closeout" type="number" step="0.01" min="0"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="anticipation">Anticipation: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="anticipation" name="anticipation" type="number" step="0.01" min="0"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="rh_ball_handling">RH Ball Handling: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="rh_ball_handling" name="rh_ball_handling" type="number" step="0.01" min="0"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="lh_ball_handling">LH Ball Handling: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="lh_ball_handling" name="lh_ball_handling" type="number" step="0.01" min="0"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="front_x_over">Front Crossover: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="front_x_over" name="front_x_over" type="number" step="0.01" min="0"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="middle_x_over">Middle Crossover: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="middle_x_over" name="middle_x_over" type="number" step="0.01" min="0"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="back_x_over">Back Crossover: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="back_x_over" name="back_x_over" type="number" step="0.01" min="0"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="passing">Passing: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="passing" name="passing" type="number" step="0.01" min="0"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="pivots">Pivots: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="pivots" name="pivots" type="number" step="0.01" min="0"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="rebound_outside_zone">Rebound Outside Zone: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="rebound_outside_zone" name="rebound_outside_zone" type="number" step="0.01" min="0"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="rebound_anticipation">Rebound Anticipation: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="rebound_anticipation" name="rebound_anticipation" type="number" step="0.01" min="0"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="rebound_physicality">Rebound Physicality: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="rebound_physicality" name="rebound_physicality" type="number" step="0.01" min="0"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="talk">Talk: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="talk" name="talk" type="number" step="0.01" min="0"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="moving_on_air_time">Moving On Air Time: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="moving_on_air_time" name="moving_on_air_time" type="number" step="0.01" min="0"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="eval_rating">Evaluation Rating: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="eval_rating" name="eval_rating" type="number" step="0.01" min="0"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="notes">Notes: </label>
                            <textarea className="md-textarea" onChange={(e) => this.updateVal(e.target)} id="notes" name="notes" maxLength="500"/>
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

export default EvaluationAdd;