import React, { Component } from "react";
import { Menu, Row, Col, Icon } from "antd";
import { withRouter } from "react-router-dom";
import { GET_PROD_CATEGORIES } from "../../Api/api";
import { requestData } from "../../RequestData/RequestData";

const initState = {
  categories: []
};

export class TabMenu extends Component {
  state = { ...initState };

  componentDidMount() {
    this.initCategories();
  }

  handleClick = category => {
    const { history } = this.props;
    !category
      ? history.push("/")
      : history.push({
          pathname: "/category",
          search: "?q=" + category,
          state: { category: category }
        });
  };

  initCategories = () => {
    let categories = {
      url: GET_PROD_CATEGORIES,
      method: "get"
    };
    requestData(categories).then(categories => {
      this.setState({ categories: categories.data }, () =>
        console.log(this.state)
      );
    });
  };

  render() {
    const { categories } = this.state;
    let mappedCategories =
      categories && categories.length
        ? categories.map(category => {
            return (
              <Menu.Item
                key={"" + category}
                onClick={() => this.handleClick(category)}
              >
                <Col>
                  <Row type="flex" justify="center" align="middle">
                    <Col className="pt-1">{category}</Col>
                  </Row>
                </Col>
              </Menu.Item>
            );
          })
        : "";

    return (
      <Row
        type="flex"
        justify="center"
        align="middle"
        className="d-none d-md-block"
      >
        <Col lg={24} span={0}>
          <Menu selectedKeys={[this.state.current]} mode="horizontal">
            <Menu.Item key="home" onClick={() => this.handleClick()}>
              <Col>
                <Row type="flex" justify="center" align="middle">
                  <Col>
                    <Icon type="home" style={{ verticalAlign: "middle" }} />
                  </Col>
                  <Col className="pt-1">Home</Col>
                </Row>
              </Col>
            </Menu.Item>
            {mappedCategories}
          </Menu>
        </Col>
      </Row>
    );
  }
}

export default withRouter(TabMenu);
