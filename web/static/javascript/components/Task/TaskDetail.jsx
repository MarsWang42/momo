import React, { Component } from 'react';
import { Spin, Row, Col, Icon, Button, Input, Alert } from 'antd';

export default class TaskDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditingTitle: false,
      isEditingDescrition: false,
      taskTitle: props.task && props.task.title,
      taskDescription: props.task && props.task.description,
    };
    this.showEditDescriptionForm = this.showEditDescriptionForm.bind(this);
    this.hideEditDescriptionForm = this.hideEditDescriptionForm.bind(this);
    this.updateTaskDescription = this.updateTaskDescription.bind(this);
    this.showEditTitleForm = this.showEditTitleForm.bind(this);
    this.hideEditTitleForm = this.hideEditTitleForm.bind(this);
    this.updateTaskTitle = this.updateTaskTitle.bind(this);
    this.onTitleFormKeydown = this.onTitleFormKeydown.bind(this);
  }

  componentDidMount() {
    this.props.setCurrentTask(this.props.task);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.taskDetail && nextProps.taskDetail.description !== this.state.taskDescription) {
      this.setState({
        taskDescription: nextProps.taskDetail.description,
      });
    }
  }

  updateTaskDescription(e) {
    this.setState({
      taskDescription: e.target.value,
    });
  }

  updateTaskTitle(e) {
    this.setState({
      taskTitle: e.target.value,
    });
  }

  onTitleFormKeydown(e) {
    const keyCode = e.keyCode || e.which;
    if (keyCode === 27 || keyCode === 13) {
      this.hideEditTitleForm();
    }
  }

  showEditTitleForm() {
    this.setState({
      isEditingTitle: true,
    });
  }

  hideEditTitleForm() {
    const { updateTask, taskDetail, boardChannel } = this.props;
    updateTask({
      title: this.state.taskTitle,
      description: taskDetail.description,
      id: taskDetail.id,
    }, boardChannel);
    this.setState({
      isEditingTitle: false,
    });
  }

  showEditDescriptionForm() {
    this.setState({
      isEditingDescrition: true,
    });
  }

  hideEditDescriptionForm() {
    const { updateTask, taskDetail, boardChannel } = this.props;
    updateTask({
      title: taskDetail.title,
      description: this.state.taskDescription,
      id: taskDetail.id,
    }, boardChannel);
    this.setState({
      isEditingDescrition: false,
    });
  }

  render() {
    const {
      taskDetail, updatingError, boardChannel,
      archiveTask, boardId, hideTaskDetailModal,
    } = this.props;
    const { isEditingDescrition, taskDescription, isEditingTitle, taskTitle } = this.state;

    const onArchive = () => {
      hideTaskDetailModal();
      archiveTask(taskDetail.id, boardChannel);
    };

    return (
      <div>
        <div>
          <Row>
            <div className="task-detail-row title-container">
              <Icon type="bars" /> &nbsp;Title:
              { !isEditingTitle && (
                <span className="task-title-text" onClick={this.showEditTitleForm}>
                  { taskTitle }
                </span>
              )}
              { isEditingTitle && (
                <Input
                  className="task-title-form"
                  value={taskTitle}
                  onChange={this.updateTaskTitle}
                  onBlur={this.hideEditTitleForm}
                  onKeyDown={this.onTitleFormKeydown}
                  autoFocus
                />
              )}
            </div>
            <Col className="task-detail-container" sm={16}>
              { updatingError && <Alert message="Updating task error." type="error" />}
              <div className="task-detail-row">
                <Icon type="edit" /> Description:
              </div>
              <div className="task-detail-row description-container">
                { !isEditingDescrition && (
                  <div className="description-text" onClick={this.showEditDescriptionForm}>
                    { taskDescription }
                  </div>
                )}
                { isEditingDescrition && (
                  <Input.Search
                    className="description-form"
                    type="textarea"
                    value={taskDescription}
                    onChange={this.updateTaskDescription}
                    onBlur={this.hideEditDescriptionForm}
                    onSearch={this.hideEditDescriptionForm}
                    autoFocus
                    rows={4}
                  />
                )}
              </div>
              <div className="task-detail-row">
                <Icon type="user" /> Created By: { taskDetail &&
                  `${taskDetail.user.first_name} ${taskDetail.user.last_name}` }
              </div>
            </Col>
            <Col sm={8} className="task-action-container">
              <Row><h2><Icon type="switcher" /> Actions</h2></Row>
              <Row className="action-button">
                <Button type="primary" onClick={onArchive}>
                  <Icon type="folder" /> Archive
                </Button>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
