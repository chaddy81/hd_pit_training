import React from 'react'
import { render } from 'react-dom'
import { Router, Route, Link, hashHistory } from 'react-router'

import NavContainer from './components/nav-container'
import Video from './components/video'
import Instructions from './components/instructions'

let App = React.createClass({
  componentWillMount: function() {
    localStorage.clear();
  },

  componentDidMount: function() {
    localStorage.clear();

    if (objSCORM.getData()) {
      localStorage.setItem('alreadyFinishedVideos', objSCORM.getData());
    } else {
      localStorage.setItem('alreadyFinishedVideos', null);
      objSCORM.setStatus('Not Evaluated');
      objSCORM.commit();
    }

    localStorage.setItem('score', objSCORM.getScore());
  },
  componentWillUnmount: function() {
    localStorage.clear();
  },

  render: function() {
    return (<div>
              <NavContainer pages={PAGES} />
              {this.props.children}
              <Instructions />
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

const container = document.getElementById('main-content');
const header = document.getElementById('header');

render((
    <Router history={hashHistory}>
      <Route path="/" component={App}>
        <Route path="/video" component={Video} />
      </Route>
    </Router>),
    container);
