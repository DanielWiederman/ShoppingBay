import React, { Component } from "react";
import { Row, Col, message } from "antd";
import * as action from "../../Store/action/cartAction";
import { connect } from "react-redux";
import { requestData } from "../../RequestData/RequestData";
import { NEW_ORDER } from "../../Api/api";
import CartView from "../../Components/front-componenets/cart/cartView";
import CartEmpty from "../../Components/front-componenets/cart/cartEmpty";
import OrderRecieved from "../../Components/front-componenets/cart/OrderRecieved";

const initState = {
  cartItems: [],
  cartSubmit: false,
  orderId: null
};

export class cartPage extends Component {
  state = { ...initState };

  componentDidMount() {
    this.initCartData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.cartData !== this.props.cartData ||
      prevState.cartItems !== this.state.cartItems
    ) {
      this.initCartData();
    }
  }

  initCartData = () => {
    this.setState({ cartItems: [] }, () => {
      this.setState({ cartItems: this.props.cartData });
    });
  };

  addToCartHandler = product => {
    let prodIndex = this.props.cartData.findIndex(
      index => index.product._id === product._id
    );
    if (product.quantity > 0) {
      if (prodIndex > -1) {
        if (product.quantity - this.props.cartData[prodIndex].buyQuantity > 0) {
          this.props.addToCart(product, 1, this.props.cartData);
        } else {
          message.error(
            "You can not buy more then " + product.quantity + " pieces!",
            2
          );
        }
      } else {
        this.props.addToCart(product, 1, this.props.cartData);
      }
    } else {
      message.error("This product is currently out of stock", 2);
    }
    this.initCartData();
  };

  deleteFromCartHandler = product => {
    this.props.deleteProdFromCart(product, this.props.cartData).then(res => {
      this.initCartData();
      message.success(product.productName + " deleted from cart");
    });
  };

  decreaseFromCartHandler = (product, buyQuantity) => {
    if (buyQuantity) {
      this.props.decQuantityFromCart(product, 1, this.props.cartData);
    } else {
      this.deleteFromCartHandler(product);
    }
    this.initCartData();
  };

  redirectToProduct = product => {
    this.props.history.push({
      pathname: "/product",
      search: "?q=" + product._id,
      state: { product: product }
    });
  };

  submitCart = () => {
    if (!this.props.userData) {
      message.error("You cant buy if you're not logged in!", 4);
      return;
    }
    message.loading('Proccesing order...')
    let data = {
      url: NEW_ORDER,
      method: "post",
      data: {
        userId: this.props.userData._id,
        products: this.props.cartData
      }
    };
    requestData(data)
      .then(res => {
        this.props.getCart([]);
        let copyState = JSON.parse(JSON.stringify(this.state));
        copyState.cartItems = [];
        copyState.cartSubmit = true;
        copyState.orderId = res.data.orderId;
        this.setState(copyState, ()=>{
          localStorage.removeItem('cartData')
          message.destroy()
        });
      })
      .catch(err => {
        console.log(err);
        message.destroy()
      });
  };

  goBackHome = () => {
    this.setState(initState, () => {
      const { history } = this.props;
      history.push("/");
    });
  };

  render() {
    return (
      <div>
        <Row>
          <Col className="text-center">
            {this.props.cartData.length && !this.state.cartSubmit ? (
              <CartView
                cartItems={this.state.cartItems}
                deleteFromCartHandler={this.deleteFromCartHandler}
                decreaseFromCartHandler={this.decreaseFromCartHandler}
                addToCartHandler={this.addToCartHandler}
                redirectToProduct={this.redirectToProduct}
                submitCart={this.submitCart}
                deleteFromCartHandler={this.deleteFromCartHandler}
                deleteAllCartData={this.props.deleteAllCartData}
              />
            ) : (
              ""
            )}
            {!this.props.cartData.length && !this.state.cartSubmit ? (
              <CartEmpty />
            ) : (
              ""
            )}
            {this.state.cartSubmit ? (
              <OrderRecieved
                orderId={this.state.orderId}
                goBackHome={this.goBackHome}
              />
            ) : (
              ""
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  cartData: state.cartData.cartData,
  userData: state.userData.userData
});

const mapDispatchToProps = dispatch => {
  return {
    addToCart: (product, buyQuantity, cartData) =>
      dispatch(action.addToCart(product, buyQuantity, cartData)),
    deleteProdFromCart: (product, cartData) =>
      dispatch(action.deleteProdFromCart(product, cartData)),
    decQuantityFromCart: (product, buyQuantity, cartData) =>
      dispatch(action.decQuantityFromCart(product, buyQuantity, cartData)),
    getCart: data => dispatch(action.getCart(data)),
    deleteAllCartData: () => dispatch(action.deleteAllCartData())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(cartPage);
