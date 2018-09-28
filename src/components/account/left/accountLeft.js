import React from "react";
import { getAuthorizedHeader, ROOT_AVATAR, ROOT_USER } from "./../../../actions/types";
import { Upload } from 'antd';
import photo from './../../../../public/img/default.png';

export default class AccountLeft extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imageUrl: ''
        };
    }

    handleUploadChange(info) {
        if (info.file.status === 'done') {
            this.getBase64(info.file.originFileObj, () => this.setState({
                    imageUrl: info.file.response.data
                }, ()=>{
                localStorage.setItem('avatar', info.file.response.data);
                this.props.history.push('/user/account');
            }));
        }
    }

    getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    render() {
        const loginName = localStorage.getItem("loginname");
        const lastLoginTime = localStorage.getItem("lastLoginTime");
        const avatar = localStorage.getItem('avatar');
        return (
            <div className="account-left">
                <div className="account-left-head">
                    <div>
                        <div>
                            <Upload
                                className="avatar-uploader"
                                name="file"
                                showUploadList={false}
                                action={`${ROOT_USER}/user/avatar`}
                                onChange={this.handleUploadChange.bind(this)}
                                headers={{authorization: getAuthorizedHeader().authorization}}
                            >
                                <img src={ this.state.imageUrl ? `${ROOT_AVATAR}/${this.state.imageUrl}` : (avatar ? `${ROOT_AVATAR}/${avatar}` : photo)} title="头像" className="avatar"/> :
                            </Upload>
                        </div>
                    </div>
                </div>
                <div style={{textAlign: 'center', marginTop: '10px'}}>
                    <p style={{fontSize: '16px'}} className="headline">{loginName}</p>
                    <p>{`上次登录：${lastLoginTime}`}</p>
                </div>
            </div>

        );
    }
}


