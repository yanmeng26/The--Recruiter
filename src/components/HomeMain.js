import React, { Component } from "react";
import HomeForm from "./HomeForm";
import "font-awesome/css/font-awesome.min.css";

class HomeMain extends Component {
  render() {
    return (
      <main className="home-main container">
        <section>
          <div>
            <div className="services-top">
              <div>
                <span className="service-icon"><i className="fa fa-edit" /></span>
                <p className="service-title">Record</p>
                <p className="content-top">
                  High customizable templates for athlete related information.
                </p>
              </div>
              <div>
                <span className="service-icon"><i className="fa fa-share" /></span>
                <p className="service-title">Share</p>
                <p className="content-top">
                  Share data of candidates to assistants or the whole recruiting
                  team.
                </p>
              </div>
              <div>
                <span className="service-icon"><i className="fa fa-bar-chart" /></span>
                <p className="service-title">Trace</p>
                <p className="content-top">
                  Trace progress of individual athlete and recruiting funnel.
                </p>
              </div>
            </div>
          </div>
        </section>
        <div className="gallery">
          <div className="gallery-item-one" style={{
        backgroundImage: 'url(/assets/img/basketball-evening.jpg)'}}/>
          <div className="gallery-item-two">
            <h2 className="gallery-title">Our Mission</h2>
            <p className="mission">
              The Recruiter is a tool for coaches and team managers to store and manage the data on prospective recruits. The user will be able to use this app when they attend live sports events to efficiently take notes as they would otherwise do using pencil and paper. With this web app, the user will be able to view, add, edit, and delete information about athletes, coaches, and teams.
            </p>
          </div>
        </div>
        <div>
          <div className="works">How it Works</div>
          <div className="services">
            <div>
              <div className="service-one" style={{
        backgroundImage: 'url(/assets/img/img-03.jpg)'}}>
                <p className="service-icon" />
              </div>
              <div className="box">
                <h2>
                  {" "}
                  <i className="fa fa-unlock-alt" />
                  Security
                </h2>
                Prevent users outside of a given school and athletic program
                from seeing/interacting with other organizations' data.
              </div>
            </div>

            <div>
              <div className="service-two"style={{
        backgroundImage: 'url(/assets/img/img-02.jpg)'}}>
                <p className="service-icon"  />
              </div>
              <div>
                <h2>
                  {" "}
                  <i className="fa fa-address-book-o" />
                  Notes
                </h2>
                Evaluate athlete performance and find the best potential
                candidate. 
              </div>
            </div>

            <div>
              <div className="service-three" style={{
        backgroundImage: 'url(/assets/img/img-04.jpg)'}}>
                <p className="service-icon" />
              </div>
              <div>
                <h2>
                  {" "}
                  <i className="fa fa-folder-open" />
                  Reports
                </h2>
                View a graphical report in the recruiting dashboard of the progress of
                individual recruits.
              </div>
            </div>
          </div>
        </div>

        <section className="main-section">
          <h2>Contact Us</h2>
          <HomeForm />
        </section>
      </main>
    );
  }
}

export default HomeMain;
