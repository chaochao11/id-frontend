/**
 * Created by zhangxiaojing on 2018/05/24.
 */
import axios from 'axios';
import { browserHistory, hashHistory } from 'react-router';
import {
    ROOT_USER,
    FETCH_NEWS,
    getAuthorizedHeader,
    requestError,
} from './types';

/**
 * 获取公司动态新闻
 */
export function fetchNews() {
    return function (dispatch) {
        axios.get(`${ROOT_USER}/cms/news`)
            .then(response => {
                if (response.status === 200 && response.data.status === 1) {
                    dispatch({ type: FETCH_NEWS, payload: response.data.data});
                }
            }).catch(err => dispatch(requestError(err.message)));
    };
}