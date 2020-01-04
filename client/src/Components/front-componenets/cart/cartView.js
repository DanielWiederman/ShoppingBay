import React, { useEffect, useState } from "react";
import { Row, Col, Button, Icon, Input, Avatar, Popconfirm } from "antd";
import "../../../CSS/ClientCSS/cart.css";

const cartView = props => {
  function getTotalPrice() {
    let price = 0;
    props.cartItems.map(item => {
      const product = item.product;
      const productBuyQuantity = item.buyQuantity;
      return (price += productBuyQuantity * parseInt(product.price, 10));
    });
    return price + "$";
  }

  function getItems() {}

  const tableItems =
    props.cartItems.length &&
    props.cartItems.map(item => {
      const product = item.product;
      const productBuyQuantity = item.buyQuantity;
      return (
        <Col
          span={24}
          key={product._id}
          className="mt-2 mb-2 pb-2 no-select item-row"
        >
          <Row type="flex" align="middle">
            <Col span={10} className="cart-product-title text-left">
              <Row type="flex" align="middle">
                <Col className="pl-2 pr-2 pb-1" className="d-none d-sm-block">
                  <Popconfirm
                    title="Are you sure to remove this product?"
                    onConfirm={() => props.deleteFromCartHandler(product)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Icon
                      theme="twoTone"
                      type="delete"
                      className="pb-md-1"
                      style={{ verticalAlign: "middle", cursor: "pointer" }}
                    />{" "}
                    |
                  </Popconfirm>
                </Col>
                <Col className="pl-2">
                  <Avatar shape="square" src={product.image} className="mr-2" />
                </Col>
                <Col>
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      props.redirectToProduct(product);
                    }}
                  >
                    {product.productName}
                  </span>
                </Col>
              </Row>
            </Col>
            <Col span={5} className="text-center">
              {product.price + "$"}
            </Col>
            <Col span={9} className="text-right">
              <Row type="flex" align="middle" justify="end">
                <Col className="text-right pr-2 cart-toggle-button">
                  <Icon
                    type="plus-circle"
                    style={{ verticalAlign: "middle" }}
                    onClick={() => {
                      props.addToCartHandler(product);
                    }}
                  />
                </Col>
                <Col span={8} md={6} xl={4}>
                  <Input disabled={true} defaultValue={productBuyQuantity} />
                </Col>
                <Col className="text-left pl-2 cart-toggle-button">
                  <Icon
                    type="minus-circle"
                    style={{ verticalAlign: "middle" }}
                    onClick={() => {
                      props.decreaseFromCartHandler(
                        product,
                        productBuyQuantity - 1
                      );
                    }}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      );
    });

  const tableInfo = (
    <Col span={24} className="mt-2 mb-1 cart-info">
      <Row type="flex" align="middle">
        <Col span={10} className="text-left cart-info-title">
          Product
        </Col>
        <Col span={5} className="text-center cart-info-title">
          Price
        </Col>
        <Col span={9} className="text-right">
          <span className="pr-3 pr-sm-4 cart-info-title">Quantity</span>
        </Col>
      </Row>
    </Col>
  );

  const totalPrice = getTotalPrice();

  return (
    <div>
      <Row>
        <Col span={24}>
          <Row type="flex" justify="center">
            <Col
              span={22}
              sm={18}
              lg={16}
              xl={10}
              className="cart-container mt-4 mb-4"
            >
              <Row type="flex" justify="center">
                <Col span={22} className="pt-4 pt-md-3">
                  <Row>{tableInfo}</Row>
                  <Row>{tableItems}</Row>
                </Col>
                <Col span={22} className="pt-5 pt-md-3 pb-3 pb-md-2">
                  <Row
                    type="flex"
                    justify="end"
                    align="middle"
                    className="total-price"
                  >
                    <Col span={10} sm={0} className="mb-1">
                      <Row type="flex" justify="start">
                        <Col>
                          <Popconfirm
                            title="Are you sure to remove all products?"
                            onConfirm={() => props.deleteAllCartData()}
                            okText="Yes"
                            cancelText="No"
                          >
                            <Button shape="circle-outline" type="primary">
                              <Icon
                                theme="filled"
                                type="delete"
                                className="pb-1"
                                style={{
                                  verticalAlign: "middle",
                                  cursor: "pointer"
                                }}
                              />
                            </Button>
                          </Popconfirm>
                        </Col>
                      </Row>
                    </Col>
                    <Col span={14} sm={24}>
                      <Row type="flex" justify="end">
                        <Col>
                          <Icon
                            type="dollar"
                            className="pb-1 pr-1"
                            style={{ verticalAlign: "middle" }}
                          />
                        </Col>
                        <Col>Total price: {totalPrice}</Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
                <Col span={22} className="mb-4 mt-md-3 mt-2">
                  <Button
                    type="primary"
                    shape="round"
                    size="large"
                    block
                    onClick={() => {
                      props.submitCart();
                    }}
                  >
                    Finish Order
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default cartView;
