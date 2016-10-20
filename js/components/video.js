import React from 'react'
import { render } from 'react-dom'
import { hashHistory } from 'react-router'

let Video = React.createClass({
  handleVideoEnded: function() {
    let chapter = this.props.location.query.chapter.toString();
    let currentScore = localStorage.getItem('score') !== '' ? localStorage.getItem('score') : 0;

    if(localStorage.getItem('alreadyFinishedVideos')) {
      let alreadyFinishedVideos = localStorage.getItem('alreadyFinishedVideos').split(',');
      if (alreadyFinishedVideos.indexOf(chapter) == -1) {
        alreadyFinishedVideos.push(chapter);
        localStorage.setItem('score', parseInt(currentScore) + 25);
        localStorage.setItem('alreadyFinishedVideos', alreadyFinishedVideos.toString());
        if (alreadyFinishedVideos.length > 0) {
          alreadyFinishedVideos.splice(alreadyFinishedVideos.indexOf(null), 1);
        }
        objSCORM.setScore(alreadyFinishedVideos.length * 25);
      }
      if(alreadyFinishedVideos.length == 4) {
        this.alert.childNodes[1].innerText = "Congratulations! You have completed this module.";
        this.alert.childNodes[2].innerText = "OK";
        this.alert.childNodes[3].style.display = "none";
        this.alert.style.display = "block";
      } else {
        this.alert.style.display = "block";
      }
    }

    objSCORM.commit();
  },

  handleSeek: function(e) {
    let ct = this.video.currentTime;
    if (ct > this.curPos) {
      this.video.currentTime = this.curPos;
    }
  },

  onNextClick: function() {
    let alreadyFinishedVideos = localStorage.getItem('alreadyFinishedVideos').split(',');
    alreadyFinishedVideos.splice(alreadyFinishedVideos.indexOf(null), 1);

    if(alreadyFinishedVideos.length == PAGES[0].sub.length) {
      hashHistory.push('/');
    }

    if(PAGES[0].sub.length > this.props.location.query.chapter) {
      let section = PAGES[0].sub[this.props.location.query.chapter];
      let title = section.title;
      let video = section.video;
      let chapter = section.chapter;
      let track = section.track;

      hashHistory.push(`/video?chapter=${chapter}&title=${title}&video=${video}&track=${track}`);
      this.setState({
        chapter: chapter,
        title: title,
        video: video,
        track: track
      });
    } else {
      console.log("Thats it");
    }
    this.alert.style.display = 'none';
  },

  onMenuClick: function() {
    this.alert.style.display = 'none';
    hashHistory.push('/');
  },

  onOkClick: function() {
    this.changeAlert.style.display = 'none';
    // hashHistory.push(`/video?chapter=${this.props.location.query.chapter}&title=${this.props.location.query.title}&video=${this.props.location.query.video}&track=${this.props.location.query.track}`)
    this.setState({
      chapter: this.props.location.query.chapter,
      title: this.props.location.query.title,
      video: this.props.location.query.video,
      track: this.props.location.query.track
    });
  },
  onCancelClick: function() {
    this.changeAlert.style.display = 'none';
    this.video.play();
  },

  getPos: function() {
    this.curPos = this.video.currentTime;
  },

  componentDidMount: function() {
    localStorage.setItem('showInstructions', false);
    this.video = document.getElementById('video');
    this.video.addEventListener('ended', this.handleVideoEnded);
    this.video.addEventListener('seeking', this.handleSeek);

    this.timer = setInterval( this.getPos, 1000 );
    this.alert = document.getElementById('alert');
    this.changeAlert = document.getElementById('change-alert');

    this.setState({
      chapter: this.props.location.query.chapter,
      title: this.props.location.query.title,
      video: this.props.location.query.video,
      track: this.props.location.query.track
    });
  },

  componentWillUnmount: function() {
    this.video.removeEventListener('ended', this.handleVideoEnded);
    clearInterval(this.timer);
    this.timer = 0;
  },

  componentWillReceiveProps: function(nextProps) {
    if(localStorage.getItem('alreadyFinishedVideos')) {
      let alreadyFinishedVideos = localStorage.getItem('alreadyFinishedVideos');
      alreadyFinishedVideos = alreadyFinishedVideos.indexOf(',') > -1 ? alreadyFinishedVideos.split(',') : alreadyFinishedVideos;

      if(alreadyFinishedVideos.indexOf(this.props.location.query.chapter.toString()) < 0) {
        this.video.pause();
        this.changeAlert.style.display = 'block';
        return false;
      } else {
        console.log(nextProps);
        return true;
      }
    } else {
      return true;
    }
  },

  getInitialState: function() {
    return {chapter: '', title: '', video: '', track: ''};
  },

  render: function() {
    let videoLocation = `videos/${this.state.video}`;
    let trackLocation = `videos/${this.state.track}`;

    return (
      <div className="video-container">
        <h3>{this.state.chapter}. {this.state.title}</h3>
        <video src={videoLocation} autoPlay="true" controls="true" id="video">
          <track src={trackLocation} srcLang="en-us" label="English" default />
        </video>
        <div class="alert" id="alert">
            <img src="images/alert.png" />
            <p>Please click Next to go the next video or Menu to go back to the list of courses.</p>
            <button class="next" onClick={this.onNextClick}>Next</button>
            <button class="menu" onClick={this.onMenuClick}>Menu</button>
        </div>
        <div class="alert" id="change-alert">
            <img src="images/alert.png" />
            <p>Are you sure you want to leave? If you leave now, your information may not be saved.</p>
            <button class="ok" onClick={this.onOkClick}>Ok</button>
            <button class="cancel" onClick={this.onCancelClick}>Cancel</button>
        </div>
      </div>
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

export default Video;
