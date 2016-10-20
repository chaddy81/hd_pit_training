import React from 'react'
import { render } from 'react-dom'
import { Link, hashHistory } from 'react-router'

import NavSubItem from './nav-sub-item'

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

export default NavItem;
