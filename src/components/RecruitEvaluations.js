import React, { Component } from "react";
import Accordion from './EvaluationsAccordion';

class RecruitEvaluations extends Component {
    constructor (props) {
        super(props);
        this.state = { 
            evaluations: [],
            componentLoaded: false
        };
    };
    // Retrieve recruit's evaluation data on component load
    componentDidMount() {
        fetch("/endpoints/evaluations.json?id=" + this.props.id)
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
                    evaluations: response.data.sort(this.sortByDate)
                });
            }
            this.setState({
                componentLoaded: true
            });
        });
    }
    sortByDate(a,b) {
        if (a.eval_date > b.eval_date)
            return -1;
        if (a.eval_date < b.eval_date)
            return 1;
        return 0;
    }
    render() {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let itemsRendered = this.state.evaluations.map((item) => {
            let date = new Date(item.eval_date);
            let formatteddate = months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
            return <Accordion data={item} formatteddate={formatteddate} key={"eval" + item.eval_id} />
        });
        return ( 
            <div>
                <div className="heading-with-button"><h2>Evaluations</h2><a className="button button-primary" href={"/recruits/" + this.props.id + "/add-evaluation"}>Add New <i style={{marginLeft: 5}} className="fa fa-plus" /></a></div>
                {this.state.evaluations.length > 0 && <div className="evaluations-list">
                    {itemsRendered}
                </div>}
                {this.state.evaluations.length < 1 && this.state.componentLoaded && <p>No evaluations found.</p>}
            </div>
        );
    }
}

export default RecruitEvaluations;