import { getDownloadFileWithToken, httpRequest } from "@/lib/http";
import { checkFile, uploadFile } from "@/lib/upload";
import { ConfigContext } from "@/stories/ConfigStore";
import { isEqual } from "@/utils/utility";
import { ValueConverterConfig, convertData } from "@/utils/convert"
import { DownOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Divider, Drawer, Dropdown, Form, FormInstance, message, Modal, Popconfirm, Row, Space, Table, TablePaginationConfig, Tabs, Tag, Upload, Image } from "antd";
import { ButtonType } from "antd/lib/button";
import { FilterValue, RowSelectionType, SorterResult } from "antd/lib/table/interface";
import { Fragment, useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import MyForm, { MyFormItems } from "../MyForm";
import MyQueryForm from "../MyQueryForm";
import '@/assets/css/common.scss'
import "./index.scss";
import MyDragSortTable from "./MyDragSortTable";

export interface MyTableProps {
    // 搜索框的配置
    queryConfig?: MyTableQueryConfig;
    // 表格的配置
    tableConfig: MyTableConfig;
    // 操作行为的配置
    actionConfig?: MyTableActionConfig;
    // tab的配置
    tabConfig?: MyTableTabConfig;
    // 数据过滤的配置
    filterConfig?: MyTableFilterConfig;
    // api接口请求的配置
    requestConfig?: MyTableRequestConfig;
    // 外部筛选参数
    listParams?: any;
    // 外部筛选参数是否必须
    listParamsRequired?: boolean;
    //刷新触发
    refreshTriggerKey?: string;
}

export interface MyTableQueryConfig {
    formItems: MyFormItems[];
    defaultSize?: number;
}

export interface MyTableConfig {
    columns: any[];
    rowKey?: string;
    selectionType?: 'radio' | 'checkbox';
    onSelect?: (item) => void;
    scroll?: {
        x?: number | true | string;
        y?: number | string;
        scrollToFirstRowOnChange?: boolean;
    },
    operateWidth?: number;
    page?: boolean;
    // 拖拽排序
    sortChange?: (activeIndex, overIndex, newDataSource) => void;
    sortMode?: 'default' | 'grip';
}

export interface MyTableActionConfig {
    headerActions?: MyTableAction[];
    itemActions?: MyTableAction[];
    itemShowNumber?: number; // 操作列直接展示的个数（其余放进下拉菜单），默认 3
    doAction?: (action: MyTableAction, params?: any) => Promise<any> | undefined;
    // 自己渲染头部操作
    headerActionRender?: () => any;
    // 自己渲染行操作
    itemActionRender?: (item) => any[];
    // 添加弹框或抽屉中自己渲染操作
    addModalActionRender?: (closeFn, okFn) => any;
    // 编辑弹框或抽屉中自己渲染操作
    editModalActionRender?: (item, closeFn, okFn) => any;
    // 查看弹框或抽屉中自己渲染操作
    detailModalActionRender?: (item, closeFn, okFn) => any;
}

export interface MyTableTabConfig {
    name: string;
    tabs: MyTableTab[];
    defaultKey: string;
    onChange?: (item: any) => any
}

export interface MyTableFilterConfig {
    // 判断操作行为能否显示
    action?: (action: MyTableAction, item?: any) => boolean;
    // 处理列表数据
    listData?: (data: any) => any;
    listDataConverter?: ValueConverterConfig;
    // 处理详情数据
    detailData?: (data: any) => any;
    detailDataConverter?: ValueConverterConfig;
    // 处理操作行为的请求参数
    requestParams?: (action: MyTableAction, data: any) => any;
    requestParamsConverter?: { [key: string]: ValueConverterConfig };
}

export interface MyTableRequestConfig {
    [key: string]: MyTableUrl;
}

export interface MyTableAction {
    // 操作名称
    title?: string;
    // 行为表示，固定的有add/edit/delete/list/view
    key: string;
    // 操作按钮上显示的图标
    icon?: React.ReactNode;
    // 按钮类型，bottom只对新增按钮有效，表示添加按钮在表格底部
    type?: 'link' | 'linkBlank' | 'btn' | 'confirmBtn' | 'upload' | 'bottom';
    // 是否是批量操作，只在headerActions中有效
    isBatch?: boolean;
    // 链接
    linkFormater?: (item?: any, type?: string) => string | string;
    // 点击按钮的处理，没有设置时会调用doAction
    handler?: MyTableActionHandler;
    // 操作显示的条件
    condition?: MyTableActionCondition;
}

export interface MyTableActionHandler {
    // 标题，可以用于弹框或抽屉的标题显示
    title?: string;
    // 交互形式
    showType?: 'modal' | 'drawer' | 'editForm';
    // form表单
    formItems?: MyFormItems[];
    formValues?: (data) => Promise<any>;
    // 请求接口地址
    requestUrl?: MyTableUrl | string;
    // 成功后的处理
    success?: (ret) => void;
    // 从当前item中提取那些字段作为请求的参数
    pick?: string[] | 'all';
    // 请求时需要带的参数
    params?: any;
    // 是否需要详情数据
    requireDetail?: boolean;
    // 是否校验必填项
    ignoreFormValidate?: boolean;
}

export interface MyTableActionCondition {
    // 权限
    pem?: string | string[];
    // 当前item的属性值条件
    values?: any;
}

export interface MyTableTab {
    key: string;
    label: React.ReactNode;
}

export interface MyTableUrl {
    method: 'get' | 'post' | 'put' | 'delete';
    url: string;
}

const MyTable: React.FC<MyTableProps> = ({ queryConfig, tableConfig, actionConfig, tabConfig, filterConfig, requestConfig, listParams, listParamsRequired, refreshTriggerKey }: MyTableProps) => {
    const { userHasPems } = useContext(ConfigContext);
    const [loading, setLoading] = useState<boolean>(false);
    const [dataTotal, setDataTotal] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(10);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [addModalShow, setAddModalShow] = useState<boolean>(false);
    const [editModalShow, setEditModalShow] = useState<boolean>(false);
    const [editFormDisabled, setEditFormDisabled] = useState<boolean>(false);
    const [currentItem, setCurrentItem] = useState<any>();
    const [currentDetailItem, setCurrentDetailItem] = useState<any>();
    const [queryParams, setQueryParams] = useState<any>({});
    const [currentOuterListParams, setCurrentOuterListPrams] = useState<any>(listParams);
    const [currentListParams, setCurrentListPrams] = useState<any>({});
    const [tabKey, setTabKey] = useState<string>(tabConfig?.defaultKey || '');
    const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
    const [sortedInfo, setSortedInfo] = useState<SorterResult<any>[]>([]);
    const [dataSource, setDataSource] = useState<any[]>([]);
    const [customModalShow, setCustomModalShow] = useState<boolean>(false);
    const [customDrawerShow, setCustomDrawerShow] = useState<boolean>(false);
    const [currentFormAction, setCurrentFormAction] = useState<MyTableAction>();
    const [isShowToEdit, setIsShowToEdit] = useState<boolean>(false)
    const [addForm] = Form.useForm();
    const [editFrom] = Form.useForm();
    const [customModalForm] = Form.useForm();
    const [customDrawerFrom] = Form.useForm();
    const ACTION_LIST = { key: "list" };
    const ACTION_DETAIL = { key: "detail", handler: { pick: ["id"] } };
    const ACTION_ADD = actionConfig?.headerActions?.find(a => a.key === "add");
    const ACTION_IMPORT = actionConfig?.headerActions?.find(a => a.key === "import");
    const ACTION_IMPORT_DEMO = actionConfig?.headerActions?.find(a => a.key === "importDemo");
    const ACTION_EXPORT = actionConfig?.headerActions?.find(a => a.key === "export");
    const ACTION_EDIT = actionConfig?.itemActions?.find(a => a.key === "edit");
    const ACTION_VIEW = actionConfig?.itemActions?.find(a => a.key === "view");

    tableConfig.columns.forEach(c => {
        if (!c.render && c.option && c.option.renderType) {
            c.render = c.option.renderType === 'image' ? (text, record) => {
                return <Image src={text} width={100} height={50} style={{ objectFit: 'cover' }}  />;
            } :
                c.option.renderType === 'link' ? (text, record) => {
                    return <a href={text} target='_blank'>{text}</a>;
                } :
                    c.option.renderType === 'tag' ? (text, record) => {
                        let v = typeof text === 'string' ? text.split(',') : text;
                        return v && Array.isArray(v) ?
                            v.map((a, index) => <Tag key={index}>{a}</Tag>) :
                            (v && <Tag color={"blue"}>{v}</Tag>)

                    } : undefined;
        }
        if (!c.render) {
            c.render = (text, record) => {
                if (typeof text === 'boolean') {
                    return text ? '是' : '否';
                }
                return text;
            }
        }
    })
    const innerColumns = actionConfig && actionConfig.itemActions && actionConfig.itemActions.length > 0 ?
        [...tableConfig.columns, {
            title: '操作',
            dataIndex: 'operate',
            width: tableConfig.operateWidth || 180,
            render: (text, record) => {
                return renderItemActions(record);
            },
            fixed: 'right' as 'right'
        }] : tableConfig.columns;

    // 表格翻页
    const pagination = tableConfig.page == false ? false : {
        pageSize: pageSize, current: pageNumber, total: dataTotal, showTotal: total => `共 ${total} 条`,
        onChange: (a) => { setPageNumber(a) }, showSizeChanger: true, onShowSizeChange: (a, b) => {
            setPageSize(b);
            setPageNumber(1);
        }
    };

    const isActionEnabled = (action: MyTableAction, item?: any) => {
        if (action.condition) {
            if (action.condition.pem) {
                // 进行权限判断
                if (!userHasPems(typeof action.condition.pem === 'string' ? [action.condition.pem] : action.condition.pem)) {
                    return false;
                }
            }
            if (action.condition.values && item) {
                for (let key in action.condition.values) {
                    let inverse = false;
                    if (key.endsWith('_not_')) {
                        inverse = true;
                        key = key.substring(0, key.length - '_not_'.length);
                    }
                    let match = matchCondition(action.condition.values[key], item[key]);
                    if ((!inverse && !match) || (inverse && match)) {
                        return false;
                    }
                }
            }
        }
        return !(filterConfig?.action && !filterConfig.action(action, item));
    }

    const matchCondition = (conditionValue, itemValue) => {
        if (Array.isArray(conditionValue)) {
            if (!conditionValue.some(v => v == itemValue)) return false;
        } else {
            if (itemValue != conditionValue) return false
        }
        return true;
    }

    const getSelectionType = () => {
        if (actionConfig &&
            actionConfig.headerActions &&
            actionConfig.headerActions.filter(a => a.isBatch).length > 0 &&
            actionConfig.headerActions.filter(a => a.isBatch && isActionEnabled(a, null)).length == 0) {
            return undefined;
        }
        return tableConfig.selectionType;
    }

    // 表格行选择
    const rowSelection = getSelectionType() ? {
        type: tableConfig.selectionType as RowSelectionType,
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRowKeys(selectedRowKeys);
            setSelectedRows(selectedRows);
            if (tableConfig.onSelect) {
                tableConfig.onSelect(selectedRows);
            }
        },
        getCheckboxProps: record => ({
            name: record.name,
        }),
        selectedRowKeys: selectedRowKeys,
    } : undefined;

    const renderActions = () => {
        const result: any[] = [];
        const addAction = renderAddAction();
        addAction && result.push(addAction);
        const headerActions = renderHeaderActions();
        headerActions && result.push(headerActions);
        const batchActions = renderBatchActions();
        batchActions && result.push(batchActions);
        const extendActions = actionConfig?.headerActionRender?.();
        if (result.length || extendActions) {
            return <Row style={{ marginBottom: 8, marginTop: 8 }}>
                <Space>
                    {result.map((item, index) => <Fragment key={index}>{item}</Fragment>)}
                </Space>
                { extendActions }
            </Row>;
        }
        return undefined;
    }

    // 批量操作按钮
    const renderBatchActions = () => {
        if (!actionConfig) {
            return undefined;
        }
        let actions: MyTableAction[] | undefined;
        if (actionConfig.headerActions) {
            actions = actionConfig.headerActions.filter(a => a.isBatch && isActionEnabled(a, null));
        }
        return actions && actions.length > 0 ? <><DropDownAction key={"batchAction"} actions={actions} onClick={(action) => {
            if (selectedRowKeys.length == 0) {
                message.warning('不存在已选择项！');
                return;
            }
            if (action && dataSource.filter(d => selectedRows.includes(d)).some(d => action && !isActionEnabled(action, d))) {
                message.warning('存在已选择项不符合此操作！');
                return;
            }
            action && innerDoAction(action, selectedRows, null);
        }}>
            <Button>
                <Space>
                    批量操作
                    <DownOutlined />
                </Space>
            </Button>
        </DropDownAction>
            {`已选择 ${selectedRowKeys && selectedRowKeys.length ? selectedRowKeys.length : 0} 项`}
        </> : undefined;
    }

    const renderHeaderActions = () => {
        if (!actionConfig) {
            return undefined;
        }
        let actions: MyTableAction[] | undefined;
        if (actionConfig.headerActions) {
            actions = actionConfig.headerActions.filter(a => (a.isBatch === undefined || a.isBatch === false) && a.key != 'add' && isActionEnabled(a, null));
        }
        return actions && actions.length > 0 ? <Space>
            {
                actions?.map(action => action.key === ACTION_IMPORT?.key ?
                    renderUploadAction('primary', action)
                    :
                    action.key === ACTION_IMPORT_DEMO?.key ?
                        renderSmallLinkAction(action)
                        :
                        renderHeaderAction('primary', action))
            }
        </Space> : undefined;
    }

    const renderItemActions = (item: any) => {
        if (!actionConfig) {
            return undefined;
        }
        let actions: MyTableAction[] | undefined;
        if (actionConfig.itemActions) {
            actions = actionConfig.itemActions.filter(a => isActionEnabled(a, item));
        }
        if (actions && actions.length) {

            // 当按钮数量超过 itemShowNumber 个时放在下拉里
            const n = actionConfig.itemShowNumber || 3
            const num = actions.length <= n ? n : n - 1
            const showActions = actions.splice(0, num)
            const dropdownActions = actions

            let result = showActions.map((action, index) => {
                if (index === showActions.length - 1) {
                    return renderItemAction(action, item);
                } else {
                    return <Fragment key={index}>{renderItemAction(action, item)}<Divider type="vertical" /></Fragment>;
                }
            });
            if (dropdownActions.length > 0) {
                if (result.length > 0) {
                    result.push(<Divider key={"lastDivider"} type="vertical" />);
                }
                result.push(<DropDownAction key={"dropDownAction"} actions={dropdownActions} onClick={(action) => innerDoAction(action, item)}>
                    <a onClick={(e) => e.preventDefault()}>
                        <Space>
                            更多
                            <DownOutlined />
                        </Space>
                    </a>
                </DropDownAction>);
            }
            const extendActions = actionConfig?.itemActionRender?.(item);
            if (extendActions && extendActions.length) {
                extendActions.forEach((action, index) => {
                    if (index === extendActions.length - 1) {
                        result.push(<Fragment key={`extend${index}`}>{action}</Fragment>);
                    } else {
                        result.push(<Fragment key={`extend${index}`}>{action}<Divider type="vertical" /></Fragment>);
                    }
                })
            }
            return result;
        }
        return undefined;
    }

    const renderItemActionsInDetail = (item: any) => {
        if (!actionConfig || !item) {
            return undefined;
        }
        let actions: MyTableAction[] | undefined;
        if (actionConfig.itemActions) {
            actions = actionConfig.itemActions.filter(a => isActionEnabled(a, item));
        }
        if (actions && actions.length) {
            let showActions = actions.filter(a => a.key != ACTION_VIEW?.key);
            let result = showActions.map((action, index) => {
                return renderHeaderAction('primary', action, item);
            });
            return result;
        }
        return undefined;
    }

    const DropDownAction = ({ actions, onClick, children }) => {
        const [currentAction, setCurrentAction] = useState<MyTableAction>();
        const [popconfirmOpen, setPopconfirmOpen] = useState<boolean>(false);
        return <Popconfirm
            placement="topRight"
            title={`确认${currentAction?.title}吗？`}
            onConfirm={() => onClick(currentAction)}
            okText="确认"
            open={popconfirmOpen}
            onOpenChange={(open, e) => {
                if (!open) {
                    setPopconfirmOpen(open);
                }

            }}
            cancelText="取消"><Dropdown menu={{
                items: actions.map(a => {
                    return { key: a.key, label: a.type === "confirmBtn" ? (<a className="danger-operation">{a.title}</a>) : (a.title), icon: a.icon }
                }), onClick: (e) => {
                    let action = actions.find(a => a.key === e.key);
                    if (action) {
                        if (action.type === 'confirmBtn') {
                            setCurrentAction(action);
                            setTimeout(() => {
                                setPopconfirmOpen(true);
                            }, 100)

                        } else {
                            onClick(action);
                        }
                    }
                }
            }}>
                {
                    children
                }
            </Dropdown></Popconfirm>;
    }

    const renderUploadAction = (buttonType: ButtonType, action: MyTableAction, item?: any) => {
        return <Upload name="file"
            key={action.key}
            showUploadList={false}
            beforeUpload={(file) => { return checkFile(file, "xlsx|xls", 5) }}
            customRequest={(info) => {
                if (info.file) {
                    let url = getActionRequestUrl(action);
                    if (url) {
                        uploadFile(info.file, url.url, 2, false, 2, undefined).then(res => {
                            message.success(`${action.title || '操作'}成功！`);
                            reloadData(1);
                        }).catch(err => {
                            message.error(`${action.title || '操作'}失败：${err.msg || err.message || err}`);
                        })
                    } else {
                        innerDoAction(action, item, info.file);
                    }
                }
            }}>
            <Button key={action.key} type={buttonType} icon={action.icon}>{action.title}</Button>
        </Upload>
    }

    const renderSmallLinkAction = (action: MyTableAction, item?: any) => {
        return <Button style={ { paddingTop: 10, paddingRight: 0, paddingLeft: 0, paddingBottom: 0, fontSize: 12 } }  type="link" key={action.key} onClick={() => innerDoAction(action, item)}>{action.title}</Button>;
    }

    const renderHeaderAction = (buttonType: ButtonType, action: MyTableAction, item?: any) => {
        if (action.type === "btn") {
            return <Button key={action.key} type={buttonType} icon={action.icon} onClick={() => innerDoAction(action, item)}>{action.title}</Button>
        } else if (action.type === "confirmBtn") {
            return <Popconfirm
                placement="topRight"
                title={`确认${action.title}吗？`}
                onConfirm={() => innerDoAction(action, item)}
                okText="确认"
                cancelText="取消"
                key={action.key}>
                <Button type={buttonType} icon={action.icon} danger>{action.title}</Button>
            </Popconfirm>
        } else if ((action.type === "link" || action.type === 'linkBlank') && action.linkFormater) {
            let link = typeof action.linkFormater === 'string' ? action.linkFormater : action.linkFormater(item);
            return <Link target={action.type === 'linkBlank' ? '_blank' : undefined} to={link || ''} key={action.key} onClick={() => { }}>
                <Button type={buttonType} icon={action.icon}>{action.title}</Button>
            </Link>;
        }
        return undefined;
    }

    const renderItemAction = (action: MyTableAction, item?: any) => {
        if (action.type === "btn") {
            return <a key={action.key} onClick={() => innerDoAction(action, item)}>{action.title}</a>
        } else if (action.type === "confirmBtn") {
            return <Popconfirm
                placement="topRight"
                title={`确认${action.title}吗？`}
                onConfirm={() => innerDoAction(action, item)}
                okText="确认"
                cancelText="取消"
                key={action.key}>
                <a className="danger-operation">{action.title}</a>
            </Popconfirm>
        } else if ((action.type === "link" || action.type === 'linkBlank') && action.linkFormater) {
            let link = typeof action.linkFormater === 'string' ? action.linkFormater : action.linkFormater(item);
            if (link.startsWith("http://") || link.startsWith("https://")) {
                return <a href={link} target="_blank">{action.title}</a>
            } else {
                return <Link target={action.type === 'linkBlank' ? '_blank' : undefined} to={link || ''} key={action.key} onClick={() => { }}>
                    {action.title}
                </Link>;
            }
        }
        return undefined;
    }


    const renderAddAction = () => {
        if (!actionConfig) {
            return undefined;
        }
        if (ACTION_ADD && ACTION_ADD.type != 'bottom' && isActionEnabled(ACTION_ADD)) {
            if (ACTION_ADD.linkFormater) {
                return <Link to={ACTION_ADD.linkFormater()} onClick={() => { }}>
                    <Button type="primary" icon={<PlusOutlined />}>{ACTION_ADD.title || '新增'}</Button>
                </Link>;
            } else {
                return <Button type="primary" onClick={() => innerDoAction(ACTION_ADD)} icon={<PlusOutlined />}>{ACTION_ADD.title || '新增'}</Button>;
            }
        }
        return undefined;
    }

    const renderAddActionInBottom = () => {
        if (!actionConfig) {
            return undefined;
        }
        if (ACTION_ADD && ACTION_ADD.type === 'bottom' && isActionEnabled(ACTION_ADD)) {
            if (ACTION_ADD.linkFormater) {
                return <div className="my-table-add-btn-bottom"><Link to={ACTION_ADD.linkFormater()} onClick={() => { }}>
                    <Button type="dashed" icon={<PlusOutlined />}>{ACTION_ADD.title || '新增'}</Button>
                </Link></div>;
            } else {
                return <div className="my-table-add-btn-bottom"><Button type="dashed" onClick={() => innerDoAction(ACTION_ADD)} icon={<PlusOutlined />}>{ACTION_ADD.title || '新增'}</Button></div>;
            }
        }
        return undefined;
    }

    const innerDoAction = (action: MyTableAction, item?: any, params?: any) => {
        if (ACTION_EDIT && action.key === ACTION_EDIT.key && ACTION_EDIT.handler?.formItems) {
            // 当从查看跳转到编辑时（即在 editModalShow 为 true 时）
            if (editModalShow) setIsShowToEdit(true)
            setCurrentItem(item);
            setEditModalShow(true);
            editFrom.resetFields();
            editFrom.setFieldsValue(item);
            setEditFormDisabled(false);
            if (action.handler?.requireDetail) {
                getDetailData(item, (data) => {
                    editFrom.resetFields();
                    editFrom.setFieldsValue(data);
                });
            }
            return;
        }
        if (ACTION_ADD && action.key === ACTION_ADD.key && ACTION_ADD.handler?.formItems) {
            setAddModalShow(true);
            addForm.resetFields();
            return;
        }
        if (ACTION_VIEW && action.key === ACTION_VIEW.key && ACTION_VIEW.handler?.showType === 'editForm' && ACTION_EDIT?.handler?.formItems) {
            setCurrentItem(item);
            setEditModalShow(true);
            editFrom.resetFields();
            editFrom.setFieldsValue(item);
            setEditFormDisabled(true);
            if (ACTION_EDIT.handler?.requireDetail) {
                getDetailData(item, (data) => {
                    editFrom.resetFields();
                    editFrom.setFieldsValue(data);
                });
            }
            return;
        }
        if ((action.handler?.showType === "modal" || action.handler?.showType === "drawer") && action.handler.formItems && action.handler.formItems.length) {
            setCurrentItem(item);
            setCurrentFormAction(action);
            let customForm;
            if (action.handler.showType === "modal") {
                setCustomModalShow(true);
                customForm = customModalForm;
            } else {
                setCustomDrawerShow(true);
                customForm = customDrawerFrom;
            }
            customForm.resetFields();
            if (action.handler.formValues) {
                action.handler.formValues(item).then(res => {
                    if (res) {
                        customForm.setFieldsValue(res);
                    }
                })
            }
            return;
        }
        callAction(action, item, params);
    }

    const callAction = (action: MyTableAction, item?: any, params?: any, success?: Function) => {
        let requestParams = params || {};
        if (action.handler?.pick && item) {
            if (action.handler.pick === 'all') {
                if (Array.isArray(item)) {
                    requestParams['array'] = item;
                } else {
                    requestParams = { ...item, ...requestParams };
                }
            } else {
                if (action.isBatch && Array.isArray(item)) {
                    action.handler.pick.forEach(p => {
                        requestParams[p + "_array"] = item.map(a => a[p]);
                    })
                } else {
                    action.handler.pick.forEach(p => {
                        requestParams[p] = item[p];
                    })
                }
            }
        }
        if (action.handler?.params) {
            requestParams = Object.assign(requestParams, action.handler.params);
        }
        if (filterConfig?.requestParamsConverter && filterConfig.requestParamsConverter[action.key]) {
            requestParams = convertData(requestParams, filterConfig.requestParamsConverter[action.key])
        }
        if (filterConfig?.requestParams) {
            requestParams = filterConfig.requestParams(action, requestParams);
        }
        if (action.key === ACTION_LIST.key) {
            setCurrentListPrams(requestParams);
        }
        let url = getActionRequestUrl(action);
        let requestAction;
        if (url) {
            if (action.key === ACTION_EXPORT?.key) {
                let exportParams = { ...currentListParams };
                delete exportParams.page_no;
                delete exportParams.page_size;
                getDownloadFileWithToken(url.url, exportParams, '导出.xlsx');
            } else if (action.key === ACTION_IMPORT_DEMO?.key) {
                getDownloadFileWithToken(url.url, {}, '导入模板.xlsx');
            } else if (url.method === 'get') {
                requestAction = httpRequest(url.url, url.method, requestParams, {});
            } else {
                requestAction = httpRequest(url.url, url.method, {}, requestParams);
            }
        } else if (actionConfig && actionConfig.doAction) {
            requestAction = actionConfig.doAction(action, requestParams);
        }
        requestAction && requestAction.then((value) => {
            if (success) {
                success(value);
            } else if (action.handler?.success) {
                action.handler.success(value);
            } else if (value !== undefined) {
                message.success('操作成功');
                if (action.key === 'delete') {
                    setEditModalShow(false);
                    setCurrentItem(undefined);
                    setCurrentDetailItem(undefined);
                    reloadData(undefined, true);
                } else {
                    reloadData();
                }
            }
        }, (reason) => {
            message.warning(reason.message || reason.msg || '请求失败，请重试！');
        });
    }

    const getActionRequestUrl = (action: MyTableAction): MyTableUrl | undefined => {
        let url: MyTableUrl | undefined;
        if (action.handler?.requestUrl) {
            url = typeof action.handler.requestUrl === 'string' ? (requestConfig && requestConfig[action.handler.requestUrl]) : action.handler.requestUrl;
        } else if (requestConfig) {
            url = requestConfig[action.key];
        }
        return url;
    }

    const getFormValues = (form: FormInstance<any>, ignoreFormValidate: boolean | undefined) => {
        if (ignoreFormValidate) {
            return Promise.resolve(form.getFieldsValue())
        }
        return form.validateFields()
    }

    const onAddModalClose = () => {
        setAddModalShow(false)
    }

    const onAddModalOk = () => {
        getFormValues(addForm, ACTION_ADD?.handler?.ignoreFormValidate).then(values => {
            ACTION_ADD && callAction(ACTION_ADD, null, values, () => {
                message.success('添加成功！');
                reloadData();
                setAddModalShow(false)
            });
        });
    }

    const onEditModalOk = () => {
        getFormValues(editFrom, ACTION_EDIT?.handler?.ignoreFormValidate).then(values => {
            ACTION_EDIT && callAction(ACTION_EDIT, currentItem, values, () => {
                message.success('保存成功！');
                reloadData();
                onEditModalClose();
            });
        });
    }

    const onEditModalClose = () => {
        // 当是从查看跳到编辑时，回到查看页面
        if (isShowToEdit) {
            setIsShowToEdit(false)
            setEditModalShow(true)
            setEditFormDisabled(true)
        } else {
            setEditModalShow(false);
            setCurrentItem(undefined);
            setCurrentDetailItem(undefined);
        }
    }

    const onCustomModalOk = () => {
        if (currentFormAction && (currentFormAction.handler?.showType === "modal" || currentFormAction.handler?.showType === "drawer")) {
            let form = currentFormAction.handler.showType === "modal" ? customModalForm : customDrawerFrom;
            getFormValues(form, currentFormAction?.handler?.ignoreFormValidate).then(values => {
                callAction(currentFormAction, currentItem, values, () => {
                    message.success('操作成功！');
                    reloadData();
                    currentFormAction?.handler?.showType === "modal" ? setCustomModalShow(false) : setCustomDrawerShow(false);
                    setCurrentFormAction(undefined);
                });
            });
        }
    }

    const onTabChange = (key) => {
        setTabKey(key);
        setPageNumber(1);
        tabConfig?.onChange ? tabConfig?.onChange(key) : undefined
    }

    const onSearch = (values) => {
        setQueryParams(values);
        setPageNumber(1);
    }

    useEffect(() => {
        if (refreshTriggerKey) {
            reloadData();
        }
    }, [refreshTriggerKey])

    useEffect(() => {
        getListData();
    }, [pageNumber, pageSize, queryParams, tabKey, sortedInfo, filteredInfo, currentOuterListParams]);

    useEffect(() => {
        if (!isEqual(listParams, currentOuterListParams)) {
            setCurrentOuterListPrams(listParams);
            setPageNumber(1);
        }
    }, [listParams]);

    const reloadData = (pageNo?: number, ignoreDetail?: boolean) => {
        if (pageNo && pageNumber != pageNo) {
            setPageNumber(pageNo);
        } else {
            getListData();
        }
        if (!ignoreDetail) {
            reloadDetailData();
        }
    }

    const reloadDetailData = () => {
        if (currentDetailItem) {
            getDetailData(currentDetailItem, (res) => {
                setCurrentItem(res);
                editFrom.resetFields();
                editFrom.setFieldsValue(res);
            })
        }
    }

    const getListData = () => {
        if (listParamsRequired && (!listParams || Object.keys(listParams).length === 0)) {
            return;
        }
        setLoading(true);
        let params = tableConfig.page == false ? {
            ...queryParams,
            ...listParams
        } : {
            page_no: pageNumber,
            page_size: pageSize,
            ...queryParams,
            ...listParams
        }
        if (tabConfig && tabKey) {
            if (tabKey.indexOf(',') > 0) {
                params[tabConfig.name + '_in_'] = tabKey;
            } else {
                params[tabConfig.name] = tabKey;
            }
        }
        if (sortedInfo && sortedInfo.length) {
            let ascField = sortedInfo.filter(s => s.order === 'ascend').map(s => s.field).join(',');
            let descField = sortedInfo.filter(s => s.order === 'descend').map(s => s.field).join(',');
            if (ascField) {
                params['order_by'] = ascField;
            }
            if (descField) {
                params['order_by_desc'] = descField;
            }
        }
        if (filteredInfo) {
            Object.keys(filteredInfo).forEach(key => {
                let value = filteredInfo[key];
                if (value && value.length === 1) {
                    params[key] = value[0];
                } else if (value && value.length > 1) {
                    params[key + "_in_"] = value.join(",");
                }
            })
        }

        callAction(ACTION_LIST, null, params, (res) => {
            if (pageNumber != 1 && res && res.list && res.list.length === 0) {
                setPageNumber(1);
            } else {
                setLoading(false);
                if (res) {
                    let data;
                    if (Array.isArray(res)) {
                        setDataTotal(res.length);
                        data = res;
                    } else {
                        setDataTotal(res.total || 0);
                        data = res.list || [];
                    }
                    if (filterConfig?.listDataConverter) {
                        data = data.map(item => convertData(item, filterConfig.listDataConverter));
                    }
                    if (filterConfig?.listData) {
                        data = filterConfig.listData(data);
                    }
                    setDataSource(data);
                    setSelectedRowKeys([]);
                    setSelectedRows([]);
                } else {
                    message.warning("获取列表数据失败");
                }
            }
        })
    }

    const getDetailData = (item, success) => {
        callAction(ACTION_DETAIL, item, null, (res) => {
            if (res) {
                if (filterConfig?.detailDataConverter) {
                    res = convertData(res, filterConfig.detailDataConverter);
                }
                if (filterConfig?.detailData) {
                    res = filterConfig.detailData(res);
                }
                setCurrentDetailItem(res);
                if (success) {
                    success(res);
                }
            } else {
                message.warning("获取详情数据失败");
            }
        })
    }

    const onTableChange = (pagination: TablePaginationConfig, filters: Record<string, FilterValue | null>, sorter: SorterResult<any> | SorterResult<any>[]) => {
        let newSorterInfo = (Array.isArray(sorter) ? sorter : [sorter]).filter(s => s.order != undefined);
        let sorterChanged = true;
        if (newSorterInfo.length == sortedInfo.length) {
            sorterChanged = false;
            newSorterInfo.forEach((s, index) => {
                if (!(s.field === sortedInfo[index].field && s.order === sortedInfo[index].order)) {
                    sorterChanged = true;
                }
            })
        }
        if (sorterChanged) {
            setSortedInfo(newSorterInfo);
        }
        let filterChanged = false;
        let filterKeys = Object.keys(filters);
        if (filterKeys.length > 0) {
            filterKeys.forEach((key, index) => {
                if (!(filters[key]?.join(",") === filteredInfo[key]?.join(","))) {
                    filterChanged = true;
                }
            })
        }
        if (filterChanged) {
            setFilteredInfo(filters);
        }
        if (sorterChanged || filterChanged) {
            setPageNumber(1);
        }
    }

    const renderTable = () => {
        if (tableConfig.sortChange) {
            return <MyDragSortTable
                columns={innerColumns}
                dataSource={dataSource}
                rowSelection={rowSelection}
                pagination={pagination}
                rowKey={tableConfig.rowKey || 'id'}
                scroll={dataSource.length === 0 ? undefined : tableConfig.scroll}
                onChange={onTableChange}
                loading={loading}
                sortChange={tableConfig.sortChange}
                sortMode={tableConfig.sortMode} />
        } else {
            return <Table
                columns={innerColumns}
                dataSource={dataSource}
                rowSelection={rowSelection}
                pagination={pagination}
                rowKey={tableConfig.rowKey || 'id'}
                scroll={dataSource.length === 0 ? undefined : tableConfig.scroll}
                onChange={onTableChange}
                loading={loading} />
        }
    }

    return <>
        {
            queryConfig && queryConfig.formItems.length > 0 ? <MyQueryForm defaultSize={queryConfig.defaultSize || 3} formItems={queryConfig.formItems} onSearch={onSearch} /> : undefined
        }
        <Card bodyStyle={{ padding: "8px 8px" }}>
            {
                tabConfig ? <Tabs defaultActiveKey={tabConfig.defaultKey} onChange={onTabChange} items={tabConfig.tabs} /> : undefined
            }
            {
                renderActions()
            }
            {
                renderTable()
            }
            {renderAddActionInBottom()}
        </Card>
        {
            ACTION_ADD?.handler?.formItems && ACTION_ADD.handler.showType === "modal" ?
                <>
                    <Modal
                        title={ACTION_ADD.handler.title || "新增"}
                        maskClosable={false}
                        open={addModalShow}
                        onCancel={onAddModalClose}
                        onOk={onAddModalOk}
                        width={"60%"}
                        footer={actionConfig?.addModalActionRender?.(onAddModalClose, onAddModalOk)}>
                        <MyForm form={{
                            form: addForm,
                            labelCol: { span: 3 },
                            wrapperCol: { span: 20 },
                        }} items={ACTION_ADD.handler.formItems} layout={[1]} />
                    </Modal>
                </> :
                ACTION_ADD?.handler?.formItems && ACTION_ADD.handler.showType === "drawer" ?
                    <>
                        <Drawer
                            width={1000}
                            title={ACTION_ADD.handler.title || "新增"}
                            placement="right"
                            maskClosable={false}
                            onClose={onAddModalClose}
                            open={addModalShow}
                            extra={
                                actionConfig?.addModalActionRender?.(onAddModalClose, onAddModalOk) ||
                                <Space>
                                    <Button onClick={onAddModalClose}>取消</Button>
                                    <Button type="primary" onClick={onAddModalOk}>
                                        确定
                                    </Button>
                                </Space>
                            }>
                            <MyForm form={{
                                form: addForm,
                                labelCol: { span: 3 },
                                wrapperCol: { span: 20 },
                            }} items={ACTION_ADD.handler.formItems} layout={[1]} />
                        </Drawer>
                    </> : undefined
        }
        {
            ACTION_EDIT?.handler?.formItems && ACTION_EDIT.handler.showType === "modal" ?
                <>
                    <Modal
                        title={editFormDisabled ? (ACTION_VIEW?.handler?.title || "查看") : (ACTION_EDIT.handler.title || "编辑")}
                        maskClosable={false}
                        open={editModalShow}
                        onCancel={onEditModalClose}
                        onOk={onEditModalOk}
                        footer={
                            editFormDisabled ?
                                (actionConfig?.detailModalActionRender?.(currentItem, onEditModalClose, onEditModalOk)
                                    ||
                                    <Space>{renderItemActionsInDetail(currentItem)}<Button onClick={onEditModalClose}>取消</Button></Space>)
                                :
                                actionConfig?.editModalActionRender?.(currentItem, onEditModalClose, onEditModalOk)
                        }
                        width={"60%"}>
                        <MyForm form={{
                            form: editFrom,
                            labelCol: { span: 3 },
                            wrapperCol: { span: 20 },
                        }} items={ACTION_EDIT.handler.formItems} layout={[1]} readonly={editFormDisabled} />
                    </Modal>
                </> :
                ACTION_EDIT?.handler?.formItems && ACTION_EDIT.handler.showType === "drawer" ?
                    <>
                        <Drawer
                            width={1000}
                            title={editFormDisabled ? (ACTION_VIEW?.handler?.title || "查看") : (ACTION_EDIT.handler.title || "编辑")}
                            placement="right"
                            maskClosable={false}
                            onClose={onEditModalClose}
                            open={editModalShow}
                            extra={
                                <Space>
                                    {
                                        editFormDisabled ?
                                            (actionConfig?.detailModalActionRender?.(currentItem, onEditModalClose, onEditModalOk)
                                                ||
                                                <>{renderItemActionsInDetail(currentItem)}<Button onClick={onEditModalClose}>取消</Button></>)
                                            :
                                            (actionConfig?.editModalActionRender?.(currentItem, onEditModalClose, onEditModalOk)
                                                ||
                                                <>
                                                    <Button onClick={onEditModalClose}>取消</Button>
                                                    <Button type="primary" onClick={onEditModalOk}>确定</Button>
                                                </>)
                                    }

                                </Space>
                            }>
                            <MyForm form={{
                                form: editFrom,
                                labelCol: { span: 3 },
                                wrapperCol: { span: 20 },
                            }} items={ACTION_EDIT.handler.formItems} layout={[1]} readonly={editFormDisabled} />
                        </Drawer>
                    </> : undefined
        }
        <Modal
            title={currentFormAction?.handler?.title}
            maskClosable={false}
            open={customModalShow}
            onCancel={() => setCustomModalShow(false)}
            onOk={onCustomModalOk}
            width={"60%"}>
            <MyForm form={{
                form: customModalForm,
                labelCol: { span: 3 },
                wrapperCol: { span: 20 },
            }} items={currentFormAction?.handler?.formItems} layout={[1]} />
        </Modal>
        <Drawer
            width={1000}
            title={currentFormAction?.handler?.title}
            placement="right"
            maskClosable={false}
            onClose={() => setCustomDrawerShow(false)}
            open={customDrawerShow}
            extra={
                <Space>
                    <Button onClick={() => setCustomDrawerShow(false)}>取消</Button>
                    <Button type="primary" onClick={onCustomModalOk}>
                        确定
                    </Button>
                </Space>
            }>
            <MyForm form={{
                form: customDrawerFrom,
                labelCol: { span: 3 },
                wrapperCol: { span: 20 },
            }} items={currentFormAction?.handler?.formItems} layout={[1]} />
        </Drawer>
    </>
}

export default MyTable;