import { useState } from 'react';
import { ColumnType } from 'antd/es/table';
import { useForm } from 'antd/es/form/Form';
import { Button, Card, Divider, Drawer, Form, Modal, Popconfirm, Table, Tag, message } from 'antd';

import './index.css'
import MyCategory from '@/components/MyCategory';
import MyForm, { MyFormItems } from '@/components/MyForm';
import api, { DocContent } from '@/api/adminService'
import { uid } from '@/utils/utility';

export default function PageOption() {

  const [data, setData] = useState<DocContent[]>([]) // 表格数据
  const [page, setPage] = useState(1) // 页码
  const [total, setTotal] = useState<number>() // 总页码
  const [size, setSize] = useState(10) // 每页条数
  const [id, setId] = useState('') // 分类
  const [addOpen, setAddOpen] = useState(false) // 新增弹窗开关
  const [addForm] = Form.useForm()
  const [upOpen, setUpOpen] = useState(false) // 更新弹窗开关
  const [upPageData, setUpPageData] = useState<any>()
  const [addUnitForm] = useForm()
  const [addUnitOpen, setAddUnitOpen] = useState(false)
  const [addUnitData, setAddUnitData] = useState<Option[]>()
  const [templateId, setTemplateId] = useState<string[]>([]) // 每次添加组件的组件 id 集合
  const [upData, setUpData] = useState<any[]>([]) // 更新的模板数据
  const [upResult, setUpResult] = useState<any[]>([]) // 编辑后要传给后端的数据
  const [editResultOpen, setEditResultOpen] = useState(false)
  const [editResultForm] = Form.useForm()
  const [editResultItems, setEditResultItems] = useState<MyFormItems[]>()
  const [nowEdit, setNowEdit] = useState<{ key: number, index: number, snid: string }>()

  const handleCategoryChange = id => {
    setId(id)
    search(id as string, page, size)
  }

  const search = (id: string, page: number, size: number) => {
    api.cms.doc.pageList({ category: id, type: 1, page_no: page, page_size: size }).then(res => {
      const data = res.list?.map(l => ({ ...l.doc_metadata, title: l.current_data_doc_content?.title, key: l.doc_metadata?.id }))
      setData(data as DocContent[])
      setTotal(res.total)
    })
  }

  const handleAdd = () => {
    addForm.resetFields()
    setAddOpen(true)
  }

  const add = v => {
    api.cms.doc.add({
      "doc_content": { title: v.title },
      "doc_metadata": { sn_id: v.sn_id, template_doc_metadata_id: v.template_doc_metadata_id, doc_type: v.doc_type, category: v.category }
    }).then(() => {
      message.success('新增成功')
      setAddOpen(false)
      setPage(1)
      search(id, 1, size) // 新增完成后查第一页
    }).catch(err => message.error(`新增失败，${err.msg}`))
  }

  const remove = data => {
    api.cms.doc.delete({ id: [data.id], sn_id: [data.sn_id], status: data.status }).then(() => {
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
    api.cms.doc.changeStatus({ id: [value.id], sn_id: [value.sn_id], status: 0 }).then(() => {
      message.success('下线成功')
      search(id, page, size)
    }).catch(err => message.error(`下线失败, ${err.msg}`))
  }

  const handleOnline = value => {
    api.cms.doc.publish({ id: [value.id], sn_id: [value.sn_id], status: value.status }).then(() => {
      message.success('上线成功')
      search(id, page, size)
    }).catch(err => message.error(`上线失败, ${err.msg}`))
  }

  const addItems: MyFormItems[] = [
    {
      type: 'multiLevelOpt',
      item: { name: 'category', label: '分类', rules: [{ required: true, message: '请选择分类' }] },
      option: { code: 'cms_page_option', split: ",", option: { style: { width: 150 } } }
    },
    {
      type: 'text',
      item: { name: 'title', label: '页面名称', rules: [{ required: true, message: '请填写名称' }] },
    },
    {
      type: 'text',
      item: { name: 'sn_id', label: 'sn_id', rules: [{ required: true, message: '请填写 sn_id' }] }
    },
    {
      type: 'select',
      item: { name: 'doc_type', label: '数据类型', rules: [{ required: true, message: '请选择数据类型' }] },
      option: {
        style: { width: 150 },
        options: [
          { label: 'JSON', value: 1 },
          { label: 'HTML', value: 2 }
        ]
      }
    },
    {
      type: 'submit',
      span: 6,
      item: { wrapperCol: { offset: 16 } }
    },
    {
      type: 'button',
      innerHtml: '取消',
      span: 18,
      item: { wrapperCol: { offset: 4 } },
      option: { onClick: () => { setAddOpen(false); setUpOpen(false) } }
    }
  ]

  const columns: ColumnType<DocContent>[] = [
    { title: '页面名称', dataIndex: 'title' },
    { title: 'snId', dataIndex: 'sn_id' },
    {
      title: '状态',
      width: 80,
      dataIndex: 'status',
      render: (_, { status }) => status == 1 ? <Tag color='green'>已发布</Tag> : <Tag color='volcano'>待发布</Tag>
    },
    {
      title: '操作',
      width: 160,
      render: (_, value) => <>
        <a onClick={() => handleUp(value)}>编辑</a>
        <Divider type='vertical' />
        {value.status === 1 ? <a onClick={() => handleOffline(value)}>下线</a> : <a onClick={() => handleOnline(value)}>上线</a>}
        <Divider type='vertical' />
        <Popconfirm title="确认删除?" onConfirm={() => remove(value)}><a className="delete-color">删除</a></Popconfirm>
      </>
    }
  ]

  const handleUp = value => {
    api.cms.doc.get({ sn_id: value.sn_id }).then(data => {
      data.current_data_doc_content?.content ? setUpResult(JSON.parse(data.current_data_doc_content.content)) : setUpResult([])
      data.current_data_doc_content?.ext_content ? setUpData(JSON.parse(data.current_data_doc_content.ext_content)) : setUpData([])
      setUpPageData(value)
      setUpOpen(true)
    })
  }

  const handleAddUnit = () => {
    addUnitForm.resetFields()
    setAddUnitOpen(true)
    api.ms.category.getOption({ code: 'cms_template_option', level: -1 }).then(res => setAddUnitData(res.children?.map(r => ({ value: r.value, label: r.label, isLeaf: false }))))
  }

  const addUnit = value => {
    api.cms.doc.get({ sn_id: value.cms_template_option[1] }).then(data => {
      setTemplateId(id => {
        id.push(data.doc_metadata?.sn_id!)
        return [...id]
      })
      if (!data.publish_data_doc_content?.ext_content) return message.warning('当前模板无数据')
      setUpData(upData => {
        upData.push(JSON.parse(data.publish_data_doc_content?.ext_content!))
        return [...upData]
      })
      setAddUnitOpen(false)
    })
  }

  const handleDeleteUnit = (i: number) => {
    setTemplateId(id => {
      id.splice(i, 1)
      return [...id]
    })
    setUpData(upData => {
      upData.splice(i, 1)
      return [...upData]
    })
    setUpResult(result => {
      result.splice(i, 1)
      return [...result]
    })
  }

  const handleAddResult = (u: any, i: number) => {
    if (upResult[i] && upResult[i][u.key] && upResult[i][u.key].length >= u.maxsize)
      return message.error(`最大数量不能超过${u.maxsize}`)
    setUpResult(result => {
      result[i] || (result[i] = { [u.key]: [] })
      const keys = u.data.filter(d => d.key !== 'action').map(d => d.key)
      const obj = { key: uid() }
      keys.forEach(v => obj[v] = undefined)
      result[i][u.key].push(obj)
      return JSON.parse(JSON.stringify(result))
    })
  }

  const handleEditResult = (record, u, i: number) => {
    setNowEdit({ key: record.key, index: i, snid: u.key })
    setEditResultItems([...upData[i].form.items, { type: 'submit' }])
    editResultForm.resetFields()
    editResultForm.setFieldsValue(record)
    setEditResultOpen(true)
  }

  const editResult = v => {
    setUpResult(result => {
      result[nowEdit?.index!][nowEdit?.snid!] = result[nowEdit?.index!][nowEdit?.snid!].map(r => r.key === nowEdit?.key ? ({ key: r.key, ...v }) : r)
      return JSON.parse(JSON.stringify(result))
    })
    setEditResultOpen(false)
  }

  const handleDelResult = (record, u, i: number) => {
    setUpResult(result => {
      result[i][u.key] = result[i][u.key].filter(r => r.key !== record.key)
      return JSON.parse(JSON.stringify(result))
    })
  }

  const addUnitItems: MyFormItems[] = [
    {
      type: 'cascader',
      item: { label: '数据模板', name: 'cms_template_option' },
      option: {
        options: addUnitData,
        loadData: (selectedOptions: any[]) => {
          const targetOption = selectedOptions[selectedOptions.length - 1]
          api.cms.doc.pageList({ category: targetOption.value, status: 1, page_no: 1, page_size: 999 }).then(data => {
            targetOption.children = data.list?.map(d => ({ label: d.publish_doc_content?.title, value: d.doc_metadata?.sn_id }))
            setAddUnitData([...addUnitData!])
          })
        }
      }
    },
    { type: 'submit' }
  ]

  const handleSave = () => {
    api.cms.doc.update({
      "doc_content": { content: JSON.stringify(upResult), ext_content: JSON.stringify(upData), title: upPageData.title },
      "doc_metadata": { ...upPageData, template_doc_metadata_id: JSON.stringify(templateId) }
    }).then(() => {
      message.success('保存成功')
      search(id, page, size)
    }).catch(err => message.error(`保存失败，${err.msg}`))
  }

  return (
    <div className='page-option'>
      <MyCategory direction='col' code='cms_page_option' split=',' buildDefaultValue onChange={handleCategoryChange} />
      <div className='page-right'>
        <div className='page-filter'>
          <Button type='primary' onClick={handleAdd}>新增页面</Button>
        </div>
        <Table className='page-table' columns={columns} dataSource={data} pagination={{ current: page, total, pageSize: size, onChange: handlePageChange }} />
      </div>
      <Drawer width={600} title="新增页面" placement="right" onClose={() => setAddOpen(false)} open={addOpen}>
        <MyForm form={{ onFinish: add, labelCol: { span: 4 }, form: addForm }} items={addItems} layout={[1]} />
      </Drawer>
      <Drawer
        width={'90%'}
        title="编辑页面"
        bodyStyle={{ display: 'flex', flexFlow: 'column', gap: '1em' }}
        placement="right"
        onClose={() => setUpOpen(false)}
        open={upOpen}
        extra={
          <div className='page-btns'>
            <Button onClick={() => handleSave()}>保存</Button>
            <Button type='primary' onClick={handleAddUnit}>添加组件</Button>
          </div>
        }
      >
        {
          upData && Array.isArray(upData) && upData.map((u, i) => (
            <Card key={i} title={u?.name} extra={<Popconfirm title="确认删除?" onConfirm={() => handleDeleteUnit(i)} ><a style={{ fontSize: '1.2em' }}>&#9587;</a></Popconfirm>}>
              <Table
                style={{ width: '100%', overflow: 'auto' }}
                dataSource={upResult[i] && upResult[i][u.key]}
                columns={[...u?.data.map(d => ({ key: d.key, title: d.name, dataIndex: d.key })), {
                  title: '操作',
                  key: 'action',
                  render: (_, record) => <div className='page-btns'>
                    <a onClick={() => handleEditResult(record, u, i)}>编辑</a>
                    <Popconfirm title="确认删除?" onConfirm={() => handleDelResult(record, u, i)}><a>删除</a></Popconfirm>
                  </div>
                }]}
              />
              <Button type="dashed" block onClick={() => handleAddResult(u, i)}>添加数据</Button>
            </Card>
          ))
        }
        <Modal title='添加组件' width={'60%'} open={addUnitOpen} onCancel={() => setAddUnitOpen(false)} footer={null}>
          <MyForm form={{ form: addUnitForm, onFinish: addUnit }} items={addUnitItems} layout={[1]} />
        </Modal>
        <Modal title='编辑数据' width={'60%'} open={editResultOpen} onCancel={() => setEditResultOpen(false)} footer={null}>
          <MyForm form={{ onFinish: editResult, form: editResultForm }} items={editResultItems} layout={[1]} />
        </Modal>
      </Drawer>
    </div>
  )

}

interface Option {
  value?: string | number | null;
  label: React.ReactNode;
  children?: Option[];
  isLeaf?: boolean;
}