import { useEffect, useState } from "react"
import { ColumnType } from "antd/es/table"
import { Button, Divider, Form, Modal, Popconfirm, Tag, message, Space, Table } from "antd"

import './index.css'
import '@/assets/css/common.scss'
import api from '@/api/adminService'
import { clearCategoryCache } from "@/utils/dictUtils"
import MyForm, { MyFormItems } from "@/components/MyForm"
import { PlusOutlined, SyncOutlined } from "@ant-design/icons"

const ClassManage: React.FC = () => {

  const [data, setData] = useState<Category[]>([])
  const [origin, setOrigin] = useState<Category[]>([])
  const [addOpen, setAddOpen] = useState(false)
  const [addForm] = Form.useForm()
  const [childAddOpen, setChildAddOpen] = useState(false)
  const [childAddForm] = Form.useForm()
  const [upOpen, setUpOpen] = useState(false)
  const [upForm] = Form.useForm()
  const [upData, setUpData] = useState<Category>()

  useEffect(() => search(-1), [])

  const search = (status: number) => {
    api.ms.category.get({ status }).then(res => {
      const data = res.children as Category[]
      setKey(data)
      setOrigin(data)
      setData(data)
    })
  }

  const setKey = (arr: Category[]) => {
    if (arr) {
      arr.forEach(a => {
        a.key = a.id
        a.children && setKey(a.children)
      })
    }
  }

  const handleAdd = () => {
    setAddOpen(true)
    addForm.resetFields()
  }

  const add = data => {
    api.ms.category.add({ parent_id: '1', ...data }).then(() => {
      message.success('添加成功')
      setAddOpen(false)
      search(-1)
    }).catch(err => message.error(`添加失败，${err.msg}`))
  }

  const handleUp = (value: Category) => {
    setUpData(value)
    upForm.setFieldsValue(value)
    setUpOpen(true)
  }

  const up = data => {
    api.ms.category.update(Object.assign(upData!, data)).then(() => {
      message.success('更新成功')
      setUpOpen(false)
      search(-1)
    }).catch(err => message.error(`更新失败, ${err.msg}`))
  }

  const statusUp = (value: Category, status: number) => {
    api.ms.category.oneclickStatus({ id: value.id!, status }).then(() => {
      message.success('修改成功')
      search(-1)
    }).catch(err => message.error(`修改失败, ${err.msg}`))
  }

  const handleChildAdd = (value: Category) => {
    setUpData(value)
    setChildAddOpen(true)
    childAddForm.resetFields()
  }

  const childAdd = data => {
    api.ms.category.add({ parent_id: upData?.id, ...data }).then(() => {
      message.success('添加成功')
      setChildAddOpen(false)
      search(-1)
    }).catch(err => message.error(`添加失败，${err.msg}`))
  }

  const remove = data => {
    api.ms.category.delete({ id: data }).then(() => {
      message.success('删除成功')
      search(-1)
    }).catch(err => message.error(`删除失败, ${err.msg}`))
  }

  const columns: ColumnType<Category>[] = [
    { title: '分类名称', dataIndex: 'name' },
    { title: '分类编码', dataIndex: 'code' },
    { title: '顺序', width: 60, dataIndex: 'orders' },
    {
      title: '状态',
      width: 100,
      dataIndex: 'status',
      render: (_, { status }) => status === 1 ? <Tag color='green'>启用</Tag> : <Tag color='volcano'>禁用</Tag>
    },
    {
      title: '分类操作',
      width: 270,
      render: (_, value) => <>
        <a onClick={() => handleUp(value)}>编辑</a>
        <Divider type='vertical' />
        <a onClick={() => statusUp(value, 1)}>启用</a>
        <Divider type='vertical' />
        <a onClick={() => statusUp(value, 2)}>禁用</a>
        <Divider type='vertical' />
        <a onClick={() => handleChildAdd(value)}>添加下级</a>
        <Divider type='vertical' />
        <Popconfirm title="确认删除?" onConfirm={() => remove(value.id)}><a className="danger-operation">删除</a></Popconfirm>
      </>
    }
  ]

  const addItems: MyFormItems[] = [
    {
      type: 'text',
      item: { name: 'name', label: '分类名称', rules: [{ required: true, message: '分类名称必需填写' }] }
    },
    {
      type: 'text',
      item: { name: 'code', label: '分类编码', rules: [{ required: true, message: '分类编码必需填写' }] }
    },
    {
      type: 'number',
      item: { name: 'orders', label: '顺序', rules: [{ required: true, message: '分类必需要有顺序' }] }
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

  const clearCache = () => {
    api.ms.category.clearCache().then(() => {
      clearCategoryCache();
      message.success('清理缓存成功！');
    })
  }

  const filter = e => {
    let searchList = [] as any[]
    const deepFilter = (arr: any[]) => {
      arr.map(item => {
        if (!item.name?.toLowerCase().includes(e?.name?.toLowerCase()) && item.children) {
          deepFilter(item.children)
        } else {
          const newData = arr.filter((d) => {
            return d.name?.toLowerCase().includes(e?.name?.toLowerCase());
          })
          searchList = searchList.concat(newData)
          const result = Array.from(new Set(searchList))
          setData(result)
        }
      })
    }
    if (e.name) {
      deepFilter(origin)
    } else {
      setData(origin)
    }
  }

  const searchItems: MyFormItems[] = [
    {
      type: 'text',
      item: { name: 'name', label: '分类名称' },
    },
    { type: 'submit', innerHtml: '查询' },
    { type: 'reset', option: { onClick: () => search(-1) } }
  ]

  return (
    <div className="classManage">
      <div className="searchBox">
        <MyForm form={{ layout: 'inline', onFinish: filter }} items={searchItems} gutter={[0, 10]} />
        <Space>
          <Button type='primary' onClick={handleAdd} icon={<PlusOutlined />}>新增</Button>
          <Button type='primary' onClick={clearCache} icon={<SyncOutlined />}>清理缓存</Button>
        </Space>
      </div>
      <Table className='classTable' columns={columns} dataSource={data} />
      <Modal title="新增分类" bodyStyle={{ padding: '1em 1em 0 1em' }} open={addOpen} footer={null} onCancel={() => setAddOpen(false)}>
        <MyForm form={{ onFinish: add, labelCol: { span: 5 }, form: addForm }} items={addItems} layout={[1]} />
      </Modal>
      <Modal title="新增子分类" bodyStyle={{ padding: '1em 1em 0 1em' }} open={childAddOpen} footer={null} onCancel={() => setChildAddOpen(false)}>
        <MyForm form={{ onFinish: childAdd, labelCol: { span: 5 }, form: childAddForm }} items={addItems} layout={[1]} />
      </Modal>
      <Modal title="编辑分类" bodyStyle={{ padding: '1em 1em 0 1em' }} open={upOpen} footer={null} onCancel={() => setUpOpen(false)}>
        <MyForm form={{ onFinish: up, labelCol: { span: 5 }, form: upForm, initialValues: upData }} items={addItems} layout={[1]} />
      </Modal>
    </div>
  )

}

export default ClassManage

/**
 * 分类
 * @param id ID
 * @param key Key
 * @param parent_id 父 ID
 * @param name 名称
 * @param orders 排序
 * @param level 层级
 * @param children 子
 */
export interface Category {
  id?: string
  key?: string
  parent_id?: string
  name?: string
  orders?: number
  status?: number
  level?: number
  children?: Category[]
}