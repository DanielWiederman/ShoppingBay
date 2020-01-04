import React, { Component } from "react";
import { Row, Col, Icon, Spin, message } from "antd";
import { GET_PROD_BY_CATEGORY, TOGGLE_FAVORITE_PRODUCT } from "../../Api/api";
import { requestData } from "../../RequestData/RequestData";
import ProductNotFound from "../../Components/front-componenets/product/ProductNotFound";
import { goBack } from "../../Components/goBack";
import CategoryProducts from "../../Components/front-componenets/category/products";
import { connect } from "react-redux";
import * as cartAction from "../../Store/action/cartAction";

const initState = {
  products: null,
  prodNotFound: false,
  loading: true,
  favorites: []
};

export class categoryPage extends Component {
  state = { ...initState };

  componentDidMount() {
    this.getProducts(this.props.location.search.slice(3));
    this.initFavorites()
  }

  initFavorites = () => {
    this.setState({ favorites: JSON.parse(localStorage.getItem("favorite")) });
  };

  toggleFavorite = product => {
    if (!this.props.userData) {
      message.error("You cant add to favorites if you're not logged in!", 4);
      return;
    }
    const asyncLocalStorage = {
      setItem: async (key, value) => {
        await null;
        return localStorage.setItem(key, value);
      },
      getItem: async key => {
        await null;
        return localStorage.getItem(key);
      }
    };

    let data = {
      url: TOGGLE_FAVORITE_PRODUCT,
      method: "post",
      data: {
        userId: this.props.userData._id,
        productId: product._id
      }
    };
    requestData(data)
      .then(res => {
        let favorite = JSON.parse(localStorage.getItem("favorite"));
        favorite.filter(favorProd => favorProd.productId === product._id).length
          ? (favorite = favorite.filter(
              favorProd => favorProd.productId !== product._id
            ))
          : favorite.push({ productId: product._id });
        asyncLocalStorage.setItem("favorite", JSON.stringify(favorite));
        this.setState({ favorites: favorite }, () => {
          message.success(product.productName + " " + res.data.msg);
        });
      })
      .catch(err => {
        message.error("Error, favorite :(");
        console.log(err);
      });
  };

  componentDidUpdate(prevProps) {
    if (this.props.location.search != prevProps.location.search) {
      // Check if it's a new user, you can also use some unique property, like the ID  (this.props.user.id !== prevProps.user.id)
      this.setState({ loading: true });
      this.getProducts(this.props.location.search.slice(3));
    }
  }

  getProducts = categoryName => {
    let data = {
      url: GET_PROD_BY_CATEGORY,
      method: "post",
      data: { category: categoryName }
    };
    requestData(data)
      .then(res => {
        this.setState({ products: res.data }, () => {
          this.setState({ loading: false }, () => {
            console.log(this.state);
          });
        });
      })
      .catch(err => {
        this.setState({ prodNotFound: true }, () => {
          this.setState({ loading: false });
        });
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
          message.success("Succesfly added " + product.productName + " to cart", 2);
        } else {
          message.error(
            "You can not buy more then " + product.quantity + " pieces!",
            2
          );
        }
      } else {
        this.props.addToCart(product, 1, this.props.cartData);
        message.success("Succesfly added " + product.productName + " to cart", 2);
      }
    } else {
      message.error("This product is currently out of stock", 2);
    }
  };

  render() {
    return (
      <Row type="flex" justify="center" className="h-100 pb-sm-2 pt-sm-2">
        <Col span={24} className={this.state.loading ? "text-center" : ""}>
          {this.state.loading ? <Spin tip="Loading..."></Spin> : ""}
          {!this.state.loading && !this.state.products.length ? (
            <ProductNotFound />
          ) : (
            ""
          )}
          {!this.state.loading && this.state.products ? (
            <CategoryProducts
              prods={this.state.products}
              addToCartHandler={this.addToCartHandler}
              toggleFavorite={this.toggleFavorite}
              favorites={this.state.favorites}
            />
          ) : (
            ""
          )}
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = state => {
  console.log("There are new state from redux to map.", state);
  return {
    data: state.reducerData.data,
    cartData: state.cartData.cartData,
    userData: state.userData.userData
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addToCart: (product, buyQuantity, cartData) =>
      dispatch(cartAction.addToCart(product, buyQuantity, cartData))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(categoryPage);
