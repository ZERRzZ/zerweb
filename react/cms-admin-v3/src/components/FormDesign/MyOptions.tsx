import React, { useState } from "react"
import { Button, Input } from "antd"

import './MyOptions.css'
import { uid } from "@/utils/utility"

export default function MyOptions({ options, onChange }: MyOptionsProps) {

  const [opt, setOpt] = useState(options)

  const handleChange = (e, type, index) => {
    setOpt(pre => {
      pre[index][type] = e.target.value
      onChange?.(pre)
      return [...pre]
    })
  }

  const sub = (index) => {
    setOpt(pre => {
      pre.splice(index, 1)
      onChange?.(pre)
      return [...pre]
    })
  }

  const add = () => {
    setOpt(pre => {
      pre.push({ label: '', value: uid() })
      onChange?.(pre)
      return [...pre]
    })
  }

  return (
    <div className="option">
      {
        opt.map((o, i) => {
          return (
            <div className="tag" key={i}>
              <Input placeholder="label 标签" title="label 标签" value={o.label} onChange={e => handleChange(e, 'label', i)} />
              <Input placeholder="value 值" title="value 值" value={o.value} onChange={e => handleChange(e, 'value', i)} />
              <Button size="small" shape='circle' danger={true} onClick={() => sub(i)}>-</Button>
            </div>
          )
        })
      }
      <Button type="primary" onClick={add}>新增选项</Button>
    </div>
  )

}

/** 
 * 表单设计器中配置表单的 options 时所用组件 
 */
export interface MyOptionsProps {
  options: any[]
  onChange?: (value: any[]) => void
}