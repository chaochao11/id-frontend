import React from "react";
import { Icon, Popover, Pagination, message } from 'antd';
import { AccountInvitedCode } from './../../../actions/account';
import {ROOT_SHARE} from './../../../actions/types';
import QrCode from 'qrcode.react';

export default class AccountInvite extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page:1
        };
    }

    changeFunc () {}
    copyClickFunc () {
        let address = this.refs.address;
        address.focus();
        address.setSelectionRange(0, address.value.length);
        document.execCommand("Copy", true);
        message.success('复制成功');
    }
    copyClickHandler () {
        let address = this.refs.invite;
        address.focus();
        address.setSelectionRange(0, address.value.length);
        document.execCommand("Copy", true);
        message.success('复制成功');
    }

    componentDidMount () {
        const { dispatch } = this.props;
        let init = {
            pageSize: 10,
            pageNum: 1,
        };
        dispatch(AccountInvitedCode(init));
    }
    onChange (page) {
        const { dispatch } = this.props;
        let init = {
            pageSize: 10,
            pageNum: page,
        };
        this.setState({
            page:page
        });
        dispatch(AccountInvitedCode(init));
    }
    render() {
        const { userInviteRecordVos, inviteCode, inviteNum, reward, totalNum } = this.props.accountInvitedCodeList.data;
        const loginname = localStorage.getItem("loginname");
        let item = userInviteRecordVos && userInviteRecordVos.map((cur, index, arr) => {
            return <div className="account-invite-list-main clear" key={index.toString()}>
                <div>{cur.userAccount}</div>
                <div>{cur.createTimeStr}</div>
                <div>{cur.qicStatusStr}</div>
                <div>{cur.amout}</div>
            </div>;
        });
        return (
            <div className="account-invite">
                <div className="account-invite-title">
                    分享方式
                </div>
                <div className="account-invite-way clear" style={{margin:'20px auto'}}>
                    <div className="account-invite-way-fir">
                        <div>
                            <Icon type="lock" /><span>专属邀请码</span>
                        </div>
                        <div className="clear">
                            <input className="fl" type="text" ref="invite" value={!inviteCode ? '' : `${inviteCode}`} onChange={this.changeFunc.bind(this)}/>
                            <button className="fr" onClick={this.copyClickHandler.bind(this)}>复制邀请码</button>
                        </div>
                    </div>
                    <div className="account-invite-way-sec">
                        <div className="clear">
                            <span className="fl"><Icon type="link" /><span>专属分享链接</span></span>
                            <span className="fr">
                                <Popover width={200} placement="bottomRight" content={<QrCode size={100} value={!inviteCode ? '' : `${ROOT_SHARE}/user/account/invite?phone=${loginname}&code=${inviteCode}`}/>} trigger="hover">
                                    <i className="fa fa-wechat fa-fw" style={{marginRight:'20px'}} aria-hidden="true"></i>
                                </Popover>
                                <Popover width={200} placement="bottomRight" content={<QrCode size={100} value={`${ROOT_SHARE}/user/account/invite?phone=${loginname}&code=${inviteCode}`}/>} trigger="hover">
                                    <i className="fa fa-qq fa-fw" aria-hidden="true"></i>
                                </Popover>
                            </span>
                        </div>
                        <div className="clear">
                            <input className="fl" type="text" ref="address" value={`${ROOT_SHARE}/user/signup/${inviteCode}`} onChange={this.changeFunc.bind(this)}/>
                            <button className="fr" onClick={this.copyClickFunc.bind(this)}>复制链接分享</button>
                        </div>
                    </div>
                </div>
                <div className="account-invite-title">
                    统计
                </div>
                <div className="account-invite-combined clear" style={{margin:'20px auto'}}>
                    <div>
                        <div><Icon type="user" />邀请人数</div>
                        <div style={{marginTop:'20px'}}>{inviteNum}</div>
                    </div>
                    <div>
                        <div><Icon type="red-envelope" />累计获得返佣</div>
                        <div style={{marginTop:'20px'}}>{`IDT ${reward}`}</div>
                    </div>
                </div>
                <div className="account-invite-title">
                    邀请记录
                </div>
                <div className="account-invite-list" style={{margin:'20px auto'}}>
                    <div className="account-invite-list-top clear">
                        <div>被邀请人账号</div>
                        <div>时间</div>
                        <div>状态</div>
                        <div>佣金</div>
                    </div>
                    {item}
                    { !parseInt(totalNum) ? <div className="account-invite-list-pagination-none">
                        暂无记录
                    </div> : <div className="account-invite-list-pagination">
                        <Pagination current={parseInt(this.state.page)} size="small" total={parseInt(totalNum)}
                                    onChange={this.onChange.bind(this)}/>
                    </div>
                    }
                </div>
                <div className="account-invite-title">
                    邀请细则
                </div>
                <div className="account-invite-rule">
                    <p>1、 被邀请人填写你的邀请码，每一人完成邀请，您都将【额外】获得10个IDT；</p>
                    <p>2、 邀请上限为10人，超出10人的部分将【不会】再获得额外IDT；</p>
                    <p>3、好友接受邀请后，完成注册和实名认证会记录为一个被邀请人员；</p>
                    <p>4、返佣的形式以IDT的形式返回到您的交易账户；</p>
                    <p>5、邀请人享受好友交易返佣有效时长以被邀请人实际完成实名认证的时间开始进行计算。</p>
                    <p style={{height:'30px'}}></p>
                    <p>活动如有调整，以IDT平台更新为准，最终解释权归IDT平台所有</p>
                </div>
            </div>
        );
    }
}


