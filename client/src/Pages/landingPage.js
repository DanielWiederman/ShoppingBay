import React, { Component } from "react";
import { connect } from "react-redux";
import "../CSS/ClientCSS/landingPage.css";
import * as action from "../Store/action/action";
import * as cartAction from "../Store/action/cartAction";
import { Col, Row, Icon, message } from "antd";
import {
  GET_ALL_HOT_PRODUCT,
  GET_ACTIVE_SALES,
  TOGGLE_FAVORITE_PRODUCT
} from "../Api/api";
import "react-id-swiper/lib/styles/css/swiper.css";
import { requestData } from "../RequestData/RequestData";
import SaleCard from "../Components/front-componenets/SaleCard";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

const initState = {
  hotProds: null,
  sales: null,
  favorites: [],
  loading: false,
};

export class landingPage extends Component {
  state = { ...initState };

  componentDidMount() {
    this.initHotProd();
    this.initSales();
    this.initFavorites();
  }

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

  initFavorites = () =>{
    this.setState({favorites : JSON.parse(localStorage.getItem("favorite"))})
  }

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

    this.setState({ loading: true });
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
        this.setState({ loading: false, favorites: favorite}, () => {
          message.success(product.productName + " " + res.data.msg);
        });
      })
      .catch(err => {
        message.error("Error, favorite :(");
        console.log(err);
      });
  };

  initSales() {
    this.setState({ loading: true });
    let data = {
      url: GET_ACTIVE_SALES,
      method: "post"
    };
    requestData(data)
      .then(res => {
        this.setState({ sales: res.data });
      })
      .catch(err => {
        console.log(err);
      });
  }

  initHotProd = () => {
    let getHotProds = {
      url: GET_ALL_HOT_PRODUCT,
      method: "get"
    };
    requestData(getHotProds).then(hotProds => {
      this.setState({ hotProds: hotProds.data }, () => console.log(this.state));
    });
  };

  onClickHandler = () => {
    this.props.saveData(this.props.data + 1);
  };

  render() {
    const hotProducts =
      this.state.hotProds &&
      this.state.hotProds
        .filter(prods => prods !== null)
        .map(product => {
          return (
            <SaleCard
              key={product._id}
              title={product.productName}
              price={product.price}
              imageUrl={product.image}
              product={product}
              favorite={
                this.state.favorites &&
                this.state.favorites.filter(
                  favorProd => favorProd.productId === product._id
                ).length
              }
              clickCart={() => {
                this.addToCartHandler(product);
              }}
              clickFavor={() => {
                this.toggleFavorite(product);
              }}
            />
          );
        });

    const carouselItems =
      this.state.sales &&
      this.state.sales
        .filter(index => index.prods.length)
        .map(sale => {
          return (
            <div
            style={{cursor: "pointer"}}
              key={sale._id}
              onClick={() => {
                this.props.history.push({
                  pathname: "/salePage",
                  search: "?q=" + sale._id,
                  state: { sale: sale, products: sale.products }
                });
              }}
            >
              <img
                src={sale.image}
                className="img-fluid"
                alt={"" + sale.saleName}
              />
              <p>{sale.saleName}</p>
            </div>
          );
        });

    return (
      <Row
        className="mainPageHeight"
        type="flex"
        justify="center"
        className="mt-4"
      >
        <Col span={24}>
          <Row type="flex" justify="center">
            <Col md={12} span={20}>
              <Carousel
                autoPlay={true}
                infiniteLoop={true}
                dynamicHeight={true}
              >
                {carouselItems}
              </Carousel>
            </Col>
          </Row>
        </Col>

        <Col span={24} xl={18}>
          <Row type="flex" justify="center">
            <Col span={20}>
              {hotProducts ? (
                <Row
                  type="flex"
                  align="middle"
                  className="text-center text-md-left"
                >
                  <Col className="d-inline-block">
                    <Icon type="fire" className="main-title-icon pr-1 pb-1" />
                  </Col>
                  <Col className="main-title d-inline-block">
                    <u>Hot Products</u>
                  </Col>
                </Row>
              ) : null}
              <Row>
                <Col span={24} className="mb-5">
                  <Row type="flex" justify="space-around">
                    {hotProducts}
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
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
    saveData: data => dispatch(action.saveData(data)),
    addToCart: (product, buyQuantity, cartData) =>
      dispatch(cartAction.addToCart(product, buyQuantity, cartData))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(landingPage);
