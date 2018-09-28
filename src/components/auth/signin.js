import React, { Component } from "react";
import { connect } from "react-redux";
import Header from "../common/header";
import Footer from "../common/footer";
import SiginComponent from "./signin_component.js";
import "./auth.css";

class SigninPage extends Component {
  constructor(props) {
    super(props);
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
        <div className="signin-page auth-page">
          <div className="signin-wrapper auth-wrapper">
            <SiginComponent from={this.props.from} history={history} />
            {/* 登录 banner 图 开始 */}
            <div className="signup-banner-img banner-container">
              <img
                src={require("./../../../public/img/signin-banner.png")}
                alt="166IDT欢乐送"
                title="166IDT欢乐送"
              />
            </div>
            {/* 登录 banner 图 结束 */}
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

export default connect(mapStateToProps)(SigninPage);
