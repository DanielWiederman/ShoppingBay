import React, { Component } from "react";
import { Row, Col, Icon, Spin, message } from "antd";
import { SEARCH_PROD_BY_NAME_AND_CATEGORY, TOGGLE_FAVORITE_PRODUCT } from "../../Api/api";
import { requestData } from "../../RequestData/RequestData";
import ProductNotFound from "../../Components/front-componenets/product/ProductNotFound";
import { goBack } from "../../Components/goBack";
import ProductPageItem from "../../Components/front-componenets/product/productPageItem";
import CategoryProducts from "../../Components/front-componenets/category/products";
import { connect } from "react-redux";
import * as cartAction from "../../Store/action/cartAction";

const initState = {
  products: [],
  prodNotFound: false,
  loading: true,
  favorites: [],
};

export class searchPage extends Component {
  state = { ...initState };

  componentDidMount() {
    this.initFavorites()
    //in case there isnt any id in the params
    if (!this.props.location || !this.props.location.search.slice(3)) {
      this.setState({ prodNotFound: true }, () => console.log(this.state));
    }
    const params = this.getParams();
    this.getQueryResult(params);
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
      this.setState({ loading: true, prodNotFound: false });
      const params = this.getParams();
      this.getQueryResult(params);
    }
  }

  getParams = () => {
    const params = this.props.location.search.slice(3).split("?cat=");
    const query = {
      //%20 stand for space in html query params
      productName: params[0].replace("%20", " "),
      category: params[1] ? params[1].replace("%20", " ") : "all"
    };
    console.log("query =>", query);
    return query;
  };

  getQueryResult = query => {
    let data = {
      url: SEARCH_PROD_BY_NAME_AND_CATEGORY,
      method: "post",
      data: query
    };
    requestData(data)
      .then(res => {
        this.setState({ products: res.data, prodNotFound: false }, () => {
          this.setState({ loading: false });
          this.initFavorites()
        });
      })
      .catch(err => {
        this.setState({ prodNotFound: true, products: [] }, () => {
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
          {(!this.state.loading && 
          this.state.prodNotFound) ||
          !this.state.products.length ? (
            <ProductNotFound />
          ) : (
            ""
          )}
          {!this.state.loading && this.state.products.length ? (
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
)(searchPage);
