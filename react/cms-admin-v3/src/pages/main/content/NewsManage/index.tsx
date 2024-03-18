import { Dayjs } from 'dayjs';
import { useForm } from 'antd/es/form/Form';
import { useContext, useEffect, useState } from 'react';
import { Button, Divider, Drawer, Modal, Space, message } from 'antd';

import './index.css';
import MyForm, { MyFormItems } from '@/components/MyForm';
import api, { News } from '@/api/adminService';
import MyTable, { MyTableAction, MyTableRequestConfig } from '@/components/MyTable';
import { ConfigContext } from '@/stories/ConfigStore';

export default function NewsManage() {

  const [addForm] = useForm()
  const [addOpen, setAddOpen] = useState(false)

  const [previewOpen, setPreviewOpen] = useState<boolean>(false)
  const [previewData, setPreviewData] = useState<News>()

  const [userRole, setUserRole] = useState<string[]>([])
  const [statusTab, setStatusTab] = useState<any>([])
  const [refreshTriggerKey, setRefreshTriggerKey] = useState('')
  const { userHasPems } = useContext(ConfigContext);

  useEffect(() => {
    api.ms.pemUser.currentUserAuth({}).then(res => {
      if (res.role_alias) {
        setUserRole(res.role_alias)
      }
    })
    api.ms.dictionary.getOption({ code: 'cms_news_status' }).then(res => {
      setStatusTab(res.map(r => ({ key: r.value, label: r.label })))
    })
  }, [])

  const handleAdd = () => {
    addForm.resetFields()
    setAddOpen(true)
  }

  const handleSave = () => {
    api.cms.news.add({ ...addForm.getFieldsValue(), status: 1 }).then(() => {
      message.success('草稿添加成功')
      setAddOpen(false)
      setRefreshTriggerKey(`${new Date().getTime()}`)
    }).catch(err => message.error(`草稿添加失败，${err.msg}`))
  }

  const handleSubmit = () => {
    addForm.validateFields().then(res => {
      api.cms.news.add({ ...res, status: 2 }).then(() => {
        message.success('提交成功')
        setAddOpen(false)
        setRefreshTriggerKey(`${new Date().getTime()}`)
      }).catch(err => message.error(`提交失败，${err.msg}`))
    })
  }

  const previewNews = res => {
    setPreviewData(res)
    setPreviewOpen(true)
  }

  const range = (start: number, end: number) => {
    const result: number[] = []
    for (let i = start; i < end; i++) {
      result.push(i)
    }
    return result
  }

  const disabledDateTime = (now: Dayjs) => {
    if (now?.year() === new Date().getFullYear() && now?.month() === new Date().getMonth() && now?.date() === new Date().getDate()) {
      if (now?.hour() === new Date().getHours()) {
        if (now?.minute() === new Date().getMinutes()) {
          return {
            disabledHours: () => range(0, new Date().getHours()),
            disabledMinutes: () => range(0, new Date().getMinutes()),
            disabledSeconds: () => range(0, new Date().getSeconds())
          }
        } {
          return {
            disabledHours: () => range(0, new Date().getHours()),
            disabledMinutes: () => range(0, new Date().getMinutes()),
          }
        }
      } else {
        return {
          disabledHours: () => range(0, new Date().getHours()),
        }
      }
    }
  }

  const queryFormItems: MyFormItems[] = [
    {
      type: 'text',
      item: { name: 'id', label: 'ID' }
    },
    {
      type: 'text',
      item: { name: 'title_like_or_', label: '资讯标题' }
    },
    {
      type: 'multiLevelOpt',
      item: { name: 'source', label: '资讯来源' },
      option: { code: "cms_news_source", split: ',', option: { style: { width: 150 } } }
    },
    {
      type: 'multiLevelOpt',
      item: { name: 'category', label: '资讯分类' },
      option: { code: "cms_news_category", split: ',', option: { style: { width: 150 } } }
    },
    {
      type: 'dateTimeRange',
      item: { name: 'create_time', label: '创建时间' }
    },
    {
      type: 'text',
      item: { name: 'keyword_like_', label: '关键词' }
    }
  ]

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 70 },
    { title: '资讯标题', dataIndex: 'title', key: 'title' },
    { title: '资讯来源', dataIndex: 'source_name', key: 'source', width: 150 },
    { title: '分类', dataIndex: 'category_name', key: 'category_id', width: 80 },
    { title: '创建时间', dataIndex: 'create_time', key: 'create_time', width: 170 },
    { title: '创建者', dataIndex: 'creator', key: 'creator', width: 100 },
    { title: '状态', dataIndex: 'status_name', key: 'status ', option: { renderType: 'tag' }, width: 100 }
  ]

  const addItems: MyFormItems[] = [
    {
      type: 'text',
      item: { name: 'title', label: '资讯标题', rules: [{ required: true, message: '请输入标题' }] }
    },
    {
      type: 'multiLevelOpt',
      item: { name: 'source', label: '资讯来源', rules: [{ required: true, message: '请选择来源' }] },
      option: { code: "cms_news_source", split: ',', option: { style: { width: 150 } } }
    },
    {
      type: 'text',
      item: { name: 'keyword', label: '关键词' }
    },
    {
      type: 'multiLevelOpt',
      item: { name: 'category', label: '资讯分类', rules: [{ required: true, message: '请选择分类' }] },
      option: { code: "cms_news_category", split: ',', option: { style: { width: 150 } } }
    },
    {
      type: 'myImageUpload',
      item: { name: 'image', label: '封面图片', rules: [{ required: true, message: '请上传图片' }], tooltip: '支持png、jepg、jpg、gif格式' },
    },
    {
      type: 'editor',
      item: { name: 'content', label: '内容' },
      option: { width: 800 }
    },
    {
      type: 'dateTime',
      item: { name: 'plan_publish_time', label: '定时发布' },
      option: {
        disabledDate: cur => cur && cur < new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
        disabledTime: disabledDateTime
      }
    },
    {
      type: 'dateTime',
      item: { name: 'publish_time', label: '前台展示时间(发布时间)', labelCol: { span: 4 } }
    }
  ]

  const headerActions: MyTableAction[] = [
    { title: "新增", key: "add", type: "btn", condition: { pem: 'news_add' } },
    { title: '批量提交', key: 'batch_submit', isBatch: true, condition: { pem: 'news_submit' }, handler: { pick: ["id"], params: { status: 2 }, requestUrl: 'batch_submit' } },
    { title: "批量删除", key: "batch_delete", isBatch: true, condition: { pem: 'news_delete' }, handler: { pick: ["id"], requestUrl: 'batch_delete' } }
  ]

  const itemActions: MyTableAction[] = [
    { title: "查看", key: "view", type: "btn", handler: { showType: 'editForm' } },
    { title: '预览', key: 'preview', type: 'btn', condition: { pem: 'news_preview' }, handler: { pick: ['id'], success: res => previewNews(res) } },
    { title: "下线", key: "offline", type: "btn", condition: { values: { status: 4 }, pem: 'news_offline' }, handler: { pick: ["id"], params: { status: 5 }, requestUrl: "offline" } },
    { title: "提交", key: "submit", type: "btn", condition: { values: { status: [1, 5, 6, 7] }, pem: 'news_submit' }, handler: { pick: ["id"], params: { status: 2 }, requestUrl: "submit" } },
    { title: "撤回", key: "revoke", type: "btn", condition: { values: { status: [2, 3] }, pem: 'news_withdraw' }, handler: { pick: ["id"], params: { status: 7 }, requestUrl: "revoke" } },
    { title: "修改", key: "edit", type: "btn", condition: { values: { status: [1, 2, 5, 6, 7] }, pem: 'news_update' }, handler: { formItems: addItems, showType: "drawer", pick: ["id", "status"], requireDetail: true, title: '修改', ignoreFormValidate: true } },
    { title: "驳回", key: "reject", type: "btn", condition: { values: { status: 2 }, pem: 'news_refuse' }, handler: { pick: ["id"], params: { status: 6 }, requestUrl: "refuse" } },
    { title: "通过", key: "up", type: "btn", condition: { values: { status: 2, plan_publish_time_not_: null }, pem: 'news_publish' }, handler: { pick: ["id"], params: { status: 3 }, requestUrl: "publish" } },
    { title: "发布", key: "up2", type: "btn", condition: { values: { status: 2, plan_publish_time: null }, pem: 'news_publish' }, handler: { pick: ["id"], params: { status: 4 }, requestUrl: "publish" } },
    { title: "置顶", key: "to_top", type: "btn", condition: { values: { status: 4, orders: 0 }, pem: 'news_to_top' }, handler: { pick: ["id"] } },
    { title: "取消置顶", key: "cancel_to_top", type: "btn", condition: { values: { status: 4, orders: [1, 2, 3, 4, 5] }, pem: 'news_to_top' }, handler: { pick: ["id"] } },
    { title: "删除", key: "delete", type: "confirmBtn", condition: { values: { status: [1, 5, 6, 7] }, pem: 'news_delete' }, handler: { pick: ["id"] } }
  ]

  const requestConfig: MyTableRequestConfig = {
    detail: { url: '/1/cms/news/get', method: 'get' },
    list: { url: '/1/cms/news/page_list', method: 'get' },
    batch_change_status: { url: '/1/cms/news/batch_change_status', method: 'post' },
    batch_submit: { url: '/1/cms/news/batch_submit', method: 'post' },
    batch_delete: { url: '/1/cms/news/batch_delete', method: 'post' },
    change_status: { url: '/1/cms/news/change_status', method: 'post' },
    edit: { url: '/1/cms/news/update', method: 'post' },
    delete: { url: '/1/cms/news/delete', method: 'post' },
    to_top: { url: '/1/cms/news/to_top', method: 'post' },
    cancel_to_top: { url: '/1/cms/news/cancel_to_top', method: 'post' },
    preview: { url: '/1/cms/news/get', method: 'get' },
    offline: { url: '/1/cms/news/offline', method: 'post' },
    publish: { url: '/1/cms/news/publish', method: 'post' },
    refuse: { url: '/1/cms/news/refuse', method: 'post' },
    revoke: { url: '/1/cms/news/withdraw', method: 'post' },
    submit: { url: '/1/cms/news/submit', method: 'post' }
  }

  const doAction = (action: MyTableAction, item) => {
    if (action.key === 'add') {
      handleAdd()
    }
    return undefined
  }

  const filterConfig = {
    action: (action, item) => {
      if (action.key === 'edit' && item.status === 2 && !userRole.includes("SuperAdmin" || "NewsManager" || "NewsAuditer")) {
        return false
      }
      return true
    }
  }

  return (
    <div>
      <MyTable
        queryConfig={{ formItems: queryFormItems }}
        tableConfig={{ columns: columns, selectionType: "checkbox", rowKey: "id", scroll: { x: 1300 } }}
        actionConfig={{ headerActions, itemActions, doAction }}
        requestConfig={requestConfig}
        tabConfig={{ name: "status", defaultKey: "", tabs: [{ key: "", label: "全部" }, ...statusTab] }}
        filterConfig={filterConfig}
        refreshTriggerKey={refreshTriggerKey}
      />
      <Modal width={'80%'} open={previewOpen} style={{ zIndex: 10000 }} footer={null} destroyOnClose onCancel={() => setPreviewOpen(false)}>
        <div className='news-preview'>
          <h1>{previewData?.title}</h1>
          <div className='news-sub-title'>
            <span>发布时间: {previewData?.publish_time}</span>
            <span>阅读数量: 0</span>
            <span>来源：{previewData?.source_name}</span>
          </div>
          <Divider />
          <div className='news-content' dangerouslySetInnerHTML={{ __html: previewData?.content as string }}></div>
        </div>
      </Modal>
      <Drawer
        width={1000}
        open={addOpen}
        title='新增'
        onClose={() => setAddOpen(false)}
        extra={
          <Space>
            <Button onClick={() => setAddOpen(false)}>取消</Button>
            <Button type='primary' onClick={() => handleSave()}>保存</Button>
            {userHasPems(['news_submit']) && <Button type='primary' onClick={() => handleSubmit()}>提交</Button>}
          </Space>
        }
      >
        <MyForm form={{ labelCol: { span: 3 }, form: addForm }} items={addItems} layout={[1]} />
      </Drawer>
    </div>
  )
}