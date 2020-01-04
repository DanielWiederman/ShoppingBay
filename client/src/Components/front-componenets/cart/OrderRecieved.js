import React, { Component } from "react";
import { Result, Button } from "antd";
export class OrderRecieved extends Component {
  render() {
    return (
      <div>
        <Result
          status="success"
          title="Successfully Purchased"
          subTitle={<p><span style={{color: 'black',}}><u>Order number</u>:</span> {this.props.orderId}<br/>Proccess order takes between 1-5 minutes, please wait before you can review it.</p>}
          extra={[
            <Button type="primary" key="console" onClick={()=>this.props.goBackHome()}>
              Go Home
            </Button>,
          ]}
        />
        ,
      </div>
    );
  }
}

export default OrderRecieved;
