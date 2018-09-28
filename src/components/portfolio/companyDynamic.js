/**
 * Created by zhangxiaojing on 2018/07/02.
 */

import React, { Component } from 'react';
import {connect} from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;
import CompanyDynamicLeftList from './companyDynamicLeftList';
import {fetchNews} from '../../actions/company';


class CompanyDynamic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index:0
        };
    }
    componentWillMount() {
        this.props.fetchNews();
    }
    render() {
        const {companyNewsList, mediaReportsList, operatingActivitiesList, companyAnnouncementsList} =this.props.news;
        return (
            <div className="company-dynamic">
                <div className="container">
                    <div className="content">
                        <div className="row" style={{marginLeft:0, marginRight:0}}>
                            <div className="col-xs-12 col-md-7 g-pb-30" style={{padding:0}}>
                                <Tabs defaultActiveKey="1" onChange={this.callback}>
                                    <TabPane tab="公司动态" key="1">
                                        <CompanyDynamicLeftList companyNewsList={companyNewsList}/>
                                    </TabPane>
                                    <TabPane tab="媒体外链" key="2">
                                        <CompanyDynamicLeftList companyNewsList={mediaReportsList}/>
                                    </TabPane>
                                    <TabPane tab="运营活动" key="3">
                                        <CompanyDynamicLeftList companyNewsList={operatingActivitiesList}/>
                                    </TabPane>
                                </Tabs>
                            </div>
                            <div className="col-xs-12 col-md-5">
                                <div className="g-py-10 company-announce">
                                    <div className="title">公司通告</div>
                                    <ul>
                                        {companyAnnouncementsList.map((item, index)=>{
                                            return(
                                                <li key={index}>
                                                    <a target="_blank" href={item.bbsUrl}>
                                                        <span>{item.title}</span> <span className="time">{item.timeStr}</span>
                                                    </a>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
function mapStateToProps(state){
    return {
        news:state.company.news
    };
}
export default withRouter(connect(mapStateToProps, { fetchNews})(CompanyDynamic));