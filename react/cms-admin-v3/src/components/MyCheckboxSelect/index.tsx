import { CheckboxChangeEvent } from "antd/es/checkbox";
import { CheckboxValueType } from "antd/es/checkbox/Group";
const CheckboxGroup = Checkbox.Group;
import { Checkbox } from 'antd';
import { useEffect, useState } from "react";
interface IPorps {
    name: string;
    options: any[];
    value: any[];
    onChange: (name, value) => void;
}
const MyCheckboxSelect = (props: IPorps) => {
    const { name, options, value, onChange } = props;
    const [checkAll, setCheckAll] = useState(false);
    const [indeterminate, setIndeterminate] = useState(true);
    const [checkAllList, setCheckAllList] = useState<any[]>(value);
    // 设置功能权限全选
    useEffect(() => {
        setCheckAllList(value);
        setCheckAll(options.length === value.length);
        setIndeterminate(!!value.length && value.length < options.length);
    }, [value, options])
    // 点击全选
    const onCheckAllChange = (e: CheckboxChangeEvent) => {
        let list = e.target.checked ? options.map(o => o.value) : []
        setCheckAllList(list);
        setIndeterminate(false);
        setCheckAll(e.target.checked);
        onChange(name, list);
    };
    // 点击功能权限
    const onInnerChange = (list: CheckboxValueType[]) => {
        setCheckAllList(list);
        setIndeterminate(!!list.length && list.length < options.length);
        setCheckAll(list.length === options.length);
        onChange(name, list);
    };
    return <tr>
        <td style={{ textAlign: 'right' }}>
            <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
                {name}
            </Checkbox>
        </td>
        <td>
            <CheckboxGroup options={options} value={checkAllList} onChange={onInnerChange} />
        </td>
    </tr>
}
export default MyCheckboxSelect;