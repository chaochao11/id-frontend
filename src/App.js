import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Switch, withRouter } from "react-router-dom";

import SigninPage from "./components/auth/signin";
import SignupPage from "./components/auth/signup";
import ForgetPassword from "./components/auth/forgetPassword";
import Home from "./components/portfolio/portfolio_list";
import Business from "./components/business/business";
import PortfolioListLine from "./components/portfolio/portfolio_list";
import PortfolioDetail from "./components/portfolio/portfolio_detail";
import BuySuccess from "./components/portfolio/buy_success";
import MyAccount from "./components/account/account";
import AccountBuy from "./components/account/pay/accountPay";
import AccountInvite from "./components/account/invite/accountInvite";
import AuthRouter from "./components/auth/auth_router";
import Page404 from "./components/common/404_page";

import Financial from "./components/financial/financial";
import FinancialDetails from "./components/financial/financialDetails";
import FinancialShare from "./components/financial/financialShare";
import FAQ from "./components/business/faq";
import FEES from "./components/business/fees";
import ProductFeature from "./components/product/product_feature";
import SecurityAssurance from "./components/safe/security_assurance";
import Hatch from "./components/fund/hatch";
import Loan from "./components/loan";
import Announcement from "./components/announcement";

import "./../public/js/language/CN.js";
import "./../public/js/language/EN.js";
import "../public/css/style.css";
import "../public/css/unify.css";

import { verifyToken, automaticLogin } from "./actions/auth";

class App extends Component {
  constructor(props) {
    super(props);
    this.from = "/";
  }
  componentDidMount() {
    const { automaticLogin } = this.props;
    const token = localStorage.getItem("token");
    if (token) {
      automaticLogin();
    }
  }
  componentWillReceiveProps(nextProps) {
    const blackList = ["/user/signin", "/user/signup", "/user/forget_password"];
    const { pathname: currentPath } = this.props.location;
    const { pathname: nextPath } = nextProps.location;
    if (blackList.includes(nextPath) && !blackList.includes(currentPath)) {
      this.from = currentPath;
    }
  }
  componentDidUpdate() {
    // 登录成功之后
    const { authenticated, logout, verifyToken } = this.props;
    if (authenticated && !logout) {
      verifyToken();
    }
  }
  render() {
    return (
      <div id="App" className="root-wrapper">
        <AuthRouter />
        <Switch>
          <Route
            path="/user/signin"
            exact
            render={(props) => <SigninPage {...props} from={this.from} />}
          />
          <Route
            path="/user/signup"
            exact
            render={(props) => <SignupPage {...props} from={this.from} />}
          />
          <Route path="/user/forget_password" component={ForgetPassword} />
          <Route path="/user/account" exact component={MyAccount} />
          <Route path="/user/account/buy" exact component={AccountBuy} />
          <Route path="/user/account/invite" exact component={AccountInvite} />
          <Route path="/portfolio/list" component={PortfolioListLine} />
          <Route path="/portfolio/success" component={BuySuccess} />
          <Route path="/portfolio/:portfolioCode" component={PortfolioDetail} />
          <Route path="/product" component={ProductFeature} />
          <Route path="/safe" component={SecurityAssurance} />
          <Route exact path="/financial" component={Financial} />
          <Route
            exact
            path="/financial/details/:id"
            component={FinancialDetails}
          />
          <Route exact path="/financial/share" component={FinancialShare} />
          <Route exact path="/fund/hatch" component={Hatch} />

          <Route path="/business" component={Business} />
          <Route path="/FAQ" component={FAQ} />
          <Route path="/fees" component={FEES} />
          <Route path="/loan" component={Loan} />
          <Route path="/announcement" component={Announcement} />
          <Route exact path="/" component={Home} />
          <Route path="*" component={Page404} />
        </Switch>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    property: state.portfolio.property,
    authenticated: state.auth.authenticated,
    logout: state.auth.logout,
  };
}
export default withRouter(
  connect(
    mapStateToProps,
    { verifyToken, automaticLogin },
  )(App),
);
