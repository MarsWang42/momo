import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { Card, Col } from 'antd';

export default class BoardCard extends Component {
  render() {
    const { board } = this.props;
    const bodyStyle = {
      padding: "12px 24px",
      fontSize: "11px",
      color: "#777777",
    };
    return (
      <Col xs={12} sm={8} md={6}>
        <Card
          onClick={() => browserHistory.push(`board/${board.id}`)}
          title={board.title}
          style={{ margin: "10px", cursor: "pointer" }}
          bodyStyle={bodyStyle}
        >
          Created By { `${board.user.first_name} ${board.user.last_name}` }
        </Card>
      </Col>
    );
  }
}
