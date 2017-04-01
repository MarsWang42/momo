import React, { Component } from 'react';
import { Row, Card, Icon, Button, Alert } from 'antd';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      archivedTaskListVisible: false,
    }
    this.hideArchivedTaskList = this.hideArchivedTaskList.bind(this);
    this.showArchivedTaskList = this.showArchivedTaskList.bind(this);
  }

  hideArchivedTaskList() {
    this.setState({
      archivedTaskListVisible: false,
    });
  }

  showArchivedTaskList() {
    const { loadArchivedTasks, boardChannel } = this.props;
    loadArchivedTasks(boardChannel);
    this.setState({
      archivedTaskListVisible: true,
    });
  }

  render() {
    const {
      hideSidebar, archivedTasks, style,
    } = this.props;
    const { archivedTaskListVisible } = this.state;
    const cardStyle = {
      margin: "10px",
      width: "250px",
      display: "inline-block",
      verticalAlign: "top",
      backgroundColor: "#fbfbfb",
    };
    const bodyStyle = {
      padding: "12px 24px",
      fontSize: "11px",
      color: "#777777",
    };
    const dateToString = (date) => {
      const dateString = new Date(date);
      return ((dateString.getMonth() + 1) + '/' + dateString.getDate() + '/' +  dateString.getFullYear());
    };
    const archivedTaskList = () => {
      if (!archivedTasks || !archivedTasks.length) {
        return <Alert message="Currently no archived tasks." type="info" style={{ margin: "15px" }} />;
      } else {
        return archivedTasks.map(archivedTask => (
          <Card title={archivedTask.title} key={archivedTask.id} style={cardStyle} bodyStyle={bodyStyle}>
            <Row>In list: { archivedTask.list && archivedTask.list.title }</Row>
            <Row>Archived by: { `${archivedTask.user.first_name} ${archivedTask.user.last_name}` }</Row>
          </Card>
        ));
      }
    };
    return (
      <div className="sidebar-container" style={style} >
        <Row className="sidebar-title-row">
          <h1>Menu</h1>
          <span onClick={hideSidebar} className="sidebar-close-button">
            <Icon type="close" />
          </span>
        </Row>
        <ReactCSSTransitionGroup
          transitionName="sidebar-main-animation"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
        >
          {
            !archivedTaskListVisible &&
              <div className="sidebar-buttons">
                <Button className="archived-items-button" onClick={this.showArchivedTaskList}>
                  <i>Archived Items</i>
                </Button>
              </div>
          }
        </ReactCSSTransitionGroup>
        <ReactCSSTransitionGroup
          transitionName="sidebar-sub-animation"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
        >
          {
            archivedTaskListVisible &&
              <div className="archived-items-list">
                <div className="archived-items-list-back">
                  <Icon type="rollback" onClick={this.hideArchivedTaskList} />
                </div>
                { archivedTaskList() }
              </div>
          }
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}
