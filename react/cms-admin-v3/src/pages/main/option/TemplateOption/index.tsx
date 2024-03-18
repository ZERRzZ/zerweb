import { useState } from 'react'
import { ColumnType } from 'antd/es/table'
import { Button, Divider, Drawer, Form, Modal, Popconfirm, Table, Tag, message } from 'antd'

import './index.css'
import MyCategory from '@/components/MyCategory'
import FormDesign from '@/components/FormDesign'
import api, { DocContent } from '@/api/adminService'
import MyForm, { MyFormItems, MyFormProps } from '@/components/MyForm'

export default function TemplateOption() {

  const [data, setData] = useState<DocContent[]>([]) // 表格数据
  const [page, setPage] = useState(1) // 页码
  const [total, setTotal] = useState<number>() // 总页码
  const [size, setSize] = useState(10) // 每页条数
  const [id, setId] = useState('') // 分类
  const [addOpen, setAddOpen] = useState(false) // 新增弹窗开关
  const [addForm] = Form.useForm()
  const [upOpen, setUpOpen] = useState(false) // 更新弹窗开关
  const [upForm] = Form.useForm() // 更新表单

  const [snidDisabled, setSnidDisabled] = useState(false)
  const [designOpen, setDesignOpen] = useState(false)
  const [designData, setDesignData] = useState<any>()
  const [designInitValue, setDesignInitValue] = useState<MyFormProps>()

  const handleCategoryChange = id => {
    setId(id)
    search(id as string, page, size)
  }

  const search = (id: string, page: number, size: number) => {
    api.cms.doc.pageList({ category: id, type: 0, page_no: page, page_size: size }).then(res => {
      const data = res.list?.map(l => ({ ...l.current_doc_content, sn_id: l.doc_metadata?.sn_id, category: l.doc_metadata?.category, key: l.doc_metadata?.sn_id, metaId: l.doc_metadata?.id, status: l.doc_metadata?.status }))
      setData(data as DocContent[])
      setTotal(res.total)
    })
  }

  const handleAdd = () => {
    addForm.resetFields()
    setSnidDisabled(false)
    setAddOpen(true)
  }

  const add = v => {
    api.cms.doc.add({
      "doc_content": { content: v.content, ext_content: v.ext_content, title: v.title },
      "doc_metadata": { sn_id: v.sn_id, category: v.category, doc_type: 3 }
    }).then(() => {
      message.success('新增成功')
      setAddOpen(false)
      setPage(1)
      search(id, 1, size) // 新增完成后查第一页
    }).catch(err => message.error(`新增失败，${err.msg}`))
  }

  const handleUp = (value: DocContent) => {
    // setUpData(value)
    upForm.setFieldsValue(value)
    setSnidDisabled(true)
    setUpOpen(true)
  }

  const up = data => {
    api.cms.doc.update({
      doc_content: { content: data.content, ext_content: data.ext_content, title: data.title },
      doc_metadata: { sn_id: data.sn_id, category: data.category, doc_type: 3 }
    }).then(() => {
      message.success('更新成功')
      setUpOpen(false)
      search(id, page, size) // 更新完成后查当前页
    }).catch(err => message.error(`更新失败, ${err.msg}`))
  }

  const remove = data => {
    api.cms.doc.delete({ id: [data.metaId], sn_id: [data.sn_id], status: data.status }).then(() => {
      message.success('删除成功')
      const preLastPage = Math.ceil(total! / size)
      const curLastPage = Math.ceil((total! - 1) / size)
      if (page !== preLastPage) // 删除时的页码是否为最后一页
        search(id, page, size)
      else {
        setPage(curLastPage)
        search(id, curLastPage, size)
      }
    }).catch(err => message.error(`删除失败, ${err.msg}`))
  }

  const handlePageChange = (page: number, size: number) => {
    setPage(page)
    setSize(size)
    search(id, page, size)
  }

  const handleOffline = value => {
    api.cms.doc.changeStatus({ id: [value.metaId], sn_id: [value.sn_id], status: 0 }).then(() => {
      message.success('下线成功')
      search(id, page, size)
    }).catch(err => message.error(`下线失败, ${err.msg}`))
  }

  const handleOnline = value => {
    api.cms.doc.publish({ id: [value.metaId], sn_id: [value.sn_id], status: value.status }).then(() => {
      message.success('上线成功')
      search(id, page, size)
    }).catch(err => message.error(`上线失败, ${err.msg}`))
  }

  const handleDesign = () => {
    const formData = addOpen ? addForm.getFieldsValue() : upOpen ? upForm.getFieldsValue() : undefined
    setDesignData(formData)
    setDesignInitValue(JSON.parse(formData.ext_content || null)?.form)
    setDesignOpen(true)
  }

  const designFinish = value => {
    const obj = {
      name: designData?.title,
      key: designData?.sn_id,
      type: 'dom',
      repeat: true,
      maxsize: 10,
      minsize: 1,
      size: 1,
      data: value.items.map(m => ({ name: m.item?.label, key: m.item?.name, type: m.type })),
      form: value
    }
    addForm && addForm.setFieldValue("ext_content", JSON.stringify(obj))
    upForm && upForm.setFieldValue("ext_content", JSON.stringify(obj))
    setDesignOpen(false)
  }

  const addItems: MyFormItems[] = [
    {
      type: 'multiLevelOpt',
      item: { name: 'category', label: '分类', rules: [{ required: true, message: '请选择分类' }] },
      option: { code: 'cms_template_option', split: ",", option: { style: { width: 150 } } }
    },
    {
      type: 'text',
      span: 12,
      item: { name: 'sn_id', label: 'sn_id', rules: [{ required: true, message: '请填写 sn_id' }], labelCol: { span: 4 } },
      option: { disabled: snidDisabled }
    },
    {
      type: 'text',
      span: 12,
      item: { name: 'title', label: '标题', rules: [{ required: true, message: '请填写标题' }], labelCol: { span: 4 } },
    },
    {
      type: 'code',
      item: { name: 'content', label: 'HTML' },
      option: { language: 'html', width: '1038px', height: '350px' }
    },
    {
      type: 'code',
      item: { name: 'ext_content', label: '数据模板' },
      option: { language: 'json', width: '1038px', height: '350px' }
    },
    {
      type: 'submit',
      span: 4,
      item: { wrapperCol: { offset: 12 } }
    },
    {
      type: 'button',
      span: 3,
      option: { type: 'primary', onClick: handleDesign },
      innerHtml: '数据模板设计'
    },
    {
      type: 'button',
      innerHtml: '取消',
      span: 1,
      item: { wrapperCol: { offset: 2 } },
      option: { onClick: () => { setAddOpen(false); setUpOpen(false) } }
    }
  ]

  const columns: ColumnType<DocContent>[] = [
    { title: 'ID', dataIndex: 'id', width: 180 },
    { title: '标题', dataIndex: 'title' },
    {
      title: '状态',
      width: 80,
      dataIndex: 'status',
      render: (_, { status }) => status === 1 ? <Tag color='green'>已发布</Tag> : <Tag color='volcano'>待发布</Tag>
    },
    { title: '创建时间', dataIndex: 'create_time', width: 120 },
    {
      title: '操作',
      width: 150,
      render: (_, value) => <>
        <a onClick={() => handleUp(value)}>编辑</a>
        <Divider type='vertical' />
        {value.status === 1 ? <a onClick={() => handleOffline(value)}>下线</a> : <a onClick={() => handleOnline(value)}>上线</a>}
        <Divider type='vertical' />
        <Popconfirm title="确认删除?" onConfirm={() => remove(value)}><a className="delete-color">删除</a></Popconfirm>
      </>
    }
  ]

  return (
    <div className='template-option'>
      <MyCategory direction='col' code='cms_template_option' split=',' buildDefaultValue onChange={handleCategoryChange} />
      <div className='template-right'>
        <div className='template-filter'>
          <Button type='primary' onClick={handleAdd}>新增模板</Button>
        </div>
        <Table className='template-table' columns={columns} dataSource={data} pagination={{ current: page, total, pageSize: size, onChange: handlePageChange }} />
      </div>
      <Drawer width={'1200px'} title="新增模板" placement="right" onClose={() => setAddOpen(false)} open={addOpen}>
        <MyForm form={{ onFinish: add, labelCol: { span: 2 }, form: addForm }} items={addItems} layout={[1]} />
      </Drawer>
      <Drawer width={'1200px'} title="编辑模板" placement="right" onClose={() => setUpOpen(false)} open={upOpen}>
        <MyForm form={{ onFinish: up, labelCol: { span: 2 }, form: upForm }} items={addItems} layout={[1]} />
      </Drawer>
      <Modal width={'90%'} title='数据模板编辑' open={designOpen} destroyOnClose onCancel={() => setDesignOpen(false)} footer={null}>
        <FormDesign initValue={designInitValue} onFinish={designFinish} />
      </Modal>
    </div>
  )

}