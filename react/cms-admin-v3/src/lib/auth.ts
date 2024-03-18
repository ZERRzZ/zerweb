import env from "@/constants/env.json";
import { getConfig, GlobalMethod, setConfig } from "@/stories/GlobalConfig";
import { paramstrToObject } from "@/utils/utility";
const INDEX_URL = `#/`
const LOGIN_URL = `#/Login`
const THIRDPARTY_LOGIN_URL = `${env.baseApiUrl}/api/third_party/login`;
const THIRDPARTY_LOGOUT_URL = `${env.baseApiUrl}/api/third_party/logout`;
const LOGOUT_URL = `${env.baseApiUrl}/logout`

interface AuthMethod {
    checkLogin: () => Promise<any>;
    login: () => void;
    logout: () => void;
    getUserInfo: () => Promise<any>;
}

type TokenType = 'local' | 'yw' | 'third';
type LoginType = TokenType;

const getLoginType = () => {
    let tokenType = localStorage.getItem('token_type');
    if (tokenType) {
        return tokenType as LoginType;
    }
    let loginType = getConfig('loginType');
    if (!loginType) {
        loginType = env.loginType;
        setConfig({loginType: loginType});
    }
    return loginType as LoginType;
}

const getAuthMethod = () => {
    let loginType = getLoginType();
    if (loginType === 'yw') {
        return YWAuth;
    } else if (loginType === 'third') {
        return ThirdPartyAuth;
    } else {
        return LocalAuth;
    }
}

const Auth = {
    checkLogin: () => {
        return getAuthMethod().checkLogin().then(res => {
            if (res) {
                return Auth.getUserInfo();
            }
        });
    },
    login: () => {
        getAuthMethod().login();
    },
    logout: () => {
        getAuthMethod().logout();
    },
    getUserInfo: () => {
        return Promise.all([new Promise((resolve) => {
                const userJson = localStorage.getItem("userinfo");
                if (!!userJson) {
                    resolve(JSON.parse(userJson) as any);
                } else {
                    resolve({} as any);
                }
            })
        , new Promise((resolve) => {
            let token = localStorage.getItem('token');
            if (!token) {
                return resolve([[], []] as any);
            }
            return GlobalMethod.authList({}).then(res => {
                if (res) {
                    let authList = res.resource_list?.map(r => r.identity) || [];
                    let roleList = res.subject_role_list?.map(r => r.role_id) || [];
                    return resolve([authList, roleList] as any);
                } else {
                    return resolve([[], []] as any);
                }
            }).catch(err => {
                if (err && err.code === 'ECONNABORTED') {
                    return Promise.reject("请刷新重试");
                }
                return resolve([[], []] as any);
            });
        })]).then(res => {
            if (res && res[0]) {
                let userInfo = res[0];
                let authList = res[1] as any;
                userInfo['authList'] = authList[0];
                userInfo['roleList'] = authList[1];
                return userInfo;
            }
            return null;
        })
    }

} as AuthMethod;

const LocalAuth  = {
    checkLogin: () => {
        return new Promise((resolve, reject) => {
            let token = localStorage.getItem("token");
            if (token) {
                GlobalMethod.getToken().then(res => {
                    if (res) {
                        localStorage.removeItem('code_error_login');
                        localStorage.setItem("token", res.token.access_token);
                        localStorage.setItem("expired_time", res.token.expired_time);
                        localStorage.setItem('userinfo', JSON.stringify(res));
                        localStorage.setItem('HT_UID', res.user_id);
                        localStorage.setItem('HT_OID', res.org_id);
                        localStorage.setItem('token_time', Date.now().toString());
                        localStorage.setItem('token_type', 'local');
                        if (isLoginPage()) {
                            window.location.href = INDEX_URL;
                            resolve(true);
                        } else {
                            resolve(true);
                        }
                    } else {
                        if (isLoginPage()) {
                            resolve(true);
                        } else {
                            Auth.login();
                            reject("token验证失败");
                        }
                    }
                    
                }, err => {
                    if (err && err.code === 'ECONNABORTED') {
                        reject("请刷新重试");
                    } else if (isLoginPage()) {
                        resolve(true);
                    } else {
                        Auth.login();
                        reject("token验证失败");
                    }
                })
            } else {
                if (isLoginPage()) {
                    resolve(true);
                } else {
                    Auth.login();
                    reject("token验证失败");
                }
            }
        });
    },
    login: () => {
        localStorage.clear();
        window.location.href = LOGIN_URL;
    },
    logout: () => {
        GlobalMethod.tokenDestory().then(
            (res) => {
                if (res) {
                    localStorage.clear();
                    window.location.href = LOGIN_URL
                }
            }
        ).catch(
            (err) => {
                console.log(err)
            }
        )
    }
} as AuthMethod;

const YWAuth = {
    checkLogin: () => {
        return new Promise((resolve, reject) => {
            let token = localStorage.getItem('token');
            if (!token) {
                let locationHref = window.location.href;
                let search = locationHref.split(/[?#]/)[1] || '';
                let searchObj = paramstrToObject(search);
                if (search && searchObj['status'] && searchObj['code']) {
                    GlobalMethod.swapYWToken(searchObj['code']).then(
                        res => {
                            if (res && res.token) {
                                localStorage.removeItem('code_error_login');
                                localStorage.setItem('token', res.token.access_token);
                                localStorage.setItem('license', res.license_key);
                                localStorage.setItem('userinfo', JSON.stringify(res.user));
                                localStorage.setItem('HT_UID', res.user.user_id);
                                localStorage.setItem('HT_OID', res.user.org_id);
                                localStorage.setItem('token_time', Date.now().toString());
                                localStorage.setItem('token_type', 'yw');
                                const win: any = window;
                                win.HT_UID = res.user.user_id;
                                win.HT_OID = res.user.org_id;
                                window.location.href =
                                    window.location.origin + window.location.pathname + window.location.hash;
                            } else {
                                reject('获取token失败');
                            }
                        },
                        err => {
                            reject('获取token失败');
                        },
                    );
                } else {
                    Auth.login();
                }
            } else {
                // 有token
                let tokenTime = localStorage.getItem('token_time');
                if (tokenTime && Date.now() - Number.parseInt(tokenTime) < 10000) {
                    //30s内不刷新token
                    resolve(true);
                } else {
                    //请求refresh_token接口
                    let licenseKey = localStorage.getItem('license') || '';
                    if (!licenseKey) {
                        Auth.login();
                        reject('license不存在');
                    }
                    
                    GlobalMethod.refreshYWToken(licenseKey).then(
                        res => {
                            if (res) {
                                localStorage.removeItem('code_error_login');
                                localStorage.setItem('token', res.token.access_token);
                                localStorage.setItem('license', res.license_key);
                                localStorage.setItem('userinfo', JSON.stringify(res.user));
                                localStorage.setItem('HT_UID', res.user.user_id);
                                localStorage.setItem('HT_OID', res.user.org_id);
                                localStorage.setItem('token_time', Date.now().toString());
                                localStorage.setItem('token_type', 'yw');
                                const win: any = window;
                                win.HT_UID = res.user.user_id;
                                win.HT_OID = res.user.org_id;
                                resolve(true);
                            } else {
                                Auth.login();
                                reject('状态过期');
                            }
                        },
                        err => {
                            reject('刷新token失败');
                        },
                    );
                }
            }
        });
    },
    login: () => {
        localStorage.clear();
        let redirect = encodeURI(window.location.href);
        window.location.href = `${env.login}?redirect=${redirect}&system_id=${env.system_id}`;
    },
    logout: () => {
        localStorage.clear();
        let redirect = encodeURI(window.location.href);
        window.location.href = `${env.logout}?redirect=${redirect}`;
    }
} as AuthMethod;

const ThirdPartyAuth = {
    checkLogin: () => {
        return new Promise((resolve, reject) => {
            let token = localStorage.getItem("token");
            if (!token) {
                let params = paramstrToObject(window.location.search);
                if (params && params.ticket) {
                    return GlobalMethod.swapThirdPartyToken(params.ticket, window.location.origin).then(res => {
                        localStorage.removeItem('code_error_login');
                        if (res) {
                            let userInfo = res;
                            localStorage.setItem("token", userInfo.token?.access_token || '');
                            localStorage.setItem("expired_time", userInfo.token?.expired_time || '');
                            localStorage.setItem('userinfo', JSON.stringify(userInfo));
                            localStorage.setItem('HT_UID', userInfo.user_id || '');
                            localStorage.setItem('HT_OID', userInfo.org_id || '');
                            localStorage.setItem('token_time', Date.now().toString());
                            localStorage.setItem('token_type', 'third');
                            window.location.href = window.location.origin;
                            resolve(true);
                        } else {
                            window.location.href = window.location.origin + '#/noregister';
                            reject("获取token失败");
                        }
                    }, err => {
                        window.location.href = window.location.origin + '#/noregister';
                        reject("获取token失败");
                    })
                } else {
                    Auth.login();
                    reject("未登录");
                }
            } else {
                GlobalMethod.getToken().then(res => {
                    if (res) {
                        localStorage.removeItem('code_error_login');
                        localStorage.setItem("token", res.token.access_token);
                        localStorage.setItem("expired_time", res.token.expired_time);
                        localStorage.setItem('userinfo', JSON.stringify(res));
                        localStorage.setItem('HT_UID', res.user_id);
                        localStorage.setItem('HT_OID', res.org_id);
                        localStorage.setItem('token_time', Date.now().toString());
                        localStorage.setItem('token_type', 'third');
                        if (isLoginPage()) {
                            window.location.href = INDEX_URL;
                            resolve(true);
                        } else {
                            resolve(true);
                        }
                    } else {
                        if (isLoginPage()) {
                            resolve(true);
                        } else {
                            Auth.login();
                            reject("token验证失败");
                        }
                    }
                    
                }, err => {
                    if (err && err.code === 'ECONNABORTED') {
                        reject("请刷新重试");
                    } else if (isLoginPage()) {
                        resolve(true);
                    } else {
                        Auth.login();
                        reject("token验证失败");
                    }
                })
            }
        });
    },
    login: () => {
        localStorage.clear();
        window.location.href = `${THIRDPARTY_LOGIN_URL}?service=${encodeURI(window.location.href)}`;
    },
    logout: () => {
        GlobalMethod.tokenDestory().then(
            (res) => {
                if (res) {
                    localStorage.clear();
                    window.location.href = `${THIRDPARTY_LOGOUT_URL}?service=${encodeURI(window.location.href)}`;
                }
            }
        ).catch(
            (err) => {
                console.log(err)
            }
        )
    }
}

export function isLoginPage() : boolean {
    return window.location.hash.startsWith('#/Login') || window.location.hash.startsWith('#/noregister');
}

export default Auth;