import React from "react";
import {Upload, message, Icon} from 'antd';
import AccountCertificationReview from './accountCertificationReview';
import AccountCertificationSuccess from './accountCertificationSuccess';
import AccountCertificationLose from './accountCertificationLose';
import anth_1 from './../../../../../public/img/auth_1.jpg';
import anth_2 from './../../../../../public/img/auth_2.jpg';
import anth_3 from './../../../../../public/img/auth_3.png';
import {AccountSecurityCommitAuthImg, AccountHighStatus} from './../../../../actions/account';
import {ROOT_USER, getAuthorizedHeader} from "./../../../../actions/types";

export default class AccountCertification extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            positiveImage: '',
            oppositeImage: '',
            hadImg: '',
            loading1: false,
            loading2: false,
            loading3: false,
            img1: true,
            img2: true,
            img3: true,
            path_1: '',
            path_2: '',
            path_3: ''
        };
    }


    beforeUpload(file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
        if (!isJPG) {
            message.error('请确保照片的内容完整并清晰可见，仅支持jpg、jpeg、PNG图片格式');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('请将照片大小保证在2M以内');
        }
        return isJPG && isLt2M;
    }

    handleChange1(info) {
        if (info.file.status === 'uploading') {
            this.setState({loading1: true});
            return;
        }
        if (info.file.status === 'done') {
            this.setState({
                path_1: info.file.response.data
            });
            // Get this url from response in real world.
            this.getBase64(info.file.originFileObj, positiveImage => this.setState({
                positiveImage,
                loading1: false,
                img1: true
            }));
        }
    }

    getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
    handleChange2 = (info) => {
        if (info.file.status === 'uploading') {
            this.setState({loading2: true});
            return;
        }
        if (info.file.status === 'done') {
            this.setState({
                path_2: info.file.response.data
            });
            // Get this url from response in real world.
            this.getBase64(info.file.originFileObj, oppositeImage => this.setState({
                oppositeImage,
                loading2: false,
                img2: true
            }));
        }
    }
    handleChange3 = (info) => {
        if (info.file.status === 'uploading') {
            this.setState({loading3: true});
            return;
        }
        if (info.file.status === 'done') {
            this.setState({
                path_3: info.file.response.data
            });
            // Get this url from response in real world.
            this.getBase64(info.file.originFileObj, hadImg => this.setState({
                hadImg,
                loading3: false,
                img3: true
            }));
        }
    }

    offChange() {
        const {dispatch} = this.props;
        let init = {
            phoneNum:0,
            emailNum:0,
            authNum:0,
            nameAuthNum:0,
            openGa:0,
            closeGa:0,
            changeGa:0,
            accountFlag:true
        };
        dispatch(AccountHighStatus(init));
    }

    sendAuthFunc() {
        const {dispatch} = this.props;
        if (!this.state.path_1) {
            this.setState({
                img1: false
            });
        }
        if (!this.state.path_2) {
            this.setState({
                img2: false
            });
        }
        if (!this.state.path_3) {
            this.setState({
                img3: false
            });
        }
        if (!this.state.path_1 || !this.state.path_2 || !this.state.path_3) {
            return false;
        }
        let init = {
            frontPhoto: this.state.path_1,
            backPhoto: this.state.path_2,
            onHandPhoto: this.state.path_3
        };
        dispatch(AccountSecurityCommitAuthImg(init));
    }

    render() {
        const positiveImage = this.state.positiveImage;
        const oppositeImage = this.state.oppositeImage;
        const hadImg = this.state.hadImg;
        const {highQICStatus} = this.props.accountSecurityInfo.data;
        let imgUrl = `${ROOT_USER}/user/upload_image`;
        const {showInfo} = this.props;
        const {accountFlag, authNum} = this.props.accountHighStatus;
        const uploadButton1 = (
            <div>
                <Icon type={this.state.loading1 ? 'loading' : 'plus'}/>
            </div>
        );
        const uploadButton2 = (
            <div>
                <Icon type={this.state.loading2 ? 'loading' : 'plus'}/>
            </div>
        );
        const uploadButton3 = (
            <div>
                <Icon type={this.state.loading3 ? 'loading' : 'plus'}/>
            </div>
        );
        return (
            <div
                className={`account-certification ${!accountFlag && authNum === 3 ? "show" : "hide"}`}>
                <div className="account-certification-title clear">
                    <span className="fl" style={{fontWeight: 'bold', fontSize: '16px'}}>高级认证</span>
                    <span className="fr" style={{lineHeight: '24px', color: '#a7a7a7', cursor: 'pointer'}}
                          onClick={this.offChange.bind(this)}><Icon type="left"/>返回账户安全</span>
                </div>
                {showInfo ? <div className="account-certification-main">
                    <div className="account-certification-wrap">
                        <div className="account-certification-center">
                            <div className="account-certification-center-fir">
                                <p>身份证正面</p>
                                <div style={this.state.img1 ? {} : {border: '1px solid #d8565d'}}>
                                    <Upload
                                        name="file"
                                        listType="picture-card"
                                        className="avatar-uploader"
                                        showUploadList={false}
                                        action={imgUrl}
                                        headers={{authorization: getAuthorizedHeader().authorization}}
                                        beforeUpload={this.beforeUpload.bind(this)}
                                        onChange={this.handleChange1.bind(this)}
                                    >
                                        {positiveImage ? <img src={positiveImage} alt="avatar"/> : uploadButton1}
                                    </Upload>
                                </div>
                                {this.state.img1 ? <span></span> : <span>*照片有误</span>}
                                <img src={anth_1} alt=""/>
                            </div>
                            <div className="account-certification-center-sec">
                                <p>身份证反面</p>
                                <div style={this.state.img2 ? {} : {border: '1px solid #d8565d'}}>
                                    <Upload
                                        name="file"
                                        listType="picture-card"
                                        className="avatar-uploader"
                                        showUploadList={false}
                                        action={imgUrl}
                                        headers={{authorization: getAuthorizedHeader().authorization}}
                                        beforeUpload={this.beforeUpload.bind(this)}
                                        onChange={this.handleChange2.bind(this)}
                                    >
                                        {oppositeImage ? <img src={oppositeImage} alt="avatar"/> : uploadButton2}
                                    </Upload>
                                </div>
                                {this.state.img2 ? <span></span> : <span>*照片有误</span>}
                                <img src={anth_2} alt=""/>
                            </div>
                            <div className="account-certification-center-thd">
                                <p>手持身份证 + IDT + 时间</p>
                                <div style={this.state.img3 ? {} : {border: '1px solid #d8565d'}}>
                                    <Upload
                                        name="file"
                                        listType="picture-card"
                                        className="avatar-uploader"
                                        showUploadList={false}
                                        action={imgUrl}
                                        headers={{authorization: getAuthorizedHeader().authorization}}
                                        beforeUpload={this.beforeUpload.bind(this)}
                                        onChange={this.handleChange3.bind(this)}
                                    >
                                        {hadImg ? <img src={hadImg} alt="avatar"/> : uploadButton3}
                                    </Upload>
                                </div>
                                {this.state.img3 ? <span></span> : <span>*照片有误</span>}
                                <img src={anth_3} alt=""/>
                            </div>
                        </div>
                    </div>
                    <div className="account-certification-info" style={{textAlign:'center'}}>
                        <p>*请确保照片的内容完整并清晰可见，仅支持jpg、jpeg、PNG图片格式</p>
                        <p>*请将照片大小保证在2M以内</p>
                    </div>
                    <div className="account-certification-button">
                        <button onClick={this.sendAuthFunc.bind(this)}>提交</button>
                    </div>
                </div> : <div>
                    {parseInt(highQICStatus) === 0 ? {} : parseInt(highQICStatus) === 1 ?
                        <AccountCertificationReview {...this.props}/> : parseInt(highQICStatus) === 2 ?
                            <AccountCertificationLose {...this.props}/> : parseInt(highQICStatus) === 3 ?
                                <AccountCertificationSuccess {...this.props}/> : {}}
                </div>}

            </div>

        );
    }
}


