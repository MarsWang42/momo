import React, { Component } from 'react';
import EventListener from '../../helpers/eventListener';

export default class WelcomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height: 0,
    };
    this.updateSize = this.updateSize.bind(this);
    this.onResize = this.onResize.bind(this);
  }

  componentDidMount() {
    document.body.className = "red-gradient-background";
    const win = window;
    this.updateSize();
    this.eventResizeToken = EventListener.listen(
      win,
      'resize',
      this.onResize,
    );
  }

  onResize() {
    clearTimeout(this.updateTimer);
    this.updateTimer = setTimeout(this.updateSize, 16);
  }

  updateSize() {
    const w = window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth;

    const h = window.innerHeight
      || document.documentElement.clientHeight
      || document.body.clientHeight;

    this.setState({ height: h, width: w });
  }

  render() {
    return (
      <div className="welcome-container" style={{ height: this.state.height-100 }}>
        <h1>momo</h1>
        <h2>A JUICY TRELLO CLONE ON PHOENIX AND ANT DESIGN
          <a className="gh-btn" href="https://github.com/Marswang92/momo" target="_blank">
            <span className="gh-ico" />
          </a>
        </h2>
        <img className="welcome-logo-icon" src="/images/logo.svg" alt="" />
      </div>
    );
  }
}

