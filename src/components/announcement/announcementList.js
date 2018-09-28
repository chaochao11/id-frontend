import React, { Component } from "react";
import { connect } from "react-redux";
import { Pagination, Spin } from "antd";
import { fetchAnnouncementList } from "./../../actions/announcement.js";
import "./announcement.css";

class AnnouncementList extends Component {
  constructor(props) {
    super(props);

    this.handlePaginationChange = this.handlePaginationChange.bind(this);
    this.jumpToDetail = this.jumpToDetail.bind(this);
  }

  componentDidMount() {
    const { fetchAnnouncementList, announcementList } = this.props;
    // if (announcementList.pageList.length === 0) {
      fetchAnnouncementList({ pageSize: 10, pageNum: 1 });
    // }
  }

  handlePaginationChange(pageNum, pageSize) {
    const { fetchAnnouncementList } = this.props;
    fetchAnnouncementList({ pageSize, pageNum });
  }

  jumpToDetail(announcementCode) {
    const { history } = this.props;
    history.push(`/announcement/${announcementCode}`);
  }

  render() {
    const { announcementList, fetchAnnouncementListLoading } = this.props;
    const { rowCount, pageList, currentPage, pageSize } = announcementList;
    return (
      <div className="announcement-list-container announcement-container">
        <ul className="announcement-list">
          {fetchAnnouncementListLoading ? (
            <Spin />
          ) : (
            pageList.map((announcementItem) => {
              return (
                <li key={announcementItem.announcementCode}>
                  <span onClick={() => this.jumpToDetail(announcementItem.announcementCode)}>
                    {announcementItem.title}
                  </span>
                </li>
              );
            })
          )}
        </ul>
        <Pagination
          total={rowCount}
          current={currentPage}
          pageSize={pageSize}
          onChange={this.handlePaginationChange}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    fetchAnnouncementListLoading: state.announcement.fetchAnnouncementListLoading,
    fetchAnnouncementListError: state.announcement.fetchAnnouncementListError,
    announcementList: state.announcement.announcementList,
  };
};

export default connect(
  mapStateToProps,
  { fetchAnnouncementList },
)(AnnouncementList);
