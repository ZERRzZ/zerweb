import { useEffect, useState } from 'react';
import { Form, Input, Button, Modal, message, Popover } from 'antd';
import { strEnc } from '@/lib/login/des';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import axios from "axios";
import env from "@/constants/env.json"
import $ from '@/lib/login/slider_captcha'
import logo from '@/assets/images/logo.png';
import ywIcon from '@/assets/images/small_logo.jpg';
import "./app.css";
import "@/lib/login/slider_captcha.css"
import { setConfig } from '@/stories/GlobalConfig';
import Auth from '@/lib/auth';
import { useNavigate } from 'react-router';
import { decrypt } from '@/lib/login/loginUtils';

const http = axios.create({
    timeout: 10000
})

const host = env.baseApiUrl;

interface IAuthConfig {
    authUrl?: string;
    authKey?: string;
    imageType?: string;
    smsUrl?: string;
    imageUrl?: string;
    imageCheckUrl?: string;
    k1?: string;
    k2?: string;
    k3?: string;
}


export default function Login() {
    const [authConfig, setAuthConfig] = useState<IAuthConfig>({})
    const navigate = useNavigate()

    useEffect(() => {
        $(document).keydown((e) => {
            if (e.key == 'Enter') {
                e.preventDefault()
                $(".verify-button").trigger("click")
            }
        })
    }, [])

    useEffect(() => {
        http.get(`${host}/load`).then((res) => {
            let data = JSON.parse(decrypt(res.data.data))
            localStorage.setItem("destroyTokenUrl", data.destroyTokenUrl)
            setAuthConfig(data as IAuthConfig);
        })
    }, [])

    const loginSubmit = (formId, formData, uid) => {
        const { user_name, password } = formData
        const params = Object.keys({ user_name, password }).map((key) => {
            return key + '=' + formData[key]
        }).join('&');
        const encryptData = encrypt(params);
        submit(encryptData, uid)
    }

    const encrypt = (text) => {
        // var random = getRandom(12);
        return strEnc(text, authConfig.k1, authConfig.k2, authConfig.k3);
    }

    const captchaFunc = (obj, formData) => {
        http.get(`${host}${authConfig.imageType}`).then(
            (res) => {
                if (res.data.data === 'PUZZLE') {
                    obj.slideVerify({
                        vOffset: 5,	//误差量，根据需求自行调整
                        mode: 'pop',
                        containerId: 'verifyBtn',//pop模式  被点击之后出现行为验证码的元素id 目前不使用
                        loadingImg: 'src\\assets\\images\\img_loading.png',
                        authKey: authConfig.authKey,
                        success: function (uid) { //成功的回调
                            // 返回的二次验证参数
                            loginSubmit("#normal_login", formData, uid)
                        }
                    });
                } else if (res.data.data === 'CLICK') {
                    obj.pointsVerify({
                        mode: 'pop',
                        containerId: 'verifyBtn',//pop模式  被点击之后出现行为验证码的元素id 目前不使用
                        loadingImg: 'src\\assets\\images\\img_loading.png',
                        authKey: authConfig.authKey,
                        success: function (uid) { //成功的回调
                            loginSubmit("#normal_login", formData, uid)
                        }
                    });
                } else if (res.data.data === 'CHAR') {
                    obj.charVerify({
                        mode: 'pop',
                        containerId: 'verifyBtn',//pop模式  被点击之后出现行为验证码的元素id 目前不使用
                        loadingImg: '',
                        authKey: authConfig.authKey,
                        success: function (uid) { //成功的回调
                            loginSubmit("#normal_login", formData, uid)
                        }
                    });
                }
            }
        )
    }

    const onFinish = (values) => {
        captchaFunc($("#captcha_box2"), values)
    };

    const submit = (encryptData, uid) => {
        http({
            method: 'POST',
            url: `${host}${authConfig.authUrl}`,
            data: encryptData,
            headers: {
                "uid": uid,
                "Auth-Key": authConfig.authKey,
                "Content-Type": "text/plain"
            }
        }).then(
            (res) => {
                if(res && res.data && res.data.data){
                    localStorage.removeItem('code_error_login');
                    const userInfo = res.data.data;
                    localStorage.setItem("token", userInfo.token.access_token);
                    localStorage.setItem("expired_time", userInfo.token.expired_time);
                    localStorage.setItem('token', userInfo.token.access_token);
                    localStorage.setItem('userinfo', JSON.stringify(userInfo));
                    localStorage.setItem('HT_UID', userInfo.user_id);
                    localStorage.setItem('HT_OID', userInfo.org_id);
                    localStorage.setItem('token_time', Date.now().toString());
                    localStorage.setItem('token_type', "local");
                    const now_host = window.location.host.split(':')[0];
                    if(now_host === '127.0.0.1') {
                        window.location.replace('/#/')
                    } else {
                        window.location.replace('/admin/#/')
                    }
                }else{
                    message.error(res.data.msg || "用户名或密码不正确");
                }
            }
        ).catch((err) => {
            message.error("登录失败，请刷新后重试")
        })
    }


    // const autoLogin = (e) => {
    //     if (e.target.checked) {
    //         console.log("自动登录")
    //     } else {
    //         console.log("不自动登录")
    //     }
    // }
    const onFormSubmit = (values) => {
        const formValues = values;
        if (formValues) {
            onFinish(formValues);
        }
    }
    // const height = window.innerHeight;

    const ywLogin = () => {
        setConfig({loginType: 'yw'});
        Auth.login()
    }

    return (
        <div className="login">
            <div className="login-header">
                <div className="header-content">
                    <img className='logo-img' src={logo} />
                    <span className="logo">云路后台管理系统</span>
                </div>
                <span className="welcom">|</span>
                <span className="welcom" style={{ marginLeft: 30 }}>欢迎登录</span>
            </div>
            <div className="login-body">
                {/* <img src='res/images/dengluye.png' /> */}
                <div className='login-form-box'>
                    <div className='login-form-title'><span>账号登录</span></div>
                    <Form
                        name="normal_login"
                        className="login-form"
                        onFinish={onFormSubmit}>
                        <Form.Item
                            key="user_name"
                            name="user_name"
                            label=""
                            rules={[
                                { required: true, message: "请输入账号！" },
                            ]}
                        >
                            <Input
                                prefix={
                                    <UserOutlined
                                        style={{ color: "rgba(0,0,0,.25)" }}
                                    />
                                }
                                placeholder="账号"
                            />
                        </Form.Item>
                        <Form.Item
                            key="password"
                            name="password"
                            label=""
                            rules={[
                                { required: true, message: "请输入密码！" },
                            ]}
                        >
                            <Input
                                prefix={
                                    <LockOutlined
                                        style={{ color: "rgba(0,0,0,.25)" }}
                                    />
                                }
                                type="password"
                                placeholder="密码"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button" size='large' block>
                                登录
                            </Button>
                            <div className='other-login'>
                                <img height={20} src={ywIcon} onClick={ywLogin} className='yw-loginIcon' title='航天云网账号登录' />
                            </div>
                        </Form.Item>
                        <div id="captcha_box2"></div>
                        <div id="captcha_box3"></div>
                    </Form>
                </div>
            </div>
            <div className='login-footer'>
                <div className="loyal">© 2023 航天云路</div>
            </div>
        </div>
    );
};