import React from "react";
import AccountMineBase from './mine/accountMineBase';
import AccountMinePressure from './mine/accountMinePressure';
import { siblings } from "./../../../tools/utils";
import AccountLeft from './../left/accountLeft';
import { AccountPressureInfo, MineAccount } from './../../../actions/account';

export default class AccountMine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 1
        };
    }
    checkType() {
        siblings(this).forEach((item, index, arr) => {
            arr[0].style.background = '#f5f5f5';
            arr[0].style.color = '#a7a7a7';
        });
        this.style.background = 'linear-gradient(-90deg, #62D2FE 0%, #62D2FE 0%, #167AFF 100%, #167AFF 100%)';
        this.style.color = '#fff';
    }
    addEvent() {
        let arr = this.refs.type.children;
        let ways = [];
        for (let i = 0; i < arr.length; i++) {
            ways.push(arr[i]);
        }
        Array.prototype.forEach.call(ways, (item) => {
            item.addEventListener('click', this.checkType);
        });
    }
    statusFunc(type) {
        const { dispatch } = this.props;
        this.setState({
            type: type
        });
        if(type === 2) {
            dispatch(AccountPressureInfo());
        }else{
            dispatch(MineAccount());
        }
    }
    componentDidMount() {
        this.addEvent();
    }
    render() {
        return (
            <div className="account-wrap">
                <AccountLeft {...this.props}/>
                <div className="clear account-select" ref='type'>
                    <div className="fl" onClick={this.statusFunc.bind(this, 1)}>基本账户</div>
                    <div className="fl" onClick={this.statusFunc.bind(this, 2)}>质押账户</div>
                </div>
                {this.state.type === 1 ? <AccountMineBase {...this.props}/> : <AccountMinePressure {...this.props}/>}
            </div>
        );
    }
}