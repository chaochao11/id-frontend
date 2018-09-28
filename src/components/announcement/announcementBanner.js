import React from "react";
import "./announcementBanner.css";

const AnnouncementBanner = () => {
  return (
    <div className="announcement-banner-wrapper">
      <div className="announcement-banner-container">
        <div className="banner-title">
          <h2>公告中心</h2>
          <h3>Announcement Center</h3>
        </div>
        <div className="banner-img">
          <img
            src={require("./../../../public/img/announcement-banner-img.png")}
            alt="Announcement Center"
            title="Announcement Center"
          />
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBanner;
