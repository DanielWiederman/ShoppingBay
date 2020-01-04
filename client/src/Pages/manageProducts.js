import React, { Component } from "react";
import { Row, Col } from "antd";
import "../CSS/Admin  CSS/manageProducts.css";
import GoBack from "../Components/goBack";
import CustomMenu from "../Components/AdminMenu";
import ProdList from "../Components/ProdList";
import AddProd from "../Components/AddProd";
import { connect } from "react-redux";
import * as action from "../Store/action/action";

const copyState = {
  menu: [
    {
        title: "Products list",
        icon: "fas fa-list"
      },
    {
      title: "Add product",
      icon: "fas fa-plus"
    },

  ],
  dataToDisplay: ""
};
export class manageProducts extends Component {
  state = { ...copyState };
  onMenuClickHeadler = userClicked => {
    if (userClicked.title === "Add product") {
      this.setState({ dataToDisplay: userClicked.title });
    } else if (userClicked.title === "Products List") {
      this.setState({ dataToDisplay: userClicked.title });
    } else {
      this.setState({ dataToDisplay: userClicked.title });
    }
  };
  render() {
    let menu = this.state.menu.map(index => {
      return (
        <CustomMenu
          key={index.title}
          title={index.title}
          icon={index.icon}
          selectedRow={this.state.dataToDisplay}
          click={() => this.onMenuClickHeadler(index)}
        />
      );
    });
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <Row type="flex" justify="center" className="mobileHeight">
          <Col span={23} md={24} className="contentCon">
            <Row type="flex" style={{ height: "100%" }}>
              <Col span={0} md={6} lg={6} xl={4} className="menuCon">
                <Row type="flex" justify="center">
                  <Col span={22}>
                    <GoBack color={"white"} />
                  </Col>
                </Row>
                <Row
                  type="flex"
                  justify="center"
                  align="top"
                  style={{ height: "10%", borderBottom: "2px solid gray" }}
                >
                  <Col xl={16} md={21} style={{ height: "100%" }}>
                    <Row
                      type="flex"
                      justify="center"
                      align="middle"
                      style={{ height: "50%" }}
                    >
                      <Col className="menuTitle">
                        <span>{"Admin Panel"}</span>
                      </Col>
                    </Row>
                    <Row
                      type="flex"
                      justify="center"
                      align="middle"
                      style={{ height: "50%" }}
                    >
                      <Col className="menuPathname">
                        <span>
                          {this.props.location.pathname
                            .slice(1)
                            .charAt(0)
                            .toUpperCase() +
                            this.props.location.pathname.slice(2)}
                        </span>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row
                  type="flex"
                  justify="center"
                  align="middle"
                  style={{ height: "80%" }}
                >
                  <Col md={24} style={{ height: "100%" }}>
                    <Row
                      type="flex"
                      justify="center"
                      className="pt-2 pb-2"
                    >
                      {menu}
                    </Row>
                  </Col>
                </Row>
                <Row
                  type="flex"
                  justify="center"
                  align="top"
                  style={{ borderTop: "2px solid gray" }}
                >
                  <Col span={24} style={{ height: "100%" }}>
                    <Row
                      type="flex"
                      justify="center"
                      align="middle"
                      style={{ height: "100%" }}
                    >
                      <Col className="menuTitle">
                        <span></span>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
              <Col span={24} md={18} xl={20} style={{ height: "90%" }} className="mt-5">
                <Row
                  type="flex"
                  align="middle"
                  justify="center"
                  style={{ height: "100%" }}
                >
                  <Col
                    span={23}
                    md={21}
                    style={{
                      display:
                        this.state.dataToDisplay === "" ? "block" : "none"
                    }}
                  >
                    <Row
                      type="flex"
                      justify="center"
                      style={{ height: "100%" }}
                    >
                      <Col>
                        <h1>
                          <u>Welcome to manage products</u>
                        </h1>
                        <h3>Here you can manage your products</h3>
                      </Col>
                    </Row>
                  </Col>
                  <Col
                    span={24}
                    md={21}
                    className="tableNtotalInfoCon"
                    style={{
                      display:
                        this.state.dataToDisplay !== "" ? "block" : "none",
                      height: "100%"
                    }}
                  >
                    <Row
                      type="flex"
                      justify="center"
                      style={{ height: "100%" }}
                    >
                      <Col span={24}>
                        <Row
                          type="flex"
                          align="middle"
                          justify="center"
                          style={{ height: "100%" }}
                        >
                          <Col className="mt-5 mb-4">
                            <h3>
                              <u>{this.state.dataToDisplay}</u>
                            </h3>
                          </Col>
                        </Row>
                      </Col>
                      <Col span={24} md={23} style={{ height: "100%" }}>
                        <Row
                          type="flex"
                          justify="center"
                          style={{
                            display:
                              this.state.dataToDisplay === "Products list"
                                ? "block"
                                : "none",
                            height: "100%"
                          }}
                        >
                          <ProdList />
                        </Row>
                        <Row
                          type="flex"
                          justify="center"
                          style={{
                            display:
                              this.state.dataToDisplay === "Add product"
                                ? "block"
                                : "none",
                            height: "100%"
                          }}
                        >
                          <AddProd />
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

export default manageProducts;
