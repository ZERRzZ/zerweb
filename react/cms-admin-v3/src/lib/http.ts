import axios from "axios";
import env from "@/constants/env.json";
import Auth, { isLoginPage } from "./auth";
import { objectToParamstr } from "@/utils/utility";

const cancelToken = axios.CancelToken;
const source = cancelToken.source();

const http = axios.create({
  timeout: 20000,
  withCredentials: true,
});

http.interceptors.request.use(
  (config) => {
    config.cancelToken = source.token;
    const { params = {}, url = "" } = config;
    if (!isIgnoreTokenApi(url) && config.headers) {
      (config.headers as any).Authorization = getAuthorization();
      (config.headers as any).Scene = 'web';
    }

    const defaultParams = {
      client_id: env.clientId,
      // ts: Date.now(),
    };
    // const secret = env.clientSecret;
    Object.assign(params, defaultParams);
    // const { urlParams } = getSecretParams(params, secret);
    config.params = params;

    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

http.interceptors.response.use(
  (res) => {
    const { config, data: body } = res as any;
    switch (body.code) {
      case 200:
        break;
      case 305:
      case 308:
      case 316:
      case 2550:
      case 2551:
      case 2552:
      case 2553: {
        if (localStorage.getItem('code_error_login') != "1") {
          if (!isLoginPage()) {
            Auth.login();
          }
          localStorage.setItem('code_error_login', "1");
        }
        break;
      }
      default:
        if (config.responseType === "blob") {
          return res;
        } else {
          throw res.data;
        }
    }
    return res;
  },
  (err) => {
    if (err.response && err.response.data) {
      return Promise.reject(err.response.data);
    } else {
      return Promise.reject(err);
    }
  }
);

function getAuthorization() {
  const token = localStorage.getItem("token");
  let tokenType = localStorage.getItem('token_type');
  return tokenType === 'yw' ? `Token ${token}` : `CMS ${token}`;
}

export function getRequestUrl(url: string) {
  let requestUrl = url;
  if (!requestUrl.startsWith('http://') && !requestUrl.startsWith('https://')) {
    if (env.baseApiUrl) {
      requestUrl = env.baseApiUrl + requestUrl;
    }
  }
  return requestUrl;
}

export function httpRequest(url: string, method: string, params?: any, data?: any) {
  return http({
    url: getRequestUrl(url),
    method: method,
    headers: { "Content-Type": "application/json" },
    params,
    data
  }).then((res) => res.data.data);
}

export function getHttpRequest(url: string, params?: any) {
  return httpRequest(url, 'get', params);
}

export function postHttpRequest(url: string, params?: any, data?: any) {
  return httpRequest(url, 'post', params, data);
}

/**
 * 是否忽略Token配置
 * @param url
 */
export const isIgnoreTokenApi = (url: string) => {
  let ignoreList = env.ignore_apis;
  let isIgnore: boolean = false;
  for (const key in ignoreList) {
    let ignoreApi = ignoreList[key];
    if (url.includes(ignoreApi)) {
      isIgnore = true;
      break;
    }
  }
  return isIgnore;
};

//下载文件带token
export function getDownloadFileWithToken(url, params, filename): Promise<any> {
  let query = objectToParamstr(params);
  let response = fetch(getRequestUrl(url) + (query ? `?${query}` : ''),
    {
      method: 'GET',
      headers: {
        Authorization: getAuthorization(),
        Scene: "web"
      }
    }
  );
  return saveFile(response, filename);
}

//下载文件带token
export function postDownloadFileWithToken(url, params, postData, filename): Promise<any> {
  let query = objectToParamstr(params);
  let response = fetch(getRequestUrl(url) + (query ? `?${query}` : ''),
    {
      method: 'POST',
      body: JSON.stringify(postData),
      headers: {
        Authorization: getAuthorization(),
        Scene: "web",
        "Content-Type": 'application/json;charset=utf-8'
      }
    }
  );
  return saveFile(response, filename);
}

function saveFile(response: Promise<Response>, filename: string): Promise<any> {
  return response.then(response => {
    if (response.ok) {
      if (response.headers.get('Content-Type') === 'application/json;charset=UTF-8') {
        return Promise.reject('下载失败！');
      }
      return response.blob(); // 处理二进制数据流，返回blob对象
    } else {
      return Promise.reject('下载失败！');
    }
  }).then(blob => {
    let url = window.URL.createObjectURL(blob); // //创建下载的链接
    let navigator = window.navigator as any;
    if (navigator.msSaveBlob) {
      // ie 浏览器
      try {
        navigator.msSaveBlob(blob, filename)
      } catch (e) {
        console.log(e)
      }
    } else {
      // 谷歌浏览器 创建a标签 添加download属性下载
      let a = document.createElement('a');
      a.href = url;
      document.body.appendChild(a)
      a.download = filename; // 下载文件的文件名
      a.click(); // 点击下载
      document.body.removeChild(a) // 下载完成移除a元素
      window.URL.revokeObjectURL(url) //释放掉blob对象
    }
  });
}

export default http;