/**
 * Created by zhangxiaojing on 2018/07/02.
 */

import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import {ROOT_AVATAR} from '../../actions/types';

class CompanyDynamicLeftList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index:0
        };
    }
    renderList(){
        return this.props.companyNewsList.map((item, index)=>{
            return(
                <li key={index}>
                    <a target="_blank" href={item.bbsUrl}>
                        {item.title}
                    </a>
                </li>
            );
        });
    }
    render() {
        const data=this.props.companyNewsList;
        return (
            <div className="g-py-20">
                <div className="col-xs-12 col-md-7 company-dynamic-left">
                    <img src={`${ROOT_AVATAR}/${data[0].image}`} alt=""/>
                </div>
                <div className="col-xs-12 col-md-5 company-dynamic-left-li">
                    <ul>
                        {this.renderList()}
                    </ul>
                </div>

            </div>
        );
    }
}
export default CompanyDynamicLeftList;