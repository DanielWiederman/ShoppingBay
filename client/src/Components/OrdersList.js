import React, { Component } from "react";
import { connect } from "react-redux";
import * as action from "../Store/action/action";
import { Row, Col, Select, Icon, Tooltip, Input, Radio } from "antd";
import { requestData } from "../RequestData/RequestData";
import { GET_ALL_ORDERS } from "../Api/api";
import OrdersAdminListView from "./front-componenets/order/ordersAdminListView";
import ProductNotFound from "./front-componenets/product/ProductNotFound";
import GoBack from "./goBack";

const initState = {
  orders: null,
  queryOrders: [],
  orderNotFound: false,
  loading: true,
  itemsPerChangeLoading: false,
  paginationPosition: "bottom",
  pageSize: 25
};

const { Option } = Select;

export class OrderList extends Component {
  state = { ...initState };

  componentDidMount() {
    this.getOrders();
    this.setState({
      pageSize: this.props.ItemPerPage,
      paginationPosition: this.props.paginationPosition
    });
  }

  getOrders = () => {
    this.setState({ loading: true });
    let data = {
      url: GET_ALL_ORDERS,
      method: "post"
    };
    requestData(data)
      .then(res => {
        this.setState({ orders: res.data }, () => {
          this.setState({ loading: false });
        });
      })
      .catch(err => {
        this.setState({ orderNotFound: true }, () => {
          this.setState({ loading: false });
        });
      });
  };

  onSearchHandler = e => {
    let customerName = e.target.value;
    var copyState = JSON.parse(JSON.stringify(this.state));
    copyState.queryOrders = copyState.orders.filter(order =>
      (
        order.user.firstName.toLowerCase() +
        " " +
        order.user.lastName.toLowerCase()
      ).includes(customerName.toLowerCase())
    );
    this.setState(copyState);
  };

  onItemsPerPageChange = value => {
    this.setState({ itemsPerChangeLoading: true }, () => {
      this.props
        .userSettingsChangeItemsPerPage({ value: value, action: "changeItem" })
        .then(res =>
          this.setState({
            itemsPerChangeLoading: false,
            pageSize: parseInt(this.props.ItemPerPage, 10)
          })
        );
    });
  };

  handlePaginationLocationChange = value => {
    this.props
      .userSettingsChangeItemsPerPage({
        value: value.target.value,
        action: "changePagePos"
      })
      .then(res =>
        this.setState({ paginationPosition: this.props.paginationPosition })
      );
  };

  render() {
    return (
      <div>
        <Row>
          <Col span={24}>
            <Row type="flex" justify="center">
              <Col span={22} className="bg-light border-info mt-5 mb-5">
                <Col span={24} className="mt-4 pl-3">
                  <GoBack />
                </Col>
                <Col span={24} style={{ fontSize: "22.5px" }} className="mt-2">
                  <Row type="flex" justify="center" align="middle">
                    <Col
                      xl={4}
                      md={8}
                      className="text-xl-center text-left mb-3"
                    >
                      <Tooltip
                        placement="top"
                        title="Click to refresh product list"
                      >
                        <Icon
                          type="sync"
                          spin={this.state.loading ? true : false}
                          onClick={() => {
                            this.getOrders();
                          }}
                        />
                      </Tooltip>
                    </Col>
                    <Col xl={5} md={10} className="text-right text-xl-left">
                      <span
                        className="w-50 text-center pr-1"
                        style={{ fontSize: "15px" }}
                      >
                        Items per page:{" "}
                      </span>
                      <Select
                        defaultValue={this.props.ItemPerPage}
                        loading={
                          this.state.itemsPerChangeLoading ? true : false
                        }
                        className="w-30"
                        onChange={this.onItemsPerPageChange}
                      >
                        <Option value="5">5</Option>
                        <Option value="25">25</Option>
                        <Option value="50">50</Option>
                        <Option value="100">100</Option>
                        <Option value="200">200</Option>
                      </Select>
                    </Col>
                    <Col
                      xl={7}
                      md={24}
                      className="text-center mt-3 mb-3 mt-xl-0 mb-xl-0"
                    >
                      <span
                        className="pr-1 text-left"
                        style={{ fontSize: "15px" }}
                      >
                        Pagination:{" "}
                      </span>
                      <Radio.Group
                        value={this.props.paginationPosition}
                        onChange={this.handlePaginationLocationChange}
                      >
                        <Radio.Button value="top">Top</Radio.Button>
                        <Radio.Button value="bottom">Bottom</Radio.Button>
                        <Radio.Button value="both">Both</Radio.Button>
                      </Radio.Group>
                    </Col>
                    <Col xl={8} md={24} className="text-xl-right text-center">
                      <Input
                        className="w-75 mb-3 mb-xl-0"
                        placeholder="Search order by customer name"
                        suffix={<Icon type="search" />}
                        onChange={this.onSearchHandler}
                      />
                    </Col>
                  </Row>
                </Col>
                {!this.state.loading && this.state.orders ? (
                  <Col span={24}>
                    <OrdersAdminListView
                      orders={
                        this.state.queryOrders.length
                          ? this.state.queryOrders
                          : this.state.orders
                      }
                      getOrders={this.getOrders}
                      pagination={{
                        pageSize: this.state.pageSize,
                        position: this.state.paginationPosition
                      }}
                    />
                  </Col>
                ) : (
                  ""
                )}
              </Col>
            </Row>
          </Col>
        </Row>

        {!this.state.loading &&
        !this.state.orders &&
        this.state.orderNotFound ? (
          <ProductNotFound props={this.props} />
        ) : (
          ""
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    ItemPerPage: state.reducerUserSettings.itemsPerPage,
    paginationPosition: state.reducerUserSettings.paginationPosition
  };
};

const mapDispatchToProps = dispatch => {
  return {
    userSettingsChangeItemsPerPage: data => dispatch(action.userSettings(data))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderList);
