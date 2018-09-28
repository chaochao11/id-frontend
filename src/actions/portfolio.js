/**
 * Created by zhangxiaojing on 2018/05/24.
 */
import axios from 'axios';
import { browserHistory, hashHistory } from 'react-router';
import {
    ROOT_USER,
    ROOT_PORTFOLIO,
    FETCH_PORTFOLIO_LIST_FORESHOW,
    FETCH_PORTFOLIO_LIST_DISPARK,
    FETCH_PORTFOLIO_DETAIL,
    FETCH_PORTFOLIO_PROPERTY,
    PORTFOLIO_BUY,
    PORTFOLIO_BUY_LIST,
    FETCH_PORTFOLIO_BALANCE,
    FETCH_REGISTER_NUMBER,
    FETCH_LIST_TOP,
    getAuthorizedHeader,
    requestError,
} from './types';

/**
 * 获取投资组合开放购买列表
 */
export function fetchPortfolioListDispark({runningStatus}) {
    return function (dispatch) {
        axios.get(`${ROOT_PORTFOLIO}/portfolio/list/${runningStatus}`)
            .then(response => {
                if (response.status === 200 && response.data.status === 1) {
                    dispatch({ type: FETCH_PORTFOLIO_LIST_DISPARK, payload: response.data.data});
                }
            }).catch(err => dispatch(requestError(err.message)));
    };
}

/**
 * 获取投资组合预购列表
 */
export function fetchPortfolioListForeshow({runningStatus}, callback) {
    return function (dispatch) {
        axios.get(`${ROOT_PORTFOLIO}/portfolio/list/${runningStatus}`)
            .then(response => {
                if (response.status === 200 && response.data.status === 1) {
                    dispatch({ type: FETCH_PORTFOLIO_LIST_FORESHOW, payload: response.data.data});
                    callback(response.data);
                }
            }).catch(err => dispatch(requestError(err.message)));
    };
}

/**
 * 获取投资组合详情
 */
export function fetchPortfolioListDetail({portfolioCode}, callback) {
    return function (dispatch) {
        axios.get(`${ROOT_PORTFOLIO}/portfolio/get/detail/${portfolioCode}`)
            .then(response => {
                if (response.status === 200 && response.data.status === 1) {
                    callback(response.data.data);
                    dispatch({ type: FETCH_PORTFOLIO_DETAIL, payload: response.data.data});
                }
            }).catch(err => dispatch(requestError(err.message)));
    };
}

/**
 * 获取我的资产
 */
export function fetchPortfolioProperty({portfolioCode}) {
    return function (dispatch) {
        axios.get(`${ROOT_PORTFOLIO}/portfolio/get/assert/${portfolioCode}`, { headers: getAuthorizedHeader() })
            .then(response => {
                if (response.status === 200 && response.data.status === 1) {
                    dispatch({ type: FETCH_PORTFOLIO_PROPERTY, payload: response.data.data});
                }
            }).catch(err => dispatch(requestError(err.message)));
    };
}


/**
 * 购买投资组合
 */
export function portfolioBuy({portfolioCode, amount, currencyType, couponCode, id}, callback) {
    return function (dispatch) {
        axios.post(`${ROOT_PORTFOLIO}/portfolioTrading/post/buy`, {portfolioCode, amount, currencyType, couponCode, id}, { headers: getAuthorizedHeader() })
            .then(response => {
                callback(response.data);
                if (response.status === 200 && response.data.status === 1) {
                    dispatch({ type: PORTFOLIO_BUY, payload: response.data.data});
                }
            }).catch(err => dispatch(requestError(err.message)));
    };
}

/**
 * 购买投资组合记录
 */
export function portfolioBuyList({portfolioCode}) {
    return function (dispatch) {
        axios.get(`${ROOT_PORTFOLIO}/portfolio/list/transactions/${portfolioCode}`)
            .then(response => {
                // console.log(response);
                if (response.status === 200 && response.data.status === 1) {
                    dispatch({ type: PORTFOLIO_BUY_LIST, payload: response.data.data});
                }
            }).catch(err => dispatch(requestError(err.message)));
    };
}

/**
 * 购买投资组合记录
 */
export function fetchPortfolioBalance() {
    return function (dispatch) {
        axios.get(`${ROOT_USER}/user/wallet/account`, { headers: getAuthorizedHeader()})
            .then(response => {
                if (response.status === 200 && response.data.status === 1) {
                    dispatch({ type: FETCH_PORTFOLIO_BALANCE, payload: response.data.data});
                }
            }).catch(err => dispatch(requestError(err.message)));
    };
}

/**
 * 检查地址激活及实名认证
 */
export function checkMessage({currencyType}, callback) {
    return function (dispatch) {
        axios.get(`${ROOT_USER}/user/check/QICAndAddress/${currencyType}`, { headers: getAuthorizedHeader() })
            .then(response => {
                callback(response.data.data);
            }).catch(err => dispatch(requestError(err.message)));
    };
}


/**
 * 检查地址激活及实名认证
 */
export function fetchRegisterNumber() {
    return function (dispatch) {
        axios.get(`${ROOT_USER}/user/count/enrollment`)
            .then(response => {
                if (response.status === 200 && response.data.status === 1) {
                    dispatch({ type: FETCH_REGISTER_NUMBER, payload: response.data.data});
                }
            }).catch(err => dispatch(requestError(err.message)));
    };
}



/**
 * 获取精品理财
 */
export function fetchListTop() {
    return function (dispatch) {
        axios.get(`${ROOT_PORTFOLIO}/portfolio/list/top`)
            .then(response => {
                if (response.status === 200 && response.data.status === 1) {
                    dispatch({ type: FETCH_LIST_TOP, payload: response.data.data});
                }
            }).catch(err => dispatch(requestError(err.message)));
    };
}


