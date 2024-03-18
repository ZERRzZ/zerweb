import adminService, { OptionModel } from "@/api/adminService"
import { getHttpRequest } from "@/lib/http";


const cacheStorage = {};

export const clearDictCache = () => {
    let keys = Object.keys(cacheStorage);
    keys.forEach(key => {
        if (key.startsWith('dict$')) {
            cacheStorage[key] = undefined;
        }
    })
}

export const clearCategoryCache = () => {
    let keys = Object.keys(cacheStorage);
    keys.forEach(key => {
        if (key.startsWith('category$')) {
            cacheStorage[key] = undefined;
        }
    })
}

export const getDictOptionByCode = (code) : Promise<OptionModel[]> => {
    let key = 'dict$' + code;
    if (cacheStorage[key]) {
        return Promise.resolve(cacheStorage[key]);
    }
    return adminService.ms.dictionary.getOption({code: code}).then(res => {
        cacheStorage[key] = res;
        return res;
    });
}

export const getDictNameByValue = (code, value) => {
    if (value === undefined || value === null) {
        return Promise.resolve(undefined);
    }
    let valueArray = value.toString().split(',');
    return getDictOptionByCode(code).then(res => {
        return res.filter(r => valueArray.includes(r.value || '')).map(r => r.title || '').join(',');
    })
}

export const getCategoryOptionByCode = (code) : Promise<OptionModel> => {
    let key = 'category$' + code;
    if (cacheStorage[key]) {
        return Promise.resolve(cacheStorage[key]);
    }
    return adminService.ms.category.getOption({code: code, level: -1, type: 2}).then(res => {
        cacheStorage[key] = res;
        return res;
    });
}

export const getCategoryNameByValue = (code, value, split?: any) => {
    if (value === undefined || value === null) {
        return Promise.resolve(undefined);
    }
    let valueArray = value.toString().split(split || ',');
    return getCategoryOptionByCode(code).then(res => {
        return findCascaderNameByValue(res.children || [], valueArray);
    })
}

export const findCascaderNameByValue = (options: any[], value: string[]) => {
    let nameArray: string[] = [];
    let list = options;
    for (let i = 0; i < value.length; i++) {
        let item = list?.find(c => c.value === value[i]);
        if (!item) {
            break;
        }
        nameArray.push(item.label || item.title || '');
        list = item.children;
    }
    return nameArray.join(' / ');
}

export const getCacheDataByUrl = (url) : Promise<any> => {
    let key = 'url$' + url;
    if (cacheStorage[key]) {
        return Promise.resolve(cacheStorage[key]);
    }
    return getHttpRequest(url).then(res => {
        cacheStorage[key] = res;
        return res;
    });
}

export const clearUrlCache = (url) => {
    if (url) {
        let key = 'url$' + url;
        cacheStorage[key] = undefined;
    } else {
        let keys = Object.keys(cacheStorage);
        keys.forEach(key => {
            if (key.startsWith('url$')) {
                cacheStorage[key] = undefined;
            }
        })
    }
}