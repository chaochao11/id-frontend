/**
 * Created by zhangxiaojing on 2018/05/24.
 */

import {
    AUTH_USER,
    UNAUTH_USER,
    FETCH_PORTFOLIO_LIST_FORESHOW,
    FETCH_PORTFOLIO_LIST_DISPARK,
    FETCH_PORTFOLIO_DETAIL,
    FETCH_PORTFOLIO_PROPERTY,
    PORTFOLIO_BUY,
    PORTFOLIO_BUY_LIST,
    FETCH_PORTFOLIO_BALANCE,
    FETCH_REGISTER_NUMBER,
    FETCH_LIST_TOP,
    FETCH_FUND_HATCH,
} from "../actions/types";

const INITIAL_STATE = {
    portfolio_foreshow: null,
    portfolio_dispark:null,
    portfolio:null,
    property:null,
    portfolio_buy:[],
    portfolio_buy_list:null,
    top:null,
    register:0,
    balance:[],
    hatch:{
        total:null,
        list:[]
    },
};
export default function(state = INITIAL_STATE, action) {
    switch (action.type) {
        case FETCH_PORTFOLIO_LIST_FORESHOW:
            return { ...state, portfolio_foreshow: action.payload };
        case FETCH_PORTFOLIO_LIST_DISPARK:
            return { ...state, portfolio_dispark: action.payload };
        case FETCH_PORTFOLIO_DETAIL:
            return { ...state, portfolio: action.payload };
        case FETCH_PORTFOLIO_PROPERTY:
            return { ...state, property: action.payload };
        case PORTFOLIO_BUY:
            return { ...state, portfolio_buy: action.payload };
        case PORTFOLIO_BUY_LIST:
            return { ...state, portfolio_buy_list: action.payload };
        case FETCH_PORTFOLIO_BALANCE:
            return { ...state, balance: action.payload };
        case FETCH_REGISTER_NUMBER:
            return { ...state, register: action.payload };
        case FETCH_LIST_TOP:
            return { ...state, top: action.payload };
        case FETCH_FUND_HATCH:
            return { ...state, hatch: action.payload };



    }
    return state;
}
