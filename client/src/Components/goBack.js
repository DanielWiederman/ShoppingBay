import React, { Component } from "react";
import { Icon, Row, Col } from "antd";

import { withRouter } from "react-router-dom";

import "../CSS/style.css";

export class goBack extends Component {
  goBack = () => {
    !this.props.home
      ? this.props.history.goBack()
      : this.props.history.push("/");
  };

  render() {
    return (
      <Row className="goBack" style={{ color: this.props.color }}>
        <Col>
          <Row type="flex" align="middle">
            <Col>
              <div className="arrowProps" className="mb-4">
                <Icon className="goBack-cursor" onClick={() => this.goBack()} type="arrow-left" />
              </div>
            </Col>
            <Col>
              <div className="title">
                <span className="goBack-cursor" onClick={() => this.goBack()}>Go back</span>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

export default withRouter(goBack);
