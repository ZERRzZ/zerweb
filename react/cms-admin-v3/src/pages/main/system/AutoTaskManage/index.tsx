import { Tag } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import './index.css'
import { MyFormItems } from "@/components/MyForm"
import MyTable, { MyTableAction, MyTableRequestConfig } from '@/components/MyTable'

export default function AutoTaskManage() {

  const queryFormItems: MyFormItems[] = [
    {
      type: 'text',
      item: { name: 'job_class_name_like_', label: '任务类名' },
    },
    {
      type: 'select',
      item: { name: 'status', label: '任务状态' },
      option: { style: { width: 100 }, options: [{ label: '正常', value: 0 }, { label: '停止', value: -1 }] }
    }
  ]

  const columns = [
    { title: '任务类名', dataIndex: 'job_class_name' },
    { title: 'Cron表达式', dataIndex: 'cron_expression' },
    { title: '参数', dataIndex: 'parameter' },
    { title: '描述', dataIndex: 'description' },
    {
      title: '状态',
      width: 80,
      dataIndex: 'status',
      render: (_, { status }) => status === 0 ? <Tag color='green'>正常</Tag> : <Tag color='volcano'>停止</Tag>
    }
  ]

  const addFormItems: MyFormItems[] = [
    {
      type: 'text',
      item: { name: 'job_class_name', label: '任务类名', rules: [{ required: true, message: '任务类名必需填写' }], labelCol: { span: 5 } },
    },
    {
      type: 'cron',
      item: { name: 'cron_expression', label: 'Cron 表达式', rules: [{ required: true, message: 'Cron 表达式必需填写' }], labelCol: { span: 5 } },
    },
    {
      type: 'textarea',
      item: { name: 'parameter', label: '参数', labelCol: { span: 5 } }
    },
    {
      type: 'radio',
      item: { name: 'status', label: '状态', rules: [{ required: true, message: '字典状态必须确认' }], labelCol: { span: 5 } },
      option: { options: [{ label: '正常', value: 0 }, { label: '停止', value: -1 }], labelCol: { span: 5 } }
    },
    {
      type: 'textarea',
      item: { name: 'description', label: '描述', labelCol: { span: 5 } },
    }
  ]

  const headerActions: MyTableAction[] = [
    { title: "新增", key: "add", type: "btn", icon: <PlusOutlined />, handler: { formItems: addFormItems, showType: "modal" } }
  ]

  const itemActions: MyTableAction[] = [
    { title: "启动", key: "resume", type: "btn", handler: { pick: ["id"] }, condition: { values: { status: -1 } } },
    { title: "停止", key: "pause", type: "btn", handler: { pick: ["id"] }, condition: { values: { status: 0 } } },
    { title: "立即执行", key: "execute", type: "btn", handler: { pick: ["id"] } },
    { title: "编辑", key: "edit", type: "btn", handler: { formItems: addFormItems, pick: ["id"], requireDetail: true, showType: "modal" } },
    { title: "删除", key: "delete", type: "confirmBtn", handler: { showType: 'editForm', pick: ["id"] } }
  ]

  const requestConfig: MyTableRequestConfig = {
    list: { url: '/1/ms/quartz/list', method: 'get' },
    add: { url: '/1/ms/quartz/add', method: 'post' },
    edit: { url: '/1/ms/quartz/update', method: 'post' },
    delete: { url: '/1/ms/quartz/delete', method: 'post' },
    resume: { url: '/1/ms/quartz/resume', method: 'post' },
    pause: { url: '/1/ms/quartz/pause', method: 'post' },
    execute: { url: '/1/ms/quartz/execute', method: 'post' }
  }

  return <>
    <MyTable
      queryConfig={{ formItems: queryFormItems }}
      tableConfig={{ columns: columns, rowKey: "id" }}
      actionConfig={{ headerActions: headerActions, itemActions: itemActions, }}
      requestConfig={requestConfig}
    />
  </>

}