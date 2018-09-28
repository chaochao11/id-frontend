/**
 * Created by lijun on 2018/3/30.
 */
import React, { Component } from 'react';
import Header from "../common/header";
import Footer from "../common/footer";
import business from './../../../public/img/business-pattern.png';
import {getLocalValue} from "../common/language";
import LazyLoad from 'react-lazyload';
class Business extends Component {
    constructor (props) {
        super(props);
        this.state = {
        };
    }
    render () {
        return (
            <div>
                <Header/>
                <div className={"container g-pt-60"}>
                    <div className={"row g-py-30"}>
                        <div className={"col-sm-12"}>
                            <div className={"text-center business-title"} style={{color:"#167AFF"}}>{getLocalValue("business_item1")}</div>
                            <div className="nl-underline g-pt-10 g-pb-40 text-center">
                                <span className="nl-style"></span>
                            </div>
                            <div className={"col-sm-12"}>
                                <LazyLoad height={1110}>
                                    <img src={business} width={"100%"} alt="业务说明"/>
                                </LazyLoad>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{backgroundColor:"#f5f5f5", width:"100%"}}>
                    <div className={"container"} >
                        <div className={"row g-py-30"}>
                            <div className={"col-sm-12"}>
                                <div className={"text-center business-title"}>{getLocalValue("business_item2")}</div>
                                <div className={"col-sm-12"}>
                                    <ul className={"business-ul"}>
                                        <li>
                                            <div ><span className={"business-ul-square"}></span> {getLocalValue("business_item2_ul1")}</div>
                                            <ul className={"business-ul-ul g-pl-10"}>
                                                <li>{getLocalValue("business_item2_ul1_li1")}</li>
                                                <li>{getLocalValue("business_item2_ul1_li2")}</li>
                                                <li>{getLocalValue("business_item2_ul1_li3")}</li>
                                                <li>{getLocalValue("business_item2_ul1_li4")}</li>
                                                <li>{getLocalValue("business_item2_ul1_li5")}</li>
                                                <li>{getLocalValue("business_item2_ul1_li6")}</li>
                                                <li>{getLocalValue("business_item2_ul1_li7")}</li>
                                                <li>{getLocalValue("business_item2_ul1_li8")}</li>
                                                <li>{getLocalValue("business_item2_ul1_li9")}</li>
                                            </ul>
                                        </li>
                                        <li>
                                            <div className={"g-my-20"}> <span className={"business-ul-square"}></span>{getLocalValue("business_item2_ul2")}</div>
                                            <ul className={"business-ul-ul g-pl-10"}>
                                                <li>{getLocalValue("business_item2_ul1_li1")}</li>
                                                <li>{getLocalValue("business_item2_ul1_li2")}</li>
                                                <li>{getLocalValue("business_item2_ul1_li3")}</li>
                                                <li>{getLocalValue("business_item2_ul1_li4")}</li>
                                                <li style={{fontSize:"12px", color:"#bbb"}}>{getLocalValue("business_item2_ul1_li5")}</li>
                                            </ul>
                                        </li>
                                    </ul>
                                    <div style={{paddingLeft:"10px"}}>
                                        <div style={{fontSize:"1.5em", color:"#a6a6a6"}} className={"g-pt-40 g-pb-10"}>{getLocalValue("business_item2_ul3")}</div>
                                        <ul className={"business-ul-last"}>
                                            <li>{getLocalValue("business_item2_ul3_li1")}</li>
                                            <li>{getLocalValue("business_item2_ul3_li2")}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        );
    }
}
export default Business;