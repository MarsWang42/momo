import React, { Component } from 'react';
import { Row, Card, Col, Icon, Modal, Alert } from 'antd';
import BoardCard from './BoardCard';
import NewBoardForm from './NewBoardForm';
import Spinner from '../Tools/Spinner';

export default class BoardList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      boardVisible: false,
    };
    this.hideBoardModal = this.hideBoardModal.bind(this);
    this.showBoardModal = this.showBoardModal.bind(this);
  }

  componentDidMount() {
    this.props.loadBoardList();
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
      isSignedIn, ownedBoards, invitedBoards, isLoading,
      createBoard, currentUser, loadingError,
      isCreating, creatingError,
    } = this.props;
    const invitedBoardsList = invitedBoards ?
      invitedBoards.map(board => <BoardCard board={board} key={board.id} />) : [];
    const ownedBoardList = ownedBoards ?
      ownedBoards.map(board => <BoardCard board={board} key={board.id} />) : [];
    ownedBoardList.push(
      <Col xs={12} sm={8} md={6} key="createCard">
        <Card style={{ margin: "10px", backgroundColor: "#f1f1f1" }}>
          <a onClick={this.showBoardModal} style={{ color: "#2a71a5" }}>
            <h2><Icon style={{ margin: "10px" }} type="plus-square-o" />New Board</h2>
          </a>
          <Modal
            title="Create Board" visible={this.state.boardVisible}
            onCancel={this.hideBoardModal} footer={null}
          >
            <NewBoardForm
              onFormSubmit={createBoard}
              hideBoardModal={this.hideBoardModal}
              isCreating={isCreating}
              creatingError={creatingError}
            />
          </Modal>
        </Card>
      </Col>,
    );
    return (
      <div className="board-list-container">
        <h1 style={{ margin: "15px 10px" }}>Hello {currentUser.firstName}</h1>
        <h4 style={{ margin: "15px 15px" }}>Please select a board or create a new one.</h4>
        <hr />
        { !loadingError ? (
          <div>
            <Row>
              { isLoading && <div style={{ height: "300px" }}><Spinner /></div> }
            </Row>
            <Row>
              <Row style={{ padding: "20px" }}><h2>Your boards:</h2></Row>
              { !isLoading && ownedBoardList }
            </Row>
            <Row>
              <Row style={{ padding: "20px" }}><h2>Invited boards:</h2></Row>
              { !isLoading && invitedBoardsList }
            </Row>
          </div>
        ) : (
          <Alert
            message="Error Text"
            description={loadingError}
            type="error"
            closable
          />
        )
        }
      </div>
    );
  }
}
