import React from 'react'
import { render } from 'react-dom'
import { Router, Route, Link, hashHistory } from 'react-router'

let NavSubItem = React.createClass({
  render: function() {
            let chapter = this.props.sub.chapter;
            let title = this.props.sub.title;
            let video = this.props.sub.video;
            let icon = "images/unseen.png";

            if(localStorage.getItem('alreadyFinishedVideos')) {
              let alreadyFinishedVideos = localStorage.getItem('alreadyFinishedVideos').split(',');

              if (alreadyFinishedVideos.indexOf(chapter.toString()) !== -1) {
                icon = "images/seen.png";
              }
            }

            return (
              <li><Link className="section-link" to={{ pathname: "/video", query: { chapter: chapter, title: title, video: video } }}>{this.props.sub.title} <img src={icon} /></Link></li>
            )
          }
});

let NavItem = React.createClass({
  handleClick: function(e) {
    if(e.target.className == 'inactive') {
      e.target.className = 'active';
    } else if(e.target.className == 'active') {
      e.target.className = 'inactive';
    }

    if(e.target.className != 'inactive' && e.target.className != 'active') {
      let navElements = document.getElementsByClassName('active');
      for(let i = 0; i < navElements.length; i++) {
        navElements[i].className = 'inactive';
      }
    }
  },

  componentDidMount: function() {
    document.addEventListener('click', this.handleClick);
  },

  componentWillUnmount: function() {
    document.removeEventListener('click', this.handleClick);
  },

  render: function() {
            let subs = [];
            this.props.page.sub.forEach(function(sub) {
              subs.push(<NavSubItem sub={sub} key={sub.title} />);
            });
            return (
              <li><a className="inactive">{this.props.page.main}</a>
                <ul className="sub-nav">
                  {subs}
                </ul>
              </li>
            )
          }
});

let NavElement = React.createClass({
  render: function() {
            let nav = [];
            this.props.pages.forEach(function(page) {
              nav.push(<NavItem page={page} key={page.main} />);
            });
            return (
              <ul>
                {nav}
              </ul>
            );
          }
});

let NavContainer = React.createClass({
  render: function() {
            return (
              <header id="header">
                <div className="container">
                  <Link to="/" className="logo">Home</Link>
                  <nav><NavElement pages={this.props.pages} /></nav>
                  <Exit />
                </div>
              </header>
              );
          }
});

let Exit = React.createClass({
  handleClick: function(e) {
    document.getElementById('alert').style.display = 'none';

    if(e.target.className == 'ok') {
      document.getElementById('exit-alert').style.display = 'none';
      hashHistory.push('/');
      objSCORM.endSession();
    } else if(e.target.className == 'cancel') {
      document.getElementById('exit-alert').style.display = 'none';
    } else {
      document.getElementById('exit-alert').style.display = 'block';
    }
  },

  componentDidMount: function() {
    let alert = document.getElementById('exit-alert');
    let exit = document.getElementsByClassName('exit')[0];
    alert.addEventListener('click', this.handleClick);
    exit.addEventListener('click', this.handleClick);
  },

  componentWillUnmount: function() {
    let alert = document.getElementById('exit-alert');
    let exit = document.getElementsByClassName('exit')[0];
    alert.removeEventListener('click', this.handleClick);
    exit.removeEventListener('click', this.handleClick);
  },

  render: function() {
    return (
      <span>
        <a class="exit">Exit</a>
        <div class="alert" id="exit-alert">
            <img src="images/alert.png" />
            <p>Are you sure you want to leave? If you leave now, your information may not be saved and you'll have to restart the course</p>
            <button class="ok">Leave</button>
            <button class="cancel">Cancel</button>
        </div>
      </span>
    )
  }
});

let Video = React.createClass({
  handleVideoEnded: function() {
      document.getElementById('alert').style.display = 'block';
      let chapter = this.props.location.query.chapter.toString();

      if(localStorage.getItem('alreadyFinishedVideos')) {
        let alreadyFinishedVideos = localStorage.getItem('alreadyFinishedVideos').split(',');
        if (alreadyFinishedVideos.indexOf(chapter) == -1) {
          alreadyFinishedVideos.push(chapter);
          localStorage.setItem('score', alreadyFinishedVideos.length * 10);
          localStorage.setItem('alreadyFinishedVideos', alreadyFinishedVideos.toString());
          objSCORM.setScore(alreadyFinishedVideos.length * 10);
        }
      } else {
        let alreadyFinishedVideos = chapter;
        localStorage.setItem('score', 10);
        localStorage.setItem('alreadyFinishedVideos', alreadyFinishedVideos);
        objSCORM.setScore(10);
      }

      objSCORM.commit();
  },

  handleClick: function(e) {
    if(e.target.className == 'next') {
      if(PAGES[0].sub.length > this.props.location.query.chapter) {
        let section = PAGES[0].sub[this.props.location.query.chapter];
        let title = section.title;
        let video = section.video;
        let chapter = section.chapter;

        hashHistory.push(`/video?chapter=${chapter}&video=${video}&title=${title}`);
      } else {
        console.log("Thats it");
      }
      document.getElementById('alert').style.display = 'none';
    }

    if(e.target.className == 'menu') {
      document.getElementById('alert').style.display = 'none';
      hashHistory.push('/');
    }
  },

  handleSeek: function(e) {
    let video = document.getElementById('video');
    let ct = video.currentTime;
    if (ct > this.curPos) {
      video.currentTime = this.curPos;
    }
  },

  onOkClick: function() {
    hashHistory.push(`/video${this.props.location.search}`);
    document.getElementById('change-alert').style.display = 'none';
    this.forceUpdate();
  },
  onCancelClick: function() {
    document.getElementById('change-alert').style.display = 'none';
    document.getElementById('video').play();
  },

  getPos: function() {
    let video = document.getElementById('video');
    this.curPos = video.currentTime;
  },

  componentDidMount: function() {
    let video = document.getElementById('video');
    video.addEventListener('ended', this.handleVideoEnded);
    video.addEventListener('seeking', this.handleSeek);
    document.addEventListener('click', this.handleClick);

    this.timer = setInterval( this.getPos, 1000 );
  },

  componentWillUnmount: function() {
    let video = document.getElementById('video');
    video.removeEventListener('ended', this.handleVideoEnded);
    document.removeEventListener('click', this.handleClick);
    clearInterval(this.timer);
    this.time = 0;
  },

  shouldComponentUpdate: function() {
    if(localStorage.getItem('alreadyFinishedVideos') || localStorage.getItem('alreadyFinishedVideos') === null) {
      let alreadyFinishedVideos = localStorage.getItem('alreadyFinishedVideos');

      alreadyFinishedVideos = alreadyFinishedVideos.indexOf(',') > -1 ? alreadyFinishedVideos.split(',') : alreadyFinishedVideos;

      console.log(alreadyFinishedVideos.indexOf(this.props.location.query.chapter.toString()));

      if(alreadyFinishedVideos.indexOf(this.props.location.query.chapter.toString()) < 0) {
        document.getElementById('video').pause();
        document.getElementById('change-alert').style.display = 'block';
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  },

  render: function() {
    let chapter = this.props.location.query.chapter;
    let title = this.props.location.query.title;
    let video = this.props.location.query.video;
    let videoLocation = "videos/" + video;

    localStorage.setItem('title', title);
    localStorage.setItem('video', video);
    localStorage.setItem('chapter', chapter);

    return (
      <div className="video-container">
        <h3>{chapter}. {title}</h3>
        <video src={videoLocation} autoPlay="true" controls="true" id="video"></video>
        <div class="alert" id="alert">
            <img src="images/alert.png" />
            <p>Please click Next to go the next video or Menu to go back to the list of courses.</p>
            <button class="next">Next</button>
            <button class="menu">Menu</button>
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

let App = React.createClass({
  componentDidMount: function() {
    if(localStorage.getItem('alreadyFinishedVideos')) {
      let alreadyFinishedVideos = localStorage.getItem('alreadyFinishedVideos').split(',');
      if (alreadyFinishedVideos.length < 4) {
        objSCORM.setStatus('Not Evaluated');
      }
    } else {
      localStorage.setItem('alreadyFinishedVideos', null);
    }
  },

  render: function() {
    return (<div>
              <NavContainer pages={PAGES} />
              {this.props.children}
            </div>)
  }
})

const PAGES = [
{
  main: "Principles",
    sub: [
    {
      chapter: 1,
      title: "Principles of Lift Truck Safety",
      video: "test_clip_1.mp4"
    },

    {
      chapter: 2,
      title: "Protect the Work Area",
      video: "test_clip_2.mp4"
    },

    {
      chapter: 3,
      title: "Lift Truck Safety",
      video: "test_clip_3.mp4"
    },

    {
      chapter: 4,
      title: "Balance and Stability",
      video: "test_clip_4.mp4"
    }
  ]
}
]

const container = document.getElementById('main-content');
const header = document.getElementById('header');

render((
    <Router history={hashHistory}>
      <Route path="/" component={App}>
        <Route path="/video" component={Video} />
      </Route>
    </Router>),
    container);
