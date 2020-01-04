import React, { Component } from "react";
import * as action from "../../../src/Store/action/userDataActions";
import * as cartAction from "../../../src/Store/action/cartAction";
import { connect } from "react-redux";
import { requestData } from "../../RequestData/RequestData";
import { GET_ORDER_BY_USER_ID } from "../../Api/api";
import OrdersListView from "../../Components/front-componenets/order/ordersListView";
import ProductNotFound from "../../Components/front-componenets/product/ProductNotFound";

const initState = {
  orders: null,
  orderNotFound: false,
  loading: true
};

export class userOrderPage extends Component {
  state = { ...initState };

  componentDidMount() {
    console.log("userData =>", this.props);
    this.getOrders();
  }

  initOrder = orders => {
    this.setState({ orders: orders }, () => {
      this.setState({ loading: false });
    });
  };

  getOrders = () => {
    let data = {
      url: GET_ORDER_BY_USER_ID,
      method: "post",
      data: { userId: this.props.userData._id }
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

  render() {
    return (
      <div>
        {!this.state.loading && this.state.orders ? (
          <OrdersListView orders={this.state.orders}/>
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

const mapStateToProps = state => ({
  userData: state.userData.userData
});

// const mapDispatchToProps = dispatch => {
//   return {
//     saveUser: (data) => dispatch(action.saveUser(data)),
//     turnAuth: () => dispatch(action.turnAuth()),
//     getCart: (data) => dispatch(cartAction.getCart(data))
//   }
// }

export default connect(mapStateToProps)(userOrderPage);
