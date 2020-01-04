import React, { Component } from "react";
import * as action from '../../../Store/action/cartAction'
import { connect } from 'react-redux'
import { withRouter } from "react-router-dom";
import { Row, Col, Icon, Button, Message, InputNumber, Alert, message } from "antd";
import GoBack from "../../goBack";
import "../../../CSS/ClientCSS/productItem.css";

const initState = {
  buyQuantity: 1,
  cart: []
};

export class ProductPageItem extends Component {
  state = { ...initState };

  componentDidMount() {
  }

  onQuantityChangeHandler = value => {
    let prodIndex = this.props.cartData.findIndex(index => index.product._id === this.props.product._id)
    var buyQuantity = 0
    if ((value > 0) && (value <= this.props.product.quantity)) {
      if (prodIndex > -1) {
        if ((this.props.product.quantity - this.props.cartData[prodIndex].buyQuantity > 0)) {
          buyQuantity = value
        }
      } else {
        buyQuantity = value
      }
    }
    else {
      message.error("You cant order more than " + this.props.product.quantity + " pieces", 4)
    }
    this.setState({ buyQuantity: buyQuantity }, () => {
      console.log(this.state.buyQuantity)
    });
  }
  addToCartHandler = () => {
    this.props.addToCart(this.props.product, this.state.buyQuantity, this.props.cartData)
    let copyState = JSON.parse(JSON.stringify(this.state));
    copyState.cart = this.props.cartData
    this.setState(copyState, () => {
      message.success("Succesfly added to cart", 2);
    });
  }

  // deleteProdFromCart = () => {
  //   this.props.deleteProdFromCart(this.props.product, this.state.buyQuantity, this.props.cartData).then(res => {
  //     let copyState = JSON.parse(JSON.stringify(this.state));
  //     copyState.cart = res
  //     copyState.buyQuantity = 1
  //     this.setState(copyState, () => {
  //       console.log(this.state.buyQuantity)
  //     });
  //   })
  // }
  // decQuantityFromCart = () => {
  //   this.props.decQuantityFromCart(this.props.product, 1, this.props.cartData).then(res => {
  //     let copyState = JSON.parse(JSON.stringify(this.state));
  //     copyState.cart = res
  //     this.setState(copyState);

  //   })
  // }

  maxQuantityToShow = () => {
    let prodIndex = this.props.cartData.findIndex(index => index.product._id === this.props.product._id)
    if (prodIndex > -1) {
      if (this.props.product.quantity - this.props.cartData[prodIndex].buyQuantity > 0) {
        return (this.props.product.quantity - this.props.cartData[prodIndex].buyQuantity)
      } else {
        return 0
      }
    } else {
      return this.props.product.quantity
    }
  }
  render() {
    return (
      <Row type="flex" justify="center" className="h-100">
        <Col
          span={24}
          sm={18}
          xl={12}
          className="bg-white shadow border rounded"
        >
          <Row>
            <Col span={24} className="pt-4 pl-4">
              <GoBack color={"black"} />
            </Col>
            <Col span={24}>
              <Row type="flex" justify="center">
                <Col span={24} className="product-item-title text-center">
                  {this.props.product.productName}
                </Col>
                {/* This Col hold the 2 sections */}
                <Col span={22} className="pt-4">
                  <Row type="flex" align="middle">
                    {/* First section for product information */}
                    <Col span={24} order={2} sm={{ span: 12, order: 1 }}>
                      <Row type="flex" justify="center">
                        {parseInt(this.props.product.quantity) && this.maxQuantityToShow() !== 0 ? (
                          ""
                        ) : (
                            <Col span={22} className="mb-2 mt-4 mt-md-0">
                              <Alert
                                message="Error"
                                description="This product is currently out of stock"
                                type="error"
                                showIcon
                              />
                            </Col>
                          )}
                        {/* First section, line 1 - product price */}
                        <Col span={24} className="mb-2 mt-4 mt-md-0 product-title">
                          <Row type="flex" align="middle">
                            <Col
                              span={12}
                              className="product-item-second-title pr-2"
                            >
                              Product price:
                            </Col>
                            <Col
                              span={12}
                              className="product-item-price text-right pr-4"
                            >
                              {this.props.product.price}$
                            </Col>
                          </Row>
                        </Col>
                        {/* First section, line 2 - select product quantity */}
                        <Col span={24} className="mb-2 mt-2 product-title">
                          <Row type="flex" align="middle">
                            <Col
                              span={12}
                              className="product-item-second-title pr-2"
                            >
                              Quantity:
                            </Col>
                            <Col
                              span={12}
                              className="product-item-price text-right pr-4 pb-2"
                            >
                              <InputNumber
                                min={1}
                                max={parseInt(this.maxQuantityToShow())}
                                onChange={this.onQuantityChangeHandler}
                                value={this.state.buyQuantity}
                                disabled={
                                  !parseInt(this.maxQuantityToShow())
                                }
                              />
                            </Col>
                          </Row>
                        </Col>
                        {/* First section, line 3 - product total calculated price */}
                        <Col span={24} className="mb-2 mt-2 product-title">
                          <Row type="flex" align="middle">
                            <Col
                              span={12}
                              className="product-item-second-title pr-2"
                            >
                              Total price:
                            </Col>
                            <Col
                              span={12}
                              className="product-item-price text-right pr-4"
                            >
                              {parseInt(this.maxQuantityToShow())
                                ? this.props.product.price *
                                this.state.buyQuantity
                                : 0}
                              $
                            </Col>
                          </Row>
                        </Col>
                        {/* First section, line 4 - Buy button */}
                        <Col span={24} className="mb-4 mt-4">
                          <Row>
                            <Col>
                              {
                                this.props.order ? null : <Button type="primary" disabled={this.maxQuantityToShow() > 0 ? false : true} onClick={this.addToCartHandler}>Add To Cart</Button>
                            }
                             
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                    {/* Second section for product image */}
                    <Col span={24} order={1} sm={{ span: 12, order: 2 }}>
                      <Row>
                        <Col className="text-center">
                          <img
                            src={this.props.product.image}
                            className="img-fluid"
                          />
                        </Col>
                      </Row>
                    </Col>
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
const mapStateToProps = (state) => ({
  cartData: state.cartData.cartData,
})

const mapDispatchToProps = dispatch => {
  return {
    addToCart: (product, buyQuantity, cartData) => dispatch(action.addToCart(product, buyQuantity, cartData)),
    deleteProdFromCart: (product, buyQuantity, cartData) => dispatch(action.deleteProdFromCart(product, buyQuantity, cartData)),
    decQuantityFromCart: (product, buyQuantity, cartData) => dispatch(action.decQuantityFromCart(product, buyQuantity, cartData)),
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductPageItem))
