import {
  AUTH_USER,
  UNAUTH_USER,
} from "../actions/auth.js";

const initialState = {
  // boolean 用户是否登录站点
  authenticated: false,
  // boolean 用户是否退出登录
  logout: false,
  // 用户退出时论坛同步退出的脚本
  discuzLogout: null,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case AUTH_USER:
      return {
        ...state,
        authenticated: true,
        logout: false,
      };
    case UNAUTH_USER:
      return {
        ...state,
        authenticated: false,
        logout: true,
        discuzLogout: action.payload.data.data,
      };
    default:
      return state;
  }
}
