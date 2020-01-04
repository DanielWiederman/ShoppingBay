import React from "react";
import { Col, Card, Icon, Avatar } from "antd";
import "../../CSS/ClientCSS/sale-card.css";
import { withRouter } from 'react-router-dom'
const { Meta } = Card;
const Products = props => {
  return (
    <Col span={23} md={12} xl={8} className="p-3">
      <Card
        cover={
          <img alt={props.title} src={props.imageUrl} className="sale-img" onClick={() => {
            props.history.push({
              pathname: '/product',
              search: '?q=' + props.product._id,
              state: { product: props.product }
            })
          }} />
        }
        actions={[
          <Icon
            style={{ fontSize: "25px" }}
            type="heart"
            title="Add to your wishlist"
            onClick={props.clickFavor}
            theme={props.favorite? 'twoTone' : 'outlined'}
          />,
          <Icon
            style={{ fontSize: "25px" }}
            title="Add to your cart"
            type="shopping-cart"
            onClick={props.clickCart}
          />
        ]}
      >
        <Meta
          style={{ fontFamily: "Asap" }}
          avatar={props.avatar ? <Avatar src={props.avatar} /> : null}
          title={
            <span className="text-dark font-weight-bold sale-card-title" onClick={() => {
              props.history.push({
                pathname: '/product',
                search: '?q=' + props.product._id,
                state: { product: props.product }
              })
            }}>
              {props.title}
            </span>
          }
          description={props.description}
        />
        <Col className="text-right pt-3">
          {props.oldPrice? <div style={{textDecoration: "line-through"}}>
            <b>{props.oldPrice}$</b>
            </div>: ''}
          <div><b style={props.oldPrice? {fontWeight: "600"} : {}}>{props.price}$</b></div>
        </Col>
      </Card>
    </Col>
  );
};
export default withRouter(Products);
