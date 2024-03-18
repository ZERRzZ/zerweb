# 功能

- 实现用户管理页面的增删查改。
- 可以兼容用户管理和角色管理两个页面。
- 可以自定义批量删除，角色分配、权限管理。

# 使用方法

```ts
<MyRoleManage  ref={tabledom}></MyRoleManage>
```

## 参数配置详情

在组件中一共有12个参数配置，可自定义列表、搜索、增加、权限管理、角色管理。参数详情如下

```tsx
interface IPorps {
    columns?: any[];//table表头
    formFields?: any[];//自定义新增列表
    data: DataType[];//列表
    delRole: Function;//删除函数
    rowSelections?: boolean;//自定义是否有批量删除
    addRole: Function;//添加和修改函数
    rolesChange?: Function;//分配角色函数
    fetchAuthList?: any[];//权限列表
    listHeader: string;//列表头部名称
    Rolesoptions?: any[];//角色列表
    searchFun?: Function;//搜索函数
    authChange?: Function;//设置功能权限保存
}
```

## columns

在 props 中传入 `columns`配置table表头， 配置项如下。

```tsx
 const columns = [
        {
            title: '角色名称',
            dataIndex: 'name',
            key:'name',
            valueType: "string",//参数为"string"添加<Input/>。参数为"Select"添加<Select/>。参数为"password"添加<Input.Password />
            searchInput: "select",//设置参数用于创建搜索
            addInput: 'add',//设置参数用于创建新增
            rules: [
                {
                    required: true,
                    message: '此项为必填项',
                },
            ],
        },
        {
            title: '操作',
            valueType: 'option',
            key: 'option',
            render: (text, record, _, action) => [
                <Space size="middle">
                    <a
                        key={`editable`}
                        onClick={() => {
                            //编辑时调用的组件方法，传入数据用户编辑回显
                            tabledom.current?.editPower(record);
                        }}
                    >
                        编辑
                    </a>
                    <a
                        key={`fenpeiPower`}
                        onClick={() => {
                            //用户管理中设置分配角色调用的组件方法
                            tabledom.current?.assignroles(record);
                        }}
                    >
                        分配角色
                    </a>
                    <a
                        key="editPower"
                        onClick={() => {
                            //角色管理中设置权限调用的组件方法
                            tabledom.current?.onPemClick(record);
                        }}
                    >
                        权限设置管理
                    </a>
                </Space>

            ],
<MyRoleManage column={columns}  ref={tabledom}></MyRoleManage>
```

## formFields

在 props 中传入 `formFields`（可选参数），自定义新增窗口，当formFields出现时，column中的addInput参数将被覆盖。配置项如下。

```tsx
    const formFields = [
        {
            title: '用户名称',
            dataIndex: 'name',
            valueType: 'string',
            rules: [
                {
                    required: true,
                    whitespace: true,
                    message: '请输入'
                },
                {
                    max: 30,
                    message: "不超过30个字符"
                }
            ]
        },
       
    ]
<MyRoleManage formFields={formFields}  ref={tabledom}></MyRoleManage>
```

## data

在 props 中传入 `data`，数据列表，参考antd（table中的dataSource）。

```tsx
<MyRoleManage data={data}  ref={tabledom}></MyRoleManage>
```

## delRole

在 props 中传入 `delRole`，删除时调用的函数，批量删除和单个删除都能返回要删除的数据，。

```tsx
    const delRole = (data) => {
        console.log(data, "要删除的数据");
    }
<MyRoleManage delRole={delRole}  ref={tabledom}></MyRoleManage>
```

## rowSelections

在 props 中传入 `rowSelections`（可选参数），当为true的时候有批量删除功能，否则没有批量删除。

```tsx
<MyRoleManage rowSelections={true}  ref={tabledom}></MyRoleManage>
```

## addRole

在 props 中传入 `addRole`，该函数优良的返回值，一个是要修改或要添加的数据，当edit为true时，返回的是新修改的数据和老数据。

```tsx
    const addRole = (data, edit = false) => {
        if (edit) {
            console.log(data, "要修改的数据");
        } else {
            console.log(data, "要添加的数据");
        }
    }
<MyRoleManage addRole={addRole}  ref={tabledom}></MyRoleManage>
```

## fetchAuthList

在 props 中传入 `fetchAuthList`，设置权限管理列表中所有权限，（目前来说传入的数组对象可以的任何数据但是权限的名称必须是name，如果有需要的话后续会改进）。

```tsx
    const fetchAuthList =[
    { identity: 'resource_manage', name: '权限资源管理', }),
    { identity: 'project_manage', name: '项目管理' }),
    { identity: 'msg_manage', name: '消息管理' }
    ]
<MyRoleManage fetchAuthList={fetchAuthList}  ref={tabledom}></MyRoleManage>
```

## authChange
在 props 中传入 `authChange`，该函数返回的是，修改角色权限后点击保存的权限列表。

```tsx
    const authChange = (data) => {
        console.log(data, "权限");
    }
<MyRoleManage authChange={authChange}  ref={tabledom}></MyRoleManage>
```


## Rolesoptions

在 props 中传入 `Rolesoptions`，分配角色中的角色列表，（就目前来说格式严格如下，如有需要后期可以修改）。

```tsx
    const Rolesoptions = [{
        label:'图谱管理员',
        value:'admin'
    }]
<MyRoleManage Rolesoptions={Rolesoptions}  ref={tabledom}></MyRoleManage>
```


## rolesChange

在 props 中传入 `rolesChange`，该函数返回的是，点击分配角色保存的角色列表。

```tsx
    const rolesChange = (data) => {
        console.log(data, "角色变更");
    }
<MyRoleManage rolesChange={rolesChange}  ref={tabledom}></MyRoleManage>
```

## listHeader
在 props 中传入 `listHeader`，用于列表表头区别用户和角色。

```tsx
<MyRoleManage listHeader='角色'  ref={tabledom}></MyRoleManage>
```

## searchFun
在 props 中传入 `searchFun`，该函数返回要搜索的参数。

```tsx
    const searchFun = (data) => {
        console.log(data, '要查询的数据');
    }
<MyRoleManage searchFun={searchFun}  ref={tabledom}></MyRoleManage>
```
