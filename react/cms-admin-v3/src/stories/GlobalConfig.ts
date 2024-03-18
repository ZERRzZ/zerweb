import adminService from "@/api/adminService";
import http from "@/lib/http";
import env from "@/constants/env.json";

const configStorage = {};

/**
  * 设置配置
  * @param config
  */
export const setConfig = config => {
    Object.assign(configStorage, config);
}

/**
 * 获取配置
 * @param key 
 * @returns 
 */
export const getConfig = (key: string): any => {
    if (key) {
        return configStorage[key];
    }
    return undefined;
}

export const GlobalMethod = {
    authList: adminService.ms.pemUser.currentPemList,
    tokenDestory: () => {
        const destroyTokenUrl = localStorage.getItem("destroyTokenUrl")
        return http.get(`${env.baseApiUrl}${destroyTokenUrl}`);
    },
    getToken: () => {
        return http.get(`${env.baseApiUrl}/user_info`).then(res => res.data.data);
    },
    swapYWToken: (code: string) => {
        const tokenUrl = `${env.issue_token}`;
        const params = { code: code, client_id: env.clientId };
        const headers = {
            Scene: 'web',
            withCredentials: true,
            allowCredentials: true,
        };
        return http.get(tokenUrl, { params, headers }).then(res => res.data.data);
    },
    refreshYWToken: (license: string) => {
        const tokenUrl = `${env.refresh_token}`;
        const params = { client_id: env.clientId };
        const headers = {
            Scene: 'web',
            LicenseKey: license
        };
        return http.get(tokenUrl, { params, headers }).then(res => res.data.data);
    },
    swapThirdPartyToken: (ticket: string, service: string) => {
        return Promise.resolve({} as any);
    },
    getUploadToken: (type) => {
        return adminService.ms.yunfile.token({ type: type });
    }
}