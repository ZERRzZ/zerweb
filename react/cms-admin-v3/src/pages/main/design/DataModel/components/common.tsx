import { MyFormItems } from "@/components/MyForm";

export interface FieldFormProps {
    name: string;
    label: string;
    type: string;
    source?: string;
    required?: boolean;
    length?: number;
    width?: number;
    regex?: string;
    msg?: string;
}

export const convertToMyFormItems = (item: FieldFormProps) => {
    const formItem = {
        type: item.type,
        item: { name: item.name, label: item.label, rules: [] as any[] },
        option: {}
    }
    let mode: any = undefined;
    if (formItem.type === 'oneLevelOptM') {
        formItem.type = 'oneLevelOpt';
        mode = 'multiple';
    }
    if ((formItem.type === 'oneLevelOpt' || formItem.type === 'multiLevelOpt') && item.source) {
        formItem.option['code'] = item.source;
        formItem.option['split'] = ",";
    }
    if (mode) {
        formItem.option['option'] = {mode: mode};
    }
    if (item.width) {
        formItem.option['option'] = {...formItem.option['option'], style: { width: item.width } };
    } else if ((formItem.type === 'oneLevelOpt' || formItem.type === 'multiLevelOpt')) {
        formItem.option['option'] = {...formItem.option['option'], style: { width: 160 } };
    }
    if (item.required) {
        formItem.item.rules.push({ required: true, message: (formItem.type === 'oneLevelOpt' || formItem.type === 'multiLevelOpt') ? '请选择' : '请输入' });
    }
    if (item.length) {
        formItem.item.rules.push({ max: item.length, message: `不超过${item.length}个字符` });
    }
    if (item.regex) {
        formItem.item.rules.push({ pattern: item.regex, message: item.msg || '格式不正确' });
    }
    return formItem as MyFormItems;
}

export const renderFieldDescription = (text, record) => {
    return record.notexists ? <span style={{color: 'red'}}>{text}（虚）</span> : text;
}