import { ReactNode } from 'react'
import { Card } from 'antd'
import { useForm } from 'antd/es/form/Form'

import './index.css'
import MyForm, { MyFormProps } from '../MyForm'

export default function MyGroupForm({ items = [], groupFormRef, combined }: MyGroupFormProps) {

  const formGroups: any[] = []

  items?.forEach((v, i) => {
    formGroups[i] = `formGroup${i}`;
    [formGroups[i]] = useForm()
    v.myForm ? v.myForm.form ? (v.myForm.form.form = formGroups[i]) : v.myForm.form = { form: formGroups[i] } : v.myForm = { form: { form: formGroups[i] } }
  })

  groupFormRef && (groupFormRef.current = {
    validateFields() {
      const promises = items.map(v => v.myForm?.form?.form?.validateFields())
      return Promise.all(promises).then(result => {
        const obj: any = {}
        if (combined)
          result.forEach(r => Object.assign(obj, r))
        else
          result.forEach((v, i) => obj[items[i].name] = v)
        return obj
      })
    },
    resetFields() {
      items.forEach(v => v.myForm?.form?.form?.resetFields())
    },
    setFieldsValue(value: any) {
      if (combined)
        items.forEach(i => i.myForm?.form?.form?.setFieldsValue(value))
      else {
        const keys = Object.keys(value)
        keys.forEach(k => items.find(i => i.name === k)?.myForm?.form?.form?.setFieldsValue(value[k]))
      }
    }
  })

  return (
    <>
      {
        items?.map((c, i) =>
          <Card title={c.label} key={i}>
            <MyForm {...c.myForm} />
          </Card>
        )
      }
    </>
  )

}

/**
 * 我的分组表单
 * @param items 每个卡片的配置
 * @param groupFormRef 传入 Ref 获取数据
 * @param combined 值是否组合在一起
 */
export interface MyGroupFormProps {
  items?: MyGroupFormItem[]
  groupFormRef?: React.MutableRefObject<MyGroupFormRef | undefined>
  combined?: boolean
}

/**
 * 卡片配置
 * @param name 字段 Key 值
 * @param label 标题
 * @param myForm 我的表单配置
 */
export interface MyGroupFormItem {
  name: string
  label?: ReactNode
  myForm?: MyFormProps
}

/**
 * 传入 Ref 携带的类型
 * @param getFieldsValue 获取组件表单的值
 * @param resetFields 重置表单的值
 * @param setFieldsValue 设置表单的值
 */
export interface MyGroupFormRef {
  validateFields: () => Promise<any>
  resetFields: () => void
  setFieldsValue: (value: any) => void
}