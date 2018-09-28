import {
  SAVE_CURRENCY_EXCHANGE_RATE,
  FETCH_CURRENCY_EXCHANGE_RATE_LOADING,
  FETCH_CURRENCY_EXCHANGE_RATE_ERROR,
  SAVE_AVAILABLE_AMOUNT_OF_ACCOUNT,
  FETCH_AVAILABLE_AMOUNT_OF_ACCOUNT_LOADING,
  FETCH_AVAILABLE_AMOUNT_OF_ACCOUNT_ERROR,
  SAVE_LOAN_OPTIONS,
  FETCH_LOAN_OPTIONS_LOADING,
  FETCH_LOAN_OPTIONS_ERROR,
  POSTING_LOAN_APPLY,
  POST_LOAN_APPLY_SUCCESS,
  POST_LOAN_APPLY_ERROR,
  RESET_STATE,
  FETCH_SUPPORTED_CURRENCY_OF_TRANSFER_MONEY_ERROR,
  FETCH_SUPPORTED_CURRENCY_OF_TRANSFER_MONEY_LOADING,
  SAVE_SUPPORTED_CURRENCY_OF_TRANSFER_MONEY,
  SET_TRANSFER_MONEY_INFO_TO_STORE,
  POST_ACCOUNT_EXCHANGE_SUCCESS,
  POST_ACCOUNT_EXCHANGE_ERROR,
  POSTING_ACCOUNT_EXCHANGE,
  CHANGE_PLEDGE_CURRENCY_TYPE,
} from "./../actions/loan.js";

const initialState = {
  // 默认质押币种类型 BTC
  pledgeCurrencyType: 3,

  // 平台所支持的质押币种 array<{ id: number, symbol: string, type: number }>
  supportPledgeCurrency: [],

  // 最小可借数量
  minApplyAmount: 500,
  // 最大可借数量
  maxApplyAmount: 100000,
  // 质押期限和借款利率
  // array<{id: number, startDate: number, endData: number, interestRate: number, loanParameterId: number}>
  loanInterestList: [],

  // 币种兑换汇率
  exchangeRate: 0.00,

  // 可用数量
  availableAmountOfAccount: 0.00,

  // 资金划转支持的币种
  supportedCurrencyOfTransferMoney: [],

  // 资金划转成功后的划转信息
  // { transferAccount: string, targetAccount: string, borrowAmount: number, currency: string }
  transferMoneyInfo: {},

  fetchSupportedCurrencyOfTransferMoneyLoading: false,
  fetchSupportedCurrencyOfTransferMoneyError: "",

  fetchCurrencyExchangeRateLoading: false,
  fetchCurrencyExchangeRateError: "",

  fetchAvailableAmountOfAccountLoading: false,
  fetchAvailableAmountOfAccountError: "",

  fetchLoanOptionsLoading: false,
  fetchLoanOptionsError: "",

  postingLoanApply: false,
  postLoanApplySuccess: false,
  postLoanApplyError: "",

  postingAccountExchange: false,
  postAccountExchangeSuccess: false,
  postAccountExchangeError: "",
};

const loanReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_PLEDGE_CURRENCY_TYPE:
      return {
        ...state,
        pledgeCurrencyType: action.payload,
      };
    case FETCH_CURRENCY_EXCHANGE_RATE_LOADING:
      return {
        ...state,
        fetchCurrencyExchangeRateLoading: action.payload,
      };
    case SAVE_CURRENCY_EXCHANGE_RATE:
      return {
        ...state,
        exchangeRate: action.payload,
      };
    case FETCH_CURRENCY_EXCHANGE_RATE_ERROR:
      return {
        ...state,
        fetchCurrencyExchangeRateError: action.payload,
      };

    case FETCH_LOAN_OPTIONS_LOADING:
      return {
        ...state,
        fetchLoanOptionsLoading: action.payload,
      };
    case SAVE_LOAN_OPTIONS:
      return {
        ...state,
        supportPledgeCurrency: action.payload.loanCurrencyList,
        minApplyAmount: action.payload.minApplyAmount,
        maxApplyAmount: action.payload.maxApplyAmount,
        loanInterestList: action.payload.loanInterestList,
      };
    case FETCH_LOAN_OPTIONS_ERROR:
      return {
        ...state,
        fetchLoanOptionsError: action.payload,
      };

    case FETCH_AVAILABLE_AMOUNT_OF_ACCOUNT_LOADING:
      return {
        ...state,
        fetchAvailableAmountOfAccountLoading: action.payload,
      };
    case SAVE_AVAILABLE_AMOUNT_OF_ACCOUNT:
      return {
        ...state,
        availableAmountOfAccount: action.payload,
      };
    case FETCH_AVAILABLE_AMOUNT_OF_ACCOUNT_ERROR:
      return {
        ...state,
        fetchAvailableAmountOfAccountError: action.payload,
      };

    case FETCH_SUPPORTED_CURRENCY_OF_TRANSFER_MONEY_LOADING:
      return {
        ...state,
        fetchSupportedCurrencyOfTransferMoneyLoading: action.payload,
      };
    case FETCH_SUPPORTED_CURRENCY_OF_TRANSFER_MONEY_ERROR:
      return {
        ...state,
        fetchSupportedCurrencyOfTransferMoneyError: action.payload,
      };
    case SAVE_SUPPORTED_CURRENCY_OF_TRANSFER_MONEY:
      return {
        ...state,
        supportedCurrencyOfTransferMoney: action.payload,
      };

    case POSTING_LOAN_APPLY:
      return {
        ...state,
        postingLoanApply: action.payload,
      };
    case POST_LOAN_APPLY_SUCCESS:
      return {
        ...state,
        postLoanApplySuccess: action.payload,
      };
    case POST_LOAN_APPLY_ERROR:
      return {
        ...state,
        postLoanApplyError: action.payload,
      };

    case POSTING_ACCOUNT_EXCHANGE:
      return {
        ...state,
        postingAccountExchange: action.payload,
      };
    case POST_ACCOUNT_EXCHANGE_SUCCESS:
      return {
        ...state,
        postAccountExchangeSuccess: action.payload,
      };
    case POST_ACCOUNT_EXCHANGE_ERROR:
      return {
        ...state,
        postAccountExchangeError: action.payload,
      };

    case RESET_STATE:
      return {
        ...state,
        postLoanApplySuccess: false,
        postAccountExchangeSuccess: false,
        fetchCurrencyExchangeRateError: "",
        fetchAvailableAmountOfAccountError: "",
        fetchLoanOptionsError: "",
        postLoanApplyError: "",
        postAccountExchangeError: "",
      };
    case SET_TRANSFER_MONEY_INFO_TO_STORE:
      return {
        ...state,
        transferMoneyInfo: action.payload,
      };
    default:
      return state;
  }
};

export default loanReducer;