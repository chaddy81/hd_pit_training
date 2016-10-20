import React from 'react'
import { render } from 'react-dom'

let Instructions = React.createClass({
  onOkClick: function() {
    document.getElementsByClassName('instructions')[0].style.display = "none";
  },

  componentDidMount: function() {
    if(localStorage.getItem('showInstructions') !== null) {
      document.getElementsByClassName('instructions')[0].style.display = "none";
    }
  },

  render: function() {
    return (
      <div class="alert instructions">
        <p>Start by selecting a video from the above dropdown</p>
        <button class="ok" onClick={this.onOkClick}>Ok</button>
      </div>
    )
  }
});

export default Instructions;
