import React, { Component } from "react";
import AnimateHeight from 'react-animate-height';

class EvaluationsAccordion extends Component {
    constructor (props) {
		super(props);
		this.state = {
            height: 0,
            isEdit: false,
            evaluation: this.props.data
		}
        this.toggleAccordion  = this.toggleAccordion.bind(this);
        this.toggleEdit  = this.toggleEdit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
	}
    
    componentDidMount() {
        const date = this.props.data.eval_date;
        // Toggle selected state
		this.setState(prevState => ({
            isSelected: !this.state.isSelected,
            evaluation: {
                ...prevState.evaluation,
                eval_date: date.replace(":00.000Z",""),
              }
		}));
    }
    handleDelete() {
      const doDelete = window.confirm("Are you sure you want to delete this evaluation? This action can not be undone.")
      const eval_id = this.state.evaluation.eval_id;
      console.log(eval_id)
      if (doDelete) {
        const postBody = {"entity":"evaluations", "idname":"eval_id", "id": eval_id}
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
                window.location.reload();
            }
        }.bind(this))
        .catch(function(error) {
            console.log(error);
            alert("There was an error. Please try again in a moment.");
        });
    }
    }
    handleSubmit(e) {
        e.preventDefault();
        let props = this.state.evaluation;
        props.eval_date = this.state.evaluation.eval_date + ":00.000Z"; // Update eval date to proper format
        // Submit form
        fetch("/endpoints/update-evaluation", {
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
            return response;
        })
        .then(function(response) {  // Success
            alert("Evaluation has been updated!");
            window.location.reload();
        })
        .catch(function(error) {    // In case of error
            console.log(error);
            alert("There was an error. Please try again in a moment.");
        });
    }

    // Update values on input change
    updateVal(input) {
      this.setState(prevState => ({
        evaluation: {
          ...prevState.evaluation,
          [input.id]: input.value,
        }
      }));
    }
    // Toggle edit state. Determines whether to display form or list
    toggleEdit() {
        this.setState({
			isEdit: !this.state.isEdit
		});
    }
    // Toggle open and close of accordion
    toggleAccordion(e) {
        e.preventDefault();
        e.stopPropagation();
        var openAccordions = document.getElementsByClassName("rah-static--height-auto");
        for (let i=0;i<openAccordions.length;i++) {
            openAccordions[i].previousElementSibling.click();
        }
		this.setState({
		    height: this.state.height === 0 ? 'auto' : 0,
		});
    }
    render() {
        return (<div className={this.state.height === 0 ? "accordion-item closed" : "accordion-item open"} key={"accordion" + this.props.data.eval_id}>
            <button onClick={(e) => this.toggleAccordion(e)} className="title no-style">{this.props.formatteddate}</button>
            <AnimateHeight duration={ 500 } height={ this.state.height } className="accordion-content">
                <button onClick={this.toggleEdit} className={this.state.isEdit ? "no-style button button-secondary" : "no-style button button-primary"}>{!this.state.isEdit ? "Edit" : "Cancel"} {!this.state.isEdit ? <i className='fa fa-edit' style={{marginLeft: 5}}></i> : "" }</button>
                <button onClick={this.handleDelete} className="no-style button button-red">Delete</button>
                {!this.state.isEdit && <div className="accordion-panel">
                    <div className="evaluations-data">
                        <p><strong>Evaluation Rating: </strong>{this.props.data.eval_rating}</p>
                        <p><strong>Opponent: </strong>{this.props.data.eval_opponent}</p>
                        <p><strong>Jump Shooting: </strong>{this.props.data.jump_shooting}</p>
                        <p><strong>Dribble Pull Up: </strong>{this.props.data.dribble_pull_up}</p>
                        <p><strong>Driving Finish: </strong>{this.props.data.driving_finish}</p>
                        <p><strong>Free Throw Shooting: </strong>{this.props.data.free_throw_shooting}</p>
                        <p><strong>RH Jump Hook: </strong>{this.props.data.rh_jump_hook}</p>
                        <p><strong>LH Jump Hook: </strong>{this.props.data.lh_jump_hook}</p>
                        <p><strong>RH Step Through: </strong>{this.props.data.rh_step_through}</p>
                        <p><strong>LH Step Through: </strong>{this.props.data.lh_step_through}</p>
                        <p><strong>RH Drop Step: </strong>{this.props.data.rh_drop_step}</p>
                        <p><strong>LH Drop Step: </strong>{this.props.data.lh_drop_step}</p>
                        <p><strong>RH Drop Step Counter: </strong>{this.props.data.rh_drop_step_counter}</p>
                        <p><strong>LH Drop Step Counter: </strong>{this.props.data.lh_drop_step_counter}</p>
                    </div>
                    <div className="evaluations-data">
                        <p><strong>RH Fadeaway: </strong>{this.props.data.rh_fadeaway}</p>
                        <p><strong>LH Fadeaway: </strong>{this.props.data.lh_fadeaway}</p>
                        <p><strong>Post Spin: </strong>{this.props.data.post_spin}</p>
                        <p><strong>Post Face Up: </strong>{this.props.data.post_face_up}</p>
                        <p><strong>Speed: </strong>{this.props.data.speed}</p>
                        <p><strong>Quickness: </strong>{this.props.data.quickness}</p>
                        <p><strong>Lateral Quickness: </strong>{this.props.data.lateral_quickness}</p>
                        <p><strong>Stance: </strong>{this.props.data.stance}</p>
                        <p><strong>Initiates Contact: </strong>{this.props.data.initiates_contact}</p>
                        <p><strong>Bounce: </strong>{this.props.data.bounce}</p>
                        <p><strong>Second Bounce: </strong>{this.props.data.second_bounce}</p>
                        <p><strong>Anticipation: </strong>{this.props.data.anticipation}</p>
                        <p><strong>RH Ball Handling: </strong>{this.props.data.rh_ball_handling}</p>
                        <p><strong>LH Ball Handling: </strong>{this.props.data.lh_ball_handling}</p>
                    </div>
                    <div className="evaluations-data">
                        <p><strong>Front Crossover: </strong>{this.props.data.front_x_over}</p>
                        <p><strong>Middle Crossover: </strong>{this.props.data.middle_x_over}</p>
                        <p><strong>Back Crossover: </strong>{this.props.data.back_x_over}</p>
                        <p><strong>Closeout: </strong>{this.props.data.closeout}</p>
                        <p><strong>Passing: </strong>{this.props.data.passing}</p>
                        <p><strong>Pivots: </strong>{this.props.data.pivots}</p>
                        <p><strong>Rebound Outside Zone: </strong>{this.props.data.rebound_outside_zone}</p>
                        <p><strong>Rebound Anticipation: </strong>{this.props.data.rebound_anticipation}</p>
                        <p><strong>Rebound Physicality: </strong>{this.props.data.rebound_physicality}</p>
                        <p><strong>Talk: </strong>{this.props.data.talk}</p>
                        <p><strong>Moving On Air Time: </strong>{this.props.data.moving_on_air_time}</p>
                        <p><strong>Both Hands?: </strong>{this.props.data.both_hands ? "Yes" : "No"}</p>
                        <p><strong>Has Post Moves?: </strong>{this.props.data.has_post_moves ? "Yes" : "No"}</p>
                    </div>
                    <div className="evaluations-data notes">
                        <p><strong>Notes: </strong></p>
                        <p dangerouslySetInnerHTML={{ __html: this.props.data.notes }}></p>
                    </div>
                </div>}
                {this.state.isEdit && <form className="accordion-panel">
                    <div className="evaluations-data">
                        <div className="form-group">
                            <label htmlFor="eval_date">Evaluation Date: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="eval_date" name="eval_date" type="datetime-local" value={this.state.evaluation.eval_date || ""} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="eval_rating">Evaluation Rating: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="eval_rating" name="eval_rating" type="number" step="0.01" min="0" value={this.state.evaluation.eval_rating || ""} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="eval_opponent">Evaluation Opponent: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="eval_opponent" name="eval_opponent" type="text" required value={this.state.evaluation.eval_opponent || ""} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="jump_shooting">Jump Shooting: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="jump_shooting" name="jump_shooting" type="number" step="0.01" min="0" value={this.state.evaluation.jump_shooting || ""} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="dribble_pull_up">Dribble Pull Up: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="dribble_pull_up" name="dribble_pull_up" type="number" step="0.01" min="0" value={this.state.evaluation.dribble_pull_up || ""} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="driving_finish">Driving Finish: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="driving_finish" name="driving_finish" type="number" step="0.01" min="0" value={this.state.evaluation.driving_finish || ""} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="free_throw_shooting">Free Throw Shooting: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="free_throw_shooting" name="free_throw_shooting" type="number" step="0.01" min="0" value={this.state.evaluation.free_throw_shooting || ""} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="rh_jump_hook">RH Jump Hook: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="rh_jump_hook" name="rh_jump_hook" type="number" step="0.01" min="0" value={this.state.evaluation.rh_jump_hook || ""} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lh_jump_hook">LH Jump Hook: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="lh_jump_hook" name="lh_jump_hook" type="number" step="0.01" min="0" value={this.state.evaluation.lh_jump_hook || ""} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="rh_step_through">RH Step Through: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="rh_step_through" name="rh_step_through" type="number" step="0.01" min="0" value={this.state.evaluation.rh_step_through || ""} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lh_step_through">LH Step Through: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="lh_step_through" name="lh_step_through" type="number" step="0.01" min="0" value={this.state.evaluation.lh_step_through || ""} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="rh_drop_step">RH Drop Step: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="rh_drop_step" name="rh_drop_step" type="number" step="0.01" min="0" value={this.state.evaluation.rh_drop_step || ""} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lh_drop_step">LH Drop Step: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="lh_drop_step" name="lh_drop_step" type="number" step="0.01" min="0" value={this.state.evaluation.lh_drop_step || ""} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="rh_drop_step_counter">RH Drop Step Counter: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="rh_drop_step_counter" name="rh_drop_step_counter" type="number" step="0.01" min="0" value={this.state.evaluation.rh_drop_step_counter || ""} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lh_drop_step_counter">LH Drop Step Counter: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="lh_drop_step_counter" name="lh_drop_step_counter" type="number" step="0.01" min="0" value={this.state.evaluation.lh_drop_step_counter || ""} />
                        </div>
                    </div>
                    <div className="evaluations-data">
                        <div className="form-group">
                            <label htmlFor="rh_fadeaway">RH Fadeaway: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="rh_fadeaway" name="rh_fadeaway" type="number" step="0.01" min="0" value={this.state.evaluation.rh_fadeaway || ""} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lh_fadeaway">LH Fadeaway: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="lh_fadeaway" name="lh_fadeaway" type="number" step="0.01" min="0" value={this.state.evaluation.lh_fadeaway || ""} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="post_spin">Post Spin: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="post_spin" name="post_spin" type="number" step="0.01" min="0" value={this.state.evaluation.post_spin || ""} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="post_face_up">Post Face Up: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="post_face_up" name="post_face_up" type="number" step="0.01" min="0" value={this.state.evaluation.post_face_up || ""} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="speed">Speed: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="speed" name="speed" type="number" step="0.01" min="0" value={this.state.evaluation.speed || ""} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="quickness">Quickness: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="quickness" name="quickness" type="number" step="0.01" min="0" value={this.state.evaluation.quickness || ""} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lateral_quickness">Lateral Quickness: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="lateral_quickness" name="lateral_quickness" type="number" step="0.01" min="0" value={this.state.evaluation.lateral_quickness || ""} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="stance">Stance: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="stance" name="stance" type="number" step="0.01" min="0" value={this.state.evaluation.stance || ""} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="initiates_contact">Initiates Contact: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="initiates_contact" name="initiates_contact" type="number" step="0.01" min="0" value={this.state.evaluation.initiates_contact || ""} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="bounce">Bounce: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="bounce" name="bounce" type="number" step="0.01" min="0" value={this.state.evaluation.bounce || ""} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="second_bounce">Second Bounce: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="second_bounce" name="second_bounce" type="number" step="0.01" min="0" value={this.state.evaluation.second_bounce || ""} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="anticipation">Anticipation: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="anticipation" name="anticipation" type="number" step="0.01" min="0" value={this.state.evaluation.anticipation || ""} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="rh_ball_handling">RH Ball Handling: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="rh_ball_handling" name="rh_ball_handling" type="number" step="0.01" min="0" value={this.state.evaluation.rh_ball_handling || ""} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lh_ball_handling">LH Ball Handling: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="lh_ball_handling" name="lh_ball_handling" type="number" step="0.01" min="0" value={this.state.evaluation.lh_ball_handling || ""} />
                        </div>
                    </div>
                    <div className="evaluations-data">
                        <div className="form-group">
                            <label htmlFor="front_x_over">Front Crossover: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="front_x_over" name="front_x_over" type="number" step="0.01" min="0" value={this.state.evaluation.front_x_over || ""} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="middle_x_over">Middle Crossover: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="middle_x_over" name="middle_x_over" type="number" step="0.01" min="0" value={this.state.evaluation.middle_x_over || ""} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="back_x_over">Back Crossover: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="back_x_over" name="back_x_over" type="number" step="0.01" min="0" value={this.state.evaluation.back_x_over || ""} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="closeout">Closeout: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="closeout" name="closeout" type="number" step="0.01" min="0" value={this.state.evaluation.closeout || ""} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="passing">Passing: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="passing" name="passing" type="number" step="0.01" min="0" value={this.state.evaluation.passing || ""} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="pivots">Pivots: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="pivots" name="pivots" type="number" step="0.01" min="0" value={this.state.evaluation.pivots || ""} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="rebound_outside_zone">Rebound Outside Zone: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="rebound_outside_zone" name="rebound_outside_zone" type="number" step="0.01" min="0" value={this.state.evaluation.rebound_outside_zone || ""} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="rebound_anticipation">Rebound Anticipation: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="rebound_anticipation" name="rebound_anticipation" type="number" step="0.01" min="0" value={this.state.evaluation.rebound_anticipation || ""} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="rebound_physicality">Rebound Physicality: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="rebound_physicality" name="rebound_physicality" type="number" step="0.01" min="0" value={this.state.evaluation.rebound_physicality || ""} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="talk">Talk: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="talk" name="talk" type="number" step="0.01" min="0" value={this.state.evaluation.talk || ""} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="moving_on_air_time">Moving On Air Time: </label>
                            <input onChange={(e) => this.updateVal(e.target)} id="moving_on_air_time" name="moving_on_air_time" type="number" step="0.01" min="0" value={this.state.evaluation.moving_on_air_time || ""} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="both_hands">Both Hands? </label>
                            <select onChange={(e) => this.updateVal(e.target)} id="both_hands" name="both_hands" value={this.state.evaluation.both_hands == null ? "" : this.state.evaluation.both_hands}>
                                <option value="">Unknown</option>
                                <option value="1">Yes</option>
                                <option value="0">No</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="has_post_moves">Has Post Moves: </label>
                            <select onChange={(e) => this.updateVal(e.target)} id="has_post_moves" name="has_post_moves" value={this.state.evaluation.has_post_moves == null ? "" : this.state.evaluation.has_post_moves}>
                                <option value="">Unknown</option>
                                <option value="1">Yes</option>
                                <option value="0">No</option>
                            </select>
                        </div>
                    </div>
                    <div className="evaluations-data notes">
                        <label htmlFor="notes">Notes: </label>
                        <textarea className="md-textarea" onChange={(e) => this.updateVal(e.target)} id="notes" name="notes" maxLength="500" value={this.state.evaluation.notes || ""}/>
                    </div>
                    <button type="submit" onClick={(e) => this.handleSubmit(e)} className="no-style button button-primary submit">Update Evaluation</button>
                </form>}
            </AnimateHeight>
        </div>
    )}
}

export default EvaluationsAccordion;