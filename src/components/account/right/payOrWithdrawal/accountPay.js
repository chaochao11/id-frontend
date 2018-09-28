import React from "react";
import { Popover, message } from 'antd';
import { AccountPrimaryStatus } from './../../../../actions/account';



const content_2 = (
    <div>
        <p>42位字符串，可以用于接收别人转币，也可作为转币凭证，类似银行卡号</p>
    </div>
);
const base = 'data:image/png;base64,';
export default class AccountPay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    changeFunc () {

    }
    showFunc (currencyType) {
        const { dispatch } = this.props;
        this.props.onAccountPay(currencyType);
        dispatch(AccountPrimaryStatus(true));
    }
    copyFunc() {
        let address = this.refs.address;
        address.focus();
        address.setSelectionRange(0, address.value.length);
        document.execCommand("Copy", true);
        message.success('复制成功');
    }

    render() {
        const { addressBase64, address, isBindAddress, currencyType, currencyName } = this.props;
        const content_3 = (
            <div>
                <img style={{width: '160px', height: '160px'}} src={base + addressBase64} alt=""/>
            </div>
        );
        return (
            <div className="account-pay-item hide">
                { parseInt(isBindAddress) === 2 ? <div className="account-pay-info clear">
                    <div className="fl">充币地址：</div>
                    <div className="fl" style={{cursor: 'pointer', textDecoration: 'underline'}}
                    onClick={this.showFunc.bind(this, currencyType)}>待激活
                    </div>
                    <Popover placement="top" content={content_2} trigger="hover">
                    <div className="fl account-common-color" style={{
                        cursor: 'pointer',
                        marginLeft: '10px',
                        textDecoration: 'underline',
                        fontSize: '12px'
                }}>充币地址是什么？
                    </div>
                    </Popover>
                    </div> : <div className="account-pay-info clear">
                    <div className="fl">充币地址：</div>
                    <input type="text" className="fl" ref="address" onChange={this.changeFunc.bind(this)}
                           value={`${address}`}/>
                    <Popover placement="top" content={content_3} trigger="hover">
                        <div className="fl" style={{cursor: 'pointer', color: '#167aff', marginLeft:'10px'}}>地址二维码</div>
                    </Popover>
                    <div className="fl"
                         style={{cursor: 'pointer', marginLeft: '10px', color: '#167aff'}}
                         onClick={this.copyFunc.bind(this)}>复制地址
                    </div>
                    <Popover placement="top" content={content_2} trigger="hover">
                        <div className="fl account-common-color" style={{
                            cursor: 'pointer',
                            marginLeft: '10px',
                            textDecoration: 'underline',
                            fontSize: '12px'
                        }}>充币地址是什么？
                        </div>
                    </Popover>
                </div> }
                {parseInt(currencyType) === 1 ? <div className='account-mine-info'>
                    <p>温馨提示</p>
                    <p>{`• 本充值地址只接受Tether标准的 USDT 资产。`}</p>
                    <p>• 您充值至上述地址后，需要整个网络节点的确认，1次网络确认后到账，6次网络确认后可提币。</p>
                    <p>{`• 最小充值金额：100 USDT ，小于最小金额的充值将不会上账。`}</p>
                </div> : parseInt(currencyType) === 2 ? <div className='account-mine-info'>
                    <p>温馨提示</p>
                    <p>• 请勿向上述地址充值任何非 IDT 资产，否则资产将不可找回。</p>
                    <p>• 您充值至上述地址后，需要整个网络节点的确认，15次网络确认后到账，30次网络确认后可提币。</p>
                    <p>• 最小充值金额：50 IDT，小于最小金额的充值将不会上账且无法退回。</p>
                    <p>• 您的充值地址不会经常改变，可以重复充值；如有更改，我们会尽量通过网站公告或邮件通知您。</p>
                    <p>• 请务必确认电脑及浏览器安全，防止信息被篡改或泄露。</p>
                    <p>• IDT充币仅支持以太坊transfer和transferFrom方法，使用其他方法的充币暂时无法上账，请您谅解。</p>
                </div> : parseInt(currencyType) === 3 ? <div className='account-mine-info'>
                    <p>温馨提示</p>
                    <p>• 请勿向上述地址充值任何非 BTC 资产，否则资产将不可找回。</p>
                    <p>• 您充值至上述地址后，需要整个网络节点的确认，1次网络确认后到账，6次网络确认后可提币。</p>
                    <p>• 最小充值金额：0.001 BTC，小于最小金额的充值将不会上账且无法退回。</p>
                    <p>• 您的充值地址不会经常改变，可以重复充值；如有更改，我们会尽量通过网站公告或邮件通知您。</p>
                    <p>• 请务必确认电脑及浏览器安全，防止信息被篡改或泄露。</p>
                </div> : parseInt(currencyType) === 4 ? <div className='account-mine-info'>
                    <p>温馨提示</p>
                    <p>• 请勿向上述地址充值任何非 ETH 资产，否则资产将不可找回。</p>
                    <p>• 您充值至上述地址后，需要整个网络节点的确认，15次网络确认后到账，30次网络确认后可提币。</p>
                    <p>• 最小充值金额：0.01 ETH，小于最小金额的充值将不会上账且无法退回。</p>
                    <p>• 目前不支持使用智能合约或区块奖励(Coinbase)的转账充值，智能合约或区块奖励的转账将不会上账，请您谅解。</p>
                    <p>• 您的充值地址不会经常改变，可以重复充值；如有更改，我们会尽量通过网站公告或邮件通知您。</p>
                    <p>• 请务必确认电脑及浏览器安全，防止信息被篡改或泄露。</p>
                </div> : <div className='account-mine-info'>
                    <p>温馨提示</p>
                    <p>• 请勿向上述地址充值任何非GET资产，否则资产将不可找回。</p>
                    <p>• 您充值至上述地址后，需要整个网络节点的确认，15次网络确认后到账，30次网络确认后可提币。</p>
                    <p>• 最小充值金额：20 GET，小于最小金额的充值将不会上账且无法退回。</p>
                    <p>• 您的充值地址不会经常改变，可以重复充值；如有更改，我们会尽量通过网站公告或邮件通知您。</p>
                    <p>• 请务必确认电脑及浏览器安全，防止信息被篡改或泄露。</p>
                    <p>• GET充币仅支持以太坊transfer和transferFrom方法，使用其他方法的充币暂时无法上账，请您谅解</p>
                    </div>}
            </div>
        );
    }
}


