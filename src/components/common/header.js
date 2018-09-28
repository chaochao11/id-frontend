import React, { Component } from "react";
import { NavLink, Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { signOutUser } from "./../../actions/auth";
import { ROOT_AVATAR, BBS_URL } from "../../actions/types";
import headImg from "./../../../public/img/default.png";
import { Dropdown, Menu } from "antd";
import "./header.css";

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      toggleDropDownMenuDisplay: false,
    };
    this.jumpToHomePage = this.jumpToHomePage.bind(this);
    this.renderUserLoginStatus = this.renderUserLoginStatus.bind(this);
    this.toggleDropDownMenu = this.toggleDropDownMenu.bind(this);
  }
  setDefaultActiveKeyToLocalStorage(key) {
    localStorage.setItem("defaultActiveKey", key);
  }

  jumpToHomePage() {
    this.props.history.push("/");
  }

  /**
   * @description 根据用户登录状态渲染登录注册入口或者用户名和头像
   */
  renderUserLoginStatus() {
    if (this.props.authenticated) {
      const userAvatar = localStorage.getItem("avatar")
        ? `${ROOT_AVATAR}/${localStorage.getItem("avatar")}`
        : headImg;

      const loginName = localStorage.getItem("loginname");

      const menu = (
        <Menu>
          <Menu.Item>
            <Link
              to="/user/account"
              onClick={() => this.setDefaultActiveKeyToLocalStorage(1)}
            >
              我的账户
            </Link>
          </Menu.Item>
          <Menu.Item>
            <Link
              to="/user/account"
              onClick={() => this.setDefaultActiveKeyToLocalStorage(2)}
            >
              我的投资
            </Link>
          </Menu.Item>
          <Menu.Item>
            <Link
              to="/user/account"
              onClick={() => this.setDefaultActiveKeyToLocalStorage(4)}
            >
              财务明细
            </Link>
          </Menu.Item>
          <Menu.Item>
            <a onClick={() => this.props.signOutUser()}>退出登录</a>
          </Menu.Item>
        </Menu>
      );

      return (
        <div className="user-login-status-container" id="login_container">
          <a>{loginName}</a>
          <Dropdown
            overlay={menu}
            placement={
              this.state.toggleDropDownMenuDisplay
                ? "bottomRight"
                : "bottomCenter"
            }
            trigger={["click"]}
            getPopupContainer={() => document.getElementById("login_container")}
          >
            <a className="user-avatar-wrapper">
              <img src={userAvatar} alt={loginName} title={loginName} />
            </a>
          </Dropdown>
        </div>
      );
    } else {
      return (
        <div className="user-login-status-container">
          <Link className="signin-link" to="/user/signin">
            登录
          </Link>
          <Link className="signup-link" to="/user/signup">
            注册
          </Link>
        </div>
      );
    }
  }

  toggleDropDownMenu() {
    this.setState({
      toggleDropDownMenuDisplay: !this.state.toggleDropDownMenuDisplay,
    });
  }

  render() {
    const { toggleDropDownMenuDisplay } = this.state;

    /**
     * @description 移动端切换下拉导航菜单按钮
     */
    const NavBarToggle = (
      <button
        type="button"
        className={`nav-bar-toggle`}
        onClick={this.toggleDropDownMenu}
      >
        <span className="icon-bar" />
        <span className="icon-bar" />
        <span className="icon-bar" />
        <span className="icon-bar" />
        <span className="icon-bar" />
      </button>
    );

    /**
     * @description 头部导航的入口链接 不包括登录注册链接
     */
    const HeaderLinkGroup = [
      <div key={Math.random() * 10}>
        <Link to="/">
          首页
        </Link>
      </div>,
      <div key={Math.random() * 10}>
        <NavLink to="/financial">
          我要理财
        </NavLink>
      </div>,
      <div key={Math.random() * 10}>
        <NavLink to="/loan">
          我要借款
        </NavLink>
      </div>,
      <div key={Math.random() * 10}>
        <NavLink to="/fund/hatch">
          基金孵化
        </NavLink>
      </div>,
      <div key={Math.random() * 10}>
        <NavLink to="/product">
          产品特色
        </NavLink>
      </div>,
      <div key={Math.random() * 10}>
        <NavLink to="/safe">
          安全保障
        </NavLink>
      </div>,
      <div key={Math.random() * 10}>
        <NavLink
          to="/user/account"
          onClick={() => this.setDefaultActiveKeyToLocalStorage(1)}
        >
          我的账户
        </NavLink>
      </div>,
    ];

    /**
     * @description 移动端下拉导航菜单 包括登录注册以及用户登录后的用户名和头像
     */
    const DropdownMenu = (
      <div
        className={`drop-down-menu-wrapper ${
          toggleDropDownMenuDisplay ? "menu-show" : "menu-hide"
        }`}
      >
        {toggleDropDownMenuDisplay && HeaderLinkGroup}
        {toggleDropDownMenuDisplay && this.renderUserLoginStatus()}
      </div>
    );

    return (
      <header className="header-wrapper">
        <div className="header-top">
          <div className="header-container header-top-container">
            <div className="customer-service-container">
              <span className="service-phone">400-626-1176</span>
              <span className="service-time">（服务时间：9:00 - 22:00）</span>
            </div>
            <div className="signin-signup-container">
              <a href={BBS_URL} target="_blank">
                IDT社区
              </a>
              {!toggleDropDownMenuDisplay && this.renderUserLoginStatus()}
            </div>
          </div>
        </div>
        <nav className={`header-nav`}>
          <div className="header-container header-nav-container">
            <div className="logo-container" onClick={this.jumpToHomePage}>
              <img
                src={require("./../../../public/img/logo.png")}
                alt="InvestDigital"
                title="InvestDigital"
              />
              <h1>InvestDigital</h1>
            </div>
            <div className="nav-link-group">{HeaderLinkGroup}</div>
            {NavBarToggle}
            {DropdownMenu}
          </div>
        </nav>
      </header>
    );
  }
}
function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
  };
}
export default withRouter(
  connect(
    mapStateToProps,
    { signOutUser },
  )(Header),
);
