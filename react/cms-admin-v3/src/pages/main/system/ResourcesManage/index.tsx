import { MyFormItems } from "@/components/MyForm";
import MyTable, { MyTableAction } from "@/components/MyTable";
import { PlusOutlined } from "@ant-design/icons";
import adminService from "@/api/adminService";

const ResourceManagePage: React.FC = () => {
    const resourceTypeOptions = [
        { value: 1, label: "功能" },
        // { value: 2, label: "数据" }
    ]

    const queryFormItems: MyFormItems[] = [
        {
            type: 'oneLevelOpt',
            item: { name: 'group', label: '所属模块' },
            option: { code: 'resource_group', option: { style: { width: 160 } } }
        },
        {
            type: 'text',
            item: { name: 'name', label: '资源名称' }
        },
    ];

    const columns = [
        {
            title: '资源名称',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: '资源标识',
            dataIndex: 'identity',
            key: 'identity'
        },
        {
            title: '模块',
            dataIndex: 'group',
            key: 'group'
        },
        {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            render: (text, record) => {
                return resourceTypeOptions.find(r => r.value == text)?.label;
            }
        },
    ];

    const addFormItems: MyFormItems[] = [
        {
            type: 'text',
            item: {
                name: 'name', label: '资源名称', rules: [
                    { required: true, whitespace: true, message: '请输入' },
                    { max: 50, message: "不超过50个字符" }
                ]
            }
        },
        {
            type: 'text',
            item: {
                name: 'identity', label: '资源标识', rules: [
                    { required: true, whitespace: true, message: '请输入' },
                    { max: 50, message: "不超过50个字符" }
                ]
            }
        },
        {
            type: 'oneLevelOpt',
            item: {
                name: 'group', label: '所属模块', rules: [
                    { required: true, message: '请选择' }
                ]
            },
            option: { code: "resource_group", option: { style: { width: 160 } } }
        },
        {
            type: 'select',
            item: {
                name: 'type', label: '类型', rules: [
                    { required: true, message: '请选择' },
                ]
            },
            option: { options: resourceTypeOptions }
        },
    ];


    const headerActions: MyTableAction[] = [
        { title: "新建权限资源", key: "add", type: "btn", icon: <PlusOutlined />, handler: { formItems: addFormItems, showType: "modal" } },
    ]

    const itemActions: MyTableAction[] = [
        { title: "编辑", key: "edit", type: "btn", handler: { formItems: addFormItems, showType: "modal", pick: ["id"] } },
        { title: "删除", key: "delete", type: "confirmBtn", handler: { pick: ["id"] } },
    ]

    const doAction = (action: MyTableAction, params) => {
        if (action.key === 'list') {
            return adminService.ms.pemResource.list(params);
        } else if (action.key === 'add') {
            return adminService.ms.pemResource.create(params);
        } else if (action.key === 'edit') {
            return adminService.ms.pemResource.update(params);
        } else if (action.key === 'delete') {
            return adminService.ms.pemResource.delete([params.id]);
        }
        return Promise.resolve(true);
    }

    const tabConfig = {
        name: "type",
        defaultKey: "1",
        tabs: [
            { key: "1", label: "功能权限" },
            // { key: "2", label: "数据权限" },
        ]
    }

    return <>
        <MyTable
            queryConfig={{ formItems: queryFormItems }}
            tableConfig={{
                columns: columns,
                rowKey: "id",
                scroll: { x: 1300 }
            }}
            actionConfig={{
                headerActions: headerActions,
                itemActions: itemActions,
                doAction: doAction
            }}
            tabConfig={tabConfig}
        />
    </>
}

export default ResourceManagePage;