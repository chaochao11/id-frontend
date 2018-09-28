import React from "react";
import { Route, Switch } from "react-router";
import Header from "./../common/header.js";
import Footer from "./../common/footer.js";
import AnnouncementList from "./announcementList.js";
import AnnouncementDetail from "./announcementDetail.js";
import AnnouncementBanner from "./announcementBanner.js";
import "./index.css";

const Announcement = () => {
  return (
    <div>
      <Header />
      <AnnouncementBanner />
      <div className="announcement-page">
        <Switch>
          <Route path="/announcement/:id" extract component={AnnouncementDetail} />
          <Route path="/announcement" extract component={AnnouncementList} />
        </Switch>
      </div>
      <Footer />
    </div>
  );
};

export default Announcement;
