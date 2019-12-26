import React, { Component } from "react";
import "font-awesome/css/font-awesome.min.css";

class HomeFooter extends Component {
  render() {
    return (
      <footer className = "home-footer">
        <div className="container footer-grid">
          <h3><a href="/">The Recruiter</a></h3>
          <p>
            <a href="mailto:recruiter@oregonstate.edu">recruiter@oregonstate.edu</a>
          </p>
          <ul>
            <li>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                <i className="fa fa-facebook" /> <span className="off-screen">Facebook</span>
              </a>
            </li>
            <li>
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                <i className="fa fa-twitter" /> <span className="off-screen">Twitter</span>
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                <i className="fa fa-instagram" /> <span className="off-screen">Instagram</span>
              </a>
            </li>
          </ul>
        </div>
      </footer>
    );
  }
}

export default HomeFooter;
