import React, { Component } from 'react';
import { Card, Row, Button, Alert, Icon, Dropdown, Input } from 'antd';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import NewTaskForm from '../Task/NewTaskForm';

export default class ListCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      newTaskDropdownVisible: false,
      listTitle: props.list && props.list.title,
    };
    this.handleNewTaskDropdownChange = this.handleNewTaskDropdownChange.bind(this);
    this.hideNewTaskDropdown = this.hideNewTaskDropdown.bind(this);
    this.showEditForm = this.showEditForm.bind(this);
    this.hideEditForm = this.hideEditForm.bind(this);
    this.updateListTitle = this.updateListTitle.bind(this);
    this.onTitleFormKeydown = this.onTitleFormKeydown.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.list && nextProps.list.title !== this.state.listTitle) {
      this.setState({
        listTitle: nextProps.list.title,
      });
    }
  }

  onTitleFormKeydown(e) {
    const keyCode = e.keyCode || e.which;
    if (keyCode === 27 || keyCode === 13) {
      this.hideEditForm();
    }
  }

  hideNewTaskDropdown() {
    this.setState({ newTaskDropdownVisible: false });
  }

  handleNewTaskDropdownChange(flag) {
    this.setState({ newTaskDropdownVisible: flag });
  }

  updateListTitle(e) {
    this.setState({
      listTitle: e.target.value,
    });
  }

  showEditForm() {
    this.setState({
      isEditing: true,
    });
  }

  hideEditForm() {
    const { updateList, list, boardChannel } = this.props;
    updateList({
      title: this.state.listTitle,
      id: list.id,
    }, boardChannel);
    this.setState({
      isEditing: false,
    });
  }

  render() {
    const {
      list, createTask, boardChannel, hideSidebar,
      isCreatingTask, creatingTaskError, showTaskDetailModal,
      updatingError, extra,
    } = this.props;
    const { isEditing, listTitle } = this.state;
    const onClickTask = (task) => {
      hideSidebar();
      showTaskDetailModal(task);
    };
    const bodyStyle = {
      padding: "12px 24px",
      fontSize: "11px",
      color: "#777777",
    };
    const taskList = list.tasks ? list.tasks.map(task => (
      <Row key={task.id}>
        <Button className="task-button" onClick={() => onClickTask(task)}>
          { task.title }
          { task.description ? <Icon type="file-text" /> : "" }
        </Button>
      </Row>
      ),
    ) : [];
    const newTaskForm = (
      <NewTaskForm
        onFormSubmit={createTask}
        listId={list.id}
        boardChannel={boardChannel}
        hideDropdown={this.hideNewTaskDropdown}
        isCreating={isCreatingTask}
        creatingError={creatingTaskError}
      />
    );
    taskList.push(
      <Row key="createTask">
        <Dropdown
          overlay={newTaskForm}
          trigger={['click']}
          onVisibleChange={this.handleNewTaskDropdownChange}
          visible={this.state.newTaskDropdownVisible}
        >
          <Button key="createTask" className="create-task-button" type="primary">
            <Icon type="plus" />Add a Task
          </Button>
        </Dropdown>
      </Row>,
    );
    const cardTitle= (
      <div className="list-card-title">
        <Icon type="bars" />
        { !isEditing && (
          <span className="list-card-title-text" onClick={this.showEditForm}>{ listTitle }</span>
        )}
        { isEditing && (
          <Input
            className="list-card-title-form"
            value={listTitle}
            onChange={this.updateListTitle}
            onBlur={this.hideEditForm}
            onKeyDown={this.onTitleFormKeydown}
            autoFocus
          />
        )}
      </div>
    );
    return (
      <Card className="list-card" title={cardTitle} bodyStyle={bodyStyle} extra={extra}>
        { updatingError && <Alert message="Updating list error." type="error" />}
        <ReactCSSTransitionGroup
          transitionName="task-list"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
        >
          { taskList }
        </ReactCSSTransitionGroup>
      </Card>
    );
  }
}
