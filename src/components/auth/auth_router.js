import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { signOutUser } from "./../../actions/auth";

const AuthRouter = (props) => {
  axios.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  axios.interceptors.response.use(
    (response) => {
      // TODO: 过滤验证 token 的请求URL /muser/auth/verify
      if (response.data.status === -8 || response.data.status === -9) {
        props.signOutUser();
      }
      return response;
    },
    (error) => {
      // TODO: 过滤验证 token 的请求URL /muser/auth/verify
      if (error.response.status === 403) {
        props.signOutUser();
      }
      return Promise.reject(error);
    },
  );

  if (!props.authenticated && props.logout) {
    return <Redirect to="/user/signin" />;
  } else {
    return null;
  }
};

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    logout: state.auth.logout,
  };
}

export default connect(mapStateToProps, { signOutUser })(AuthRouter);
