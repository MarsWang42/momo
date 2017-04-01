import React, { Component, PropTypes } from 'react';
import { Modal, Button, Dropdown, Menu, Icon, Affix, Input, Collapse } from 'antd';
import { browserHistory } from 'react-router';
import SignInForm from './User/SignInForm';
import SignUpForm from './User/SignUpForm';
import NewBoardForm from './Board/NewBoardForm';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const Panel = Collapse.Panel;

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signInVisible: false,
      signUpVisible: false,
      boardVisible: false,
    };
    this.showSignInModal = this.showSignInModal.bind(this);
    this.showSignUpModal = this.showSignUpModal.bind(this);
    this.hideSignInModal = this.hideSignInModal.bind(this);
    this.hideSignUpModal = this.hideSignUpModal.bind(this);
    this.hideBoardModal = this.hideBoardModal.bind(this);
    this.showBoardModal = this.showBoardModal.bind(this);
  }

  showSignInModal() {
    this.setState({
      signInVisible: true,
      signUpVisible: false,
    });
  }

  showSignUpModal() {
    this.setState({
      signUpVisible: true,
      signInVisible: false,
    });
  }

  hideSignUpModal(e) {
    this.setState({
      signUpVisible: false,
    });
  }

  hideSignInModal(e) {
    this.setState({
      signInVisible: false,
    });
  }

  showBoardModal() {
    this.setState({
      boardVisible: true,
    });
  }

  hideBoardModal() {
    this.setState({
      boardVisible: false,
    });
  }

  render() {
    const {
      user: {
        isSignedIn,
        currentUser,
        loginPath,
        csrfToken,
        signInError,
        signUpError,
      },
      logoutUser,
      loginUser,
      registerUser,
      createBoard,
    } = this.props;

    return (
      <Affix>
        <Menu
          onClick={this.handleClick}
          selectedKeys={[this.state.current]}
          mode="horizontal"
          className="navbar"
        >
          <Menu.Item key="logo">
            <a
              onClick={() => browserHistory.push('/')}
              className="navbar-logo" rel="noopener noreferrer"
            >
              <img className="navbar-logo-icon" src="/images/logo.svg" alt=""></img>
              <h2>momo</h2>
            </a>
          </Menu.Item>
          { !isSignedIn &&
            <Menu.Item key="signup" className="float-right">
              <a onClick={this.showSignUpModal} rel="noopener noreferrer">
                Sign up
              </a>
              <Modal
                title="Register Now!" visible={this.state.signUpVisible && !isSignedIn}
                onCancel={this.hideSignUpModal} footer={null}
              >
                <SignUpForm
                  onFormSubmit={registerUser}
                  signUpError={signUpError}
                  csrfToken={csrfToken}
                  hideSignUpModal={this.hideSignUpModal}
                />
              </Modal>
            </Menu.Item>
          }
          { !isSignedIn &&
            <Menu.Item key="signin" className="float-right">
              <a onClick={this.showSignInModal} rel="noopener noreferrer">
                Sign in
              </a>
              <Modal
                title="Sign In" visible={this.state.signInVisible && !isSignedIn}
                onCancel={this.hideSignInModal} footer={null}
              >
                <SignInForm
                  onFormSubmit={loginUser}
                  csrfToken={csrfToken}
                  signInError={signInError}
                  hideSignInModal={this.hideSignInModal}
                  showSignUpModal={this.showSignUpModal}
                />
              </Modal>
            </Menu.Item>
          }
          { isSignedIn &&
            <SubMenu
              title={<span><Icon type="setting" />{currentUser && currentUser.firstName}</span>}
              className="float-right"
            >
              <Menu.Item key="setting">
                <a href="/">Settings</a>
              </Menu.Item>
              <Menu.Item key="logout">
                <a onClick={() => logoutUser(csrfToken)}>Logout</a>
              </Menu.Item>
            </SubMenu>
          }
          { isSignedIn &&
            <Menu.Item key="board" className="float-right">
              <a onClick={this.showBoardModal}>
                <Icon type="plus-square-o" />Create a Board
              </a>
              <Modal
                title="Create Board" visible={this.state.boardVisible && isSignedIn}
                onCancel={this.hideBoardModal} footer={null}
              >
                <NewBoardForm onFormSubmit={createBoard} hideBoardModal={this.hideBoardModal} />
              </Modal>
            </Menu.Item>
          }
        </Menu>
      </Affix>
    );
  }
}

Navbar.propTypes = {
  user: PropTypes.object.isRequired,
};

export default Navbar;
