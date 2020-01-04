import React from "react";
import { Row, Col, Card } from "antd";
import "../CSS/Admin  CSS/adminPanel.css";
import "../CSS/Admin  CSS/genericClass.css";

const AdminNotifications = props => {
  return (
    <Col
      span={22}
      className={
        props.quantity > 4 || props.diff > 4
          ? "notificationCard borderGreen"
          : "notificationCard borderRed"
      }
    >
      <Row>
        <Card
        className="card-ant-props"
          title={
            <Col
              span={24}
              className={
                props.quantity > 4 || props.diff > 4
                  ? "notiTitle"
                  : "notiTitle"
              }
            >
              {props.title}
            </Col>
          }
          bordered={true}
        >
          <Col span={24}>
            <Row type="flex" justify="center">
              <Col
                span={22}
                style={{
                  display:
                    props.quantity !== undefined && props.quantity > 0
                      ? "block"
                      : "none"
                }}
              >
                <span className="sub-title">
                  <u>
                    <b>{props.title}</b>
                  </u>
                </span>
                <span className="sub-title">
                  {" "}
                  quantity{" "}
                  {props.quantity > 4
                    ? "getting low just (" + props.quantity + ") remaining"
                    : "getting very low just (" +
                      props.quantity +
                      ") remaining "}
                </span>
              </Col>
              <Col
                span={22}
                style={{ display: props.quantity <= 0 ? "block" : "none" }}
              >
                <span className="sub-title">
                  Prod{" "}
                  <u>
                    <b>{props.title}</b>
                  </u>
                </span>
                <span className="sub-title"> ended</span>
              </Col>
              <Col
                span={22}
                style={{
                  display:
                    props.diff !== undefined && props.diff > 0
                      ? "block"
                      : "none"
                }}
              >
                <span className="sub-title">
                  <u>
                    <b>{props.title}</b>
                  </u>
                </span>
                <span className="sub-title">
                  {" "}
                  about to end{" "}
                  {props.diff > 4
                    ? " soon in (" + props.diff + ") days"
                    : " really soon in (" + props.diff + ") days"}
                </span>
              </Col>
              <Col
                span={22}
                style={{ display: props.diff <= 0 ? "block" : "none" }}
              >
                <span className="sub-title">
                  Sale{" "}
                  <u>
                    <b>{props.title}</b>
                  </u>
                </span>
                <span className="sub-title"> ended</span>
              </Col>
            </Row>
          </Col>
        </Card>
      </Row>
    </Col>
  );
};
export default AdminNotifications;
