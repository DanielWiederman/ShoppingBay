import React from "react";
import { withRouter } from 'react-router-dom'
import {
    Icon,
    Badge,
    Col,
  } from "antd";
import { useSelector } from "react-redux";

const cardIcon = (props) => {
  const { userData, cartData } = useSelector(state => ({
    userData: state.userData.userData,
    isAuth: state.userData.isAuth,
    cartData: state.cartData.cartData
  }));
  return userData && userData.admin ? (
    <div>
      <Icon
        type="control"
        className="shoppingCartIcon"
        style={{verticalAlign: "middle"}}
        onClick={() => {
          const { history } = props;
          history.push("/");
        }}
      />
    </div>
  ) : (
    <div className="cartDrop ">
      <Badge count={cartData.length} overflowCount={10}>

        <div className="shoppingCartIcon d-none d-md-inline-block">
          <Icon 
          type="shopping-cart" 
          style={{verticalAlign: "text-top"}}
          onClick={() => {
            const { history } = props;
            history.push("/cart");
          }}
          />
        </div>


        <div className="shoppingCartIcon d-md-none">
          <Icon 
          type="shopping-cart" 
          style={{verticalAlign: "text-bottom"}}
          onClick={() => {
            const { history } = props;
            history.push("/cart");
          }}
          />
        </div>

      </Badge>
    </div>
  );
};

export default withRouter(cardIcon);
