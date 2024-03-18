import { MyFormItems } from "@/components/MyForm";
import MyTable, { MyTableAction } from "@/components/MyTable";
import { PlusOutlined } from "@ant-design/icons";
import adminService from "@/api/adminService";
import { useEffect, useState } from "react";
import { encrypt } from "@/lib/login/loginUtils";

const UserManagePage: React.FC = () => {
    const [roleOptions, setRoleOptions] = useState<any[]>([]);
    const queryFormItems: MyFormItems[] = [
        {
            type: 'text',
            item: { name: 'full_name', label: '用户名' }
        },
        {
            type: 'text',
            item: { name: 'account', label: '用户账号' }
        },
        {
            type: 'text',
            item: { name: 'mobile', label: '手机号' }
        },
    ];


    const columns = [
        {
            title: '用户ID',
            dataIndex: 'id',
            key: 'id',
            width: 180,
            fixed: 'left' as 'left',
        },
        {
            title: '用户名',
            dataIndex: 'full_name',
            key: 'full_name',
            width: 160,
            fixed: 'left' as 'left',
        },
        {
            title: '用户账号',
            dataIndex: 'account',
            key: 'account',
            width: 160
        },
        {
            title: '手机号',
            dataIndex: 'mobile',
            key: 'mobile'
        },
        {
            title: '角色',
            dataIndex: 'roleList',
            key: "roleList",
            render: (text, record, _, action) => (
                <span>{`${record.roleList?.map(r => r.name).join('，') || ''}`}</span>
            )
        },
    ];

    const addFormItems: MyFormItems[] = [
        {
            type: 'text',
            item: {
                name: 'full_name', label: '用户名', rules: [
                    { required: true, whitespace: true, message: '请输入' },
                    { max: 30, message: "不超过30个字符" }
                ]
            }
        },
        {
            type: 'text',
            item: {
                name: 'account', label: '用户账号', rules: [
                    { required: true, whitespace: true, message: '请输入' },
                    { max: 30, message: "不超过30个字符" }
                ]
            }
        },
        {
            type: 'text',
            item: {
                name: 'mobile', label: '手机号', rules: [
                    {required: true,whitespace: true,message: '请输入'},
                    { pattern: /^((13[0-9])|(14[0-9])|(15[0-9])|(17[0-9])|(18[0-9])|((19[0-9])))\d{8}$/, message: "格式不正确", }
                ]
            }
        },
        {
            type: 'password',
            item: {
                name: 'password', label: '密码', rules: [
                    { required: true, whitespace: true, message: '请输入' },
                    {
                        validator: (rule: any, value: any, callback) => {
                            if (value) {
                                if (value.length < 8 || value.length > 19) {
                                    callback('密码长度8-19');
                                } else if (!/^[0-9a-zA-Z!@#$&_\.]+$/.test(value)) {
                                    callback('只能由数字、小写字母、大写字母、特殊字符（!@#$&_.）组成');
                                } else if (!/[0-9]+/.test(value) || !/[a-z]+/.test(value) || !/[A-Z]+/.test(value) || !/[!@#$&_\.]+/.test(value)) {
                                    callback('必须同时包含数字、小写字母、大写字母、特殊字符（!@#$&_.）');
                                } else {
                                    callback(undefined);
                                }
                            } else {
                                callback(undefined);
                            }
                        }
                    }
                ],
                extra: '密码长度8-19，且同时包含数字、小写字母、大写字母、特殊字符（!@#$&_.）'
            }
        },
    ];

    const editFormItems: MyFormItems[] = [
        {
            type: 'text',
            item: {
                name: 'full_name', label: '用户名', rules: [
                    { required: true, whitespace: true, message: '请输入' },
                    { max: 30, message: "不超过30个字符" }
                ]
            }
        },
        {
            type: 'text',
            item: {
                name: 'account', label: '用户账号', rules: [
                    { required: true, whitespace: true, message: '请输入' },
                    { max: 30, message: "不超过30个字符" }
                ]
            }
        },
        {
            type: 'text',
            item: {
                name: 'mobile', label: '手机号', rules: [
                    // {required: true,whitespace: true,message: '请输入'},
                    { pattern: /^((13[0-9])|(14[0-9])|(15[0-9])|(17[0-9])|(18[0-9])|((19[0-9])))\d{8}$/, message: "格式不正确", }
                ]
            }
        },
        {
            type: 'password',
            item: {
                name: 'password', label: '密码', rules: [
                    {
                        validator: (rule: any, value: any, callback) => {
                            if (value) {
                                if (value.length < 8 || value.length > 19) {
                                    callback('密码长度8-19');
                                } else if (!/^[0-9a-zA-Z!@#$&_\.]+$/.test(value)) {
                                    callback('只能由数字、小写字母、大写字母、特殊字符（!@#$&_.）组成');
                                } else if (!/[0-9]+/.test(value) || !/[a-z]+/.test(value) || !/[A-Z]+/.test(value) || !/[!@#$&_\.]+/.test(value)) {
                                    callback('必须同时包含数字、小写字母、大写字母、特殊字符（!@#$&_.）');
                                } else {
                                    callback(undefined);
                                }
                            } else {
                                callback(undefined);
                            }
                        }
                    }
                ],
                extra: '密码长度8-19，且同时包含数字、小写字母、大写字母、特殊字符（!@#$&_.）'
            }
        },
    ];

    const roleFormItems: MyFormItems[] = [
        {
            type: 'select',
            item: { name: 'roles', label: '角色' },
            option: { mode: 'multiple', options: roleOptions }
        },
    ]

    const headerActions: MyTableAction[] = [
        { title: "新增用户", key: "add", type: "btn", icon: <PlusOutlined />, handler: { formItems: addFormItems, showType: "modal" } },
    ]

    const itemActions: MyTableAction[] = [
        { title: "编辑", key: "edit", type: "btn", handler: { formItems: editFormItems, showType: "modal", pick: ["id"] } },
        {
            title: "分配角色", key: "role", type: "btn", handler: {
                formItems: roleFormItems, formValues: (item) => {
                    return Promise.resolve({ roles: item.roleList?.map(r => r.id) });
                }, showType: "modal", title: '分配角色', pick: ["id", "roleList"]
            }
        },
        { title: "删除", key: "delete", type: "confirmBtn", handler: { pick: ["id"] } },
    ]

    const doAction = (action: MyTableAction, params) => {
        if (action.key === 'list') {
            return adminService.ms.userRole.pageList(params).then(res => {
                res.list = res.list?.map(item => {
                    let user = item.user as any;
                    user.roleList = item.role;
                    return user;
                })
                return res;
            });
        } else if (action.key === 'add') {
            params.password = encrypt(params.password);
            return adminService.ms.user.add(params);
        } else if (action.key === 'edit') {
            if (params.password) {
                params.password = encrypt(params.password);
            }
            return adminService.ms.user.update(params);
        } else if (action.key === 'delete') {
            return adminService.ms.user.delete([params.id]);
        } else if (action.key === 'role') {
            let oldRoles = params.roleList?.map(r => r.id) || [];
            let newRoles = params.roles || [];
            let deleteRoles = [] as any[];
            let addRoles = [] as any[];
            newRoles.forEach(r => {
                if (!oldRoles.includes(r)) {
                    addRoles.push(r);
                }
            });
            oldRoles.forEach(r => {
                if (!newRoles.includes(r)) {
                    deleteRoles.push(r);
                }
            });
            if (deleteRoles.length > 0 || addRoles.length > 0) {
                return adminService.ms.pemUserRole.updateSubjectRole({ subject_id: params.id, org_id: "0", delete_role: deleteRoles, add_role: addRoles });
            }
        }
        return Promise.resolve(true);
    }

    useEffect(() => {
        const params = {
            page_no: 1,
            page_size: 999
        }
        adminService.ms.pemRole.list(params).then(res => {
            if (res && res.list) {
                setRoleOptions(res.list.map((item, index) => {
                    return { label: item.name, value: item.id }
                }));
            }
        })
    }, [])

    return <>
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
                doAction: doAction
            }}
        />
    </>
}

export default UserManagePage;