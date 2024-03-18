import { MyFormItems } from "@/components/MyForm";
import { convertToMyFormItems } from "./common";

const codeSpace = '    ';
export const generateCode = (name, modelConfig) => {
    const code: any[] = [];
    code.push(generateImport());
    code.push(`const ListPage: React.FC = () => {`);
    code.push(generateQueryFormItems(modelConfig));
    code.push(generateColumns(modelConfig));
    code.push(generateAddFormItems(modelConfig));
    code.push(generateHeaderActions(modelConfig));
    code.push(generateItemActions(modelConfig));
    code.push(generateRequestConfig(name));
    code.push(generateTabConfig(modelConfig));
    code.push(generateReturn());
    code.push(`}`);
    code.push(`export default ListPage;`);
    return code.join('\n');
}

const sorter = (a, b) => (a.index || 0) - (b.index || 0);
const jsonToString = (obj) => {
    return JSON.stringify(obj, undefined, 4).replaceAll('\n', '\n    ').replaceAll('"$$', '').replaceAll('$$"', '');
}

const generateImport = () => {
    return `import { MyFormItems } from "@/components/MyForm";\n` + 
    `import MyTable, { MyTableAction, MyTableUrl } from "@/components/MyTable";\n` +
    `import { DeleteOutlined, DownOutlined, ExportOutlined, ImportOutlined, PlusOutlined, UpOutlined } from "@ant-design/icons";\n`;
}

const generateQueryFormItems = (modelConfig) => {
    let formItems: MyFormItems[] = [];
    if (modelConfig && modelConfig.query) {
        formItems = modelConfig.query.sort(sorter).map(item => convertToMyFormItems(item));
    }
    return `${codeSpace}const queryFormItems: MyFormItems[] = ${jsonToString(formItems)};`;
}

const generateColumns = (modelConfig) => {
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
    return `${codeSpace}const columns = ${jsonToString(list)};`;
}

const generateAddFormItems = (modelConfig) => {
    let formItems: MyFormItems[] = [];
    if (modelConfig && modelConfig.form) {
        formItems = modelConfig.form.sort(sorter).map(item => convertToMyFormItems(item));
    }
    return `${codeSpace}const addFormItems: MyFormItems[] = ${jsonToString(formItems)};`;
}

const generateHeaderActions = (modelConfig) => {
    let actions: any[] = [];
    if (modelConfig && modelConfig.action) {
        if (modelConfig.action.add) {
            actions.push({ title: "新增", key: "add", type: "btn", icon: "$$<PlusOutlined />$$", condition: { pem: modelConfig.action.add_pem }, handler: { formItems: "$$addFormItems$$", showType: "drawer" } });
        }
        if (modelConfig.action.import) {
            actions.push({ title: "导入", key: "import", type: "btn", icon: "$$<ImportOutlined />$$", condition: { pem: modelConfig.action.import_pem } });
            actions.push({ title: "下载导入模板", key: "importDemo", type: "link", condition: { pem: modelConfig.action.import_pem } });
        }
        if (modelConfig.action.export) {
            actions.push({ title: "导出", key: "export", type: "btn", icon: "$$<ExportOutlined />$$", condition: { pem: modelConfig.action.export_pem } });
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
    return `${codeSpace}const headerActions: MyTableAction[] = ${jsonToString(actions)}`;
}

const generateItemActions = (modelConfig) => {
    let actions: any[] = [];
    if (modelConfig && modelConfig.action) {
        if (modelConfig.action.itemActions) {
            modelConfig.action.itemActions.forEach(item => {
                let action = { title: item.title, key: item.key, type: (item.confirm ? 'confirmBtn' : 'btn'), condition: { values: item.before_status && { status: item.before_status.split(',') }, pem: item.pem } };
                if (item.key === 'view') {
                    action['handler'] = { showType: "editForm" };
                } else if (item.key === 'edit') {
                    action['handler'] = { formItems: "$$addFormItems$$", showType: "drawer", pick: ["id"], requireDetail: true };
                } else if (item.key === 'delete') {
                    action['handler'] = { pick: ["id"] };
                } else {
                    action['handler'] = { pick: ["id"], params: item.after_status && { status: item.after_status }, requestUrl: "changeStatus" };
                }
                actions.push(action);
            })
        }
    }
    return `${codeSpace}const itemActions: MyTableAction[] = ${jsonToString(actions)};`;
}

const generateRequestConfig = (name) => {
    return `    const requestConfig = {
        list: { url: '/1/ms/${name}/page_list', method: 'get' } as MyTableUrl,
        add: { url: '/1/ms/${name}/add', method: 'post' } as MyTableUrl,
        edit: { url: '/1/ms/${name}/update', method: 'post' } as MyTableUrl,
        delete: { url: '/1/ms/${name}/delete', method: 'post' } as MyTableUrl,
        deleteBatch: { url: '/1/ms/${name}/batch_delete', method: 'post' } as MyTableUrl,
        changeStatus: { url: '/1/ms/${name}/change_status', method: 'post' } as MyTableUrl,
        changeStatusBatch: { url: '/1/ms/${name}/batch_change_status', method: 'post' } as MyTableUrl,
        detail: { url: '/1/ms/${name}/get', method: 'get' } as MyTableUrl,
        export: { url: '/1/ms/${name}/export', method: 'get' } as MyTableUrl,
        import: { url: '/1/ms/${name}/import', method: 'post' } as MyTableUrl,
        importDemo: { url: '/1/ms/${name}/import_demo', method: 'get' } as MyTableUrl,
    }`;
}

const generateTabConfig = (modelConfig) => {
    if (modelConfig && modelConfig.tab) {
        if (modelConfig.tab.defaultKey === undefined) {
            modelConfig.tab.defaultKey = modelConfig.tab.tabs && modelConfig.tab.tabs.length ? modelConfig.tab.tabs[0].key : "";
        }
    }
    return modelConfig && modelConfig.tab ? `${codeSpace}const tabConfig = ${jsonToString(modelConfig.tab)};`
    : 
    `${codeSpace}const tabConfig = undefined;`;
}

const generateReturn = () => {
    return `${codeSpace}return <>
        <MyTable
            queryConfig={{ formItems: queryFormItems }}
            tableConfig={{
                columns: columns,
                selectionType: "checkbox",
                rowKey: "id",
                scroll: { x: 1300 }
            }}
            actionConfig={{
                headerActions: headerActions,
                itemActions: itemActions,
            }}
            requestConfig={requestConfig}
            tabConfig={tabConfig}
        />
    </>`;
}