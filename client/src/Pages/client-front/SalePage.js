import React, { Component } from "react";
import { Row, Col, message, Spin } from "antd";
import { GET_SALE_PRODUCTS_BY_ID, TOGGLE_FAVORITE_PRODUCT } from "../../Api/api";
import { requestData } from "../../RequestData/RequestData";
import ProductNotFound from "../../Components/front-componenets/product/ProductNotFound";
import { goBack } from "../../Components/goBack";
import ProductPageItem from "../../Components/front-componenets/product/productPageItem";
import SaleProducts from "../../Components/front-componenets/sale/products";
import { connect } from "react-redux";
import * as cartAction from "../../Store/action/cartAction";
import { stringify } from "querystring";

const initState = {
  products: [],
  sale: null,
  prodNotFound: false,
  loading: true,
  favorites: []
};
//http://localhost:3000/salePage?q=5da2f918379d6812586d21a3
//http://localhost:3000/salePage?q=5da2f8ba379d6812586d219e
//http://localhost:3000/salePage?q=5da2f95f379d6812586d21a8

export class SalePage extends Component {
  state = { ...initState };

  componentDidMount() {
    //in case there isnt any id in the params
    if (!this.props.location.search.slice(3)) {
      this.setState({ prodNotFound: true }, () => console.log(this.state));
    }

    this.props.location.search &&
      this.props.location.state &&
      this.props.location.state.products &&
      this.props.location.state.sale
      ? this.initSaleProduct(this.props.location.state)
      : this.getSale(this.props.location.search.slice(3));
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

  initSaleProduct = sale => {
    this.setState({ sale: sale, products: sale.products }, () => {
      this.setState({ loading: false });
    });
  };

  getSale = saleId => {
    let data = {
      url: GET_SALE_PRODUCTS_BY_ID,
      method: "post",
      data: { _id: saleId }
    };
    requestData(data)
      .then(res => {
        this.setState(
          { sale: res.data.sale, products: res.data.allProds },
          () => {
            this.setState({ loading: false });
            this.initFavorites();
          }
        );
      })
      .catch(err => {
        this.setState({ prodNotFound: true }, () => {
          this.setState({ loading: false });
        });
      });
  };
  changeProdPrice = (product) => {
    this.state.sale.prods.map(saleProduct => {
      if (saleProduct.prodId === product._id) {
        product.price = ""+saleProduct.newPrice
      }
    })
    return product
  }
  addToCartHandler = product => {
    product = this.changeProdPrice(product)
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
          {!this.state.loading &&
            this.state.prodNotFound ? (
              <ProductNotFound />
            ) : (
              ""
            )}
          {!this.state.loading && this.state.products.length ? (
            <SaleProducts
              sale={this.state.sale}
              prods={this.state.products.filter(prods => prods !== null)}
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
)(SalePage);
