import { useEffect, useState } from "react";
import { useForm } from "antd/es/form/Form";
import { Button, Drawer, Space, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import useMessage from "antd/es/message/useMessage";

import './index.scss';
import DataConfig from "../PageManage/DataConfig";
import MyForm, { MyFormItems } from "@/components/MyForm";
import api, { Component, Module } from "@/api/adminService";
import MyTable, { MyTableAction, MyTableRequestConfig } from "@/components/MyTable";

const PublicModuleManage: React.FC = () => {

  const [message, contextHolder] = useMessage();

  let configData: any
  const [data, setData] = useState<Component[]>([]) // 数据
  const [drawerShow, setDrawerShow] = useState<boolean>(false)
  const [recordItem, setRecordItem] = useState({})
  const [dataContent, setDataContent] = useState<any>([])
  const [moduleData, setModuleData] = useState<any>()
  const [type, setType] = useState<any>("1")

  const [upForm] = useForm()
  const [upOpen, setUpOpen] = useState(false)
  const [upData, setUpData] = useState<Module>()
  const [refreshKey, setRefreshKey] = useState('')

  const [pageOption, setPageOption] = useState<any>()

  useEffect(() => {
    const params = { query: '', page_no: -1, page_size: 999 }
    api.cms.component.pageList(params).then(res => {
      setData(res.list?.map(l => ({ value: l.id, label: l.title, ...l })) || [])
    })
    api.cms.page.option().then(res => {
      setPageOption(res?.map(r => ({ value: r.id, label: r.title })) || [])
    })
  }, [])

  const handleUp = data => {
    api.cms.module.get({ id: data.id }).then(res1 => {
      upForm.resetFields()
      if (res1.component_id) {
        api.cms.component.get({ id: res1.component_id }).then(res2 => {
          if (res2?.deleted)
            res1 = { ...res1, component_id: undefined, component_name: undefined }
          setUpData(res1)
          upForm.setFieldsValue(res1)
          setUpOpen(true)
        })
      } else {
        setUpData(res1)
        upForm.setFieldsValue(res1)
        setUpOpen(true)
      }
    })
  }

  const up = value => {
    api.cms.module.update(Object.assign(upData!, value)).then(() => {
      message.success('更新成功')
      setUpOpen(false)
      setRefreshKey(`${new Date().getTime()}`)
    }).catch(err => message.error(`更新失败, ${err.msg}`))
  }

  const handlePreview = data => {
    api.cms.module.preview({ sn_id: data.sn_id }).then(res => {
      const html = new Blob([res], { type: "text/html" })
      const url = window.URL.createObjectURL(html)
      const a = document.createElement('a')
      a.href = url
      a.target = '_blank'
      a.click()
    }).catch(err => message.error(`预览失败，${err.msg}`))
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 70 },
    { title: 'Sn_id', dataIndex: 'sn_id' },
    { title: '模块名称', dataIndex: 'name' },
    { title: '组件名称', dataIndex: 'component_name' },
    { title: '当前页面', dataIndex: 'page_title' },
    { title: '状态', dataIndex: 'status_name', width: 100, render: (_, { status, status_name }) => <Tag color={status == '1' ? 'green' : 'volcano'}>{status_name}</Tag> }
  ]

  const addItems: MyFormItems[] = [
    {
      type: 'text',
      item: { name: 'name', label: '模块名称', rules: [{ required: true, message: '请填写名称' }] },
    },
    {
      type: 'text',
      item: { name: 'sn_id', label: 'Sn_id', rules: [{ required: true, message: '请填写 sn_id' }] }
    },
    {
      type: 'select',
      item: { name: 'component_id', label: '组件', rules: [{ required: true, message: '请选择组件' }] },
      option: { options: data }
    }
  ]

  const upItems: MyFormItems[] = [
    {
      type: 'text',
      item: { name: 'name', label: '模块名称', rules: [{ required: true, message: '请填写名称' }] },
    },
    {
      type: 'select',
      item: { name: 'component_id', label: '组件', rules: [{ required: true, message: '请选择组件' }] },
      option: { options: data }
    }
  ]

  const headerActions: MyTableAction[] = type !== '2' ? [{ title: "新增", key: "add", type: "btn", icon: <PlusOutlined />, handler: { formItems: addItems, showType: "drawer" } }] : []

  const itemActions: MyTableAction[] = [
    { title: "编辑", key: "edit", type: "btn", handler: { pick: 'all' } },
    { title: "数据配置", key: "source", type: "btn", handler: { pick: 'all' } },
    { title: '上线', key: 'online', type: 'btn', condition: { values: { status: [0, 2] } }, handler: { pick: ['id'] } },
    { title: '下线', key: 'offline', type: 'btn', condition: { values: { status: 1 } }, handler: { pick: ['id'] } },
    { title: '发布', key: 'publish', type: 'btn', handler: { pick: ['id'] } },
    { title: '预览', key: 'preview', type: 'btn', handler: { pick: ['sn_id'] } },
    { title: '清除缓存', key: 'clear_cache', type: 'btn', handler: { pick: ['id'] } },
    { title: "删除", key: "delete", type: "confirmBtn", handler: { pick: ["id"] } }
  ]

  const queryFormItems: MyFormItems[] = [
    { type: 'text', item: { name: 'name_like_', label: '模块名称' } },
    { type: 'select', item: { name: 'page_id', label: '当前页面' }, option: { options: pageOption, style: { width: '180px' } } }
  ]

  const requestConfig: MyTableRequestConfig = {
    list: { url: '/1/cms/module/page_list', method: 'get' },
    add: { url: '/1/cms/module/add', method: 'post' },
    delete: { url: '/1/cms/module/delete', method: 'post' },
    online: { url: '/1/cms/module/online', method: 'post' },
    offline: { url: '/1/cms/module/offline', method: 'post' },
    publish: { url: '/1/cms/module/publish', method: 'post' },
    clear_cache: { url: '/1/cms/module/clear_cache', method: 'post' }
  }

  const doAction = (action: MyTableAction, item) => {
    if (action.key === "source") {
      setRecordItem(item)
      if (!item.component_id)
        message.error('没有选择组件')
      else
        api.cms.component.get({ id: item.component_id }).then(res => {
          if (res.data_content) {
            setDataContent(JSON.parse(res.data_content))
          } else {
            setDataContent(undefined)
            message.error("所选组件无内容！")
          }
          getModule(item)
        })
    } else if (action.key === 'edit') {
      handleUp(item)
    } else if (action.key === 'preview') {
      handlePreview(item)
    }
    return undefined
  }

  const getModule = (item: { id: any; }) => {
    item.id ? api.cms.module.get({ id: item.id }).then(res => {
      setModuleData(res.data)
      setDrawerShow(true)
    }) : setModuleData(undefined)
  }

  const requestParams = (action: MyTableAction, item: any) => {
    if (action.key === 'add') {
      item = { ...item, type }
    }
    return item;
  }

  const handleSave = () => {
    const params = { ...recordItem, data: JSON.stringify(configData) }
    api.cms.module.update(params).then(() => {
      message.success("保存成功！")
      setDrawerShow(false)
    }).catch(err => message.error(`保存失败！，${err.msg}`))
  }

  return (
    <>
      {contextHolder}
      <MyTable
        queryConfig={{ formItems: queryFormItems }}
        tableConfig={{ columns, rowKey: "id", operateWidth: 200 }}
        actionConfig={{ headerActions, itemActions, doAction }}
        requestConfig={requestConfig}
        filterConfig={{ requestParams }}
        tabConfig={{ name: "type", defaultKey: "1", tabs: [{ key: "1", label: "公共模块" }, { key: "2", label: "私有模块" }, { key: "3", label: "公共配置模块" }], onChange: item => setType(item) }}
        refreshTriggerKey={refreshKey}
      />
      <Drawer
        width={'90%'}
        title={"数据配置"}
        placement="right"
        maskClosable={false}
        onClose={() => setDrawerShow(false)}
        destroyOnClose
        open={drawerShow}
        extra={
          <Space>
            <Button onClick={() => setDrawerShow(false)}>取消</Button>
            <Button type="primary" onClick={() => handleSave()}>保存</Button>
          </Space>
        }
      >
        <DataConfig dataContent={dataContent} initData={moduleData} onFinish={v => configData = v} />
      </Drawer>
      <Drawer
        width={'90%'}
        title={'模板编辑'}
        open={upOpen}
        onClose={() => setUpOpen(false)}
        extra={
          <Space>
            <Button onClick={() => setUpOpen(false)}>取消</Button>
            <Button type="primary" onClick={() => upForm.submit()}>确认</Button>
          </Space>
        }
      >
        <MyForm form={{ onFinish: up, labelCol: { span: 2 }, form: upForm }} items={upItems} layout={[1]} />
      </Drawer>
    </>
  )
}

export default PublicModuleManage;