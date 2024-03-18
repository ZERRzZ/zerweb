import { useEffect, useState } from 'react'
import { Button, Divider, Drawer, Form, Modal, Popconfirm, Tag, message, Space, Table } from 'antd'

import './index.css'
import '@/assets/css/common.scss'
import api from '@/api/adminService'
import MyForm, { MyFormItems } from "@/components/MyForm"
import { PlusOutlined, SyncOutlined } from '@ant-design/icons'
import { clearDictCache } from '@/utils/dictUtils'
import { ColumnType } from 'antd/es/table'

const DictManage: React.FC = () => {

  const [data, setData] = useState<Dictionary[]>([]) // 表格数据
  const [page, setPage] = useState(1) // 页码
  const [total, setTotal] = useState<number>() // 总页码
  const [size, setSize] = useState(10) // 每页条数
  const [filters, setFilters] = useState<Dictionary>() // 筛选条件
  const [addOpen, setAddOpen] = useState(false) // 新增弹窗开关
  const [addForm] = Form.useForm()
  const [upOpen, setUpOpen] = useState(false) // 更新弹窗开关
  const [upForm] = Form.useForm() // 更新表单
  const [upData, setUpData] = useState<Dictionary>() // 更新项数据

  const [id, setId] = useState('')
  const [childData, setChildData] = useState<DictionaryItems[]>([])
  const [childPage, setChildPage] = useState(1)
  const [childTotal, setChildTotal] = useState<number>()
  const [childSize, setChildSize] = useState(10)
  const [childFilters, setChildFilters] = useState<DictionaryItems>()
  const [childOpen, setChildOpen] = useState(false)
  const [childAddOpen, setChildAddOpen] = useState(false)
  const [childAddForm] = Form.useForm()
  const [childUpOpen, setChildUpOpen] = useState(false)
  const [childUpForm] = Form.useForm()
  const [childUpData, setChildUpData] = useState<DictionaryItems>()

  useEffect(() => search({ page_no: page, page_size: size }), [])

  const search = params => {
    api.ms.dictionary.list(params).then((res: any) => {
      const data: Dictionary[] = res.list?.map(l => ({ key: l.id, ...l }))
      setData(data)
      setTotal(res.total)
    })
  }

  const handleAdd = () => {
    setAddOpen(true)
    addForm.resetFields()
  }

  const add = data => {
    api.ms.dictionary.create(data).then(() => {
      message.success('添加成功')
      setAddOpen(false)
      setPage(1)
      search({ page_size: size, ...filters }) // 新增完成后查第一页
    }).catch(err => message.error(`添加失败，${err.msg}`))
  }

  const handleUp = (value: Dictionary) => {
    setUpData(value)
    upForm.setFieldsValue(value)
    setUpOpen(true)
  }

  const up = data => {
    api.ms.dictionary.update(Object.assign(upData!, data)).then(() => {
      message.success('更新成功')
      setUpOpen(false)
      search({ page_no: page, page_size: size, ...filters }) // 更新完成后查当前页
    }).catch(err => message.error(`更新失败, ${err.msg}`))
  }

  const remove = data => {
    api.ms.dictionary.delete([data]).then(() => {
      message.success('删除成功')
      const preLastPage = Math.ceil(total! / size)
      const curLastPage = Math.ceil((total! - 1) / size)
      if (page !== preLastPage) // 删除时的页码是否为最后一页
        search({ page_no: page, page_size: size, ...filters })
      else {
        setPage(curLastPage)
        search({ page_no: curLastPage, page_size: size, ...filters })
      }
    }).catch(err => message.success(`删除失败, ${err.msg}`))
  }

  const handlePageChange = (page: number, size: number) => {
    setPage(page)
    setSize(size)
    search({ page_no: page, page_size: size, ...filters })
  }

  const filter = e => {
    setPage(1)
    setFilters(e)
    search({ page_size: size, ...e }) // 筛选完成时查询第一页
  }

  const searchItems: MyFormItems[] = [
    {
      type: 'text',
      item: { name: 'name', label: '字典名称' },
    },
    {
      type: 'text',
      item: { name: 'code', label: '字典编码' },
    },
    { type: 'submit', innerHtml: '查询' },
    { type: 'reset', option: { onClick: () => search({ page_no: page, page_size: size }) } }
  ]

  const addItems: MyFormItems[] = [
    {
      type: 'text',
      item: { name: 'name', label: '字典名称', rules: [{ required: true, message: '字典名称必需填写' }] },
    },
    {
      type: 'text',
      item: { name: 'code', label: '字典编码', rules: [{ required: true, message: '字典编码必需填写' }] },
    },
    {
      type: 'text',
      item: { name: 'description', label: '字典描述', rules: [{ required: true, message: '描述必需填写' }] },
    },
    {
      type: 'radio',
      item: { name: 'status', label: '状态', rules: [{ required: true, message: '字典状态必须确认' }] },
      option: { options: [{ label: '启用', value: 1 }, { label: '禁用', value: 2 }] }
    },
    {
      type: 'submit',
      span: 20,
      item: { wrapperCol: { offset: 20 } }
    },
    {
      type: 'reset',
      span: 4,
      item: { wrapperCol: { offset: 3 } }
    }
  ]

  const handleChildOpen = value => {
    setChildOpen(true)
    setId(value.id)
    setChildPage(1) // 每次打开时重置
    setChildSize(10) // 每次打开时重置
    setChildFilters(undefined) // 每次打开时重置
    childSearch(value.id, {}) // 每次打开时重置
  }

  const childSearch = (id: string, params) => {
    api.ms.dictionary.itemList({ dic_id: id, ...params }).then((res: any) => {
      const data: DictionaryItems[] = res.list?.map(l => ({ key: l.id, ...l }))
      setChildData(data)
      setChildTotal(res.total)
    })
  }

  const handleChildAdd = () => {
    setChildAddOpen(true)
    childAddForm.resetFields()
  }

  const childAdd = data => {
    api.ms.dictionary.itemCreate({ dic_id: id, ...data }).then(() => {
      message.success('添加成功')
      setChildAddOpen(false)
      setChildPage(1)
      childSearch(id, { page_size: childSize, ...childFilters })
    }).catch(err => message.error(`添加失败，${err.msg}`))
  }

  const handleChildUp = (value: DictionaryItems) => {
    setChildUpData(value)
    childUpForm.setFieldsValue(value);
    setChildUpOpen(true)
  }

  const childUp = data => {
    api.ms.dictionary.itemUpdate({ dic_id: id, ...childUpData, ...data }).then(() => {
      message.success('更新成功')
      setChildUpOpen(false)
      childSearch(id, { page_no: childPage, page_size: childSize, ...childFilters })
    }).catch(err => message.error(`更新失败, ${err.msg}`))
  }

  const childRemove = data => {
    api.ms.dictionary.itemDelete({ id: data }).then(() => {
      message.success('删除成功')
      const preLastPage = Math.ceil(childTotal! / childSize)
      const curLastPage = Math.ceil((childTotal! - 1) / childSize)
      if (childPage !== preLastPage)
        childSearch(id, { page_no: childPage, page_size: childSize, ...childFilters })
      else {
        setChildPage(curLastPage)
        childSearch(id, { page_no: curLastPage, page_size: childSize, ...childFilters })
      }
    }).catch(err => message.success(`删除失败, ${err.msg}`))
  }

  const handleChildPageChange = (page: number, size: number) => {
    setChildPage(page)
    setChildSize(size)
    childSearch(id, { page_no: page, page_size: size, ...childFilters })
  }

  const childFilter = e => {
    setChildFilters(e)
    setChildPage(1)
    childSearch(id, { page_size: childSize, ...e })
  }

  const childSearchItems: MyFormItems[] = [
    {
      type: 'text',
      item: { name: 'name', label: '名称' },
    },
    { type: 'submit', innerHtml: '查询' },
    { type: 'reset', option: { onClick: () => { childSearch(id, { page_no: page, page_size: size }) } } }
  ]

  const childAddItems: MyFormItems[] = [
    {
      type: 'text',
      item: { name: 'name', label: '名称', rules: [{ required: true, message: '名称必须填写' }] }
    },
    {
      type: 'text',
      item: { name: 'value', label: '数据值', rules: [{ required: true, message: '数据值必须填写' }] }
    },
    {
      type: 'text',
      item: { name: 'description', label: '字典描述', rules: [{ required: true, message: '描述必需填写' }] },
    },
    {
      type: 'radio',
      item: { name: 'status', label: '状态', rules: [{ required: true, message: '状态必须确认' }] },
      option: { options: [{ label: '启用', value: 1 }, { label: '禁用', value: 2 }] }
    },
    {
      type: 'number',
      item: { name: 'orders', label: '顺序', rules: [{ required: true, message: '顺序必须确认' }] },
      option: { min: 1 }
    },
    {
      type: 'submit',
      span: 20,
      item: { wrapperCol: { offset: 20 } }
    },
    {
      type: 'reset',
      span: 4,
      item: { wrapperCol: { offset: 3 } }
    }
  ]

  const columns: ColumnType<Dictionary>[] = [
    { title: '字典名称', dataIndex: 'name' },
    { title: '字典编码', dataIndex: 'code' },
    { title: '字典描述', dataIndex: 'description' },
    {
      title: '字典状态',
      width: 100,
      dataIndex: 'status',
      render: (_, { status }) => status === 1 ? <Tag color='green'>启用</Tag> : <Tag color='volcano'>禁用</Tag>
    },
    {
      title: '字典操作',
      width: 200,
      render: (_, value) => <>
        <a onClick={() => handleUp(value)}>编辑</a>
        <Divider type='vertical' />
        <a onClick={() => handleChildOpen(value)}>字典配置</a>
        <Divider type='vertical' />
        <Popconfirm title="确认删除?" onConfirm={() => remove(value.id)}><a className="danger-operation">删除</a></Popconfirm>
      </>
    }
  ]

  const childColumns: ColumnType<DictionaryItems>[] = [
    { title: '名称', dataIndex: 'name' },
    { title: '数据值', dataIndex: 'value' },
    { title: '字典描述', dataIndex: 'description' },
    { title: '顺序', dataIndex: 'orders', width: 60 },
    {
      title: '字典状态',
      width: 100,
      dataIndex: 'status',
      render: (_, { status }) => status === 1 ? <Tag color='green'>启用</Tag> : <Tag color='volcano'>禁用</Tag>
    },
    {
      title: '操作',
      width: 120,
      render: (_, value) => <>
        <a onClick={() => handleChildUp(value)}>编辑</a>
        <Divider type='vertical' />
        <Popconfirm title="确认删除?" onConfirm={() => childRemove(value.id)}><a className="delete-color">删除</a></Popconfirm>
      </>
    }
  ]

  const clearCache = () => {
    api.ms.dictionary.clearCache().then(() => {
      clearDictCache();
      message.success('清理缓存成功！');
    })
  }

  return (
    <div className="dictManage">
      <div className="searchBox">
        <MyForm form={{ layout: 'inline', onFinish: filter }} items={searchItems} gutter={[0, 10]} />
        <Space>
          <Button type='primary' onClick={handleAdd} icon={<PlusOutlined />}>新增</Button>
          <Button type='primary' onClick={clearCache} icon={<SyncOutlined />}>清理缓存</Button>
        </Space>
      </div>
      <Table className='dictTable' columns={columns} dataSource={data} pagination={{ current: page, total, pageSize: size, onChange: handlePageChange }} />
      <Modal title="新增字典" bodyStyle={{ padding: '1em 1em 0 1em' }} open={addOpen} footer={null} onCancel={() => setAddOpen(false)}>
        <MyForm form={{ onFinish: add, labelCol: { span: 5 }, form: addForm }} items={addItems} layout={[1]} />
      </Modal>
      <Modal title="编辑字典" bodyStyle={{ padding: '1em 1em 0 1em' }} open={upOpen} footer={null} onCancel={() => setUpOpen(false)}>
        <MyForm form={{ onFinish: up, labelCol: { span: 5 }, form: upForm, initialValues: upData }} items={addItems} layout={[1]} />
      </Modal>
      <Drawer width={'50%'} title="字典配置" placement="right" onClose={() => setChildOpen(false)} open={childOpen}>
        <div className="searchBox">
          <MyForm form={{ layout: 'inline', onFinish: childFilter }} items={childSearchItems} gutter={[0, 10]} />
          <Button type='primary' onClick={handleChildAdd}>新增</Button>
        </div>
        <Table className='dictTable' columns={childColumns} dataSource={childData} pagination={{ current: childPage, total: childTotal, pageSize: childSize, onChange: handleChildPageChange }} />
      </Drawer>
      <Modal title="新增字典项" bodyStyle={{ padding: '1em 1em 0 1em' }} open={childAddOpen} footer={null} onCancel={() => setChildAddOpen(false)}>
        <MyForm form={{ onFinish: childAdd, labelCol: { span: 5 }, form: childAddForm }} items={childAddItems} layout={[1]} />
      </Modal>
      <Modal title="编辑字典项" bodyStyle={{ padding: '1em 1em 0 1em' }} open={childUpOpen} footer={null} onCancel={() => setChildUpOpen(false)}>
        <MyForm form={{ onFinish: childUp, labelCol: { span: 5 }, form: childUpForm, initialValues: childUpData }} items={childAddItems} layout={[1]} />
      </Modal>
    </div>
  )

}

export default DictManage

/**
 * 字典
 * @param id ID
 * @param key Key
 * @param name 名称
 * @param code 值
 * @param description 描述
 * @param status 状态，1：启用，2：禁用
 */
export interface Dictionary {
  id: string
  key: string
  name: string
  code: string
  description: string
  status: 1 | 2
}

/**
 * 字典子项
 * @param id ID
 * @param key Key
 * @param dic_id 父字典 ID
 * @param name 名称
 * @param value 值
 * @param description 描述
 * @param status 状态，1：启用，2：禁用
 * @param orders 排序
 */
export interface DictionaryItems {
  id: string
  key: string
  dic_id: string
  name: string
  value: string
  description: string
  status: 1 | 2
  orders: number
}