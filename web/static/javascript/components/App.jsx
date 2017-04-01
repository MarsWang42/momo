import React, { Component } from 'react';
import WelcomePage from './Tools/WelcomePage'
import Navbar from '../containers/NavbarContainer';

export default class App extends Component {
  componentDidMount() {
    document.body.className = "body-background";
    this.props.getCurrentUser();
  }

  render() {
    const { isSignedIn, isCheckedUser } = this.props;
    return (
      <div>
        { isCheckedUser && <Navbar /> }
        { isCheckedUser && !isSignedIn && <WelcomePage /> }
        { isCheckedUser && isSignedIn && this.props.children }
      </div>
    );
  }
}
