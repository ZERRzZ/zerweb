import MyTable, { MyTableProps } from "@/components/MyTable";
import MyCategory from "@/components/MyCategory";
import { useMemo, useState } from "react";

export interface MyCategoryTableProps {
    /**
     * MyTable的属性
     */
    tableProps: MyTableProps;
    /**
     * 分类编码
     */
    code: string;
    /**
     * 左侧分类宽度
     */
    leftWidth?: number;
    /**
     * 分类字段名
     */
    columnName: string;
}

/**
 * 左侧带了分类的列表组件
 * @param param0 
 * @returns 
 */
const MyCategoryTable: React.FC<MyCategoryTableProps> = ({ tableProps, code, leftWidth = 160, columnName }) => {
    const [categoryValue, setCategoryValue] = useState<string[]>([]);

    const onCategoryChange = (value) => {
        setCategoryValue(value);
    }

    const innerTableProps = useMemo(() => {
        let props = { ...tableProps };
        props.filterConfig = tableProps.filterConfig ? { ...tableProps.filterConfig } : {};
        props.filterConfig.requestParams = (action, data) => {
            if (action.key === 'add') {
                data[columnName] = categoryValue.join(',');
            }
            if (tableProps.filterConfig?.requestParams) {
                return tableProps.filterConfig.requestParams(action, data);
            }
            return data;
        };
        return props;
    }, [tableProps, categoryValue])
    return <>
        <div style={{ display: 'flex', gap: '1em' }}>
            <MyCategory direction="col" buildDefaultValue={true} code={code} value={categoryValue} onChange={onCategoryChange} />
            <div style={{ width: '100%' }}>
                <MyTable
                    listParams={categoryValue.length > 0 ? { [`${columnName}_like_r_`]: categoryValue.join(',') } : undefined}
                    listParamsRequired={true}
                    {...innerTableProps}
                />
            </div>
        </div>
    </>
}

export default MyCategoryTable;