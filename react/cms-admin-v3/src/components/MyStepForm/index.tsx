import { Button, StepProps, Steps, message } from 'antd'
import { ReactNode, useEffect, useState } from 'react'
import { useForm } from 'antd/es/form/Form'

import './index.scss'
import MyForm, { MyFormProps } from '../MyForm'

export default function MyStepForm({ items = [], stepFormRef, combined, buildInSubmit = true, onFinish }: MyStepFormProps) {

  const [stepItem, setStepItems] = useState<StepProps[]>()
  const [current, setCurrent] = useState(0)

  const formStep: any[] = []

  // 为每一个表单都设上一个 form
  items?.forEach((v, i) => {
    formStep[i] = `formGroup${i}`;
    [formStep[i]] = useForm()
    v.myForm ? v.myForm.form ? (v.myForm.form.form = formStep[i]) : v.myForm.form = { form: formStep[i] } : v.myForm = { form: { form: formStep[i] } }
  })

  useEffect(() => {
    setStepItems(items?.map(i => ({ title: i.label })))
  }, [])

  const validateFields = () => {
    const promises = items.map(v => v.myForm?.form?.form?.validateFields())
    return Promise.all(promises).then(result => {
      const obj: any = {}
      if (combined)
        result.forEach(r => Object.assign(obj, r))
      else
        result.forEach((v, i) => obj[items[i].name] = v)
      return obj
    })
  }

  const setFieldsValue = (value: any) => {
    if (combined)
      items.forEach(i => i.myForm?.form?.form?.setFieldsValue(value))
    else {
      const keys = Object.keys(value)
      keys.forEach(k => items.find(i => i.name === k)?.myForm?.form?.form?.setFieldsValue(value[k]))
    }
  }

  const preStep = () => setCurrent(current - 1 < 0 ? 0 : current - 1)

  const nextStep = () =>
    items[current].myForm?.form?.form?.validateFields()
      .then(() => setCurrent(current + 1 > items.length - 1 ? items.length - 1 : current + 1))
      .catch(() => message.error('当前表单验证未通过'))

  const handleSubmit = () => validateFields().then(v => onFinish?.(v))

  stepFormRef && (stepFormRef.current = {
    validateFields,
    setFieldsValue,
    preStep,
    nextStep
  })

  return (
    <div className='my-step-form'>
      <Steps current={current} items={stepItem} />
      <div className='my-step-form-box' style={{ transform: `translate(-${100 * current}%)` }}>
        {
          items.map((v, i) =>
            <div className='my-step-form-forms' key={i}>
              <MyForm {...v.myForm} />
            </div>
          )
        }
      </div>
      <div className='my-step-form-btns'>
        {current !== 0 && <Button onClick={() => preStep()}>上一步</Button>}
        {current < items.length - 1 && <Button onClick={() => nextStep()}>下一步</Button>}
        {buildInSubmit && current === items.length - 1 && <Button type='primary' onClick={handleSubmit}>提交</Button>}
      </div>
    </div>
  )

}

/**
 * 我的分步表单
 * @param items 每个卡片的配置
 * @param stepFormRef 传入 Ref 获取数据
 * @param combined 值是否组合在一起
 * @param buildInSubmit 是否内置提交
 * @param onFinish 完成时触发事件，当内置提交时用来获取值
 */
export interface MyStepFormProps {
  items?: MyStepFormItem[]
  stepFormRef?: React.MutableRefObject<MyStepFormRef | undefined>
  combined?: boolean
  buildInSubmit?: boolean
  onFinish?: (v: any) => void
}

/**
 * 卡片配置
 * @param name 表单字段 Key 值
 * @param label 步骤标题
 * @param myForm 我的表单配置
 */
export interface MyStepFormItem {
  name: string
  label?: ReactNode
  myForm?: MyFormProps
}

/**
 * 传入 Ref 携带的类型
 * @param getFieldsValue 获取组件表单的值
 * @param setFieldsValue 设置表单的值
 * @param preStep 上一步
 * @param nextStep 下一步
 */
export interface MyStepFormRef {
  validateFields: () => Promise<any>
  setFieldsValue: (value: any) => void
  preStep: () => void
  nextStep: () => void
}