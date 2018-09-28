import {
  FETCH_ANNOUNCEMENT_LIST_ERROR,
  FETCH_ANNOUNCEMENT_DETAIL_ERROR,
  FETCH_ANNOUNCEMENT_DETAIL_LOADING,
  FETCH_ANNOUNCEMENT_LIST_LOADING,
  SAVE_ANNOUNCEMENT_DETAIL,
  SAVE_ANNOUNCEMENT_LIST,
} from "./../actions/announcement";

const initialState = {
  fetchAnnouncementListLoading: null,
  fetchAnnouncementListError: null,
  announcementList: {
    // pageList: Array<{ announcementCode: number, title: string, content: null, createTime: null }>
    pageList: [],
    rowCount: 0,
  },
  fetchAnnouncementDetailError: null,
  fetchAnnouncementDetailLoading: null,
  // announcementDetail: { announcementCode: number, title: string, content: string, createTime: string }
  announcementDetail: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ANNOUNCEMENT_LIST_LOADING:
      return {
        ...state,
        fetchAnnouncementListLoading: action.payload,
      };
    case FETCH_ANNOUNCEMENT_LIST_ERROR:
      return {
        ...state,
        fetchAnnouncementListError: action.payload,
      };
    case SAVE_ANNOUNCEMENT_LIST:
      return {
        ...state,
        announcementList: action.payload,
      };
    case FETCH_ANNOUNCEMENT_DETAIL_LOADING:
      return {
        ...state,
        fetchAnnouncementDetailLoading: action.payload,
      };
    case FETCH_ANNOUNCEMENT_DETAIL_ERROR:
      return {
        ...state,
        fetchAnnouncementDetailError: action.payload,
      };
    case SAVE_ANNOUNCEMENT_DETAIL:
      return {
        ...state,
        announcementDetail: action.payload,
      };
    default:
      return state;
  }
};
