//Usual React-App
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import App from "./App";
//Roouter
import { BrowserRouter } from "react-router-dom";
//Redux
import thunk from "redux-thunk";
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";

import reducerDataR from "./Store/reducer/reducerData";
import reducerUserSettingsR from "./Store/reducer/reducerUserSettings";
import userDataR from "./Store/reducer/userData";
import cartDataR from "./Store/reducer/cartData";

const rootReducer = combineReducers({
  reducerData: reducerDataR,
  reducerUserSettings: reducerUserSettingsR,
  userData: userDataR,
  cartData: cartDataR
});

const composeEnhancers =
  process.env.NODE_ENV === "development" //make reduxDevTool extension only available in developer mode
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : null || compose;

//const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
const store = createStore(rootReducer, (applyMiddleware(thunk)))

//Setting app ready
const app = (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(app, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
