import React, { Component } from 'react';
import { Card, Icon, Dropdown, Tooltip, Modal, Button, Alert, message } from 'antd';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import ReactGravatar from 'react-gravatar';
import ListCard from '../List/ListCard';
import NewListForm from '../List/NewListForm';
import TaskDetail from '../../containers/TaskDetailContainer';
import Spinner from '../Tools/Spinner';
import Sidebar from '../../containers/SidebarContainer';
import NewMemberForm from './NewMemberForm';
import EventListener from '../../helpers/eventListener';
import { generateRandomKey } from '../../helpers/util';

export default class BoardDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newListDropdownVisible: false,
      taskDetailVisible: false,
      sidebarVisible: false,
      height: 0,
      width: 0,
      boardDetailMargin: 0,
      selectedTask: null,
      taskDetailKey: 0,
    };
    this.updateSize = this.updateSize.bind(this);
    this.onResize = this.onResize.bind(this);
    this.handleNewListDropdownChange = this.handleNewListDropdownChange.bind(this);
    this.hideNewListDropdown = this.hideNewListDropdown.bind(this);
    this.showTaskDetailModal = this.showTaskDetailModal.bind(this);
    this.hideTaskDetailModal = this.hideTaskDetailModal.bind(this);
    this.showSidebar = this.showSidebar.bind(this);
    this.hideSidebar = this.hideSidebar.bind(this);
  }

  componentDidMount() {
    document.body.className = "red-gradient-background";
    const { loadBoardDetail, userSocket, params } = this.props;
    loadBoardDetail(params.id, userSocket);
    const win = window;
    this.updateSize();
    this.eventResizeToken = EventListener.listen(
      win,
      'resize',
      this.onResize,
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.addingMemberError && nextProps.addingMemberError !== this.props.addingMemberError) {
      message.error(nextProps.addingMemberError);
    }
  }

  componentWillUnmount() {
    this.props.boardChannel.leave();
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

  hideNewListDropdown() {
    this.setState({ newListDropdownVisible: false });
  }

  handleNewListDropdownChange(flag) {
    this.setState({ newListDropdownVisible: flag });
  }

  showTaskDetailModal(task) {
    this.setState({
      taskDetailVisible: true,
      selectedTask: task,
      taskDetailKey: generateRandomKey(),
    });
  }

  hideTaskDetailModal() {
    this.setState({
      taskDetailVisible: false,
      selectedTaskId: null,
    });
  }

  showSidebar() {
    clearTimeout(this.boardDetailTimer);
    this.setState({ sidebarVisible: true });
    this.boardDetailTimer = setTimeout(() => {
      this.setState({ boardDetailMargin: 250 });
    }, 500);
  }

  hideSidebar() {
    clearTimeout(this.boardDetailTimer);
    this.setState({
      sidebarVisible: false,
      boardDetailMargin: 0,
    });
  }

  render() {
    const {
      isSignedIn, lists, isLoading, loadingError,
      createList, createTask, params,
      boardDetail, isCreatingList, isCreatingTask,
      creatingTaskError, creatingListError, updateList,
      updatingListError, archiveList,
      boardMembers, addBoardMember, isAddingMember,
      addingMemberError, boardChannel, connectedUsers,
    } = this.props;

    const {
      newListDropdownVisible, taskDetailVisible, sidebarVisible,
      height, boardDetailMargin, selectedTask, taskDetailKey,
    } = this.state;

    const cardStyle = {
      margin: "10px",
      width: "300px",
      display: "inline-block",
      verticalAlign: "top",
      backgroundColor: "rgba(240,65,52,.2)",
    };
    const newListForm = (
      <NewListForm
        onFormSubmit={createList}
        boardChannel={boardChannel}
        hideDropdown={this.hideNewListDropdown}
        isCreating={isCreatingList}
        creatingError={creatingListError}
      />
    );

    const archiveListButton = id => (
      <Tooltip title="Archive this list.">
        <Icon type="upload" className="archive-list-button" onClick={() => archiveList(id, boardChannel)} />
      </Tooltip>
    );

    const listIndex = lists ?
      lists.map(list => (
        <ListCard
          list={list}
          key={list.id}
          extra={archiveListButton(list.id)}
          createTask={createTask}
          boardChannel={boardChannel}
          isCreatingTask={isCreatingTask}
          creatingTaskError={creatingTaskError}
          showTaskDetailModal={this.showTaskDetailModal}
          hideSidebar={this.hideSidebar}
          updateList={updateList}
          updatingError={updatingListError}
        />)) : [];
    listIndex.push(
      <Card style={cardStyle} key="createlist">
        <Dropdown
          overlay={newListForm}
          trigger={['click']}
          onVisibleChange={this.handleNewListDropdownChange}
          visible={newListDropdownVisible}
        >
          <h2 style={{ color: "#2a71a5", cursor: "pointer" }}>
            <Icon style={{ margin: "10px" }} type="plus-square-o" />
            New List
          </h2>
        </Dropdown>
      </Card>,
    );

    const boardDetailStyle = {
      marginRight: boardDetailMargin,
      height: height - 140,
    };

    const newMemberForm = (
      <NewMemberForm
        onFormSubmit={addBoardMember}
        channel={boardChannel}
        isAddingMember={isAddingMember}
        addingMemberError={addingMemberError}
      />
    );

    const isConnected = (id) => {
      if (connectedUsers && connectedUsers.indexOf(id) !== -1) return true;
      else return false;
    };

    const boardMembersIndex = boardMembers ? boardMembers.map(boardMember => (
      <Tooltip title={boardMember.first_name} key={boardMember.id}>
        <ReactGravatar
          className="board-member-avatar"
          email={boardMember.email}
          style={{ opacity: isConnected(boardMember.id) ? 1 : 0.1 }}
      />
      </Tooltip>
    )) : [];
    boardMembersIndex.push(
      <Dropdown overlay={newMemberForm} trigger={['click']} key="add-a-member">
        <Tooltip title="Add a member.">
          <div className="add-member-button">
            <Icon type="plus-circle-o" />
          </div>
        </Tooltip>
      </Dropdown>,
    );

    return (
      <div>
        { isLoading && <div style={{ height: "300px" }}><Spinner /></div> }
        { !isLoading && loadingError && (
          <Alert
            description={ loadingError }
            type="error"
            closable
            style={{ margin: "10px" }}
          />
        )}
        { !isLoading && !loadingError && (
          <div className="board-detail-wrapper">
            <div className="sidebar-switch">
              <ReactCSSTransitionGroup
                transitionName="sidebar-switch"
                transitionEnterTimeout={500}
                transitionLeaveTimeout={500}
              >
                {
                  !sidebarVisible && (
                    <div className="sidebar-switch-wrapper">
                      <div className="board-members-container">
                        { boardMembersIndex }
                      </div>
                      <Button onClick={this.showSidebar} ghost>
                        <Icon type="menu-fold" />Menu
                      </Button>
                    </div>
                  )
                }
              </ReactCSSTransitionGroup>
            </div>
            <div className="board-detail-title">
              <Icon type="book" />
              <h2>{ boardDetail && boardDetail.title }</h2>
            </div>
            <div className="board-detail-container" style={boardDetailStyle}>
                <ReactCSSTransitionGroup
                  transitionName="list-index"
                  transitionEnterTimeout={500}
                  transitionLeaveTimeout={500}
                >
                  { listIndex }
                </ReactCSSTransitionGroup>
            </div>
            <ReactCSSTransitionGroup
              transitionName="sidebar-switch"
              transitionEnterTimeout={500}
              transitionLeaveTimeout={500}
            >
              {
                sidebarVisible && (
                  <Sidebar hideSidebar={this.hideSidebar} style={{ height: this.state.height-50 }} />
                )
              }
            </ReactCSSTransitionGroup>
            <Modal
              visible={taskDetailVisible} width={700} footer={null}
              onCancel={this.hideTaskDetailModal} key={taskDetailKey}
            >
              <TaskDetail task={selectedTask} hideTaskDetailModal={this.hideTaskDetailModal} />
            </Modal>
          </div>
        )}
      </div>
    );
  }
}
