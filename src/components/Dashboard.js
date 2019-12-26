import React, { Component } from "react";
import "../css/Dashboard.css";
import Header from "./Header";
import {HorizontalBar} from 'react-chartjs-2';




class Dashboard extends Component {
  constructor() {
    super();

    this.state = {
      list:[],
      warmcount:"",
      hotcount:"",
      coldcount:"",
      lukewarmcount:""
      
    };
    
  }
  
   
  componentDidMount() {
    this.getFunnels();
  }

  // Retrieve all team data
  getFunnels() {
    fetch("/endpoints/recruits.json")
    .then(response => {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) 
        return response.json() 
      else
        return {data:[]}
    })
    .then(response => {
      this.setState({
        list: response.data
      });
      let _count=0, warm,cold, hot, lukewarm;
    warm = this.state.list.filter(item => item.funnelstatus === 'Warm');
    _count = warm.length;
   this.setState({warmcount: _count});
   console.log(this.state.warmcount);

   cold = this.state.list.filter(item => item.funnelstatus === 'Cold');
    _count = cold.length;
   this.setState({coldcount: _count});
   console.log(this.state.coldcount);


   hot = this.state.list.filter(item => item.funnelstatus === 'Hot');
   _count = hot.length;
  this.setState({hotcount: _count});
  console.log(this.state.hotcount);

  lukewarm = this.state.list.filter(item => item.funnelstatus === 'Lukewarm');
  _count = lukewarm.length;
 this.setState({lukewarmcount: _count});
 console.log(this.state.lukewarmcount);



    });
  }

  



  render() {
  
    let data = {
      labels: ['Hot  ', 'Warm  ', 'LukeWarm  ', 'Cold  '],
      datasets: [
        {
          label: 'Number of recruits',
          backgroundColor: 'navy',
          borderColor: 'navy',
          borderWidth: 2,
          hoverBackgroundColor: 'yellow',
          hoverBorderColor: 'navy',
          data: [this.state.hotcount, this.state.warmcount,  this.state.lukewarmcount,this.state.coldcount]
        }
      ]
    };
    


    const options = {
      maintainAspectRatio: false,
      scales: {
        yAxes: [{
          ticks: {
            fontSize: 12,
            fontFamily: 'lato',
            fontColor: 'black'
            
          },
          beginAtZero: true,
          gridLines: {
            drawTicks: false,
          },
        }],
    
        xAxes: [{
          ticks: {
            beginAtZero: true,
            fontSize: 12,
            fontFamily: 'lato',
            fontColor: 'black',
  
            
          },
          gridLines: {
            tickMarkLength: 40,
            offsetGridLines: true,
            display: true,
            drawTicks: false,
            drawOnChartArea: false,
          },
    
        }]
      },
    };


    return (
      <div>
         <Header/>
         
         <section className="dashboard-container">
         <div className = "dashboard-calendar">
           <label>Year</label> 
         <div className = "dashboard-year">2018/2019</div>
         </div>
        <div className="dashboard-section">
            <div>
            <div className="dashboard-title">
                Commits
              </div>
              <div className="dashboard-section-one">
                7
              </div>
             
            </div>

            <div>
            <div className="dashboard-title">
                Offers
              </div>
              <div className="dashboard-section-two">
                8
              </div>
             
            </div>

            <div className = "funnel">
            <div className="dashboard-title">
                Recruiting Funnel
              </div>
              <div className="dashboard-section-three">
        
              <HorizontalBar data={data} options={options} width={120}
  height={150}/> 
              </div>
              </div>
             
            </div>


          <div className="dashboard-section">
            <div>
            <div className="dashboard-title">
                Available
              </div>
              <div className="dashboard-section-four">
                <div className = "item-one"> Scholarship</div>
                <div className = "item-two">Budget</div>
                
              </div>
             
            </div>

            <div>
            <div className="dashboard-title">
                Offered
              </div>
              <div className="dashboard-section-five">
              <div className = "item-one"> Scholarship</div>
                <div className = "item-two">Budget</div>
                
              </div>
             
            </div>

            <div>
            <div className="dashboard-title">
                Task
              </div>
              <div className="dashboard-section-six">
                6/6 Call Joe
              </div>
             
            </div>
          </div>
          </section>
          </div>
     
    )
  }
}

export default Dashboard;
