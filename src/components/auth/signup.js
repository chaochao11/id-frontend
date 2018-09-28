import React, { Component } from "react";
import { connect } from "react-redux";
import Header from "../common/header";
import Footer from "../common/footer";
import SignupComponent from "./signup_component.js";
import { parseUrl } from "./../../tools/utils.js";
import "./auth.css";

class SignupPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      useInviteCode: parseUrl(this.props.location.search).query.inviteCode || "",
    };
  }

  componentWillMount() {
    if (this.props.authenticated) {
      this.props.history.push("/");
    }
  }

  render() {
    const { history } = this.props;
    return (
      <div>
        <Header />

        <div className="signup-page auth-page">
          <div className="signup-wrapper auth-wrapper">
            <SignupComponent
            history={history}
              useInviteCode={this.state.useInviteCode}
              from={this.props.from}
            />
            {/* 注册 banner 图 开始 */}
            <div className="signup-banner-img banner-container">
              <img
                src={require("./../../../public/img/signin-banner.png")}
                alt="166IDT欢乐送"
                title="166IDT欢乐送"
              />
            </div>
            {/* 注册 banner 图 结束 */}
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { authenticated: state.auth.authenticated };
}

export default connect(mapStateToProps)(SignupPage);
