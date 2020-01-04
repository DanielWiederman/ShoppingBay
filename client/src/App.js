import React, { Component } from "react";
import * as action from "../src/Store/action/userDataActions";
import * as cartAction from "../src/Store/action/cartAction";
import { connect } from "react-redux";
import { Switch, Route, withRouter, Redirect } from "react-router-dom";
import Layout from "./Layout/layout";
import { LOGIN_WITH_TOKEN, GET_FAVORIT_PRODUCTS_ID_BY_USER_ID } from "./Api/api";
import { reqLocalStorage } from "./localStorage/file";
import "./App.css";
//routes importing
import adminPanel from "./Pages/adminPanel";
import adminSales from "./Pages/adminSales";
import manageProducts from "./Pages/manageProducts";
import landingPage from "./Pages/landingPage";
import authPage from "./Pages/authPage";
import registerForm from "./Pages/client-front/registerForm";
import ProductPage from "./Pages/client-front/ProductPage";
import { requestData } from "./RequestData/RequestData";
import contantList from "./Components/contantList";
import NoAccess from "./Components/front-componenets/results/NoAccess";
import cartPage from "./Pages/client-front/cartPage";
import categoryPage from "./Pages/client-front/categoryPage";
import searchPage from "./Pages/client-front/searchPage";
import SalePage from "./Pages/client-front/SalePage";
import orderPage from "./Pages/client-front/orderPage";
import userOrderPage from "./Pages/client-front/userOrderPage";
import OrderList from "./Components/OrdersList";
import WishlistPage from "./Pages/client-front/WishlistPage";

class App extends Component {
  state = {
    loading: true
  };

  componentDidMount() {
    let dataStorage = {
      method: "get"
    };
    let cartData = JSON.parse(localStorage.getItem("cartData"));
    if (cartData && cartData.length) {
      this.props.getCart(cartData);
    }
    let tokenStorage = reqLocalStorage(dataStorage);
    if (tokenStorage) {
      let data = {
        url: LOGIN_WITH_TOKEN,
        method: "get",
        header: {
          token: tokenStorage
        }
      };

      requestData(data).then(res => {
        let user = res.data;
        user.fullName = user.firstName + " " + user.lastName;
        delete user.password;
        delete user.tokens;
        delete user.secAns;
        delete user.secQes;
        this.props
          .saveUser(user)
          .then(res => {
            this.props.turnAuth().then(result => {
              this.initFavorite()
            });
          })
          .catch(err => {
            console.log(err);
          });
      });
    }
  }


  initFavorite = () => {
    let data = {
      url: GET_FAVORIT_PRODUCTS_ID_BY_USER_ID,
      method: "post",
      data: {
        userId: this.props.userData._id,
      }
    };
    requestData(data)
      .then(res => {
        localStorage.setItem("favorite", JSON.stringify(res.data))
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    let route;
    if (this.props.isAuth && this.props.userData.admin) {
      route = (
        //admin
        <Switch>
          <Route path="/" component={adminPanel} exact />
          <Route path="/home" component={landingPage} />
          <Route path="/product" component={ProductPage} />
          <Route path="/authPage" component={authPage} />
          <Route path="/register" component={registerForm} />
          <Route path="/contactList" component={contantList} />
          <Route path="/manageProducts" component={manageProducts} />
          <Route
            path="/manageProducts/RemoveProduct"
            component={manageProducts}
          />
          <Route path="/manageProducts/AddProduct" component={manageProducts} />
          <Route path="/search" component={searchPage} />
          <Route path="/category" component={categoryPage} />
          <Route path="/sales" component={adminSales} />
          <Route path="/salePage" component={SalePage} />
          <Route path="/cart" component={cartPage} />
          <Route path="/order" component={orderPage} />
          <Route path="/orderList" component={userOrderPage} />
          <Route path="/manageOrdersList" component={OrderList} />
          <Route path="/wishlist" component={WishlistPage} />
          <Redirect to="/" />
        </Switch>
      );
    } else if (this.props.isAuth && !this.props.userData.admin) {
      route = (
        //auth user
        <Switch>
          <Route path="/" component={landingPage} exact />
          <Route path="/product" component={ProductPage} />
          <Route path="/cart" component={cartPage} />
          <Route path="/category" component={categoryPage} />
          <Route path="/search" component={searchPage} />
          <Route path="/salePage" component={SalePage} />
          <Route path="/order" component={orderPage} />
          <Route path="/orderList" component={userOrderPage} />
          <Route path="/wishlist" component={WishlistPage} />
          <Redirect to="/" />
        </Switch>
      );
    } else {
      route = (
        //guest
        <Switch>
          <Route path="/" component={landingPage} exact />
          <Route path="/search" component={searchPage} />
          <Route path="/authPage" component={authPage} />
          <Route path="/register" component={registerForm} />
          <Route path="/product" component={ProductPage} />
          <Route path="/cart" component={cartPage} />
          <Route path="/category" component={categoryPage} />
          <Route path="/salePage" component={SalePage} />
          <Route path="/order" component={orderPage} />
          <Redirect to="/" />
        </Switch>
      );
    }

    return (
      <Layout className="App">
        {route}
      </Layout>
    );
  }
}

const mapStateToProps = state => ({
  isAuth: state.userData.isAuth,
  userData: state.userData.userData
});

const mapDispatchToProps = dispatch => {
  return {
    saveUser: data => dispatch(action.saveUser(data)),
    turnAuth: () => dispatch(action.turnAuth()),
    getCart: data => dispatch(cartAction.getCart(data))
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
