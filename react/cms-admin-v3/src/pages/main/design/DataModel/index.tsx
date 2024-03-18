
import { MyFormItems } from "@/components/MyForm";
import MyTable, { MyTableAction } from "@/components/MyTable";
import { PlusOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, Drawer, Space } from "antd";
import DataModelForm from "./components/DataModelForm";
import { useState } from "react";
import adminService from "@/api/adminService";
import DataModelApiForm from "./components/DataModelApiForm";
import DataModelUIForm from "./components/DataModelUIForm";
import MyCode from "@/components/MyCode";
import { generateCode } from "./components/CodeGenerator";
import { verticalObject } from "@/utils/convert";

const DataModelListPage: React.FC = () => {
    const [modelFormShow, setModelFormShow] = useState<boolean>(false);
    const [currentModel, setCurrentModel] = useState<any>();
    const [modelApiFormShow, setModelApiFormShow] = useState<boolean>(false);
    const [currentModelApi, setCurrentModelApi] = useState<any>();
    const [modelUIFormShow, setModelUIFormShow] = useState<boolean>(false);
    const [currentModelUI, setCurrentModelUI] = useState<any>();
    const [refreshTriggerKey, setRefreshTriggerKey] = useState<string>();
    const [codeModalOpen, setCodeModalOpen] = useState<boolean>(false);
    const [code, setCode] = useState<string>('');
    const queryFormItems: MyFormItems[] = [
        {
            type: 'text',
            item: { name: 'name', label: '模型名称' }
        }, {
            type: 'text',
            item: { name: 'description_like_', label: '模型说明' }
        },
    ];


    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '模型名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '模型说明',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: '创建时间',
            dataIndex: 'create_time',
            key: 'create_time',
        },
        {
            title: '更新时间',
            dataIndex: 'update_time',
            key: 'update_time',
        },
    ];


    const headerActions: MyTableAction[] = [
        { title: "新增", key: "add", type: "btn", icon: <PlusOutlined />, condition: { pem: 'datamodel_edit' } },
        { title: "清理缓存", key: "cache", type: "btn", icon: <SyncOutlined />, condition: { pem: 'datamodel_edit' } },
    ]

    const itemActions: MyTableAction[] = [
        { title: "编辑", key: "edit", type: "btn", handler: { pick: 'all' }, condition: { pem: 'datamodel_edit' } },
        // { title: "接口配置", key: "api", type: "btn", handler: { pick: 'all' }, condition:{ pem: 'datamodel_edit' } },
        { title: "UI配置", key: "ui", type: "btn", handler: { pick: 'all' }, condition: { pem: 'datamodel_edit' } },
        {
            title: "数据管理", key: "ui", type: "link", linkFormater: (item, type) => {
                return `/design/DataModel/${item.name}`;
            }, handler: { pick: 'all' }
        },
        { title: "生成代码", key: "code", type: "btn", handler: { pick: 'all' }, condition: { pem: 'datamodel_edit' } },
        { title: "删除", key: "delete", type: "confirmBtn", handler: { pick: ["id"] }, condition: { pem: 'datamodel_edit' } },
    ]

    const doAction = (action: MyTableAction, params) => {
        if (action.key === "list") {
            // 添加按创建时间倒序排序
            const temp = { ...params, order_by_desc: 'create_time' }
            return adminService.ms.design.modelMeta.list(temp);
        } else if (action.key === 'add') {
            setModelFormShow(true);
            setCurrentModel(undefined);
        } else if (action.key === 'edit') {
            setModelFormShow(true);
            setCurrentModel(params);
        } else if (action.key === 'delete') {
            return adminService.ms.design.modelMeta.delete(params);
        } else if (action.key === 'api') {
            setModelApiFormShow(true);
            setCurrentModelApi(params);
        } else if (action.key === 'ui') {
            setModelUIFormShow(true);
            setCurrentModelUI(params);
        } else if (action.key === 'cache') {
            return adminService.ms.design.modelMeta.clearCache();
        } else if (action.key === 'code') {
            setCodeModalOpen(true);
            adminService.ms.design.modelMeta.get({ name: params.name }).then(res => {
                if (res && res.id && res.meta_data) {
                    const model = JSON.parse(res.meta_data);
                    adminService.ms.design.modelMeta.ui.get({ id: res.id }).then(data => {
                        if (data) {
                            const listConfig = (data.list_config && verticalObject(JSON.parse(data.list_config))) || {};
                            const queryConfig = (data.query_config && verticalObject(JSON.parse(data.query_config))) || {};
                            const formConfig = (data.form_config && verticalObject(JSON.parse(data.form_config))) || {};
                            const queryItems: any[] = [];
                            const listItems: any[] = [];
                            const formItems: any[] = [];
                            Object.keys(queryConfig).forEach(key => {
                                if (queryConfig[key] && queryConfig[key].query && queryConfig[key].query.enabled) {
                                    queryItems.push({
                                        name: key + ((queryConfig[key].query.cond === 'equal' || queryConfig[key].query.cond === 'range') ? "" : queryConfig[key].query.cond),
                                        label: model?.property_meta_list.find(p => p.name === key)?.description || '',
                                        ...queryConfig[key].query
                                    });
                                }
                            })
                            Object.keys(listConfig).forEach(key => {
                                if (listConfig[key] && listConfig[key].list && listConfig[key].list.enabled) {
                                    listItems.push({
                                        name: key,
                                        label: model?.property_meta_list.find(p => p.name === key)?.description || '',
                                        ...listConfig[key].list
                                    });
                                }
                            })
                            Object.keys(formConfig).forEach(key => {
                                if (formConfig[key] && formConfig[key].form && formConfig[key].form.enabled) {
                                    formItems.push({
                                        name: key,
                                        label: model?.property_meta_list.find(p => p.name === key)?.description || '',
                                        ...formConfig[key].form
                                    });
                                }
                            })
                            const modelConfig = {
                                query: queryItems,
                                list: listItems,
                                tab: data.tab_config && JSON.parse(data.tab_config),
                                form: formItems,
                                action: data.action_config && JSON.parse(data.action_config),
                            };
                            setCode(generateCode(params.name, modelConfig));
                        }
                    })
                }
            })

        }
        return undefined;
    }

    const onModalFinish = (changed) => {
        if (changed) {
            setRefreshTriggerKey(new Date().getTime().toString());
        }
        setCurrentModel(undefined);
        setModelFormShow(false);
    }

    const onModalApiFinish = (changed) => {
        setCurrentModelApi(undefined);
        setModelApiFormShow(false);
    }

    const onModalUIFinish = (changed) => {
        setCurrentModelUI(undefined);
        setModelUIFormShow(false);
    }

    const onCodeModalClose = () => {
        setCodeModalOpen(false);
    }

    return <>
        <MyTable
            queryConfig={{ formItems: queryFormItems }}
            tableConfig={{
                columns: columns,
                rowKey: "id",
                operateWidth: 320
            }}
            actionConfig={{
                headerActions: headerActions,
                itemActions: itemActions,
                itemShowNumber: 10,
                doAction: doAction
            }}
            refreshTriggerKey={refreshTriggerKey}
        />
        <DataModelForm visible={modelFormShow} modelId={currentModel?.id} onFinish={onModalFinish} />
        <DataModelApiForm visible={modelApiFormShow} modelId={currentModelApi?.id} onFinish={onModalApiFinish} />
        <DataModelUIForm visible={modelUIFormShow} modelId={currentModelUI?.id} onFinish={onModalUIFinish} />
        <Drawer
            width={900}
            title={"生成代码"}
            placement="right"
            maskClosable={false}
            onClose={onCodeModalClose}
            open={codeModalOpen}
            extra={
                <Space>
                    <Button onClick={onCodeModalClose}>取消</Button>
                </Space>
            }>
            <MyCode width='100%' height="800px" value={code} />
        </Drawer>
    </>
}

export default DataModelListPage;