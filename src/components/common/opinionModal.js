import React from "react";
import {connect} from 'react-redux';
import { Modal, InputNumber, message } from 'antd';
import { OpinionFeedBack } from './../../actions/account';

let reg = /^((1[3-8][0-9])+\d{8})$/;
class OpinionModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            numFlag: true,
            opinion: true
        };
    }
    handleCancelFunc(){
        this.props.onCancleModal();
    }
    onChange (value) {
        this.setState({
            value: value
        });
    }
    blurFunc (){
        const { value, numFlag } = this.state;
        if (value === undefined || value === '') {
            this.setState({
                numFlag: false
            });
            return false;
        } else if (!reg.test(value)) {
            this.setState({
                numFlag: false
            });
            return false;
        }else{
            this.setState({
                numFlag: true
            });
        }
    }
    opinionFunc () {
        let description = this.refs.opinion.value.trim();
        if (!description){
            this.setState({
                opinion:false
            });
            return false;
        }else{
            this.setState({
                opinion:true
            });
        }
    }
    sureFunc() {
        const { dispatch } = this.props;
        const { value } = this.state;
        let description = this.refs.opinion.value.trim();
        let init = {
            mobilephone: value,
            content: description
        };
        if (value === undefined || value === '' || !reg.test(value)) {
            this.setState({
                numFlag: false
            });
            return message.error('填写有误，请重新填写');
        } else if (!description) {
            this.setState({
                opinion:false
            });
            return message.error('填写有误，请重新填写');
        } else{
            this.setState({
                numFlag: true,
                opinion: true
            });
        }
        dispatch(OpinionFeedBack(init, () => {
            this.props.onCancleModal();
            this.setState({
                value: ''
            });
            this.refs.opinion.value = '';
        }));
    }
    render() {
        const { opinionFlag } = this.props;
        return (
            <div>
                <Modal
                    visible={opinionFlag}
                    onCancel={this.handleCancelFunc.bind(this)}
                    footer={null}
                    width={587}
                >
                    <div className="opinion-modal">
                        <div className="opinion-modal-top clear">
                            <span className="headline">手机号</span>
                            <InputNumber className={this.state.numFlag ? "fl" : "fl account-input-border"} value={this.state.value} onChange={this.onChange.bind(this)} onBlur={this.blurFunc.bind(this)}/>
                        </div>
                        <div className="clear">
                            <span className="opinion-modal-span" style={{height: '20px'}}></span>
                            {this.state.numFlag ? <p></p> : <p>*手机号格式错误</p>}
                        </div>
                        <div className="opinion-modal-middle clear">
                            <span className="headline">反馈意见</span>
                            <textarea ref="opinion" maxLength="200" className={this.state.opinion ? "fl" : "fl account-input-border"} onBlur={this.opinionFunc.bind(this)}>
                            </textarea>
                        </div>
                        <div className="clear">
                            <span className="opinion-modal-span" style={{height: '20px'}}></span>
                            {this.state.opinion ? <p></p> : <p>*输入有误</p>}
                        </div>
                        <div className="opinion-modal-bottom clear">
                            <span></span>
                            <div className="opinion-modal-bottom-btn clear">
                                <button className="fl button-active-blue" onClick={this.sureFunc.bind(this)}>提交</button>
                                <button className="fl" onClick={this.handleCancelFunc.bind(this)}>取消</button>
                            </div>
                        </div>
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
})(OpinionModal);