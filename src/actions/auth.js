import axios from "axios";
import { ROOT_USER, getAuthorizedHeader } from "./types";

export const UNAUTH_USER = "unauth_user";
export const AUTH_USER = "auth_user";


/**
 * ## 注册 ##
 * 检查用户输入的手机号是否已经注册 checkUserPhoneIsRegistered
 * 行为验证第一步，获取极验验证初始信息 fetchBehaviorVerificationInfo
 * 用户注册 register
 * 发送验证码（邮箱/手机）（是否需要行为验证信息）sendVerificationCode
 */
/**
 * ## 登录 ##
 * 行为验证第一步，获取极验验证初始信息 firstStepOfBehaviorVerification
 * 用户登录 login
 * 登录时谷歌验证码检验 checkGoogleVerificationCode
 */

/**
 * ## 忘记密码 ##
 * 密码忘记处理 forgetPassword
 * 发送验证码（邮箱/手机）（是否需要行为验证信息）sendVerificationCode
 */

/**
 * ## 退出 ##
 * 用户退出 logout
 */

export const automaticLogin = function automaticLogin() {
  return (dispatch) => dispatch({ type: AUTH_USER });
};

/**
 * @description 将用户信息保存到 LocalStorage
 * @param {object} userInfo 用户信息
 * {
 *    用户token token: string,
 *    用户登录名 loginname: string,
 *    头像 image: string,
 *    手机号 mobilephone: string,
 *    邮箱 email: string,
 *    用户上次登陆时间 lastLoginTime: string,
 *    用户实名认证状态 isQIC: number, 2: 未认证; 1: 已认证
 *    论坛同步登录脚本 discuzSyncScript: string,
 * }
 */
export const setUserInfoToLocalStorage = function setUserInfoToLocalStorage(userInfo) {
  localStorage.setItem("token", userInfo.token);
  localStorage.setItem("loginname", userInfo.loginname);
  localStorage.setItem("avatar", userInfo.image);
  localStorage.setItem("mobilephone", userInfo.mobilephone);
  localStorage.setItem("email", userInfo.email);
  localStorage.setItem("discuzSyncScript", userInfo.discuzSyncScript);
  localStorage.setItem("lastLoginTime", userInfo.lastLoginTime);
  localStorage.setItem("authState", userInfo.isQIC);
};

/**
 * @description 用户退出时，清除 LocalStorage 中存储的用户信息
 */
const removeUserInfoFromLocalStorage = function removeUserInfoFromLocalStorage() {
  localStorage.removeItem("token");
  localStorage.removeItem("loginname");
  localStorage.removeItem("avatar");
  localStorage.removeItem("mobilephone");
  localStorage.removeItem("email");
  localStorage.removeItem("discuzSyncScript");
  localStorage.removeItem("lastLoginTime");
  localStorage.removeItem("authState");
};

// 校验 token
export function verifyToken() {
  return function(dispatch) {
    axios.get(`${ROOT_USER}/auth/verify`, {
        headers: getAuthorizedHeader(),
      })
      .then((response) => {
        // console.log(response);
      })
      .catch((err) => err.message);
  };
}

// 退出登录
export const signOutUser = function signOutUser() {
  return function(dispatch) {
    // 此处必须采用这样的写法!!! 否则 token 将不会出现在请求头中!!! 没有原因
    axios({
      method: "post",
      url: `${ROOT_USER}/user/signout`,
      headers: getAuthorizedHeader(),
    })
      .then((response) => {
        dispatch({ type: UNAUTH_USER, payload: response });
        removeUserInfoFromLocalStorage();

        if (response.data.data.discuzSyncLogoutScript) {
          document.body.appendChild(response.data.data.discuzSyncLogoutScript);
        }
        // localStorage.setItem('discuzSyncLogoutScript', discuzSyncLogoutScript);
      })
      .catch((err) => err.message);
  };
};
