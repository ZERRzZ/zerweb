import { useState } from 'react'
import { Base64 } from 'js-base64'
import useMessage from 'antd/es/message/useMessage'
import { Button, Drawer, Form, Modal, Space } from 'antd'

import './index.scss'
import FormDesign from '@/components/FormDesign'
import { PlusOutlined } from '@ant-design/icons'
import api, { Component, DataTemplate } from '@/api/adminService'
import MyForm, { MyFormItems } from '@/components/MyForm'
import MyCategoryTable from '@/components/MyTable/MyCategoryTable'
import MyTable, { MyTableAction, MyTableRequestConfig } from '@/components/MyTable'

export default function ComponentManage() {

  const [message, contextHolder] = useMessage()

  const [baseForm] = Form.useForm()
  const [addOpen, setAddOpen] = useState(false) // 新增弹窗开关
  const [upOpen, setUpOpen] = useState(false) // 更新弹窗开关
  const [upData, setUpData] = useState<Component>() // 更新项数据
  const [snidDisabled, setSnidDisabled] = useState(false)
  const [refreshKey, setRefreshKey] = useState('')

  const [designOpen, setDesignOpen] = useState(false)
  const [designData, setDesignData] = useState<any>()
  const [designIndex, setDesignIndex] = useState(-1)

  const [template, setTemplate] = useState<DataTemplate>()
  const [templateOpen, setTemplateOpen] = useState(false)
  const [templateIndex, setTemplateIndex] = useState(-1)

  const handleAdd = () => {
    baseForm.resetFields()
    setSnidDisabled(false)
    setAddOpen(true)
  }

  const add = data => {
    // 转换数据类型
    const temp1 = data.data_content?.map(dc => dc.self && JSON.parse(dc.self))
    const temp2 = JSON.stringify(temp1, undefined, 2)
    api.cms.component.add({
      ...data,
      content: Base64.encode(data.content),
      style_content: Base64.encode(data.style_content),
      script_content: Base64.encode(data.script_content),
      data_content: temp2
    }).then(() => {
      message.success('添加成功')
      setAddOpen(false)
      setRefreshKey(`${new Date().getTime()}`)
    }).catch(err => message.error(`添加失败，${err.msg}`))
  }

  const handleUp = data => {
    api.cms.component.get({ id: data.id }).then(res => {
      setUpData(res)
      // 转换数据模板类型
      const temp1 = res.data_content && JSON.parse(res.data_content)
      const temp2 = temp1?.map(t => ({ self: JSON.stringify(t, undefined, 2) }))
      baseForm.resetFields()
      baseForm.setFieldsValue({ ...res, data_content: temp2 })
      setSnidDisabled(true)
      setUpOpen(true)
    })
  }

  const up = value => {
    // 转换数据模板类型
    const temp1 = value?.data_content?.map(dc => dc.self && JSON.parse(dc.self))
    const temp2 = JSON.stringify(temp1, undefined, 2)
    api.cms.component.update(Object.assign(upData!, {
      ...value,
      content: Base64.encode(value.content),
      style_content: Base64.encode(value.style_content),
      script_content: Base64.encode(value.script_content),
      data_content: temp2
    })).then(() => {
      message.success('更新成功')
      setUpOpen(false)
      setRefreshKey(`${new Date().getTime()}`)
    }).catch(err => message.error(`更新失败, ${err.msg}`))
  }

  const handlePreview = data => {
    api.cms.component.componentPreview({ id: data.id }).then(res => {
      const html = new Blob([res], { type: "text/html" })
      const url = window.URL.createObjectURL(html)
      const a = document.createElement('a')
      a.href = url
      a.target = '_blank'
      a.click()
    }).catch(err => message.error(`预览失败，${err.msg}`))
  }

  const handleDesign = e => {
    // 根据点击元素 id 确认数据数组的 index
    setDesignData(baseForm.getFieldValue("data_content"))
    setDesignIndex(e.currentTarget.id.split('_')[2])
    setDesignOpen(true)
  }

  const designFinish = value => {
    let temp = [...designData]
    const dataContent = temp?.[designIndex]?.self && JSON.parse(temp?.[designIndex]?.self)
    const obj = {
      name: dataContent?.name || "未知模板",
      key: dataContent?.key || "unknow",
      minSize: dataContent?.minSize || 1,
      maxSize: dataContent?.maxSize || 1,
      data: renderData(value.items),
      form: value
    }
    temp[designIndex] = { self: JSON.stringify(obj, undefined, 2) }
    baseForm.setFieldValue("data_content", temp)
    setDesignOpen(false)
    function renderData(items: MyFormItems[] = []) {
      return items.map(i => i.type !== 'list' ?
        { name: i.item?.label, key: i.item?.name, type: i.type } :
        { name: i.list?.label, key: i.list?.name, type: i.type, list: renderData(i.list?.items) }
      )
    }
  }

  const handleChoose = e => {
    setTemplate(undefined)
    setTemplateIndex(e.currentTarget.id.split('_')[2])
    setTemplateOpen(true)
  }

  const chooseFinsh = () => {
    if (!template?.id) return message.warning('未选中任何模板')
    let temp = [...baseForm.getFieldValue("data_content")]
    temp[templateIndex] = { self: template?.content }
    baseForm.setFieldValue('data_content', temp)
    setTemplateOpen(false)
  }

  const baseItems: MyFormItems[] = [
    {
      type: 'multiLevelOpt',
      span: 12,
      item: { name: 'category', label: '分类', rules: [{ required: true, message: '请选择分类' }], labelCol: { span: 4 } },
      option: { code: 'cms_component_category', split: "," }
    },
    {
      type: 'text',
      span: 12,
      item: { name: 'title', label: '组件名称', rules: [{ required: true, message: '请填写名称' }], labelCol: { span: 4 } },
    },
    {
      type: 'text',
      span: 12,
      item: { name: 'sn_id', label: 'sn_id', rules: [{ required: true, message: '请填写 sn_id' }], labelCol: { span: 4 } },
      option: { disabled: snidDisabled }
    },
    {
      type: 'myImageUpload',
      item: { name: 'ex_image', label: '缩略图' }
    },
    {
      type: 'code',
      item: { name: 'content', label: 'HTML' },
      option: { language: 'html', height: '350px', width: '1038px' }
    },
    {
      type: 'code',
      item: { name: 'style_content', label: 'CSS' },
      option: { language: 'css', height: '350px', width: '1038px' }
    },
    {
      type: 'code',
      item: { name: 'script_content', label: 'JS' },
      option: { language: 'javascript', height: '350px', width: '1038px' }
    },
    {
      type: 'list',
      list: {
        name: 'data_content',
        label: '数据模板',
        notMove: true,
        items: [
          { type: 'code', item: { name: 'self' }, option: { language: 'json', width: '840px' } },
          { type: 'button', option: { type: 'primary', onClick: handleDesign }, innerHtml: '设计' },
          { type: 'button', option: { type: 'primary', onClick: handleChoose }, innerHtml: '选择' },
        ]
      }
    },
    {
      type: 'code',
      item: { name: 'ex_data', label: '示例数据' },
      option: { language: 'json', height: '350px', width: '1038px' }
    },
    {
      type: 'code',
      item: { name: 'config_content', label: '配置模板' },
      option: { language: 'json', height: '350px', width: '1038px' }
    }
  ]

  const columns = [
    { width: 60, title: 'ID', dataIndex: 'id' },
    { title: '组件名称', dataIndex: 'title' },
    { title: 'sn_id', dataIndex: 'sn_id' },
    {
      width: 100,
      title: '缩略图',
      dataIndex: 'ex_image',
      option: { renderType: 'image' }
    }
  ]

  const queryItems: MyFormItems[] = [
    { type: 'text', item: { label: '组件名称', name: 'title_like_' } },
    { type: 'text', item: { label: 'sn_id', name: 'sn_id_like_' } }
  ]

  const requestConfig: MyTableRequestConfig = {
    list: { url: '/1/cms/component/page_list', method: 'get' },
    delete: { url: '/1/cms/component/delete', method: 'post' }
  }

  const headerActions: MyTableAction[] = [{ title: "新增", key: "add", type: "btn", icon: <PlusOutlined /> }]

  const itemActions: MyTableAction[] = [
    { title: '编辑', key: 'edit', type: 'btn', handler: { pick: ['id'] } },
    { title: '预览', key: 'preview', type: 'btn', handler: { pick: ['id'] } },
    { title: '删除', key: 'delete', type: 'confirmBtn', handler: { pick: ['id'] } }
  ]

  const doAction = (action: MyTableAction, item) => {
    switch (action.key) {
      case 'add': handleAdd(); break;
      case 'edit': handleUp(item); break;
      case 'preview': handlePreview(item); break;
    }
    return undefined
  }

  /* 数据模板部分 */

  const dataTemplateRequestConfig: MyTableRequestConfig = { list: { url: '/1/cms/data_template/list?deleted=0', method: 'get' } }

  const dataTemplateColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id', },
    { title: '模板标题', dataIndex: 'title', key: 'title' }
  ]

  const dataTemplateQueryItems: MyFormItems[] = [{ type: 'text', item: { name: 'title_like_', label: '模板标题' } }]

  const handleSelect = v => setTemplate(v[0])

  return (
    <>
      {contextHolder}
      <MyCategoryTable
        tableProps={{
          requestConfig,
          queryConfig: { formItems: queryItems },
          tableConfig: { columns: columns, operateWidth: 150 },
          actionConfig: { headerActions, itemActions, doAction, itemShowNumber: 3 },
          refreshTriggerKey: refreshKey
        }}
        code="cms_component_category"
        columnName="category"
      />
      <Drawer
        width={1200}
        open={addOpen || upOpen}
        title={addOpen ? '新增组件' : '编辑组件'}
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
        <FormDesign onFinish={designFinish} initValue={designData?.[designIndex]?.self && JSON.parse(designData?.[designIndex]?.self).form} />
      </Modal>
      <Modal width={800} title='数据模板列表' open={templateOpen} destroyOnClose onCancel={() => setTemplateOpen(false)} onOk={chooseFinsh}>
        <MyTable
          requestConfig={dataTemplateRequestConfig}
          tableConfig={{ columns: dataTemplateColumns, selectionType: "radio", onSelect: handleSelect }}
          queryConfig={{ formItems: dataTemplateQueryItems }}
        />
      </Modal>
    </>
  )

}