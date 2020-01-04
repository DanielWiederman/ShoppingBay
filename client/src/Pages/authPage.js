import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Icon, Input, Button, Checkbox, message } from 'antd';
import { Link } from 'react-router-dom'
import { GET_USER } from "../Api/api"
import { requestData } from '../RequestData/RequestData'
import { reqLocalStorage } from '../localStorage/file'
import * as action from '../Store/action/userDataActions'
import '../CSS/authPage.css'

//for mobile:
//Main element props=>
// width: "95%", marginTop: "5%", 
//Container=>
//margin-top: 15%;
//width: 80%;

const initState = {
    elementWidth: "95%",
    elementMarginTop: "5%"
}

export class authPage extends Component {

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                message.destroy()
                message.loading("checking...", 0)
                let data = {
                    url: GET_USER,
                    method: "post",
                    data: {
                        email: values.email,
                        password: values.password
                    }
                }



                requestData(data).then(res => {
                    message.destroy()
                    let localData = {
                        method: "set",
                        data: res.data.tokens[res.data.tokens.length - 1].token,
                    }
                    if (values.remember) {
                        reqLocalStorage(localData)
                    }
                    let user = {
                        userID: res.data._id,
                        userName: res.data.userName,
                        email: res.data.email
                    }
                    this.props.saveUser(user).then(res => {
                        this.props.turnAuth().then(result => {
                            const { history } = this.props;
                            history.push("/Home")
                        })
                    })
                }).catch(err => {
                    message.destroy()
                    message.error(err.response.data.msg, 5)
                    console.log(err.response.data)
                })
            }
        });
    }

    render() {

        const { getFieldDecorator } = this.props.form;

        return (
            <div>
                <center>
                    <div className="authContainer">
                        <Form style={{ width: "95%", marginTop: "4%" }} onSubmit={this.handleSubmit} className="login-form">
                            <h2 style={{ color: "#1890ff" }}>Please login to FuckNJoy</h2>
                            <Form.Item>
                                {getFieldDecorator('email', {
                                    rules: [{ type: "email", required: true, message: 'Please input your email!' }],
                                })(
                                    <Input prefix={<Icon type="email" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Email" />
                                )}
                            </Form.Item>
                            <Form.Item>
                                {getFieldDecorator('password', {
                                    rules: [{ required: true, message: 'Please input your Password!' }],
                                })(
                                    <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                                )}
                            </Form.Item>
                            <Form.Item>
                                {getFieldDecorator('remember', {
                                    valuePropName: 'checked',
                                    initialValue: true,
                                })(
                                    <Checkbox style={{ float: "left" }}>Remember me</Checkbox>
                                )}

                                <Link style={{ float: "right" }} className="login-form-forgot" to="/forgotpassword">Forgot password</Link>
                                <br />
                                <Button type="primary" htmlType="submit" className="login-form-button">
                                    Log in
                                    </Button>
                                <div>  Or <Link to="/Register">register now!</Link></div>
                            </Form.Item>
                        </Form>
                    </div>
                </center>
            </div>
        )
    }
}

const WrappedLogin = Form.create({ name: 'normal_login' })(authPage);

const mapStateToProps = (state) => ({

})
const mapDispatchToProps = dispatch => {
    return {
        saveUser: (data) => dispatch(action.saveUser(data)),
        turnAuth: () => dispatch(action.turnAuth()),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(WrappedLogin)
