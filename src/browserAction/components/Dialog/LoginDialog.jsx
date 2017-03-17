import React, { PropTypes } from 'react';
import { Icon, Input, Button } from 'antd';
import { API } from '../../config';
import './style.less';


class LoginDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            message: null
        };
        this.handleLogin = this.handleLogin.bind(this);
    }
    handleLogin() {
        const { username, password } = this.state;
        if (!username) {
            this.setState({ message: '请填写用户名' });
            return;
        }
        if (!password) {
            this.setState({ message: '请填写密码' });
            return;
        }
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        fetch(API.login, { headers: { 'Content-Type': 'application/json; charset=utf-8' }, method: 'POST', body: JSON.stringify({ username, password }) })
            .then(res => res.json())
            .then(({ userInfo, code, message }) => {
                if (code) {
                    this.setState({ message });
                    return;
                }
                chromep.storage.local.set({ userInfo }).then(() => {
                    this.props.handleLoginDone(userInfo);
                    this.props.handleClose();
                });
            });
    }

    render() {
        const { message } = this.state;
        return (
            <div className="x-draw-dialog x-draw-dialog-login">
                <p>
                    <Input
                        onChange={e => this.setState({ username: e.target.value })}
                        prefix={<Icon type="user" style={{ fontSize: 13 }} />}
                        placeholder="请输入账号"
                    />
                </p>
                <p>
                    <Input
                        onChange={e => this.setState({ password: e.target.value })}
                        prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
                        type="password"
                        placeholder="请输入密码"
                    />
                </p>
                <Button type="primary" className="x-draw-dialog-login-button" onClick={this.handleLogin}>
                    登陆
                </Button>
                {
                    message ?
                        <p className="x-draw-dialog-login-error">{message}</p>
                        : null
                }
            </div>
        );
    }
}

LoginDialog.defaultProps = {
    handleLoginDone: () => {},
    handleClose: () => {}
};

LoginDialog.propTypes = {
    handleLoginDone: PropTypes.func,
    handleClose: PropTypes.func,
};

export default LoginDialog;