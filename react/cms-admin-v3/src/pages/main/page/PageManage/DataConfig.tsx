import { useEffect, useState } from 'react'
import { useForm } from 'antd/es/form/Form'
import useMessage from 'antd/es/message/useMessage'
import { Button, Card, Image, Modal, Popconfirm, Space, Table } from 'antd'

import './DataConfig.scss'
import { uid } from '@/utils/utility'
import MyForm, { MyFormProps, MyFormType } from '@/components/MyForm'

export default function DataConfig({ dataContent, initData, onFinish }: DataConfigProps) {

  const [multiForm] = useForm()
  const [multiOpen, setMultiOpen] = useState(false)
  const [multiFormProps, setMultiFormProps] = useState<MyFormProps>()
  const [activeKeys, setActiveKeys] = useState<any>()

  // 总数据
  const [data, setData] = useState<any>(JSON.parse(initData || "{}"))

  const [message, contextHolder] = useMessage();

  useEffect(() => {
    if (!initData)
      // 为全部模板生成初始值
      dataContent?.forEach(dc => {
        const arr: any = []
        for (let i = 0; i < dc.minSize; i++) {
          const obj = { key: uid() }
          dc.data.forEach(d => obj[d.key] = undefined)
          arr.push(obj)
        }
        setData(d => {
          d = { ...d, [dc.key]: arr }
          onFinish?.(d)
          return JSON.parse(JSON.stringify(d))
        })
      })
    else {
      setData(d => {
        d = JSON.parse(initData || "{}")
        const templateKey = dataContent?.map(dc => dc.key)
        for (let key in d) {
          templateKey?.includes(key) || (d[key] = undefined)
        }
        onFinish?.(d)
        return JSON.parse(JSON.stringify(d))
      })
    }
  }, [dataContent, initData])

  const handleMultiAdd = (dc: DataContent) => {
    if (data[dc.key].length >= dc.maxSize)
      return message.warning(`最大数量不能超过${dc.maxSize}`)
    setData(d => {
      const keys = dc.data.map(d => d.key)
      const obj = { key: uid() }
      keys.forEach(k => obj[k] = undefined)
      d[dc.key].push(obj)
      onFinish?.(d)
      return JSON.parse(JSON.stringify(d))
    })
  }

  const handleMultiUp = (dc: DataContent, record) => {
    setActiveKeys({ mainKey: dc.key, childKey: record.key })
    setMultiFormProps(dc.form)
    multiForm.resetFields()
    multiForm.setFieldsValue(record)
    setMultiOpen(true)
  }

  const multiUp = v => {
    setData(d => {
      d[activeKeys.mainKey] = d[activeKeys.mainKey].map(dd => dd.key === activeKeys.childKey ? { key: dd.key, ...v } : dd)
      onFinish?.(d)
      return JSON.parse(JSON.stringify(d))
    })
    setMultiOpen(false)
  }

  const handleMultiDel = (dc: DataContent, record) => {
    if (data[dc.key].length <= dc.minSize)
      return message.warning(`最小数量不能小于${dc.minSize}`)
    setData(d => {
      d[dc.key] = d[dc.key].filter(dd => dd.key !== record.key)
      onFinish?.(d)
      return JSON.parse(JSON.stringify(d))
    })
  }

  const handleSingleFormValuesChange = (values, dc) => {
    setData(d => {
      d = { ...d, [dc.key]: [values] }
      onFinish?.(d)
      return JSON.parse(JSON.stringify(d))
    })
  }

  const columnRender = d => {
    switch (d.type) {
      case 'myImageUpload':
      case 'image': return text => <Image src={text} style={{ width: 100, height: 50, objectFit: 'cover' }} />
      case 'list': return text => <Table dataSource={text?.map(t => ({ ...t, key: uid() }))} columns={d.list.map(l => ({ title: l.name, dataIndex: l.key, render: columnRender(l) }))} size='small' />
    }
  }

  return (
    <div className='data-config'>
      {
        dataContent && Array.isArray(dataContent) && dataContent.map(dc => dc?.maxSize > 1 ?
          <Card className='data-config-card' title={`${dc.name}数据`} key={dc.key}>
            <Table
              style={{ width: '100%', overflow: 'auto' }}
              dataSource={data?.[dc.key]}
              columns={[
                ...dc.data.map(d => ({ title: d.name, dataIndex: d.key, render: columnRender(d) })),
                {
                  width: 100,
                  title: '操作',
                  key: 'action',
                  fixed: 'right',
                  render: (_, record) =>
                    <Space>
                      <a onClick={() => handleMultiUp(dc, record)}>编辑</a>
                      <Popconfirm title="确认删除?" onConfirm={() => handleMultiDel(dc, record)}><a>删除</a></Popconfirm>
                    </Space>
                }
              ]}
            />
            <Button type="dashed" block onClick={() => handleMultiAdd(dc)}>添加数据</Button>
          </Card>
          :
          <Card className='data-config-card' title={`${dc.name}数据`} key={dc.key}>
            <MyForm {...dc.form} form={{ ...dc.form.form, initialValues: data?.[dc.key]?.[0], onValuesChange: (_, values) => handleSingleFormValuesChange(values, dc) }} />
          </Card>
        )
      }
      <Modal width={'90%'} title='编辑数据' open={multiOpen} onCancel={() => setMultiOpen(false)} onOk={() => multiForm.submit()}>
        <MyForm {...multiFormProps} form={{ onFinish: multiUp, form: multiForm, ...multiFormProps?.form }} />
      </Modal>
      {contextHolder}
    </div>
  )

}

export interface DataConfigProps {
  dataContent?: DataContent[]
  initData?: any
  onFinish?: (v: any) => void
}

/**
 * 数据模板
 * @param name 名称
 * @param key
 * @param minsize 最小数据量
 * @param maxsize 最大数据量
 * @param data 数据校验
 * @param form 数据表单
 */
export interface DataContent {
  name: string
  key: string
  minSize: number
  maxSize: number
  data: DataContentData[]
  form: MyFormProps
}

/**
 * 数据模板校验
 * @param name 表单项 label
 * @param key 表单项 name
 * @param type 表单项类型
 */
export interface DataContentData {
  name: string
  key: string
  type: MyFormType
}