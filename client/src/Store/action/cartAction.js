import * as actionType from "./actionType";

export const getCart = cartData => {
    return {
      type: actionType.ADD_TO_CART,
      payload: cartData
    };
};

export const deleteAllCartData = () => {
  return {
    type: actionType.DELETE_ALL_CART,
    payload: []
  };
};

export const addToCart = (product, buyQuantity, cartData) => {
  if (buyQuantity > 0) {
    if (cartData.length === 0) {
      cartData.push({ product: product, buyQuantity: buyQuantity });
    } else {
      let prodIndex = cartData.findIndex(
        index => index.product._id === product._id
      );
      if (prodIndex !== -1) {
        cartData[prodIndex].buyQuantity += buyQuantity;
      } else {
        cartData.push({ product: product, buyQuantity: buyQuantity });
      }
    }
  }
  localStorage.setItem('cartData', JSON.stringify(cartData))
  return {
    type: actionType.ADD_TO_CART,
    payload: cartData
  };
};

export const deleteProdFromCart = (product, cartData) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      cartData = cartData.filter(index => index.product !== product);
      localStorage.setItem('cartData', JSON.stringify(cartData))
      dispatch({
        type: actionType.DELETE_FROM_CART,
        payload: cartData
      });
      resolve(cartData);
    });
  };
};

export const decQuantityFromCart = (product, buyQuantity, cartData) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      if (cartData.length > 0) {
        let prodIndex = cartData.findIndex(
          index => index.product._id === product._id
        );
        if (buyQuantity === 1) {
          if (prodIndex !== -1) {
            if (
              cartData[prodIndex].buyQuantity > 0 &&
              cartData[prodIndex].buyQuantity - 1 > 0
            ) {
              cartData[prodIndex].buyQuantity -= 1;
            } else {
              cartData = cartData.filter(
                index => index.product._id !== product._id
              );
            }
          }
        } else {
          if (prodIndex !== -1) {
            if (
              cartData[prodIndex].buyQuantity > 0 &&
              cartData[prodIndex].buyQuantity - buyQuantity > 0
            ) {
              cartData[prodIndex].buyQuantity -= buyQuantity;
            } else {
              cartData = cartData.filter(index => index.product !== product);
            }
          }
        }
      }
      localStorage.setItem('cartData', JSON.stringify(cartData))
      dispatch({
        type: actionType.DELETE_FROM_CART,
        payload: cartData
      });
      resolve(cartData);
    });
  };
};
