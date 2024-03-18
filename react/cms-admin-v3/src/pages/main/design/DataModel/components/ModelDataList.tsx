import { MyFormItems } from "@/components/MyForm";
import MyTable, { MyTableAction, MyTableUrl } from "@/components/MyTable";
import { ExportOutlined, ImportOutlined, PlusOutlined } from "@ant-design/icons";
import { useEffect, useMemo, useState } from "react";
import adminService, { ModelMeta } from "@/api/adminService";
import { verticalObject } from "@/utils/convert";
import { convertToMyFormItems } from "./common";

interface ModelDataListProps {
    name?: string
}

const ModelDataList: React.FC<ModelDataListProps> = ({ name }: ModelDataListProps) => {
    const [modelMeta, setModelMeta] = useState<ModelMeta>();
    const [modelConfig, setModelConfig] = useState<any>({});

    useEffect(() => {
        adminService.ms.design.modelMeta.get({ name: name }).then(res => {
            if (res && res.id && res.meta_data) {
                const model = JSON.parse(res.meta_data);
                setModelMeta(model);
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
                        setModelConfig({
                            query: queryItems,
                            list: listItems,
                            tab: data.tab_config && JSON.parse(data.tab_config),
                            form: formItems,
                            action: data.action_config && JSON.parse(data.action_config),
                        });
                    }
                })
            }
        })
    }, [name])

    const sorter = (a, b) => (a.index || 0) - (b.index || 0);

    const queryFormItems: MyFormItems[] = useMemo(() => {
        let formItems: MyFormItems[] = [];
        if (modelConfig && modelConfig.query) {
            formItems = modelConfig.query.sort(sorter).map(item => convertToMyFormItems(item));
        }
        return formItems;
    }, [modelConfig]);

    const columns = useMemo(() => {
        let list: any[] = [];
        if (modelConfig && modelConfig.list) {
            list = modelConfig.list.sort(sorter).map(item => {
                return {
                    title: item.label,
                    dataIndex: item.name,
                    key: item.name,
                    width: item.width,
                    option: item.render && { renderType: item.render }
                };
            })
        }
        return list;
    }, [modelConfig]);

    const addFormItems: MyFormItems[] = useMemo(() => {
        let formItems: MyFormItems[] = [];
        if (modelConfig && modelConfig.form) {
            formItems = modelConfig.form.sort(sorter).map(item => convertToMyFormItems(item));
        }
        return formItems;
    }, [modelConfig])

    const headerActions: MyTableAction[] = useMemo(() => {
        let actions: MyTableAction[] = [];
        if (modelConfig && modelConfig.action) {
            if (modelConfig.action.add) {
                actions.push({ title: "新增", key: "add", type: "btn", icon: <PlusOutlined />, condition: { pem: modelConfig.action.add_pem }, handler: { formItems: addFormItems, showType: "drawer" } });
            }
            if (modelConfig.action.import) {
                actions.push({ title: "导入", key: "import", type: "btn", icon: <ImportOutlined />, condition: { pem: modelConfig.action.import_pem } });
                actions.push({ title: "下载导入模板", key: "importDemo", type: "link", condition: { pem: modelConfig.action.import_pem } });
            }
            if (modelConfig.action.export) {
                actions.push({ title: "导出", key: "export", type: "btn", icon: <ExportOutlined />, condition: { pem: modelConfig.action.export_pem } });
            }
            if (modelConfig.action.itemActions) {
                modelConfig.action.itemActions.forEach(item => {
                    if (item.batch) {
                        if (item.key === 'delete') {
                            actions.push({ title: `批量${item.title}`, key: `${item.key}Batch`, isBatch: true, type: (item.confirm ? 'confirmBtn' : 'btn'), condition: { pem: item.pem }, handler: { pick: ["id"] } });
                        } else {
                            actions.push({ title: `批量${item.title}`, key: `${item.key}Batch`, isBatch: true, type: (item.confirm ? 'confirmBtn' : 'btn'), condition: { values: item.before_status && { status: item.before_status.split(',') }, pem: item.pem }, handler: { pick: ["id"], params: item.after_status && { status: item.after_status }, requestUrl: "changeStatusBatch" } });
                        }
                    }
                })
            }
        }
        return actions;
    }, [modelConfig])

    const itemActions: MyTableAction[] = useMemo(() => {
        let actions: MyTableAction[] = [];
        if (modelConfig && modelConfig.action) {
            if (modelConfig.action.itemActions) {
                modelConfig.action.itemActions.forEach(item => {
                    let action = { title: item.title, key: item.key, type: (item.confirm ? 'confirmBtn' : 'btn'), condition: { values: item.before_status && { status: item.before_status.split(',') }, pem: item.pem } } as MyTableAction;
                    if (item.key === 'view') {
                        action['handler'] = { showType: "editForm" };
                    } else if (item.key === 'edit') {
                        action['handler'] = { formItems: addFormItems, showType: "drawer", pick: ["id"], requireDetail: true };
                    } else if (item.key === 'delete') {
                        action['handler'] = { pick: ["id"] };
                    } else {
                        action['handler'] = { pick: ["id"], params: item.after_status && { status: item.after_status }, requestUrl: "changeStatus" };
                    }
                    actions.push(action);
                })
            }
        }
        return actions;
    }, [modelConfig])

    const requestConfig = {
        list: { url: `/1/ms/${name}/page_list`, method: 'get' } as MyTableUrl,
        add: { url: `/1/ms/${name}/add`, method: 'post' } as MyTableUrl,
        edit: { url: `/1/ms/${name}/update`, method: 'post' } as MyTableUrl,
        delete: { url: `/1/ms/${name}/delete`, method: 'post' } as MyTableUrl,
        deleteBatch: { url: `/1/ms/${name}/batch_delete`, method: 'post' } as MyTableUrl,
        changeStatus: { url: `/1/ms/${name}/change_status`, method: 'post' } as MyTableUrl,
        changeStatusBatch: { url: `/1/ms/${name}/batch_change_status`, method: 'post' } as MyTableUrl,
        detail: { url: `/1/ms/${name}/get`, method: 'get' } as MyTableUrl,
        export: { url: `/1/ms/${name}/export`, method: 'get' } as MyTableUrl,
        import: { url: `/1/ms/${name}/import`, method: 'post' } as MyTableUrl,
        importDemo: { url: `/1/ms/${name}/import_demo`, method: 'get' } as MyTableUrl,
    }

    const tabConfig = useMemo(() => {
        if (modelConfig && modelConfig.tab) {
            if (modelConfig.tab.defaultKey === undefined) {
                modelConfig.tab.defaultKey = modelConfig.tab.tabs && modelConfig.tab.tabs.length ? modelConfig.tab.tabs[0].key : "";
            }
            return modelConfig.tab;
        }
        return undefined;
    }, [modelConfig]);

    return <>
        <MyTable
            queryConfig={{ formItems: queryFormItems }}
            tableConfig={{
                columns: columns,
                selectionType: headerActions.filter(a => a.isBatch).length > 0 ? "checkbox" : undefined,
                rowKey: modelMeta?.property_meta_list.find(f => f.model_column?.primary_key)?.name || 'id',
                scroll: { x: 1300 }
            }}
            actionConfig={{
                headerActions: headerActions,
                itemActions: itemActions,
            }}
            requestConfig={requestConfig}
            tabConfig={tabConfig}
        />
    </>
}

export default ModelDataList;