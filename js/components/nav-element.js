import React from 'react'
import { render } from 'react-dom'

import NavItem from './nav-item'

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

export default NavElement;
