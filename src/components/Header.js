import React, { Component } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { slide as Menu } from 'react-burger-menu'
import "../css/header.css";

class Header extends Component {
  render() {
    return (
      <div>
          <div className="mobile-only main-mobile-nav header-logo"><a className="logo" href="/">R</a></div>
          <Menu noOverlay right>
            <div className="main-nav">
              <div className="container">
                <ul className="main-nav-items">
                    <li className="desktop-only"><a className="logo" href="/">R</a></li>
                    <li>
                        <Link to={"/dashboard"} className="nav-link">
                        {" "}
                        Dashboard{" "}
                        </Link>
                    </li>
                    <li>
                        <Link to={"/recruits"} className="nav-link">
                        Recruits
                        </Link>
                    </li>
                    <li>
                        <Link to={"/coaches"} className="nav-link">
                        Coaches
                        </Link>
                    </li>
                    <li>
                        <Link to={"/teams"} className="nav-link">
                        Teams
                        </Link>
                    </li>
                    <li className="far-right">
                        <a className="nav-link log-out" href="/logout">Log Out<span className="mobile-only"> →</span></a>
                    </li>
                </ul>
              </div>
            </div>
          </Menu>
        
      </div>
    );
  }
}

export default Header;
