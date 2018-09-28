import axios from 'axios';
import { browserHistory, hashHistory } from 'react-router';
import {
    ROOT_PORTFOLIO,
    FETCH_FUND_HATCH,
    getAuthorizedHeader,
    requestError,
} from './types';

export function fetchFundHatch({pageNum, pageSize}, callback) {
    return function (dispatch) {
        axios.get(`${ROOT_PORTFOLIO}/portfolio/list/incubate/${pageNum}/${pageSize}`, {headers: getAuthorizedHeader()})
            .then(response => {
                if (response.status === 200 && response.data.status === 1) {
                    dispatch({ type: FETCH_FUND_HATCH, payload: response.data.data});
                    callback(response.data);
                }
            }).catch(err => dispatch(requestError(err.message)));
    };
}