import React, { Component } from "react";
import CustomFooter from "../Components/Footer";
import CustomHeader from "../Components/Header";
import { Layout, BackTop } from "antd";
import "./layout.css";
import TabMenu from "../Components/front-componenets/TabMenu";
const { Header, Content } = Layout;

export class layout extends Component {
  render() {
    return (
      <div>
        <Layout style={{ height: "100vh" }}>
          <Header className="headerLayOutHeight">
            <CustomHeader />
          </Header>
          <TabMenu />
          <Content className="outStyling">{this.props.children}</Content>
        </Layout>
      </div>
    );
  }
}

export default layout;
