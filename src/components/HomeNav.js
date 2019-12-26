import React, { Component } from "react";

class HomeNav extends Component {
  render() {
    return (
      <nav className="home-nav">
        <div className="container">
          <ul className = "home-ul nav-left">
            <li className="logo">R</li>
          </ul>
          <ul className = "home-ul nav-right">
            <li className = "home-li">
              <a href="/login#">Sign In</a>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default HomeNav;
