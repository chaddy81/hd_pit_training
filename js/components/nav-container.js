import React from 'react'
import { render } from 'react-dom'
import { Link, hashHistory } from 'react-router'

import NavElement from './nav-element'
import Exit from './exit'

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

export default NavContainer;
