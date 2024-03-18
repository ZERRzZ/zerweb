import { Card, FormProps } from "antd";
import { useMemo, useState } from "react";

import MyForm, { MyFormItems } from "../MyForm";
import { DownOutlined, SearchOutlined, SyncOutlined, UpOutlined } from "@ant-design/icons";

interface MyQueryFormProps {
    formItems: MyFormItems[];
    defaultSize?: number;
    onSearch: (params) => void;
}

const MyQueryForm: React.FC<MyQueryFormProps> = ({ formItems, defaultSize, onSearch }: MyQueryFormProps) => {

    const [expanded, setExpanded] = useState<boolean>(false);

    const formProps: FormProps = {
        layout: 'inline',
        onFinish: v => {
            for (let key in v) {
                let item = formItems.find(f => f.item?.name === key);
                if (item && item.type.endsWith('Range') && v[key] instanceof Array) {
                    if (item.type === 'dateRange') {
                        v[`${key}_start_`] = v[key][0] && (v[key][0] + " 00:00:00");
                        v[`${key}_end_`] = v[key][1] && (v[key][1] + " 23:59:59");
                    } else {
                        v[`${key}_start_`] = v[key][0];
                        v[`${key}_end_`] = v[key][1];
                    }
                    delete v[key];
                }
            }
            if (onSearch) {
                onSearch(v);
            }
        }
    }

    const getFormItems = useMemo(() => {
        const items: MyFormItems[] = [];
        const showExpanded = defaultSize && defaultSize < formItems.length;
        formItems.forEach((item, index) => {
            items.push(item);
            if (showExpanded && defaultSize && index >= defaultSize) {
                item.hidden = !expanded;
            }
        });
        items.push({ type: 'submit', innerHtml: '查询', option: { icon: <SearchOutlined /> } });
        items.push({ type: 'reset', option: { icon: <SyncOutlined />, onClick: () => onSearch({}) } });
        if (showExpanded) {
            items.push({
                type: 'button',
                option: { type: 'link', style: { paddingLeft: 0, paddingRight: 0 }, onClick: () => setExpanded(!expanded) },
                innerHtml: expanded ? <>收起<UpOutlined /></> : <>展开<DownOutlined /></>
            });
        }
        return items;
    }, [formItems, expanded]);

    return (
        <Card bodyStyle={{ padding: "14px 48px" }}>
            <MyForm form={formProps} items={getFormItems} gutter={[8, 8]} />
        </Card>
    )

}

export default MyQueryForm;