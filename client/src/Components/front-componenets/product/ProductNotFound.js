import React, { Component } from "react";
import { Col, Row, Icon, Result, Button } from "antd";
import { withRouter } from "react-router-dom";
import "../../../CSS/ClientCSS/productNotFound.css";

export class ProductNotFound extends Component {
  backToHome = () => {
    if (this.props.props) {
      const { history } = this.props.props;
      history.push("/");
    } else {
      const { history } = this.props;
      history.push("/");
    }
  };

  render() {
    {
      console.log(this.props);
    }
    return (
      <Row className="text-center mt-2 mt-md-5">
        <Col span={24} className="mt-md-5">
          <Result
            className="transparent-background"
            status="404"
            title="404"
            subTitle="Sorry, this item does not exist."
            extra={
              <Button type="primary" onClick={this.backToHome}>
                Back Home
              </Button>
            }
          />
        </Col>
      </Row>
    );
  }
}

export default withRouter(ProductNotFound);
