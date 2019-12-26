import React, { Component } from "react";
import "../css/Home.css";
import HomeHeader from "./HomeHeader";
import HomeMain from "./HomeMain";

class Home extends Component {
  render() {
    return (
      <div className="home-container">
        <HomeHeader />
        <HomeMain />
      </div>
    );
  }
}

export default Home;
