/**
 * Created by zhangxiaojing on 2018/07/03.
 */

import {
    AUTH_USER,
    UNAUTH_USER,
    FETCH_NEWS
} from "../actions/types";

const INITIAL_STATE = {
    news:{companyNewsList:[{image:null}], mediaReportsList:[{image:null}], operatingActivitiesList:[{image:null}], companyAnnouncementsList:[]}
};
export default function(state = INITIAL_STATE, action) {
    switch (action.type) {
        case FETCH_NEWS:
            return { ...state, news: action.payload };
    }
    return state;
}
