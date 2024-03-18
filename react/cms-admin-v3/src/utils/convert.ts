import dayjs from "dayjs";
import { getCategoryNameByValue, getDictNameByValue } from "./dictUtils";

export type ValueConverterType = 'string' | 'array' | 'number' | 'float' | 'float-fixed' | 'number-split'
    | 'obj-pick' | 'obj-pick-single' | 'obj-upward' | 'obj-downward' | 'obj-merge'
    | 'dayjs' | 'dayjs-string' | 'tags-array' | 'array-tags' | 'prefix-suffix' | 'dict-name' | 'category-name';

const ValueConverter = {
    'string': (value: any, arg?: any) => {
        if (value === null || value === undefined || typeof value === 'string') {
            return value;
        } else if (Array.isArray(value)) {
            return value.join(arg || ',');
        } else if (typeof value === 'object') {
            return JSON.stringify(value);
        }
        return value.toString();
    },
    'array': (value: any, arg?: any) => {
        if (value === null || value === undefined || Array.isArray(value)) {
            return value;
        } else if (typeof value === 'string') {
            return value.split(arg || ',');
        }
        return [value];
    },
    'number': (value: any, arg?: any) => {
        if (value === null || value === undefined || typeof value === 'number') {
            return value;
        } else if (typeof value === 'string') {
            let val = value.replace('%', '');
            return Number(val.replace(/,/gi, ''));
        }
        return NaN;
    },
    'float': (value: any, arg?: any) => {
        if (value === null || value === undefined) {
            return value;
        }
        return Number.parseFloat(ValueConverter['float-fixed'](value, arg))
    },
    'float-fixed': (value: any, arg?: any) => {
        if (value === null || value === undefined) {
            return value;
        }
        let v = ValueConverter['number'](value) as Number;
        return v.toFixed(arg)
    },
    'number-split': (value: any, arg?: any) => {
        if (value === null || value === undefined) {
            return value;
        }
        let num = ValueConverter['number'](value) as number;
        let prefix: string = '';
        if (num < 0) {
            num *= -1;
            prefix = '-';
        }
        let digitPattern = /(^|\s)\d+(?=\.?\d*($|\s))/g;
        let miliPattern = /(?=(?!\b)(\d{3})+\.?\b)/g;
        let str: string = num.toString().replace(digitPattern, m => m.replace(miliPattern, ','));
        return prefix + str;
    },
    'obj-pick': (value: any, arg?: any) => {
        if (value && arg) {
            if (Array.isArray(value)) {
                return value.map(item => {
                    let v = {};
                    arg.forEach(key => {
                        v[key] = item[key];
                    });
                    return v;
                })
            } else {
                let v = {};
                arg.forEach(key => {
                    v[key] = value[key];
                });
                return v;
            }
        }
        return undefined;
    },
    'obj-pick-single': (value: any, arg?: any) => {
        if (value && arg) {
            if (Array.isArray(value)) {
                return value.map(item => item[arg]);
            } else {
                return value[arg];
            }
        }
        return undefined;
    },
    'obj-upward': (value: any, arg?: any) => {
        if (!value || !arg) {
            return value;
        }
        if (Array.isArray(value)) {
            return value.map(item => {
                for (let key in item[arg]) {
                    item[key] = item[arg][key];
                }
                delete item[arg];
                return item;
            })
        } else {
            for (let key in value[arg]) {
                value[key] = value[arg][key];
            }
            delete value[arg];
            return value;
        }

    },
    'obj-downward': (value: any, arg?: any) => {
        if (!value || !arg) {
            return value;
        }
        if (Array.isArray(value)) {
            return value.map(item => {
                let field = arg[0];
                let v = ValueConverter['obj-pick'](item, arg.slice(1));
                for (let key in v) {
                    delete item[key];
                }
                item[field] = v;
                return item;
            })
        } else {
            let field = arg[0];
            let v = ValueConverter['obj-pick'](value, arg.slice(1));
            for (let key in v) {
                delete value[key];
            }
            value[field] = v;
            return value;
        }
    },
    'obj-merge': (value: any, arg?: any) => {
        if (!value || !arg) {
            return value;
        }
        if (Array.isArray(value)) {
            return value.map(item => Object.assign(item || {}, arg))
        }
        return Object.assign(value || {}, arg);
    },
    'dayjs': (value: any, arg?: any) => {
        if (Array.isArray(value)) {
            return value.map(item => dayjs(item, arg));
        }
        return dayjs(value, arg);
    },
    'dayjs-string': (value: any, arg?: any) => {
        if (Array.isArray(value)) {
            return value.map(item => item.format(arg));
        }
        return value.format(arg);
    },
    'tags-array': (value: any, arg?: any) => {
        let array;
        if (value && typeof value === 'string') {
            array = value.split(',').filter(a => a.length > 0);
        }
        return array && array.length > 0 ? array : undefined;
    },
    'array-tags': (value: any, arg?: any) => {
        if (value && Array.isArray(value) && value.length > 0) {
            return ',' + value.join(',') + ',';
        } else if (value) {
            return ',' + value + ',';
        }
        return "";
    },
    'prefix-suffix': (value: any, arg?: any) => {
        if (value && arg) {
            return (arg['prefix'] || '') + value + (arg['suffix'] || '');
        }
        return value;
    },
    'dict-name': (value: any, arg?: any) => {
        if (arg && arg.from && arg.code && value) {
            getDictNameByValue(arg.code, value[arg.from]).then(res => {
                value[arg.from+ "_name"] = res;
            });
        }
        return value;
    },
    'category-name': (value: any, arg?: any) => {
        if (arg && arg.from && arg.code && value) {
             getCategoryNameByValue(arg.code, value[arg.from]).then(res => {
                value[arg.from+ "_name"] = res;
            });
        }
        return value;
    }
}

export const convertData = (data, config?: ValueConverterConfig) => {
    if (!config) {
        return data;
    }
    if (config.fields) {
        for (let key in config.fields) {
            key.split(',').forEach(item => {
                data[item] = convertData(data[item], config.fields && config.fields[key]);
            })
        }
    }
    if (config.converter) {
        config.converter.forEach(item => {
            let converter = ValueConverter[item.type];
            converter && (data = converter(data, item.arg));
        })
    }
    return data;
}

export const pick = (value: any, fields: any[]) => {
    return ValueConverter['obj-pick'](value, fields);
}

export interface ValueConverterConfig {
    converter?: { type: ValueConverterType; arg?: any }[];
    fields?: {
        [key: string]: ValueConverterConfig;
    }
}

export const verticalObject = (data: any) => {
    const newData = {};
    const nexKeys: string[] = [];
    Object.keys(data).forEach(key => {
        const index = key.indexOf('.');
        if (index < 0) {
            newData[key] = data[key];
        } else {
            const key1 = key.substring(0, index);
            const key2 = key.substring(index + 1, key.length);
            if (!newData[key1]) {
                newData[key1] = {};
            }
            newData[key1][key2] = data[key];
            if (!nexKeys.includes(key1)) {
                nexKeys.push(key1);
            }
        }
    })
    nexKeys.forEach(key => {
        newData[key] = verticalObject(newData[key]);
    })
    if (Object.keys(newData).every(key => !Number.isNaN(Number.parseInt(key)))) {
        const newArray: any[] = [];
        Object.keys(newData).forEach(key => newArray[Number.parseInt(key)] = newData[key]);
        return newArray;
    }
    return newData;
}

export const horizontalObject = (data: any) => {
    const newData = {};
    Object.keys(data).forEach(key => {
        if (typeof data[key] == 'object') {
            const child = horizontalObject(data[key]);
            Object.keys(child).forEach(c => {
                newData[`${key}.${c}`] = child[c];
            })
        } else {
            newData[key] = data[key];
        }
    })
    return newData;
}