import { MyFormItems } from "@/components/MyForm";
import { Form, Modal, Select, Switch, Table } from "antd";
import { useEffect, useState } from "react";

interface DataModelApiFormProps {
    visible?: boolean;
    modelId?: string;
    onFinish: (changed: boolean) => void;
}
const DataModelApiForm: React.FC<DataModelApiFormProps> = ({visible, modelId, onFinish} : DataModelApiFormProps) => {
    const [open, setOpen] = useState<boolean>(false);
    const [apiForm] = Form.useForm();
    const pemOptions = [{label: '添加权限', value: ''}];
    const apiList = [
        {label: '详情查询接口', key: 'get'},
        {label: '列表查询接口', key: 'list'},
        {label: '新增接口', key: 'add'},
        {label: '更新接口', key: 'update'},
        {label: '删除接口', key: 'delete'},
    ]

    const onModalOk = () => {

    }

    const onModalClose = () => {
        setOpen(false);
        onFinish(false);
    }

    useEffect(() => {
        setOpen(visible == undefined ? false : visible);
    }, [visible])

    useEffect(() => {
        if (modelId) {
            
        } else {
            
        }
    }, [modelId])

    return <Modal
            title={"API接口配置"}
            maskClosable={false}
            open={open}
            onCancel={onModalClose}
            onOk={onModalOk}
            width={600}>
        <Form form={apiForm}>
            <Table
                columns={[
                    {title: '接口', dataIndex: 'title', key: 'title', width: 120},
                    {title: '是否允许访问', key: 'enabled', render: (text, record) => {
                        return <Form.Item valuePropName="checked" name={`${record.key}_enabled`}><Switch /></Form.Item>;
                    }, width: 120},
                    {title: '权限要求', key: 'pem', render: (text, record) => {
                        return <Form.Item name={`${record.key}_pem`}><Select options={pemOptions} mode="multiple" /></Form.Item>;
                    }},
                ]}
                dataSource={[
                    {title: '详情查询接口', key: 'get'},
                    {title: '列表查询接口', key: 'list'},
                    {title: '新增接口', key: 'add'},
                    {title: '更新接口', key: 'update'},
                    {title: '删除接口', key: 'delete'}
                ] as any[]}
                pagination={false}
                size="small"
                />
           
        </Form>
        </Modal>
}

export default DataModelApiForm;