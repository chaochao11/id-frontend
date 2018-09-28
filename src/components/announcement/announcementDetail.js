import React, { Component } from "react";
import { connect } from "react-redux";
import { Spin } from "antd";
import { fetchAnnouncementDetail } from "./../../actions/announcement.js";
import "./announcement.css";


class AnnouncementDetail extends Component {
  constructor(props) {
    super(props);

    const { location } = this.props;
    const { pathname } = location;
    this.announcementCode = Number(pathname.split("/")[2]);
  }

  componentDidMount() {
    const { fetchAnnouncementDetail, history } = this.props;
    if (Number.isNaN(this.announcementCode)) {
      history.push("/announcement");
    }
    fetchAnnouncementDetail(this.announcementCode);
  }

  render() {
    const { announcementDetail, fetchAnnouncementDetailLoading } = this.props;
    const { title, content, createTime } = announcementDetail;
    return (
      <div className="announcement-detail-container announcement-container">
        {fetchAnnouncementDetailLoading ? (
          <Spin />
        ) : (
          <div>
            <h2>{title}</h2>
            <div className="detail-header">
              <p>尊敬的IDT用户：</p>
              <p>亲爱的广大用户：</p>
            </div>
            <div className="detail-content" dangerouslySetInnerHTML={{ __html: content }} />
            <div className="detail-footer">
              <p>特此公告</p>
              <p>【IDT运营团队】</p>
              <p>{createTime}</p>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    fetchAnnouncementDetailError: state.announcement.fetchAnnouncementDetailError,
    fetchAnnouncementDetailLoading: state.announcement.fetchAnnouncementDetailLoading,
    announcementDetail: state.announcement.announcementDetail,
  };
};

export default connect(
  mapStateToProps,
  { fetchAnnouncementDetail },
)(AnnouncementDetail);
