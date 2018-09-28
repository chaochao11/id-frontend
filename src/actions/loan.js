import axios from "axios";
import { message } from "antd";
import { ROOT_ACCOUNT, getAuthorizedHeader } from "./types.js";

/**
 * action types
 */

/**
 * 获取币种兑换的汇率 fetch_currency_exchange_rate
 * 获取支持的质押币种 最小、最大可借数量 质押期限 借款利率 fetch_loan_options
 * 获取用户 基本账户(1)/质押账户(2) 可用的 ETH/BTC 数量 fetch_available_amount_of_account
 * 获取账户资金划转所支持的币种 fetch_supported_currency_of_transfer_money
 * 提交用户借款申请 post_loan_apply
 * 提交账户划转 post_account_exchange
 */
export const SAVE_CURRENCY_EXCHANGE_RATE = "save_currency_exchange_rate";
export const FETCH_CURRENCY_EXCHANGE_RATE_LOADING =
  "fetch_currency_exchange_rate_loading";
export const FETCH_CURRENCY_EXCHANGE_RATE_ERROR =
  "fetch_currency_exchange_rate_error";

export const SAVE_AVAILABLE_AMOUNT_OF_ACCOUNT =
  "save_available_amount_of_account";
export const FETCH_AVAILABLE_AMOUNT_OF_ACCOUNT_LOADING =
  "fetch_available_amount_of_account_loading";
export const FETCH_AVAILABLE_AMOUNT_OF_ACCOUNT_ERROR =
  "fetch_available_amount_of_account_error";

export const SAVE_LOAN_OPTIONS = "save_loan_options";
export const FETCH_LOAN_OPTIONS_LOADING = "fetch_loan_options_loading";
export const FETCH_LOAN_OPTIONS_ERROR = "fetch_loan_options_error";

export const SAVE_SUPPORTED_CURRENCY_OF_TRANSFER_MONEY =
  "save_supported_currency_of_transfer_money";
export const FETCH_SUPPORTED_CURRENCY_OF_TRANSFER_MONEY_LOADING =
  "fetch_supported_currency_of_transfer_money_loading";
export const FETCH_SUPPORTED_CURRENCY_OF_TRANSFER_MONEY_ERROR =
  "fetch_supported_currency_of_transfer_money_error";

export const POST_LOAN_APPLY_SUCCESS = "post_loan_apply_success";
export const POSTING_LOAN_APPLY = "posting_loan_apply";
export const POST_LOAN_APPLY_ERROR = "post_loan_apply_error";

export const POST_ACCOUNT_EXCHANGE_SUCCESS = "post_account_exchange_success";
export const POSTING_ACCOUNT_EXCHANGE = "posting_account_exchange";
export const POST_ACCOUNT_EXCHANGE_ERROR = "post_account_exchange_error";

export const RESET_STATE = "reset_state";
export const SET_TRANSFER_MONEY_INFO_TO_STORE = "set_transfer_money_info_to_store";
export const CHANGE_PLEDGE_CURRENCY_TYPE = "change_pledge_currency_type";

export const resetState = () => {
  return (dispatch) => {
    dispatch({ type: RESET_STATE });
  };
};

export const setTransferMoneyInfoToStore = (params) => {
  return (dispatch) => {
    dispatch({ type: SET_TRANSFER_MONEY_INFO_TO_STORE, payload: params });
  };
};

export const changePledgeCurrencyType = (type) => {
  return (dispatch) => {
    dispatch({ type: CHANGE_PLEDGE_CURRENCY_TYPE, payload: type });
  };
};

/**
 * request
 */

export const initRequest = (currencyType = 3, accountType = 2) => {
  return (dispatch) => {
    dispatch({
      type: FETCH_AVAILABLE_AMOUNT_OF_ACCOUNT_LOADING,
      payload: true,
    });
    axios
      .get(
        `${ROOT_ACCOUNT}/loan/get/loanAccountExchange/${currencyType}/${accountType}`,
        {
          headers: getAuthorizedHeader(),
        },
      )
      .then((response) => {
        dispatch({
          type: FETCH_AVAILABLE_AMOUNT_OF_ACCOUNT_LOADING,
          payload: false,
        });
        if (response.status === 200 && response.data.status === 1) {
          // payload 可用数量 number
          dispatch({
            type: SAVE_AVAILABLE_AMOUNT_OF_ACCOUNT,
            payload: response.data.data,
          });
          fetchLoanOptions(currencyType)(dispatch);
          fetchCurrencyExchangeRate(currencyType)(dispatch);
        } else {
          dispatch({
            type: FETCH_AVAILABLE_AMOUNT_OF_ACCOUNT_ERROR,
            payload: response.data.message,
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: FETCH_AVAILABLE_AMOUNT_OF_ACCOUNT_LOADING,
          payload: false,
        });
        if (error.response) {
          dispatch({
            type: FETCH_AVAILABLE_AMOUNT_OF_ACCOUNT_ERROR,
            payload: error.response.message,
          });
        } else {
          dispatch({
            type: FETCH_AVAILABLE_AMOUNT_OF_ACCOUNT_ERROR,
            payload: error.message || "request error",
          });
        }
      });
  };
};

/**
 * 获取支持的质押币种 最小、最大可借数量 质押期限 借款利率
 * @param {number} currencyType 币种类型
 */
export const fetchLoanOptions = (currencyType = 3) => {
  return (dispatch) => {
    dispatch({ type: FETCH_LOAN_OPTIONS_LOADING, payload: true });

    axios
      .get(`${ROOT_ACCOUNT}/loan/get/loanOptions/${currencyType}`, {
        headers: getAuthorizedHeader(),
      })
      .then((response) => {
        dispatch({ type: FETCH_LOAN_OPTIONS_LOADING, payload: false });
        if (response.status === 200 && response.data.status === 1) {
          // payload
          // 获取支持的质押币种(loanCurrencyList: array<{ id: number, symbol: string, type: number }>)
          // 最小、最大可借数量(minApplyAmount: number, maxApplyAmount: number)
          // 质押期限和借款利率(loanInterestList: array<{id: number, startDate: number, endData: number, interestRate: number, loanParameterId: number}>)
          dispatch({ type: SAVE_LOAN_OPTIONS, payload: response.data.data });
        } else {
          dispatch({
            type: FETCH_LOAN_OPTIONS_ERROR,
            payload: response.data.message,
          });
        }
      })
      .catch((error) => {
        dispatch({ type: FETCH_LOAN_OPTIONS_LOADING, payload: false });
        if (error.response) {
          dispatch({
            type: FETCH_LOAN_OPTIONS_ERROR,
            payload: error.response.message,
          });
        } else {
          dispatch({
            type: FETCH_LOAN_OPTIONS_ERROR,
            payload: error.message || "request error",
          });
        }
      });
  };
};

/**
 * 获取币种兑换的汇率 fetch_currency_exchange_rate
 * @param {number} currencyType 币种类型
 */
export const fetchCurrencyExchangeRate = (currencyType = 3) => {
  return (dispatch) => {
    dispatch({ type: FETCH_CURRENCY_EXCHANGE_RATE_LOADING, payload: true });

    axios
      .get(`${ROOT_ACCOUNT}/loan/get/loanCurrencyRate/${currencyType}`, {
        headers: getAuthorizedHeader(),
      })
      .then((response) => {
        dispatch({
          type: FETCH_CURRENCY_EXCHANGE_RATE_LOADING,
          payload: false,
        });
        if (response.status === 200 && response.data.status === 1) {
          // payload 币种汇率 number
          dispatch({
            type: SAVE_CURRENCY_EXCHANGE_RATE,
            payload: response.data.data,
          });
        } else {
          dispatch({
            type: FETCH_CURRENCY_EXCHANGE_RATE_ERROR,
            payload: response.data.message,
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: FETCH_CURRENCY_EXCHANGE_RATE_LOADING,
          payload: false,
        });
        if (error.response) {
          dispatch({
            type: FETCH_CURRENCY_EXCHANGE_RATE_ERROR,
            payload: error.response.message,
          });
        } else {
          dispatch({
            type: FETCH_CURRENCY_EXCHANGE_RATE_ERROR,
            payload: error.message || "request error",
          });
        }
      });
  };
};

/**
 * 获取用户 基本账户(1)/质押账户(2) 可用的 ETH/BTC 数量 fetch_available_amount_of_account
 * @param {number}} currencyType 币种类型
 * @param {number} accountType 账户类型 基本账户: 1, 质押账户: 2
 */
export const fetchAvailableAmountOfAccount = (
  currencyType = 3,
  accountType = 2,
) => {
  return (dispatch) => {
    dispatch({
      type: FETCH_AVAILABLE_AMOUNT_OF_ACCOUNT_LOADING,
      payload: true,
    });
    axios
      .get(
        `${ROOT_ACCOUNT}/loan/get/loanAccountExchange/${currencyType}/${accountType}`,
        {
          headers: getAuthorizedHeader(),
        },
      )
      .then((response) => {
        dispatch({
          type: FETCH_AVAILABLE_AMOUNT_OF_ACCOUNT_LOADING,
          payload: false,
        });
        if (response.status === 200 && response.data.status === 1) {
          // payload 可用数量 number
          dispatch({
            type: SAVE_AVAILABLE_AMOUNT_OF_ACCOUNT,
            payload: response.data.data,
          });
        } else {
          dispatch({
            type: FETCH_AVAILABLE_AMOUNT_OF_ACCOUNT_ERROR,
            payload: response.data.message,
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: FETCH_AVAILABLE_AMOUNT_OF_ACCOUNT_LOADING,
          payload: false,
        });
        if (error.response) {
          dispatch({
            type: FETCH_AVAILABLE_AMOUNT_OF_ACCOUNT_ERROR,
            payload: error.response.message,
          });
        } else {
          dispatch({
            type: FETCH_AVAILABLE_AMOUNT_OF_ACCOUNT_ERROR,
            payload: error.message || "request error",
          });
        }
      });
  };
};

/**
 * 申请借款
 * param: { currencyType: number, depositAmount: number, depositPeriod: number, loanAmount: number }
 */
export const postLoanApply = (param) => {
  return (dispatch) => {
    dispatch({ type: POSTING_LOAN_APPLY, payload: true });

    axios
      .post(`${ROOT_ACCOUNT}/loan/update/loan`, param, {
        headers: getAuthorizedHeader(),
      })
      .then((response) => {
        dispatch({ type: POSTING_LOAN_APPLY, payload: false });
        if (response.status === 200 && response.data.status === 1) {
          dispatch({ type: POST_LOAN_APPLY_SUCCESS, payload: true });
        } else {
          message.error(response.data.message || '申请借款失败');
          dispatch({ type: POST_LOAN_APPLY_SUCCESS, payload: false });
          dispatch({
            type: POST_LOAN_APPLY_ERROR,
            payload: response.data.message,
          });
        }
      })
      .catch((error) => {
        dispatch({ type: POSTING_LOAN_APPLY, payload: false });
        dispatch({ type: POST_LOAN_APPLY_SUCCESS, payload: false });
        if (error.response) {
          dispatch({
            type: POST_LOAN_APPLY_ERROR,
            payload: error.response.message,
          });
        } else {
          dispatch({
            type: POST_LOAN_APPLY_ERROR,
            payload: error.message || "request error",
          });
        }
      });
  };
};

/**
 * 获取账户资金划转所支持的币种
 */
export const fetchSupportedCurrencyOfTransferMoney = () => {
  return (dispatch) => {
    dispatch({
      type: FETCH_SUPPORTED_CURRENCY_OF_TRANSFER_MONEY_LOADING,
      payload: true,
    });

    axios
      .get(`${ROOT_ACCOUNT}/loan/get/loanAccountExchange/currency`, {
        headers: getAuthorizedHeader(),
      })
      .then((response) => {
        dispatch({
          type: FETCH_SUPPORTED_CURRENCY_OF_TRANSFER_MONEY_LOADING,
          payload: false,
        });
        if (response.status === 200 && response.data.status === 1) {
          dispatch({
            type: SAVE_SUPPORTED_CURRENCY_OF_TRANSFER_MONEY,
            payload: response.data.data,
          });
        } else {
          dispatch({
            type: FETCH_SUPPORTED_CURRENCY_OF_TRANSFER_MONEY_ERROR,
            payload: response.data.message,
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: FETCH_SUPPORTED_CURRENCY_OF_TRANSFER_MONEY_LOADING,
          payload: false,
        });
        if (error.response) {
          dispatch({
            type: FETCH_SUPPORTED_CURRENCY_OF_TRANSFER_MONEY_ERROR,
            payload: error.response.message,
          });
        } else {
          dispatch({
            type: FETCH_SUPPORTED_CURRENCY_OF_TRANSFER_MONEY_ERROR,
            payload: error.message || "request_error",
          });
        }
      });
  };
};

/**
 * 提交账户划转
 * @param {object} param { amount: number, currencyType: number, initAccount: number, targetAccount: number }
 */
export const postAccountExchange = (param) => {
  return (dispatch) => {
    dispatch({ type: POSTING_ACCOUNT_EXCHANGE, payload: true });

    axios
      .post(`${ROOT_ACCOUNT}/loan/update/loanAccountExchange`, param, {
        headers: getAuthorizedHeader(),
      })
      .then((response) => {
        dispatch({ type: POSTING_ACCOUNT_EXCHANGE, payload: false });

        if (response.status === 200 && response.data.status === 1) {
          dispatch({ type: POST_ACCOUNT_EXCHANGE_SUCCESS, payload: true });
        } else {
          message.error(response.data.message || "划款失败");
          dispatch({ type: POST_ACCOUNT_EXCHANGE_SUCCESS, payload: false });
          dispatch({
            type: POST_ACCOUNT_EXCHANGE_ERROR,
            payload: response.data.message,
          });
        }
      })
      .catch((error) => {
        dispatch({ type: POSTING_ACCOUNT_EXCHANGE, payload: false });
        dispatch({ type: POST_ACCOUNT_EXCHANGE_SUCCESS, payload: false });
        if (error.response) {
          dispatch({
            type: POST_ACCOUNT_EXCHANGE_ERROR,
            payload: error.response.message,
          });
        } else {
          dispatch({
            type: POST_ACCOUNT_EXCHANGE_ERROR,
            payload: error.message || "request error",
          });
        }
      });
  };
};
