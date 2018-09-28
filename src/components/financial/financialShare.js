import React from "react";
import {connect} from 'react-redux';
import { Popover, Modal } from 'antd';
import { getQueryString } from "./../common/language";
import { GetActivityCoupon } from './../../actions/financial';
import wallet from './../../../public/img/financial-share-wallet.png';

const content = (
    <div style={{width: '200px'}}>
        <p>1.每邀请一位好友成功购买理财产品，邀请人可获得6.66USDT现金券，被邀请人可获得6.66USDT满减券。多邀多得，奖励实时发放。</p>
        <p>2.若邀请人邀请多位好友成功购买产品，现金券可多次领取，上不封顶。</p>
        <p>3.若同一被邀请人购买产品，对应的现金券只可领取1次，不可叠加。</p>
        <p>4.满减券只可领取1次，不可叠加。</p>
    </div>
);
const phoneReg = /^((1[3-8][0-9])+\d{8})$/;
const mailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
const diffReg = /@/;
class FinancialShare extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: ''
        };
    }
    register () {
        const { status } = this.props.financial.getActivityCouponInfo.data;
        if (parseInt(status) === 1) {
            this.props.history.push(`/user/signin`);
            return false;
        }
        this.props.history.push(`/user/signup`);
    }
    submit () {
        let uid = getQueryString('uid');
        let code = getQueryString('code');
        let phone = this.refs.phone.value.trim();
        const { dispatch } = this.props;
        let init = {
            activityCode: code,
            uid: uid,
            phoneNumber: phone
        };
        if (!phone) {
            this.setState({
                error: '输入不能为空'
            });
            return false;
        }
        if (diffReg.test(phone)) {
            if (!mailReg.test(phone)) {
                this.setState({
                    error: "邮箱格式不正确",
                });
            }else{
                dispatch(GetActivityCoupon(init));
            }
        }else{
            if (!phoneReg.test(phone)) {
                this.setState({
                    error: "手机号格式不正确",
                });
            }else{
                dispatch(GetActivityCoupon(init));
            }
        }
    }
    handleCancel () {
        const { dispatch } = this.props;
        let phone = this.refs.phone;
        phone.value = '';
        this.setState({
            error: ''
        });
        dispatch({
            type: 'GET_ACTIVITY_COUPON',
            getActivityCouponFlag: false,
            getActivityCouponInfo: {
                data: {
                    currencyType: "IDT",
                    fullAmount: 0,
                    status: 0,
                    subAmount: 0
                }
            }
        });
    }
    render() {
        document.title="IDT理财，年化收益36.8%，带你制霸夏天！";
        let coin = getQueryString('coin');
        const { getActivityCouponFlag } = this.props.financial;
        const { currencyType, fullAmount, status, subAmount } = this.props.financial.getActivityCouponInfo.data;
        return (
            <div className="financial-share-main">
                <div className="financial-share">
                    <div className="financial-share-warp">
                        <div className="financial-share-wallet">
                            <img src={wallet} alt=""/>
                        </div>
                        <div className="financial-share-bgc"></div>
                        <div className="financial-share-center">
                            <p>支持币种</p>
                            <p>{coin}</p>
                            <div className="financial-share-get clear">
                                <span>手机号/邮箱</span>
                                <input type="text" ref='phone'/>
                            </div>
                            <div className={!this.state.error ? "financial-share-error clear hide" : "financial-share-error clear show"}>
                                <p>{this.state.error}</p>
                            </div>
                        </div>
                        <div className="financial-share-btn">
                            <button onClick={this.submit.bind(this)}>立即领取福利</button>
                        </div>
                        <p className="financial-share-active-rule">
                            <Popover placement="top" content={content} trigger="click">
                                <span>活动规则 ></span>
                            </Popover>
                        </p>
                    </div>
                </div>
                <Modal
                    visible={getActivityCouponFlag}
                    title={null}
                    onCancel={this.handleCancel.bind(this)}
                    maskStyle={{background: 'rgba(255, 255, 255, .9)'}}
                    width={480}
                    footer={null}
                >
                    <div className="pop-box g-pt-20 g-pb-10 text-center">
                        {parseInt(status) === 1 ? <div>
                            <p>{`满${fullAmount}${currencyType}减${subAmount}优惠券`}</p>
                            <p>已发放到您的账户</p>
                        </div> : <div>
                            {`您需完成注册才可领取${fullAmount}${currencyType}减${subAmount}优惠券`}
                        </div> }
                        <button className="financial-share-button" onClick={this.register.bind(this)}>{parseInt(status) === 1 ? '立即查看' : '立即注册'}</button>
                    </div>
                </Modal>
            </div>

        );
    }
}

export default connect(state => {
    return {
        ...state
    };
})(FinancialShare);


