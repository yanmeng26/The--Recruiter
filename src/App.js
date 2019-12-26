import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import Dashboard from "./components/Dashboard";
import RecruitsListing from "./components/RecruitsListing";
import RecruitEdit from "./components/RecruitEdit";
import RecruitInfo from "./components/RecruitInfo";
import EvaluationAdd from "./components/EvaluationAdd";
import CallAdd from "./components/CallAdd";
import CoachListing from "./components/CoachListing";
import CoachInfo from "./components/CoachInfo";
import CoachEdit from "./components/CoachEdit";
import TeamAdd from "./components/TeamAdd";
import TeamListing from "./components/TeamListing";
import TeamInfo from "./components/TeamInfo";
import TeamEdit from "./components/TeamEdit";
import AthleteAdd from "./components/AthleteAdd";
import CoachAdd from "./components/CoachAdd";
//import ClubAdd from "./components/ClubAdd";
//import SchoolAdd from "./components/SchoolAdd";
import Home from "./components/Home";
import HomeFooter from "./components/HomeFooter";
import "./css/App.css";

class App extends Component {
  render() {
    return (
      <Router>
        <div>
            <Switch>
              <Route exact path="/dashboard" component={Dashboard} />
              <Route path={`/recruits/:id/edit`} exact component={RecruitEdit} />
              <Route path={`/recruits/:id/add-call`} exact component={CallAdd} />
              <Route path={`/recruits/:id/add-evaluation`} exact component={EvaluationAdd} />
              <Route path={`/recruits/:id`} exact component={RecruitInfo} />
              <Route path="/recruits" exact component={RecruitsListing} />
              <Route path="/add-recruit" exact component={AthleteAdd} />
              <Route path="/coaches/:id/edit" exact component={CoachEdit} />
              <Route path="/coaches/:id" exact component={CoachInfo} />
              <Route path="/coaches" exact component={CoachListing} />
              <Route path="/add-coach" exact component={CoachAdd} />
              <Route path="/add-team" exact component={TeamAdd} />
              <Route path="/teams/:id/edit" exact component={TeamEdit} />
              <Route path="/teams/:id" exact component={TeamInfo} />
              <Route path="/teams" exact component={TeamListing} />
              <Route path="/" exact component={Home} />
              <Route component={() => <Redirect to="/"/>} />
            </Switch>
        </div>
        <HomeFooter />
      </Router>
    );
  }
}

export default App;