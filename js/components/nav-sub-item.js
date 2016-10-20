import React from 'react'
import { render } from 'react-dom'
import { Link, hashHistory } from 'react-router'

let NavSubItem = React.createClass({
  render: function() {
            let chapter = this.props.sub.chapter;
            let title = this.props.sub.title;
            let video = this.props.sub.video;
            let track = this.props.sub.track;
            let icon = "images/unseen.png";

            if(localStorage.getItem('alreadyFinishedVideos')) {
              let alreadyFinishedVideos = localStorage.getItem('alreadyFinishedVideos').split(',');

              if (chapter && alreadyFinishedVideos.indexOf(chapter.toString()) != -1) {
                icon = "images/seen.png";
              }
            }

            return (
              <li><Link className="section-link" to={{ pathname: "/video", query: { chapter: chapter, title: title, video: video, track: track } }}>{this.props.sub.title} <img src={icon} /></Link></li>
            )
          }
});

export default NavSubItem;
