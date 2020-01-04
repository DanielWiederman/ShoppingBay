import React, { Component } from "react";
import "../CSS/Admin  CSS/adminPanel.css";
import "../CSS/Admin  CSS/genericClass.css";
import Apps from "../Components/Apps";
import AdminNotifications from "../Components/AdminNotifications";
import { Row, Col, Tabs } from "antd";
import { GET_ALL_PROD, GET_ALL_SALES } from "../Api/api";
import { requestData } from "../RequestData/RequestData";
import { CircleArrow as ScrollUpButton } from "react-scroll-up-button";
import moment from "moment";

const { TabPane } = Tabs;

const copyState = {
  apps: [
    {
      name: "Manage sales",
      isClicked: false
    },
    {
      name: "Manage products",
      isClicked: false
    },
    {
      name: "Contact list",
      isClicked: false
    },
    {
      name: "Manage orders",
      isClicked: false
    },
    {
      name: "Cart",
      isClicked: false
    },
    {
      name: "Home Page",
      isClicked: false
    }
  ],
  allProds: [],
  allSales: [],
  salesToNotifications: []
};
export class adminPanel extends Component {
  state = { ...copyState };

  componentDidMount() {
    let getProdsData = {
      url: GET_ALL_PROD,
      method: "post"
    };
    requestData(getProdsData).then(allProd => {
      this.setState({ allProds: allProd.data }, () => {
        let copyState = JSON.parse(JSON.stringify(this.state));
        copyState.allProds = copyState.allProds.filter(
          item => item.quantity < 6
        );
        this.setState(copyState, () => {});
      });
    });
    let getSalesData = {
      url: GET_ALL_SALES,
      method: "post"
    };
    requestData(getSalesData).then(allSales => {
      this.setState({ allSales: allSales.data }, () => {
        let copyState = JSON.parse(JSON.stringify(this.state));
        copyState.salesToNotifications = [];
        copyState.allSales.map(index => {
          var endDate = moment(index.dateEnd, "DD-MM-YYYY");
          var nowDate = new Date();
          nowDate = moment(nowDate, "DD-MM-YYYY");
          let diff = endDate.diff(nowDate, "days");
          diff += 1;
          if (diff <= 7) {
            index.diff = diff;
            copyState.salesToNotifications.push(index);
          }
        });
        this.setState(copyState, () => {});
      });
    });
  }
  onClickHeadler = index => {
    if (index.name === "Manage sales") {
      this.props.history.push("/sales");
    } else if (index.name === "Manage products") {
      this.props.history.push("/manageProducts");
    } else if (index.name === "Contact list") {
      this.props.history.push("/contactList");
    } else if (index.name === "Manage orders") {
      this.props.history.push("/manageOrdersList");
    } else if (index.name === "Cart") {
      this.props.history.push("/cart");
    } else {
      const { history } = this.props;
      history.push("/home");
    }
  };
  render() {
    let apps = this.state.apps.map(index => {
      return (
        <Apps
          key={index.name}
          name={index.name}
          click={() => this.onClickHeadler(index)}
        />
      );
    });
    let prodNotifications = this.state.allProds.map(index => {
      return (
        <AdminNotifications
          key={index._id}
          title={index.productName}
          quantity={index.quantity}
        />
      );
    });
    let saleNotifications = this.state.salesToNotifications.map(index => {
      return (
        <AdminNotifications
          key={index._id}
          title={index.saleName}
          diff={index.diff}
        />
      );
    });
    return (
      <div className="adminPanelContainer">
        {/* Main Row will get all the height */}
        <Row style={{ height: "100%" }}>
          {/* first row for admin apps */}
          <Col className="firstRowBorder" style={{ height: "50%" }}>
            {/* The main row for admin app should get all the height of the row for responsive design*/}
            <Row
              type="flex"
              justify="center"
              align="middle"
              style={{ height: "100%" }}
            >
              {/* This col control the sizing of center with justify-center*/}
              <Col span={24} md={22} lg={20}>
                <Row>{apps}</Row>
              </Col>
            </Row>
          </Col>

          {/* second row for satistics and notifcitaions */}

          <Col span={24} style={{ height: "50%", overflowY: "none" }}>
            <Row style={{ height: "100%" }}>
              {/* second row mobile tab view*/}
              <Col span={24} md={0} style={{ overflowY: "auto" }}>
                <Tabs defaultActiveKey="1" tabBarStyle={{width: '100%'}}>
                  <TabPane tab="Sale Notifications" key="1">
                    <Col
                      span={24}
                      style={{ overflowY: "auto" }}
                    >
                      <Row type="flex" justify="center">
                        <Col span={24} className="boxTitle">
                          <u>Sale notifications</u>
                        </Col>
                        {saleNotifications}
                      </Row>
                    </Col>
                  </TabPane>
                  <TabPane tab="Product Notification" key="2">
                    <Col
                      span={24}
                      style={{ overflowY: "auto" }}
                    >
                      <Row type="flex" justify="center">
                        <Col span={24} className="boxTitle">
                          <u>Product notifications</u>
                        </Col>
                        {prodNotifications}
                      </Row>
                    </Col>
                  </TabPane>
                </Tabs>
              </Col>
              {/* second row first half for satistics not visibile for mobile at admin homepage*/}
              <Col
                span={0}
                md={12}
                className="secondRowBorder"
                style={{ overflowY: "auto" }}
              >
                <Row type="flex" justify="center">
                  <Col span={24} className="boxTitle">
                    <u>Sale notifications</u>
                  </Col>
                  {saleNotifications}
                </Row>
              </Col>
              {/* second row second half for notifications */}
              <Col
                span={0}
                md={12}
                className="secondRowBorder"
                style={{ overflowY: "auto", direction: "rtl" }}
              >
                <Row type="flex" justify="center">
                  <Col span={24} className="boxTitle">
                    <u>Product notifications</u>
                  </Col>
                  {prodNotifications}
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

export default adminPanel;
