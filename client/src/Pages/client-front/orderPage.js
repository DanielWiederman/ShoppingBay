import React, { Component } from "react";
import { requestData } from "../../RequestData/RequestData";
import { GET_ORDER_BY_ID } from "../../Api/api";
import OrderView from "../../Components/front-componenets/order/orderView";
import { ProductNotFound } from "../../Components/front-componenets/product/ProductNotFound";

const initState = {
  order: null,
  orderNotFound: false,
  loading: true
};

export class orderPage extends Component {
  state = { ...initState };

  componentDidMount() {
    //in case there isnt any id in the params
    if (!this.props.location.search.slice(3)) {
      this.setState({ orderNotFound: true });
    }
    this.props.location.search &&
      this.props.location.state &&
      this.props.location.state.order
      ? this.initOrder(this.props.location.state.order)
      : this.getOrder(this.props.location.search.slice(3));
  }

  initOrder = order => {
    this.setState({ order: order }, () => {
      this.setState({ loading: false });
    });
  };

  getOrder = orderId => {
    let data = {
      url: GET_ORDER_BY_ID,
      method: "post",
      data: { orderId: orderId }
    };
    requestData(data)
      .then(res => {
        this.setState({ order: res.data }, () => {
          this.setState({ loading: false });
        });
      })
      .catch(err => {
        this.setState({ orderNotFound: true }, () => {
          this.setState({ loading: false });
        });
      });
  };

  redirectToProduct = product => {
    this.props.history.push({
      pathname: "/product",
      search: "?q=" + product._id,
      state: { product: product, order: true }
    });
  };

  render() {
    return (
      <div>
        {!this.state.loading && this.state.order ? (
          <OrderView
            totalSum={this.state.order.totalSum}
            orderItems={this.state.order.products}
            redirectToProduct={this.redirectToProduct}
          />
        ) : (
            ""
          )}
        {!this.state.loading &&
          !this.state.order &&
          this.state.orderNotFound ? (
            <ProductNotFound props={this.props} />
          ) : (
            ""
          )}
      </div>
    );
  }
}

export default orderPage;
