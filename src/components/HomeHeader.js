import React, { Component } from "react";
import HomeNav from "./HomeNav";


class HomeHeader extends Component {

  render() {
    return (
      <header style={{
        backgroundImage: 'url(/assets/img/img-05.jpg)'}} className = "home-header">
        <HomeNav />
        <div className="head" >
          <h1>The Recruiter</h1>
          <div>
            <p className="slogan">Let's Find Athletes Together</p>
            <div>
              <a className="contact" href="#">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default HomeHeader;
