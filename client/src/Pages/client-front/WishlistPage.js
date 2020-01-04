import React, { Component } from "react";
import { Row, Col, message, Spin } from "antd";
import {
  TOGGLE_FAVORITE_PRODUCT,
  GET_FAVORIT_PRODUCTS_BY_USER_ID
} from "../../Api/api";
import { requestData } from "../../RequestData/RequestData";
import ProductNotFound from "../../Components/front-componenets/product/ProductNotFound";
import GoBack from "../../Components/goBack";
import { connect } from "react-redux";
import * as cartAction from "../../Store/action/cartAction";
import CategoryProducts from "../../Components/front-componenets/category/products";

const initState = {
  prodNotFound: false,
  loading: true,
  prods: [],
  favorites: []
};
//http://localhost:3000/salePage?q=5da2f918379d6812586d21a3
//http://localhost:3000/salePage?q=5da2f8ba379d6812586d219e
//http://localhost:3000/salePage?q=5da2f95f379d6812586d21a8

export class WishlistPage extends Component {
  state = { ...initState };

  componentDidMount() {
    this.getUserFavorites();
  }

  getUserFavorites = () => {
    this.setState({ loading: true }, () => {
      let data = {
        url: GET_FAVORIT_PRODUCTS_BY_USER_ID,
        method: "post",
        data: {
          userId: this.props.userData._id
        }
      };
      requestData(data)
        .then(res => {
          this.setState({ favorites: res.data, loading: false, prodNotFound: false });
        })
        .catch(err => {
          this.setState({ loading: false, prodNotFound: true, favorites: [] });
          console.log(err);
        });
    });
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
        message.success(product.productName + " " + res.data.msg);
        this.getUserFavorites();
      })
      .catch(err => {
        message.error("Error, favorite :(");
        console.log(err);
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
          {!this.state.loading && this.state.prodNotFound ? (
            <ProductNotFound />
          ) : (
              ""
            )}
          {!this.state.loading && this.state.favorites.length ? (
            <CategoryProducts
              sale={this.state.sale}
              prods={this.state.favorites.filter(prods => prods.product !== null).map(prods => {
                return prods.product;
              })}
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
)(WishlistPage);
