import React from "react";
import { createStore, applyMiddleware, compose } from "redux";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import reduxThunk from "redux-thunk";
import { AppContainer } from "react-hot-loader";
import reducers from "./reducers";

import App from "./App";
import ScrollTop from "./components/common/ScrollTop";

const isProduction = process.env.NODE_ENV === "production";

const store = isProduction
  ? compose(applyMiddleware(reduxThunk))(createStore)(reducers)
  : compose(
      applyMiddleware(reduxThunk),
      window.devToolsExtension ? window.devToolsExtension() : (f) => f,
    )(createStore)(reducers);

const ROOT_NODE = document.getElementById("root");
const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <BrowserRouter>
          <ScrollTop>
            <Component />
          </ScrollTop>
        </BrowserRouter>
      </Provider>
    </AppContainer>,
    ROOT_NODE,
  );
};
render(App);

if (module.hot) {
  module.hot.accept("./App.js", () => {
    const NextApp = require("./App.js").default;
    render(NextApp);
  });
}
