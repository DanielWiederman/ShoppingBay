import React, { useEffect, useState } from "react";
import { Row, Col, Button, Icon, Input, Avatar } from "antd";
import "../../../CSS/ClientCSS/cart.css";

const orderView = props => {

  const tableItems =
    props.orderItems.length &&
    props.orderItems.map(item => {
      const product = item.product;
      const productBuyQuantity = item.buyQuantity;
      return (
        <Col
          span={24}
          key={product._id}
          className="mt-2 mb-2 pb-2 no-select item-row"
        >
          <Row type="flex" align="middle">
            <Col span={11} className="cart-product-title text-left">
              <span
                style={{ cursor: "pointer" }}
                onClick={() => {
                  props.redirectToProduct(product);
                }}
              >
                <Avatar shape="square" src={product.image} className="mr-2" />
                {product.productName}
              </span>
            </Col>
            <Col span={6} className="text-center">
              {product.price + "$"}
            </Col>
            <Col span={7} className="text-center">
              <Row type="flex" align="middle" justify="center">
                <Col>
                 {productBuyQuantity}
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
        <Col span={11} className="text-left cart-info-title">
          Product
        </Col>
        <Col span={6} className="text-center cart-info-title">
          Price
        </Col>
        <Col span={7} className="text-center">
          <span className="cart-info-title">Quantity</span>
        </Col>
      </Row>
    </Col>
  );


  return (
    <div>
      <Row>
        <Col span={24}>
          <Row type="flex" justify="center">
            <Col span={22} sm={17} lg={12} className={props.noSpacing? "cart-container mb-4" : "cart-container mt-4 mb-4"}>
              <Row type="flex" justify="center">
                <Col span={22} className={props.noSpacing? "" : "pt-4 pt-md-3"}>
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
                    <Col className="pr-2">Order price:</Col>
                    <Col>{props.totalSum + "$"}</Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default orderView;
