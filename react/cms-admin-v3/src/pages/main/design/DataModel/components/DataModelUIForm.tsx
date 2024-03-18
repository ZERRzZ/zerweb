import adminService, { ModelConfig } from "@/api/adminService";
import MyForm, { MyFormItems } from "@/components/MyForm";
import { pick } from "@/utils/convert";
import { Button, Drawer, Form, Input, InputNumber, message, Modal, Select, Space, Switch, Table, Tabs } from "antd";
import { useEffect, useState } from "react";
import { renderFieldDescription } from "./common";
import "./model.scss"

interface DataModelUIFormProps {
    visible?: boolean;
    modelId?: string;
    onFinish: (changed: boolean) => void;
}
const DataModelUIForm: React.FC<DataModelUIFormProps> = ({ visible, modelId, onFinish }: DataModelUIFormProps) => {
    const [properties, setProperties] = useState<any[]>([]);
    const [open, setOpen] = useState<boolean>(false);
    const [categoryOptions, setCategoryOptions] = useState<any[]>([]);
    const [dictOptions, setDictOptions] = useState<any[]>([]);
    const [pemOptions, setPemOptions] = useState<any[]>([]);
    const [listConfigFormValues, setListConfigFormValues] = useState<any>({});
    const [queryConfigFormValues, setQueryConfigFormValues] = useState<any>({});
    const [formConfigFormValues, setFormConfigFormValues] = useState<any>({});
    const [tabConfigFormValues, setTabConfigFormValues] = useState<any>({});
    const [actionConfigFormValues, setActionConfigFormValues] = useState<any>({});
    const [statusCode, setStatusCode] = useState<string>('');
    const [listConfigForm] = Form.useForm();
    const [queryConfigForm] = Form.useForm();
    const [tabConfigForm] = Form.useForm();
    const [formConfigForm] = Form.useForm();
    const [actionConfigForm] = Form.useForm();
    const queryFormTypeOptions = [
        { label: '输入框', value: 'text' },
        { label: '字典选项', value: 'oneLevelOpt' },
        { label: '分类选项', value: 'multiLevelOpt' },
        { label: '日期范围', value: 'dateRange' },
    ]

    const formTypeOptions = [
        { label: '输入框', value: 'text' },
        { label: '密码输入框', value: 'password' },
        { label: '区域输入框', value: 'textarea' },
        { label: '数字输入框', value: 'number' },
        { label: '开关', value: 'switch' },
        { label: '上传图片', value: 'myImageUpload' },
        { label: '上传视频', value: 'myVideoUpload' },
        { label: '上传文档', value: 'myDocUpload' },
        { label: '日期', value: 'date' },
        { label: '时间', value: 'dateTime' },
        { label: '字典选项-单选', value: 'oneLevelOpt' },
        { label: '字典选项-多选', value: 'oneLevelOptM' },
        { label: '分类选项', value: 'multiLevelOpt' },
        { label: '富文本', value: 'editor' },
    ]

    const renderTypeOptions = [
        { label: '默认', value: '' },
        { label: '标签', value: 'tag' },
        { label: '图片', value: 'image' },
        { label: '链接', value: 'link' },
    ]

    const onModalOk = () => {
        tabConfigFormValues.tabs && tabConfigFormValues.tabs.forEach(t => {
            if (t['key'] == undefined) {
                t['key'] = '';
            }
        })
        const data = {
            id: modelId,
            list_config: JSON.stringify(listConfigFormValues),
            query_config: JSON.stringify(queryConfigFormValues),
            tab_config: JSON.stringify(tabConfigFormValues),
            form_config: JSON.stringify(formConfigFormValues),
            action_config: JSON.stringify(actionConfigFormValues)
        } as ModelConfig;
        adminService.ms.design.modelMeta.ui.save(data).then(res => {
            message.success('保存成功！');
            setOpen(false);
            onFinish(true);
        }, (reason) => {
            message.warning(reason.message || reason.msg || '保存失败，请重试！');
        })
    }

    const onModalClose = () => {
        setOpen(false);
        onFinish(false);
    }

    useEffect(() => {
        adminService.ms.category.getOption({ level: 1, code: 'root', type: 2 }).then(res => {
            setCategoryOptions(res.children || []);
        })
        adminService.ms.dictionary.list({ page_no: 1, page_size: 100 }).then(res => {
            setDictOptions(res.list?.map(item => ({ label: item.name, value: item.code })) || []);
        })
        adminService.ms.pemResource.list({page_no: -1, type: 1}).then(res => {
            if (res && res.list) {
                setPemOptions(res.list.map(r => ({label: r.name, value: r.identity})));
            }
        })
    }, [])

    useEffect(() => {
        setOpen(visible == undefined ? false : visible);
    }, [visible])

    useEffect(() => {
        if (modelId) {
            listConfigForm.resetFields();
            queryConfigForm.resetFields();
            tabConfigForm.resetFields();
            formConfigForm.resetFields();
            actionConfigForm.resetFields();
            adminService.ms.design.modelMeta.get({ id: modelId }).then(res => {
                if (res && res.meta_data) {
                    const model = JSON.parse(res.meta_data);
                    setProperties(model.property_meta_list.map(item => {
                        let newItem = { ...item, ...item.model_query, ...pick(item.model_column, ['primary_key', 'length', 'default_order_by', 'convert_from', 'convert_code', 'conver_class_name']) };
                        newItem['notexists'] = item.model_column?.exists == undefined ? false : !item.model_column.exists;
                        let ignore: string[] = [];
                        item.model_column?.ignore_select && ignore.push('select');
                        item.model_column?.ignore_list && ignore.push('list');
                        item.model_column?.ignore_update && ignore.push('update');
                        item.model_column?.ignore_insert && ignore.push('insert');
                        newItem['ignore'] = ignore;
                        if (newItem.name === 'status_name' && newItem.convert_code) {
                            setStatusCode(newItem.convert_code);
                        }
                        return newItem;
                    }))
                    adminService.ms.design.modelMeta.ui.get({ id: modelId }).then(data => {
                        if (data) {
                            const listFormValues = (data.list_config && JSON.parse(data.list_config)) || {};
                            const queryFormValues = (data.query_config && JSON.parse(data.query_config)) || {};
                            const tabFormValues = (data.tab_config && JSON.parse(data.tab_config)) || {};
                            const formFormValues = (data.form_config && JSON.parse(data.form_config)) || {};
                            const actionFormValues = (data.action_config && JSON.parse(data.action_config)) || {};
                            listConfigForm.setFieldsValue(listFormValues);
                            setListConfigFormValues({ ...listFormValues });
                            queryConfigForm.setFieldsValue(queryFormValues);
                            setQueryConfigFormValues({ ...queryFormValues });
                            tabConfigForm.setFieldsValue(tabFormValues);
                            setTabConfigFormValues({...tabFormValues})
                            formConfigForm.setFieldsValue(formFormValues);
                            setFormConfigFormValues({ ...formFormValues });
                            actionConfigForm.setFieldsValue(actionFormValues);
                            setActionConfigFormValues({...actionFormValues})
                        }
                    })
                }
            })

        }
    }, [modelId])

    const onListConfigFormValuesChange = (changedValues, values) => {
        setListConfigFormValues({ ...values });
    }

    const getListIndexDisabled = (item) => {
        return listConfigFormValues[`${item.name}.list.enabled`] ? false : true;
    }

    const onQueryConfigFormValuesChange = (changedValues, values) => {
        Object.keys(changedValues).forEach(item => {
            if (item.endsWith('.query.type')) {
                queryConfigForm.setFieldValue(item.substring(0, item.length - '.query.type'.length) + '.query.cond', undefined);
                queryConfigForm.setFieldValue(item.substring(0, item.length - '.query.type'.length) + '.query.source', undefined);
            }
        });
        setQueryConfigFormValues({ ...values });
    }

    const getQueryCondOptions = (item) => {
        if (queryConfigFormValues[`${item.name}.query.type`] === 'dateRange') {
            return [
                { label: '范围', value: 'range' },
            ]
        } else if (queryConfigFormValues[`${item.name}.query.type`]) {
            return [
                { label: '等于', value: 'equal' },
                { label: '左模糊', value: '_like_l_' },
                { label: '右模糊', value: '_like_r_' },
                { label: '模糊', value: '_like_' },
            ];
        } else {
            return [];
        }
    }

    const getQuerySourceOptions = (item) => {
        if (queryConfigFormValues[`${item.name}.query.type`] === 'oneLevelOpt') {
            return dictOptions;
        } else if (queryConfigFormValues[`${item.name}.query.type`] === 'multiLevelOpt') {
            return categoryOptions;
        } else {
            return [];
        }
    }

    const getQueryTypeDisabled = (item) => {
        return queryConfigFormValues[`${item.name}.query.enabled`] ? false : true;
    }

    const getQueryCondDisabled = (item) => {
        return queryConfigFormValues[`${item.name}.query.enabled`] && queryConfigFormValues[`${item.name}.query.type`] ? false : true;
    }

    const getQuerySourceDisabled = (item) => {
        return queryConfigFormValues[`${item.name}.query.enabled`] &&
            (queryConfigFormValues[`${item.name}.query.type`] === 'oneLevelOpt'
                || queryConfigFormValues[`${item.name}.query.type`] === 'multiLevelOpt') ? false : true;
    }

    const onFormConfigFormValuesChange = (changedValues, values) => {
        Object.keys(changedValues).forEach(item => {
            if (item.endsWith('.form.type')) {
                formConfigForm.setFieldValue(item.substring(0, item.length - '.form.type'.length) + '.form.source', undefined);
            }
        });
        setFormConfigFormValues({ ...values });
    }

    const getFormIndexDisabled = (item) => {
        return formConfigFormValues[`${item.name}.form.enabled`] ? false : true;
    }

    const getFormSourceDisabled = (item) => {
        return formConfigFormValues[`${item.name}.form.enabled`] &&
            (formConfigFormValues[`${item.name}.form.type`] === 'oneLevelOpt'
                || formConfigFormValues[`${item.name}.form.type`] === 'oneLevelOptM'
                || formConfigFormValues[`${item.name}.form.type`] === 'multiLevelOpt') ? false : true;
    }

    const getFormConfigSourceOptions = (item) => {
        if (formConfigFormValues[`${item.name}.form.type`] === 'oneLevelOpt' || formConfigFormValues[`${item.name}.form.type`] === 'oneLevelOptM') {
            return dictOptions;
        } else if (formConfigFormValues[`${item.name}.form.type`] === 'multiLevelOpt') {
            return categoryOptions;
        } else {
            return [];
        }
    }

    const onTabConfigFormValuesChange = (changedValues, values) => {
        setTabConfigFormValues({ ...values });
    }

    const onActionConfigFormValuesChange = (changedValues, values) => {
        setActionConfigFormValues({ ...values });
    }

    const renderListConfigForm = () => {
        return <Form className="model-list-config-form" form={listConfigForm} onValuesChange={onListConfigFormValuesChange}>
            <Table
                columns={[
                    { title: '字段', dataIndex: 'description', key: 'description', width: 120, render: renderFieldDescription },
                    {
                        title: '列表展示', key: 'list.enabled', render: (text, record) => {
                            return <Form.Item name={`${record.name}.list.enabled`} valuePropName="checked">
                                <Switch />
                            </Form.Item>;
                        }
                    },
                    {
                        title: '列表序号', key: 'list.index', render: (text, record) => {
                            return <Form.Item name={`${record.name}.list.index`}>
                                <InputNumber disabled={getListIndexDisabled(record)} />
                            </Form.Item>;
                        }
                    },
                    {
                        title: '列表宽度', key: 'list.width', render: (text, record) => {
                            return <Form.Item name={`${record.name}.list.width`}>
                                <InputNumber disabled={getListIndexDisabled(record)} />
                            </Form.Item>;
                        }
                    },
                    {
                        title: '展现形式', key: 'list.render', render: (text, record) => {
                            return <Form.Item name={`${record.name}.list.render`}>
                                <Select disabled={getListIndexDisabled(record)} options={renderTypeOptions} />
                            </Form.Item>;
                        }
                    },
                ]}
                dataSource={properties}
                pagination={false}
                size="small"
                rowKey="name"
            />

        </Form>;
    }

    const renderQueryConfigForm = () => {
        return <Form className="model-query-config-form" form={queryConfigForm} onValuesChange={onQueryConfigFormValuesChange}>
            <Table
                columns={[
                    { title: '字段', dataIndex: 'description', key: 'description', width: 120, render: renderFieldDescription },
                    {
                        title: '筛选展示', key: 'query.enabled', render: (text, record) => {
                            return <Form.Item name={`${record.name}.query.enabled`} valuePropName="checked">
                                <Switch />
                            </Form.Item>;
                        }, width: 80
                    },
                    {
                        title: '筛选序号', key: 'query.index', render: (text, record) => {
                            return <Form.Item name={`${record.name}.query.index`}>
                                <InputNumber disabled={getQueryTypeDisabled(record)} style={{ width: 60 }} />
                            </Form.Item>;
                        }, width: 80
                    },
                    {
                        title: '筛选组件', key: 'query.type', render: (text, record) => {
                            return <Form.Item name={`${record.name}.query.type`}>
                                <Select options={queryFormTypeOptions} disabled={getQueryTypeDisabled(record)} />
                            </Form.Item>;
                        }
                    },
                    {
                        title: '组件宽度', key: 'query.width', render: (text, record) => {
                            return <Form.Item name={`${record.name}.query.width`}>
                                <InputNumber disabled={getQueryTypeDisabled(record)} style={{ width: 60 }} />
                            </Form.Item>;
                        }, width: 80
                    },
                    {
                        title: '筛选条件', key: 'query.cond', render: (text, record) => {
                            return <Form.Item name={`${record.name}.query.cond`}>
                                <Select options={getQueryCondOptions(record)} disabled={getQueryCondDisabled(record)} />
                            </Form.Item>;
                        }
                    },
                    {
                        title: '筛选数据来源', key: 'query.source', render: (text, record) => {
                            return <Form.Item name={`${record.name}.query.source`}>
                                <Select options={getQuerySourceOptions(record)} disabled={getQuerySourceDisabled(record)} />
                            </Form.Item>;
                        }
                    },
                ]}
                dataSource={properties}
                pagination={false}
                size="small"
                rowKey="name"
            />

        </Form>;
    }

    const renderTabConfigForm = () => {
        return <MyForm
            form={{
                form: tabConfigForm,
                labelCol: { span: 3 },
                wrapperCol: { span: 20 },
                onValuesChange: onTabConfigFormValuesChange
            }}
            items={[
                { type: 'select', item: { name: 'name', label: '选择字段' }, option: { options: properties.filter(p => p.notexists ? false : true).map(p => ({ label: p.description, value: p.name })) } },
                { type: 'text', item: { name: 'defaultKey', label: '默认值' } },
                {
                    type: 'list',
                    list: {
                        name: 'tabs',
                        label: 'Tab选项',
                        items: [
                            {
                                type: 'text', item: { name: 'label', label: 'Tab名称' }
                            },
                            {
                                type: 'text', item: { name: 'key', label: 'Tab值' }
                            }
                        ]
                    }
                }
            ]}
            layout={[1]}
        />
    }

    const renderFormConfigForm = () => {
        return <Form className="model-form-config-form" form={formConfigForm} onValuesChange={onFormConfigFormValuesChange}>
            <Table
                columns={[
                    { title: '字段', dataIndex: 'description', key: 'description', width: 120, render: renderFieldDescription },
                    {
                        title: '表单展示', key: 'form.enabled', render: (text, record) => {
                            return <Form.Item name={`${record.name}.form.enabled`} valuePropName="checked">
                                <Switch />
                                </Form.Item>;
                        }, width: 80
                    },
                    {
                        title: '展示序号', key: 'form.index', render: (text, record) => {
                            return <Form.Item name={`${record.name}.form.index`}>
                                <InputNumber disabled={getFormIndexDisabled(record)} style={{ width: 60 }} />
                                </Form.Item>;
                        }, width: 80
                    },
                    {
                        title: '组件', key: 'form.type', render: (text, record) => {
                            return <Form.Item name={`${record.name}.form.type`}>
                                <Select options={formTypeOptions} disabled={getFormIndexDisabled(record)} />
                                </Form.Item>;
                        }, width: 120
                    },
                    {
                        title: '组件宽度', key: 'form.width', render: (text, record) => {
                            return <Form.Item name={`${record.name}.form.width`}>
                                <InputNumber disabled={getFormIndexDisabled(record)} style={{ width: 60 }} />
                                </Form.Item>;
                        }, width: 80
                    },
                    {
                        title: '数据来源', key: 'form.source', render: (text, record) => {
                            return <Form.Item name={`${record.name}.form.source`}>
                                <Select options={getFormConfigSourceOptions(record)} disabled={getFormSourceDisabled(record)} />
                                </Form.Item>;
                        }, width: 120
                    },
                    {
                        title: '是否必须', key: 'form.required', render: (text, record) => {
                            return <Form.Item name={`${record.name}.form.required`} valuePropName="checked">
                                <Switch disabled={getFormIndexDisabled(record)} style={{ width: 60 }} />
                                </Form.Item>;
                        }, width: 80
                    },
                    {
                        title: '字数限制', key: 'form.length', render: (text, record) => {
                            return <Form.Item name={`${record.name}.form.length`} valuePropName="checked">
                                <InputNumber disabled={getFormIndexDisabled(record)} style={{ width: 60 }} />
                                </Form.Item>;
                        }, width: 80
                    },
                    {
                        title: '正则校验', key: 'form.regex', render: (text, record) => {
                            return <Form.Item name={`${record.name}.form.regex`}>
                                <Input disabled={getFormIndexDisabled(record)} />
                                </Form.Item>;
                        }
                    },
                    {
                        title: '校验提示', key: 'form.msg', render: (text, record) => {
                            return <Form.Item name={`${record.name}.form.msg`}>
                                <Input disabled={getFormIndexDisabled(record)} />
                                </Form.Item>;
                        }
                    },
                ]}
                dataSource={properties}
                pagination={false}
                size="small"
                rowKey="name"
            />

        </Form>;
    }

    const renderActionConfigForm = () => {
        return <MyForm
            form={{
                form: actionConfigForm,
                labelCol: { span: 2 },
                wrapperCol: { span: 22 },
                onValuesChange: onActionConfigFormValuesChange,
            }}
            items={[
                { type: 'switch', item: { name: 'add', label: '新增', labelCol: { span: 12 }, wrapperCol: { span: 4 } }, span: 4 },
                { type: 'select', item: { name: 'add_pem', label: '权限要求', labelCol: { span: 2 }, wrapperCol: { span: 4 } }, option: { options: pemOptions }, span: 20 },
                { type: 'switch', item: { name: 'import', label: '导入', labelCol: { span: 12 }, wrapperCol: { span: 4 } }, span: 4 },
                { type: 'select', item: { name: 'import_pem', label: '权限要求', labelCol: { span: 2 }, wrapperCol: { span: 4 } }, option: { options: pemOptions }, span: 20 },
                { type: 'switch', item: { name: 'export', label: '导出', labelCol: { span: 12 }, wrapperCol: { span: 4 } }, span: 4 },
                { type: 'select', item: { name: 'export_pem', label: '权限要求', labelCol: { span: 2 }, wrapperCol: { span: 4 } }, option: { options: pemOptions }, span: 20 },
                {
                    type: 'list',
                    list: {
                        name: 'itemActions',
                        label: '行操作',
                        tooltip: '只支持查看、编辑、删除和变更状态的操作',
                        items: [
                            {
                                type: 'text', item: { name: 'title', label: '操作名称',style: {width: 90} }, option: {  }
                            },
                            {
                                type: 'text', item: { name: 'key', label: '操作标识',style: {width: 90}, tooltip: '固定标识：查看为view、编辑为edit、删除为delete' }, option: {  }
                            },
                            {
                                type: 'switch', item: { name: 'confirm', label: '再次确认',style: {width: 60} }, option: { }
                            },
                            {
                                type: 'switch', item: { name: 'batch', label: '支持批量',style: {width: 60} }, option: { }
                            },
                            {
                                type: 'oneLevelOpt', item: { name: 'before_status', label: '操作前状态' }, option: { code: statusCode, option:{style: {width: 260}, mode: 'multiple'} }
                            },
                            {
                                type: 'oneLevelOpt', item: { name: 'after_status', label: '操作后状态' }, option: { code: statusCode, option:{style: {width: 90}} }
                            },
                            {
                                type: 'select', item: { name: 'pem', label: '权限' }, option: { options: pemOptions, style: {width: 120} }
                            }
                        ]
                    }
                }
            ]}
            layout={[1]}
        />
    }

    return <Drawer
        width={1200}
        title={"UI配置"}
        placement="right"
        maskClosable={false}
        onClose={onModalClose}
        open={open}
        extra={
            <Space>
                <Button onClick={onModalClose}>取消</Button>
                <Button type="primary" onClick={onModalOk}>
                    确定
                </Button>
            </Space>
        }>
        <Tabs items={
            [
                {
                    key: '1',
                    label: '列表配置',
                    children: renderListConfigForm()
                },
                {
                    key: '2',
                    label: '筛选配置',
                    children: renderQueryConfigForm()
                },
                {
                    key: '3',
                    label: '列表Tab配置',
                    children: renderTabConfigForm()
                },
                {
                    key: '4',
                    label: '表单配置',
                    children: renderFormConfigForm()
                },
                {
                    key: '5',
                    label: '操作配置',
                    children: renderActionConfigForm()
                }
            ]
        }
            tabBarStyle={{ marginBottom: 24 }}
        />

    </Drawer>
}

export default DataModelUIForm;