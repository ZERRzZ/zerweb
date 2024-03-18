import { MyFormItems } from "@/components/MyForm";
import MyTable, { MyTableAction } from "@/components/MyTable";
import { PlusOutlined } from "@ant-design/icons";
import adminService, { RoleAuthority } from "@/api/adminService";
import { useCallback, useState } from "react";
import { message, Modal } from "antd";
import "./index.scss";
import MyCheckboxSelect from "@/components/MyCheckboxSelect";
import MyModalTransfer from "@/components/MyTransfer";

const UserManagePage: React.FC = () => {
    const [authModalVisible, setAuthModalVisible] = useState(false);
    const [authModalLoading, setAuthModalLoading] = useState(false);
    const [allResourceMap, setAllResourceMap] = useState<any>({});
    const [resourceMap, setResourceMap] = useState<any>();
    const [resourceSelectedMap, setResourceSelectedMap] = useState<any>({});
    const [resourceSelected, setResourceSelected] = useState<RoleAuthority[]>([]);
    const [currentItem, setCurrentItem] = useState<any>();
    const [pemType, setPemType] = useState<number>();
    // 管理成员
    const [userModalVisible, setUserModalVisible] = useState(false);
    const [userModalLoading, setUserModalLoading] = useState(false);
    const [currentRole, setCurrentRole] = useState<any>();
    const columns = [
        {
            title: '角色名称',
            dataIndex: 'name',
            key: 'name',
            width: 180,
            fixed: 'left',
        },
        {
            title: '角色标识',
            dataIndex: 'alias',
            key: 'alias',
            width: 160,
            fixed: 'left',
        },
        {
            title: '角色描述',
            dataIndex: 'description',
            key: 'description',
        },
    ];

    const addFormItems: MyFormItems[] = [
        {
            type: 'text',
            item: {
                name: 'name', label: '角色名称', rules: [
                    { required: true, whitespace: true, message: '请输入' },
                    { max: 30, message: "不超过30个字符" }
                ]
            }
        },
        {
            type: 'text',
            item: {
                name: 'alias', label: '角色标识', rules: [
                    { required: true, whitespace: true, message: '请输入' },
                    { max: 30, message: "不超过30个字符" }
                ]
            }
        },
        {
            type: 'text',
            item: {
                name: 'description', label: '角色描述', rules: [
                    { max: 100, message: "不超过100个字符" }
                ]
            }
        },
    ];


    const headerActions: MyTableAction[] = [
        { title: "新建角色", key: "add", type: "btn", icon: <PlusOutlined />, handler: { formItems: addFormItems, showType: "modal" } },
    ]

    const itemActions: MyTableAction[] = [
        { title: "编辑", key: "edit", type: "btn", handler: { formItems: addFormItems, showType: "modal", pick: ["id"] } },
        { title: "设置功能权限", key: "auth_res", type: "btn", handler: { pick: ["id", "name"] } },
        // { title: "设置数据权限", key: "auth_data", type: "btn", handler: { pick: ["id"] } },
        { title: "管理成员", key: "memeber", type: "btn", handler: { pick: ["id"] } },
        { title: "删除", key: "delete", type: "confirmBtn", handler: { pick: ["id"] } },
    ]

    const doAction = (action: MyTableAction, params) => {
        if (action.key === 'list') {
            return adminService.ms.pemRole.list(params);
        } else if (action.key === 'add') {
            return adminService.ms.pemRole.create(params);
        } else if (action.key === 'edit') {
            return adminService.ms.pemRole.update(params);
        } else if (action.key === 'delete') {
            return adminService.ms.pemRole.delete([params.id]);
        } else if (action.key === 'auth_res') {
            onPemClick(params, 1);
            return Promise.resolve(undefined);
        } else if (action.key === 'auth_data') {
            onPemClick(params, 2);
            return Promise.resolve(undefined);
        } else if (action.key === 'memeber') {
            setCurrentRole(params);
            setUserModalVisible(true);
            return Promise.resolve(undefined);
        }
        return Promise.resolve(true);
    }

    const onAuthorityChange = (name, list) => {
        if (resourceSelectedMap) {
            const newMap: any = resourceSelectedMap;
            newMap[name] = list || [];
            setResourceSelectedMap(newMap);
        }
    }

    const onSaveAuthority = () => {
        setAuthModalLoading(true);
        let addItems: any[] = [];
        let deleteItems: any[] = [];
        for (let key in resourceSelectedMap) {
            resourceSelectedMap[key].forEach(r => {
                if (!resourceSelected.find(f => f.resource_id === r)) {
                    addItems.push({
                        action_id: 1,
                        resource_id: r
                    })
                }
            })
        }
        resourceSelected.forEach(r => {
            if (!findSelectedRole(resourceSelectedMap, r.resource_id)) {
                deleteItems.push({
                    action_id: 1,
                    resource_id: r.resource_id
                })
            }
        })
        adminService.ms.pemRoleResource.batchUpdate({ role_id: currentItem.id, delete_authority: deleteItems, add_authority: addItems }).then(res => {
            if (res) {
                message.success('设置成功', 2);
                setAuthModalVisible(false);
            } else {
                message.warning('设置失败');
            }
        }, err => {
            message.error(`异常：${err.msg}`);
        }).finally(() => setAuthModalLoading(false));
    }

    const onPemClick = (item, type?: number) => {
        setPemType(type || 1);
        setCurrentItem(item);
        setResourceSelectedMap({});
        Promise.all([fetchAuthList(type || 1), fetchAuthSelected(item.id)]).then(res => {
            let map = res[0];
            let list = res[1];
            setResourceMap(map);
            let newResourceSelectedMap = {};
            let selected: any[] = [];
            list.forEach(r => {
                let role = findRole(map, r.resource_id);
                if (role) {
                    selected.push(r);
                    let selectedIds = newResourceSelectedMap[role.group];
                    if (!selectedIds) {
                        selectedIds = [];
                    }
                    selectedIds.push(r.resource_id);
                    newResourceSelectedMap[role.group] = selectedIds;
                }
            });
            setResourceSelected(selected);
            setResourceSelectedMap(newResourceSelectedMap);
        });
        setAuthModalVisible(true);
    }

    const fetchAuthList = (type: number): Promise<any> => {
        let map = allResourceMap[type];
        if (!map) {
            return adminService.ms.pemResource.list({ page_no: -1, type: type }).then(res => {
                let map = {};
                if (res && res.list) {
                    res.list.forEach(r => {
                        let group = r.group || '其他';
                        if (!map[group]) {
                            map[group] = [];
                        }
                        map[group].push(r);
                    });
                }
                let newAllResouceMap = { ...allResourceMap };
                newAllResouceMap[type] = map;
                setAllResourceMap(newAllResouceMap);
                return map;
            })
        }
        return Promise.resolve(map);
    };

    const fetchAuthSelected = (id): Promise<RoleAuthority[]> => {
        return adminService.ms.pemRoleResource.list({ page_no: -1, role_id: id }).then(res => {
            return res.list || [];
        });
    }

    const findRole = (map, id) => {
        if (map) {
            for (let key in map) {
                let role = map[key].find(m => m.id === id);
                if (role) {
                    return role;
                }
            }
        }
        return undefined;
    }

    const findSelectedRole = (map, id) => {
        if (map) {
            for (let key in map) {
                if (map[key].includes(id)) {
                    return true;
                }
            }
        }
        return false;
    }

    const fetchUserList = useCallback(() => {
        return adminService.ms.user.allList({}).then(res => {
            if (res) {
                return res.map(item => ({
                    key: item.id?.toString() || '',
                    title: item.full_name,
                }));
            }
            return [];
        });
    }, [])

    const fetchUserSelected = useCallback(() => {
        if (!currentRole) return Promise.resolve([]);
        return adminService.ms.pemUserRole.list({
            role_id: currentRole.id,
        })
            .then(res => {
                if (res) {
                    return res.filter(f => f !== null).map(item => item.subject_id?.substring(7) || '');
                } else {
                    return [];
                }
            });
    }, [currentRole]);

    const onSaveUser = (data) => {
        setUserModalLoading(true);
        adminService.ms.pemUserRole.updateRoleSubject({
            add_items: data.add_items,
            delete_items: data.delete_items,
            role_id: currentRole.id,
            org_id: '0',
        }).then(res => {
            if (res) {
                Modal.success({
                    content: '成员修改成功',
                    onOk() {
                        setUserModalVisible(false);
                    },
                });
            } else {
                Modal.error({
                    content: '成员修改失败',
                });
            }
        })
            .catch(error =>
                Modal.error({
                    content: error.msg,
                }),
            )
            .finally(() => setUserModalLoading(false));
    }

    return <>
        <MyTable
            tableConfig={{
                columns: columns,
                rowKey: "id",
                operateWidth: 320,
                scroll: { x: 1300 }
            }}
            actionConfig={{
                headerActions: headerActions,
                itemActions: itemActions,
                doAction: doAction
            }}
        />
        <Modal
            title={`${currentItem?.name}权限设置`}
            maskClosable={false}
            open={authModalVisible}
            onCancel={() => { setAuthModalVisible(false) }}
            onOk={() => {
                onSaveAuthority();
            }}
            confirmLoading={authModalLoading}
            width={930}
            centered={true}
        >
            <div className="role-auth-modal">
                <table className='table-bordered'>
                    <thead><tr><th style={{ width: 200, textAlign: 'center' }}>模块</th><th style={{ textAlign: 'center' }}>资源</th></tr></thead>
                    <tbody>
                        {
                            resourceMap ?
                                Object.keys(resourceMap).map((item, index) => {
                                    return <MyCheckboxSelect
                                        key={index}
                                        onChange={onAuthorityChange}
                                        name={item}
                                        options={resourceMap[item].map(r => ({ label: r.name, value: r.id }))}
                                        value={resourceSelectedMap[item] || []} />
                                })
                                : undefined
                        }
                    </tbody>
                </table>
            </div>
        </Modal>
        <MyModalTransfer
            title="管理成员"
            visible={userModalVisible}
            loading={userModalLoading}
            fetchList={fetchUserList}
            fetchSelected={fetchUserSelected}
            onCancel={() => setUserModalVisible(false)}
            onSubmit={onSaveUser}
        />
    </>
}

export default UserManagePage;