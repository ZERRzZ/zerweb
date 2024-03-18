import { useEffect, useState } from 'react';
import { useForm } from 'antd/es/form/Form';
import { Button, Drawer, Space, Tag, message } from 'antd';

import './index.scss';
import api from '@/api/adminService';
import { PlusOutlined } from '@ant-design/icons';
import MyForm, { MyFormItems } from '@/components/MyForm';
import MyCategoryTable from '@/components/MyTable/MyCategoryTable';
import MyTable, { MyTableAction, MyTableRequestConfig } from '@/components/MyTable';

export default function PageManage() {

  const [layoutOption, setLayoutOption] = useState<any>()

  const [activeSnid, setActiveSnid] = useState<string>()
  const [activeId, setActiveId] = useState<string>()

  const [refreshTriggerKey, setRefreshTriggerKey] = useState<string>()

  const [historyOpen, setHistoryOpen] = useState(false)

  const [upForm] = useForm()
  const [upOpen, setUpOpen] = useState(false)
  const [upData, setUpData] = useState<any>()

  useEffect(() => {
    api.cms.layout.pageList({ page_no: 1, page_size: 999 }).then(res => {
      setLayoutOption(res.list?.map(v => ({ label: v.name, value: v.id })))
    })
  }, [])

  const handleUp = data => {
    api.cms.page.get({ id: data.id }).then(res1 => {
      upForm.resetFields()
      if (res1.layout_id)
        api.cms.layout.get({ id: res1.layout_id }).then(res2 => {
          if (res2.deleted)
            res1 = { ...res1, layout_id: undefined }
          setUpData(res1)
          upForm.setFieldsValue(res1)
          setUpOpen(true)
        })
      else {
        setUpData(res1)
        upForm.setFieldsValue(res1)
        setUpOpen(true)
      }
    })
  }

  const up = value => {
    api.cms.page.update(Object.assign(upData!, value)).then(() => {
      message.success('更新成功')
      setUpOpen(false)
      setRefreshTriggerKey(`${new Date().getTime()}`)
    }).catch(err => message.error(`更新失败, ${err.msg}`))
  }

  const columns = [
    { title: 'ID', dataIndex: 'id' },
    { title: '标题', dataIndex: 'title' },
    { title: 'sn_id', dataIndex: 'sn_id' },
    { width: 120, title: '版本', dataIndex: 'version' },
    {
      width: 140,
      title: '缩略图',
      dataIndex: 'ex_image',
      option: { renderType: 'image' }
    },
    {
      width: 100,
      title: '状态',
      dataIndex: 'status_name',
      render: (_, { status, status_name }) => <Tag color={status == '1' ? 'green' : 'volcano'}>{status_name}</Tag>
    }
  ]

  const queryFormItems: MyFormItems[] = [
    {
      type: 'text',
      item: { name: 'title_like_', label: '标题' }
    }
  ]

  const addItems: MyFormItems[] = [
    {
      type: 'select',
      item: { label: '布局', name: 'layout_id', rules: [{ required: true, message: '请选择布局' }] },
      option: { options: layoutOption }
    },
    {
      type: 'text',
      item: { name: 'title', label: '标题', rules: [{ required: true, message: '请填写标题' }] }
    },
    {
      type: 'text',
      item: { name: 'page_url', label: '路径', rules: [{ required: true, message: '请填写路径' }] }
    },
    {
      type: 'text',
      item: { name: 'sn_id', label: 'sn_id', rules: [{ required: true, message: '请填写 sn_id' }] },
    },
    {
      type: 'myImageUpload',
      item: { name: 'ex_image', label: '缩略图' }
    }
  ]

  const upItems: MyFormItems[] = [
    {
      type: 'multiLevelOpt',
      item: { name: 'category', label: '分类', rules: [{ required: true, message: '请选择分类' }] },
      option: { code: 'cms_page_category', split: "," }
    },
    {
      type: 'select',
      item: { label: '布局', name: 'layout_id', rules: [{ required: true, message: '请选择布局' }] },
      option: { options: layoutOption }
    },
    {
      type: 'text',
      item: { name: 'title', label: '标题', rules: [{ required: true, message: '请填写标题' }] }
    },
    {
      type: 'text',
      item: { name: 'page_url', label: '路径', rules: [{ required: true, message: '请填写路径' }] }
    },
    {
      type: 'text',
      item: { name: 'sn_id', label: 'sn_id', rules: [{ required: true, message: '请填写 sn_id' }] },
      option: { disabled: true }
    },
    {
      type: 'myImageUpload',
      item: { name: 'ex_image', label: '缩略图' }
    }
  ]

  const requestConfig: MyTableRequestConfig = {
    list: { url: '/1/cms/page/page_list', method: 'get' },
    add: { url: '/1/cms/page/add', method: 'post' },
    online: { url: '/1/cms/page/online', method: 'post' },
    offline: { url: '/1/cms/page/offline', method: 'post' },
    publish: { url: '/1/cms/page/publish', method: 'post' },
    delete: { url: '/1/cms/page/delete', method: 'post' },
    batch_publish: { url: '/1/cms/page/batch_publish', method: 'post' },
    clear_cache: { url: '/1/cms/page/clear_cache', method: 'post' }
  }

  const headerActions: MyTableAction[] = [
    { title: "新增", key: "add", type: "btn", icon: <PlusOutlined />, handler: { formItems: addItems, showType: "drawer" } },
    { title: "批量发布", key: "batch_publish", isBatch: true, type: "btn", handler: { pick: ["id"] } }
  ]

  const itemActions: MyTableAction[] = [
    { title: '编辑', key: 'edit', type: 'btn', handler: { pick: ['id'] } },
    { title: '设计', key: 'design', type: "link", linkFormater: item => `/page/PageManage/${item.id}` },
    { title: '预览', key: 'preview', type: 'btn', handler: { pick: ['id'] } },
    { title: '上线', key: 'online', type: 'btn', condition: { values: { status: [0, 2] } }, handler: { pick: ['id'] } },
    { title: '下线', key: 'offline', type: 'btn', condition: { values: { status: 1 } }, handler: { pick: ['id'] } },
    { title: '发布', key: 'publish', type: 'btn', handler: { pick: ['id'] } },
    { title: '历史', key: 'history', type: 'btn', handler: { pick: ['id', 'sn_id'] } },
    { title: '清除缓存', key: 'clear_cache', type: 'btn', handler: { pick: ['id'] } },
    { title: '删除', key: 'delete', type: 'confirmBtn', handler: { pick: ['id'] } }
  ]

  const doAction = (action: MyTableAction, items) => {
    if (action.key === 'edit') {
      handleUp(items)
    } else if (action.key === 'preview') {
      api.cms.page.preview({ id: items.id }).then(res => {
        const html = new Blob([res], { type: "text/html" })
        const url = window.URL.createObjectURL(html)
        const a = document.createElement('a')
        a.href = url
        a.target = '_blank'
        a.click()
      }).catch(err => message.error(`预览失败，${err.msg}`))
    } else if (action.key === 'history') {
      setHistoryOpen(true)
      setActiveSnid(items.sn_id)
      setActiveId(items.id)
    }
    return undefined
  }

  const historyColumns = [
    { title: 'ID', dataIndex: 'id' },
    { title: '页面 sn_id', dataIndex: 'page_sn_id' },
    { title: '版本', dataIndex: 'version' },
    { title: '发布时间', dataIndex: 'publish_time' }
  ]

  const historyRequestConfig: MyTableRequestConfig = { list: { url: `/1/cms/page/publish_list?sn_id=${activeSnid}`, method: 'get' } }

  const historyItemActions: MyTableAction[] = [{ title: '回溯此版本', key: 'backtrack', type: 'btn', condition: { values: { current_publish: false } }, handler: { pick: 'all' } }]

  const historyDoAction = (action: MyTableAction, items) => {
    if (action.key === 'backtrack') {
      api.cms.page.fallback({ id: activeId!, publish_id: items.id }).then(() => {
        setHistoryOpen(false)
        setRefreshTriggerKey(`${new Date().getDate()}`)
        message.success('回溯成功')
      }).catch(err => message.error(`回溯失败, ${err.msg}`))
    }
    return undefined
  }

  return (
    <>
      <MyCategoryTable
        tableProps={{
          queryConfig: { formItems: queryFormItems },
          requestConfig,
          tableConfig: { columns: columns, selectionType: "checkbox", rowKey: "id", operateWidth: 180 },
          actionConfig: { headerActions, itemActions, itemShowNumber: 3, doAction },
          refreshTriggerKey
        }}
        code="cms_page_category"
        columnName="category"
      />
      <Drawer
        width={1200}
        open={upOpen}
        title={'编辑组件'}
        onClose={() => setUpOpen(false)}
        extra={
          <Space>
            <Button type='primary' onClick={() => upForm.submit()}>确认</Button>
            <Button onClick={() => setUpOpen(false)}>取消</Button>
          </Space>
        }
      >
        <MyForm form={{ onFinish: up, labelCol: { span: 2 }, form: upForm }} items={upItems} layout={[1]} />
      </Drawer>
      <Drawer width={'60%'} open={historyOpen} destroyOnClose onClose={() => setHistoryOpen(false)} footer={null}>
        <MyTable
          requestConfig={historyRequestConfig}
          tableConfig={{ columns: historyColumns, operateWidth: 150 }}
          actionConfig={{ itemActions: historyItemActions, doAction: historyDoAction }}
          refreshTriggerKey={refreshTriggerKey}
        />
      </Drawer>
    </>
  )

}