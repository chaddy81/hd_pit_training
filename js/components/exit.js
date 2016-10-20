import React from 'react'
import { render } from 'react-dom'
import { hashHistory } from 'react-router'

let Exit = React.createClass({
  onOkClick: function() {
    this.exitAlert.style.display = 'none';
    hashHistory.push('/');
    objSCORM.setData(localStorage.getItem('alreadyFinishedVideos'));
    if(objSCORM.getScore() == 100) {
      objSCORM.setStatus('completed');
    } else {
      objSCORM.setStatus('incomplete');
    }
    objSCORM.endSession();
    objSCORM.exit();
  },

  onCancelClick: function() {
    this.exitAlert.style.display = 'none';
  },

  onExitClick: function() {
    let alreadyFinishedVideos = localStorage.getItem('alreadyFinishedVideos').split(',');
    alreadyFinishedVideos.splice(alreadyFinishedVideos.indexOf(null), 1);

    if(alreadyFinishedVideos.length == PAGES[0].sub.length) {
      hashHistory.push('/');
      if(objSCORM.getScore() == 100) {
        objSCORM.setStatus('completed');
      } else {
        objSCORM.setStatus('incomplete');
      }
      objSCORM.endSession();
      objSCORM.exit();
    } else {
      this.exitAlert.style.display = "block";
    }
  },

  componentDidMount: function() {
    this.exitAlert = document.getElementById('exit-alert');
    this.exitAlert.addEventListener('click', this.handleClick);
  },

  componentWillUnmount: function() {
    this.exitAlert.removeEventListener('click', this.handleClick);
    this.exit.removeEventListener('click', this.handleClick);
  },

  render: function() {
    return (
      <span>
        <a class="exit" onClick={this.onExitClick}>Exit</a>
        <div class="alert" id="exit-alert">
            <img src="images/alert.png" />
            <p>Are you sure you want to leave? If you leave now, your information may not be saved and you'll have to restart the course</p>
            <button class="ok" onClick={this.onOkClick}>Leave</button>
            <button class="cancel" onClick={this.onCancelClick}>Cancel</button>
        </div>
      </span>
    )
  }
});

const PAGES = [
{
  main: "Principles",
  sub: [
    {
      chapter: 1,
      title: "Principles of Lift Truck Safety",
      video: "Principles_1cc_test.mp4",
      track: "Principles_1cc_test.vtt"
    },

    {
      chapter: 2,
      title: "Protect the Work Area",
      video: "test_clip_2.mp4",
      track: ""
    },

    {
      chapter: 3,
      title: "Lift Truck Safety",
      video: "test_clip_3.mp4",
      track: ""
    },

    {
      chapter: 4,
      title: "Balance and Stability",
      video: "test_clip_4.mp4",
      track: ""
    }
  ]
}
]

export default Exit;
