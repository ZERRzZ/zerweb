import { useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import useMessage from 'antd/es/message/useMessage'
import { Button, Drawer, Form, Modal, Space } from 'antd'

import './index.scss'
import FormDesign from '@/components/FormDesign'
import api, { DataTemplate } from '@/api/adminService'
import MyForm, { MyFormItems } from '@/components/MyForm'
import MyTable, { MyTableAction, MyTableRequestConfig } from '@/components/MyTable'

export default function TemplateManage() {

  const [baseForm] = Form.useForm()
  const [addOpen, setAddOpen] = useState(false) // 新增弹窗开关
  const [upOpen, setUpOpen] = useState(false) // 更新弹窗开关
  const [upData, setUpData] = useState<DataTemplate>() // 更新项数据
  const [refreshKey, setRefreshKey] = useState('')

  const [designOpen, setDesignOpen] = useState(false)
  const [designData, setDesignData] = useState<any>()

  const [message, contextHolder] = useMessage()

  const handleAdd = () => {
    baseForm.resetFields()
    setAddOpen(true)
  }

  const add = data => {
    api.cms.dataTemplate.add(data).then(() => {
      message.success('添加成功')
      setAddOpen(false)
      setRefreshKey(`${new Date().getTime()}`)
    }).catch(err => message.error(`添加失败，${err.msg}`))
  }

  const handleUp = data => {
    api.cms.dataTemplate.get({ id: data.id }).then(res => {
      setUpData(res)
      baseForm.resetFields()
      baseForm.setFieldsValue(res)
      setUpOpen(true)
    })
  }

  const up = data => {
    api.cms.dataTemplate.update(Object.assign(upData!, data)).then(() => {
      message.success('更新成功')
      setUpOpen(false)
      setRefreshKey(`${new Date().getTime()}`)
    }).catch(err => message.error(`更新失败, ${err.msg}`))
  }

  const handleDesign = () => {
    setDesignData(JSON.parse(baseForm.getFieldValue("content") || "{}")?.form)
    setDesignOpen(true)
  }

  const designFinish = value => {
    const obj = {
      name: '模板',
      key: 'template',
      minSize: 1,
      maxSize: 1,
      data: value.items.map(m => ({ name: m.item?.label, key: m.item?.name, type: m.type })),
      form: value
    }
    baseForm.setFieldValue("content", JSON.stringify(obj, undefined, 2))
    setDesignOpen(false)
  }

  const queryItems: MyFormItems[] = [{ type: 'text', item: { name: 'title_like_', label: '模板标题' } }]

  const baseItems: MyFormItems[] = [
    {
      type: 'text',
      item: { name: 'title', label: '模板名称', rules: [{ required: true, message: '请填写名称' }] },
    },
    {
      type: 'code',
      item: { name: 'content', label: '数据模板' },
      option: { language: 'json', height: '350px', width: '1038px' }
    },
    {
      type: 'button',
      innerHtml: '数据模板设计',
      item: { wrapperCol: { offset: 2 } },
      option: { type: 'primary', onClick: handleDesign }
    }
  ]

  const columns = [
    { title: 'ID', dataIndex: 'id' },
    { title: '模板标题', dataIndex: 'title' }
  ]

  const headerActions: MyTableAction[] = [{ title: "新增", key: "add", type: "btn", icon: <PlusOutlined /> }]

  const itemActions: MyTableAction[] = [
    { title: '编辑', key: 'edit', type: 'btn', handler: { pick: ['id'] } },
    { title: '删除', key: 'delete', type: 'confirmBtn', handler: { pick: ['id'] } }
  ]

  const requestConfig: MyTableRequestConfig = {
    detail: { url: '/1/cms/data_template/get', method: 'get' },
    list: { url: '/1/cms/data_template/list?deleted=0', method: 'get' },
    delete: { url: '/1/cms/data_template/delete', method: 'post' }
  }

  const doAction = (action: MyTableAction, item) => {
    switch (action.key) {
      case 'add': handleAdd(); break;
      case 'edit': handleUp(item); break;
    }
    return undefined
  }

  return (
    <>
      <MyTable
        queryConfig={{ formItems: queryItems }}
        tableConfig={{ columns: columns, rowKey: "id", operateWidth: 180 }}
        actionConfig={{ headerActions, itemActions, doAction }}
        requestConfig={requestConfig}
        refreshTriggerKey={refreshKey}
      />
      <Drawer
        width={1200}
        open={addOpen || upOpen}
        title={addOpen ? '新增模板' : '编辑模板'}
        onClose={() => addOpen ? setAddOpen(false) : setUpOpen(false)}
        extra={
          <Space>
            <Button type='primary' onClick={() => baseForm.submit()}>确认</Button>
            <Button onClick={() => addOpen ? setAddOpen(false) : setUpOpen(false)}>取消</Button>
          </Space>
        }
      >
        <MyForm form={{ onFinish: addOpen ? add : up, labelCol: { span: 2 }, form: baseForm }} items={baseItems} layout={[1]} />
      </Drawer>
      <Modal width={'90%'} title='数据模板设计' open={designOpen} destroyOnClose onCancel={() => setDesignOpen(false)} footer={null}>
        <FormDesign onFinish={designFinish} initValue={designData} />
      </Modal>
      {contextHolder}
    </>
  )

}