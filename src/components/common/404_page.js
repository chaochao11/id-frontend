import React, { Component } from "react";
import Header from "./header";
import Footer from "./footer";
import error from './../../../public/img/404.png';
import { Link, withRouter } from 'react-router-dom';

const Page404 = () => {
  return (
    <div>
      <div className="page-404">
        <div className="page-404-wrapper">
          <img src={error} alt="404" title="ERROR 404 - 页面丢失了" />
          <h4>ERROR 404 - 页面丢失了</h4>
          <p>不用着急，InvestDigital正在全力以赴修复中~~</p>
            <div className="text-center" style={{ marginTop:"50px"}}>
                <Link className='button-active-blue' style={{padding:"10px 40px", color:"white"}} to="/">返回首页</Link>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Page404;
