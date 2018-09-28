import axios from "axios";
import { ROOT_USER } from "./types.js";
/**
 * 获取公告列表 fetchAnnouncementList
 */
/**
 * 获取公告详情 fetchAnnouncementDetail
 */

export const SAVE_ANNOUNCEMENT_LIST = "save_announcement_list";
export const FETCH_ANNOUNCEMENT_LIST_LOADING = "fetch_announcement_list_loading";
export const FETCH_ANNOUNCEMENT_LIST_ERROR = "fetch_announcement_list_error";

export const SAVE_ANNOUNCEMENT_DETAIL = "save_announcement_detail";
export const FETCH_ANNOUNCEMENT_DETAIL_LOADING = "fetch_announcement_detail_loading";
export const FETCH_ANNOUNCEMENT_DETAIL_ERROR = "fetch_announcement_detail_error";

/**
 * 获取公告列表
 * @param {object} pageSize: number, pageNum: number
 */
export const fetchAnnouncementList = function fetchAnnouncementList({ pageSize, pageNum }, callback) {
  const URL = `${ROOT_USER}/cms/announcements/${pageNum}/${pageSize}`;
  return (dispatch) => {
    dispatch({ type: FETCH_ANNOUNCEMENT_LIST_LOADING, payload: true });
    axios
      .get(URL)
      .then((response) => {
        if (response.status === 200 && response.data.status === 1) {
          const { data } = response.data;
          dispatch({ type: SAVE_ANNOUNCEMENT_LIST, payload: data });
            callback(data);
        } else {
          dispatch({ type: FETCH_ANNOUNCEMENT_LIST_ERROR, payload: true });
        }
        dispatch({ type: FETCH_ANNOUNCEMENT_LIST_LOADING, payload: false });
      })
      .catch(() => {
        dispatch({ type: FETCH_ANNOUNCEMENT_LIST_LOADING, payload: false });
        dispatch({ type: FETCH_ANNOUNCEMENT_LIST_ERROR, payload: true });
      });
  };
};

/**
 * 获取公告详情
 * @param {number} announcementCode
 */
export const fetchAnnouncementDetail = function fetchAnnouncementDetail(announcementCode) {
  const URL = `${ROOT_USER}/cms/announcement/${announcementCode}`;
  return (dispatch) => {
    dispatch({ type: FETCH_ANNOUNCEMENT_DETAIL_LOADING, payload: true });
    axios
      .get(URL)
      .then((response) => {
        if (response.status === 200 && response.data.status === 1) {
          const { data } = response.data;
          dispatch({ type: SAVE_ANNOUNCEMENT_DETAIL, payload: data });
        } else {
          dispatch({ type: FETCH_ANNOUNCEMENT_DETAIL_ERROR, payload: true });
        }
        dispatch({ type: FETCH_ANNOUNCEMENT_DETAIL_LOADING, payload: false });
      })
      .catch(() => {
        dispatch({ type: FETCH_ANNOUNCEMENT_DETAIL_LOADING, payload: false });
        dispatch({ type: FETCH_ANNOUNCEMENT_DETAIL_ERROR, payload: true });
      });
  };
};
