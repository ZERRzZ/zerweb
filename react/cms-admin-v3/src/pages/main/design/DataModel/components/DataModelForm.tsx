import adminService, { ModelMeta, OptionModel } from "@/api/adminService";
import MyForm, { MyFormItems } from "@/components/MyForm";
import { pick } from "@/utils/convert";
import { getDictOptionByCode } from "@/utils/dictUtils";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Divider, Drawer, Form, message, Modal, Popconfirm, Space, Table } from "antd";
import { useEffect, useState } from "react";
import { renderFieldDescription } from "./common";

interface DataModelFormProps {
    visible?: boolean;
    modelId?: string;
    onFinish: (changed: boolean) => void;
}
const DataModelForm: React.FC<DataModelFormProps> = ({ visible, modelId, onFinish }: DataModelFormProps) => {
    const initProperties = [
        { name: 'id', description: 'ID', type: 'long', primary_key: true, auto_increment: true, ignore: ['insert'], default_order_by: 'desc' },
        { name: 'deleted', description: '删除标记', type: 'boolean', ignore: ['update'] },
        { name: 'create_time', description: '创建时间', type: 'Date', ignore: ['update', 'insert'] },
        { name: 'update_time', description: '更新时间', type: 'Date', ignore: ['update', 'insert'] }
    ]
    const propertyTypeOptions = [
        { label: '字符串', value: 'String' },
        { label: '整型', value: 'int' },
        { label: '长整型', value: 'long' },
        { label: '字节型', value: 'byte' },
        { label: '布尔型', value: 'boolean' },
        { label: '浮点型', value: 'float' },
        { label: '双精度浮点型', value: 'double' },
        { label: '时间', value: 'Date' },
    ]
    const propertyIgnoreOptions = [
        { label: '查询', value: 'select' },
        { label: '列表查询', value: 'list' },
        { label: '更新', value: 'update' },
        { label: '新增', value: 'insert' }
    ]
    const orderByOptions = [
        { label: '无', value: '' },
        { label: '顺序', value: 'asc' },
        { label: '倒序', value: 'desc' }
    ];
    const converterOptions = [
        { label: '无', value: '' },
        { label: '字典', value: 'DictionaryColumnConverterImpl' },
        { label: '分类', value: 'CategoryColumnConverterImpl' },
    ]
    const findNameByValueInOptions = (options: any[], value) => {
        return options.find(o => o.value === value)?.label || '';
    }
    const [generatorOptions, setGeneratorOptions] = useState<OptionModel[]>([]);
    const [open, setOpen] = useState<boolean>(false);
    const [modelInfo, setModelInfo] = useState<any>({});
    const [properties, setProperties] = useState<any[]>([]);
    const [propertyModalShow, setPropertyModalShow] = useState<boolean>(false);
    const [propertyConverterModalShow, setPropertyConverterModalShow] = useState<boolean>(false);
    const [propertyQueryModalShow, setPropertyQueryModalShow] = useState<boolean>(false);
    const [currentProperty, setCurrentProperty] = useState<any>();
    const [modelForm] = Form.useForm();
    const [propertyForm] = Form.useForm();
    const [propertyConverterForm] = Form.useForm();
    const [propertyQueryForm] = Form.useForm();
    const modelFormItems: MyFormItems[] = [
        {
            type: 'text',
            item: { name: 'name', label: '模型名称', rules: [{ required: true, message: '请输入' }] }
        },
        {
            type: 'text',
            item: { name: 'description', label: '模型说明', rules: [{ required: true, message: '请输入' }] }
        }, {
            type: 'text',
            item: { name: 'table_name', label: '表名称', rules: [{ required: true, message: '请输入' }] }
        },
        {
            type: 'text',
            item: { name: 'table_description', label: '表说明', rules: [{ required: true, message: '请输入' }] }
        },
        {
            type: 'switch',
            item: { name: 'auto_create', label: '自动创建表', rules: [{ required: true, message: '请输入' }] }
        },
    ];
    const propertyFormItems: MyFormItems[] = [
        {
            type: 'text',
            item: { name: 'name', label: '字段名称', rules: [{ required: true, message: '请输入' }] }
        },
        {
            type: 'text',
            item: { name: 'description', label: '字段说明', rules: [{ required: true, message: '请输入' }] }
        },
        {
            type: 'select',
            item: { name: 'type', label: '字段类型', rules: [{ required: true, message: '请输入' }] },
            option: {
                options: propertyTypeOptions
            }
        },
        {
            type: 'number',
            item: { name: 'length', label: '字段长度' },
        },
        {
            type: 'switch',
            item: { name: 'primary_key', label: '是否主键' },
        },
        {
            type: 'switch',
            item: { name: 'auto_increment', label: '是否自增' },
        },
        {
            type: 'select',
            item: { name: 'ignore', label: '字段忽略' },
            option: { mode: 'multiple', options: propertyIgnoreOptions }
        },
        {
            type: 'select',
            item: { name: 'default_order_by', label: '默认排序' },
            option: { options: orderByOptions }
        },
        {
            type: 'switch',
            item: { name: 'notexists', label: '是否虚字段' }
        },
        {
            type: 'oneLevelOpt',
            item: { name: 'generator', label: '生成器' },
            option: { code: "value_generator", option: { style: { width: 160 } } }
        },
    ];
    const propertyConverterFormItems: MyFormItems[] = [
        {
            type: 'select',
            item: { name: 'convert_from', label: '来源字段' },
            option: {
                options: properties.map(item => ({ label: item.notexists ? (item.description + "（虚）") : item.description, value: item.name }))
            }
        },
        {
            type: 'select',
            item: { name: 'convert_class_name', label: '转化类型' },
            option: {
                options: converterOptions
            }
        },
        {
            type: 'text',
            item: { name: 'convert_code', label: '转化编码' }
        },
    ];
    const propertyQueryFormItems: MyFormItems[] = [
        {
            type: 'switch',
            item: { name: 'required', label: '是否必须' }
        },
        {
            type: 'switch',
            item: { name: 'allow_order_by', label: '是否支持排序' }
        },
        {
            type: 'switch',
            item: { name: 'allow_equal', label: '是否支持等于筛选' }
        },
        {
            type: 'switch',
            item: { name: 'allow_in', label: '是否支持包含筛选' }
        },
        {
            type: 'switch',
            item: { name: 'allow_range', label: '是否支持范围筛选' }
        },
        {
            type: 'switch',
            item: { name: 'allow_left_like', label: '是否支持左模糊筛选' }
        },
        {
            type: 'switch',
            item: { name: 'allow_right_like', label: '是否支持右模糊筛选' }
        },
        {
            type: 'switch',
            item: { name: 'allow_like', label: '是否支持模糊筛选' }
        },
        {
            type: 'text',
            item: { name: 'fixed_value', label: '固定值' }
        },
    ];
    const propertyColumns = [
        { title: '字段名称', dataIndex: 'name', key: 'name', width: 110, fixed: 'left' as 'left' },
        { title: '字段说明', dataIndex: 'description', key: 'description', render: renderFieldDescription, width: 110, fixed: 'left' as 'left' },
        { title: '字段类型', dataIndex: 'type', key: 'type', width: 75 },
        { title: '字段长度', dataIndex: 'length', key: 'length', width: 75 },
        { title: '是否主键', dataIndex: 'primary_key', key: 'primary_key', render: (text, record) => text ? '是' : '', width: 75 },
        { title: '是否自增', dataIndex: 'auto_increment', key: 'auto_increment', render: (text, record) => text ? '是' : '', width: 75 },
        {
            title: '字段忽略', dataIndex: 'ignore', key: 'ignore', render: (text, record) => {
                return text?.map(i => findNameByValueInOptions(propertyIgnoreOptions, i)).join("，") || ''
            }, width: 90
        },
        {
            title: '默认排序', dataIndex: 'default_order_by', key: 'default_order_by', render: (text, record) => {
                return findNameByValueInOptions(orderByOptions, text);
            }, width: 75
        },
        { title: '是否虚字段', dataIndex: 'notexists', key: 'notexists', render: (text, record) => text ? '是' : '', width: 90 },
        {
            title: '生成器', dataIndex: 'generator', key: 'generator', render: (text, record) => {
                return text ? generatorOptions.find(g => g.value === text)?.title : ''
            }
        },
        {
            title: '操作', key: 'operater', render: (text, record) => {
                return renderPropertyAction(record);
            }, width: 170, fixed: 'right' as 'right'
        }
    ]

    const renderPropertyAction = (item) => {
        const editBtn = <a key="edit" onClick={() => onPropertyEditClick(item)}>编辑</a>;
        const converterBtn = <a key="converter" onClick={() => onPropertyConverterClick(item)}>转化配置</a>;
        const queryBtn = <a key="query" onClick={() => onPropertyQueryClick(item)}>筛选配置</a>;
        const deleteBtn = <Popconfirm
            placement="topRight"
            title={`确认删除吗？`}
            onConfirm={() => onPropertyDeleteClick(item)}
            okText="确认"
            cancelText="取消"
            key="delete">
            <a className="danger-operation">删除</a>
        </Popconfirm>;
        let actions = [editBtn, <Divider key="divider1" type="vertical" />];
        if (item.notexists) {
            actions.push(converterBtn);
        } else {
            actions.push(queryBtn);
        }
        actions.push(<Divider key="divider2" type="vertical" />);
        actions.push(deleteBtn);
        return actions;
    }

    const onPropertyEditClick = (item) => {
        setCurrentProperty(item);
        setPropertyModalShow(true);
        propertyForm.resetFields();
        propertyForm.setFieldsValue(item);
    }

    const onPropertyConverterClick = (item) => {
        setCurrentProperty(item);
        setPropertyConverterModalShow(true);
        propertyConverterForm.resetFields();
        propertyConverterForm.setFieldsValue(pick(item, propertyConverterFormItems.map(item => item.item?.name || '')));
    }

    const onPropertyQueryClick = (item) => {
        setCurrentProperty(item);
        setPropertyQueryModalShow(true);
        propertyQueryForm.resetFields();
        propertyQueryForm.setFieldsValue(pick(item, propertyQueryFormItems.map(item => item.item?.name || '')));
    }

    const onPropertyDeleteClick = (item) => {
        let newData = [...properties];
        const index = newData.indexOf(item);
        newData.splice(index, 1);
        setProperties(newData);
    }

    const onPropertyAddClick = () => {
        setCurrentProperty(undefined);
        propertyForm.resetFields();
        setPropertyModalShow(true);
    }

    const onPropertyModalOk = () => {
        propertyForm.validateFields().then(values => {
            let newData = [...properties];
            if (currentProperty) {
                if (newData.filter(item => item != currentProperty).find(item => item.name === values.name)) {
                    message.warning(`已经存在${values.name}字段！`);
                    return;
                }
                let newProperty = { ...currentProperty, ...values };
                const index = newData.indexOf(currentProperty);
                newData.splice(index, 1, newProperty);
            } else {
                if (newData.find(item => item.name === values.name)) {
                    message.warning(`已经存在${values.name}字段！`);
                    return;
                }
                newData.push(values);
            }
            setProperties(newData);
            setPropertyModalShow(false);
        })

    }

    const onPropertyConverterModalOk = () => {
        propertyConverterForm.validateFields().then(values => {
            let newData = [...properties];
            if (currentProperty) {
                let newProperty = { ...currentProperty, ...values };
                const index = newData.indexOf(currentProperty);
                newData.splice(index, 1, newProperty);
            }
            setProperties(newData);
            setPropertyConverterModalShow(false);
        })
    }

    const onPropertyQueryModalOk = () => {
        propertyQueryForm.validateFields().then(values => {
            let newData = [...properties];
            if (currentProperty) {
                let newProperty = { ...currentProperty, ...values };
                const index = newData.indexOf(currentProperty);
                newData.splice(index, 1, newProperty);
            }
            setProperties(newData);
            setPropertyQueryModalShow(false);
        })
    }

    const onModalOk = () => {
        modelForm.validateFields().then(values => {
            let modelData = pick(values, ['name', 'description']) || {};
            modelData['model_table'] = { name: values['table_name'], description: values['table_description'], auto_create: values['auto_create'] };
            modelData['property_meta_list'] = properties.map(item => {
                let newItem = pick(item, ['name', 'description', 'type']) || {};
                let column = pick(item, ['primary_key', 'auto_increment', 'generator', 'length', 'convert_from', 'convert_code', 'convert_class_name', 'default_order_by']) || {};
                column['exists'] = item.notexists == undefined ? true : !item.notexists;
                column['ignore_select'] = item.ignore ? item.ignore.includes('select') : false;
                column['ignore_list'] = item.ignore ? item.ignore.includes('list') : false;
                column['ignore_update'] = item.ignore ? item.ignore.includes('update') : false;
                column['ignore_insert'] = item.ignore ? item.ignore.includes('insert') : false;
                let query = pick(item, propertyQueryFormItems.map(item => item.item?.name || ''))
                newItem['model_column'] = column;
                newItem['model_query'] = query;
                return newItem;
            });
            adminService.ms.design.modelMeta.save({ id: modelId }, modelData as ModelMeta).then(res => {
                message.success('保存成功！');
                setOpen(false);
                onFinish(true);
            }, (reason) => {
                message.warning(reason.message || reason.msg || '保存失败，请重试！');
            })
        })
    }

    const onModalClose = () => {
        setOpen(false);
        onFinish(false);
    }

    useEffect(() => {
        getDictOptionByCode('value_generator').then(res => {
            setGeneratorOptions(res);
        })
    }, [])

    useEffect(() => {
        setOpen(visible == undefined ? false : visible);
    }, [visible])

    useEffect(() => {
        if (modelId) {
            adminService.ms.design.modelMeta.get({ id: modelId }).then(res => {
                if (res && res.meta_data) {
                    const model = JSON.parse(res.meta_data);
                    const newModelInfo = pick(model, ['name', 'description']) || {};
                    newModelInfo['table_name'] = model.model_table.name;
                    newModelInfo['table_description'] = model.model_table.description;
                    newModelInfo['auto_create'] = model.model_table.auto_create;
                    setModelInfo(newModelInfo);
                    setProperties(model.property_meta_list.map(item => {
                        const newItem = { ...item, ...item.model_query, ...pick(item.model_column, ['primary_key', 'auto_increment', 'generator', 'length', 'default_order_by', 'convert_from', 'convert_code', 'convert_class_name']) };
                        newItem['notexists'] = item.model_column?.exists == undefined ? false : !item.model_column.exists;
                        const ignore: string[] = [];
                        item.model_column?.ignore_select && ignore.push('select');
                        item.model_column?.ignore_list && ignore.push('list');
                        item.model_column?.ignore_update && ignore.push('update');
                        item.model_column?.ignore_insert && ignore.push('insert');
                        newItem['ignore'] = ignore;
                        return newItem;
                    }))
                }
            })
        } else {
            setModelInfo({});
            setProperties(initProperties);
        }
    }, [modelId])

    useEffect(() => {
        modelForm.resetFields();
        modelForm.setFieldsValue(modelInfo);
    }, [modelInfo])


    return <Drawer
        width={1000}
        title={"数据模型配置"}
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
        <MyForm
            form={{
                form: modelForm,
                labelCol: { span: 8 },
                wrapperCol: { span: 16 },
            }} items={modelFormItems} layout={[3]}
        />
        <Card title="模型字段" bordered={false} style={{ boxShadow: "none" }} bodyStyle={{ paddingLeft: 0, paddingRight: 0, paddingTop: 8, paddingBottom: 8 }}>
            <Table
                columns={propertyColumns}
                dataSource={properties}
                rowKey="name"
                size="small"
                pagination={false}
                scroll={{ x: 1050 }} />
            <div className="my-table-add-btn-bottom">
                <Button type="dashed" onClick={onPropertyAddClick} icon={<PlusOutlined />}>新增字段</Button></div>
        </Card>
        <Modal
            title={"编辑字段"}
            maskClosable={false}
            open={propertyModalShow}
            onCancel={() => setPropertyModalShow(false)}
            onOk={onPropertyModalOk}
            width={"60%"}>
            <MyForm form={{
                form: propertyForm,
                labelCol: { span: 3 },
                wrapperCol: { span: 20 },
            }} items={propertyFormItems} layout={[1]} />
        </Modal>
        <Modal
            title={"转化配置"}
            maskClosable={false}
            open={propertyConverterModalShow}
            onCancel={() => setPropertyConverterModalShow(false)}
            onOk={onPropertyConverterModalOk}
            width={"60%"}>
            <MyForm form={{
                form: propertyConverterForm,
                labelCol: { span: 3 },
                wrapperCol: { span: 20 },
            }} items={propertyConverterFormItems} layout={[1]} />
        </Modal>
        <Modal
            title={"筛选配置"}
            maskClosable={false}
            open={propertyQueryModalShow}
            onCancel={() => setPropertyQueryModalShow(false)}
            onOk={onPropertyQueryModalOk}
            width={400}>
            <MyForm form={{
                form: propertyQueryForm,
                labelCol: { span: 12 },
                wrapperCol: { span: 10 },
            }} items={propertyQueryFormItems} layout={[1]} />
        </Modal>
    </Drawer>
}

export default DataModelForm;