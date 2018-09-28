import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router";
import { connect } from "react-redux";
import Header from "./../common/header.js";
import Footer from "./../common/footer.js";
import LoanPage from "./LoanPage.js";
import LoanApplyPage from "./LoanApplyPage.js";
import LoanSuccessPage from "./LoanSuccessPage.js";

class Loan extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { authenticated } = this.props;

    return (
      <div>
        <Header />
        <Switch>
          <Route
            path="/loan/loanApply"
            extract
            render={(props) =>
              authenticated ? (
                <LoanApplyPage {...props} />
              ) : (
                <Redirect to="/loan" />
              )
            }
          />
          <Route
            path="/loan/loanSuccess"
            extract
            render={(props) =>
              authenticated ? (
                <LoanSuccessPage {...props} />
              ) : (
                <Redirect to="/loan" />
              )
            }
          />
          <Route
            path="/loan"
            extract
            render={(props) => (
              <LoanPage {...props} authenticated={authenticated} />
            )}
          />
        </Switch>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    authenticated: state.auth.authenticated,
  };
};

export default connect(mapStateToProps)(Loan);
