import { useEffect, useState } from 'react'

import './CorMList.scss'
import api from '@/api/adminService'
import MyMultiLevelOpt from '@/components/MyMultiLevelOpt'

export default function CorMList({ type, code, pageId, onDragStart }: CorMListProps) {

  const [list, setList] = useState<any>()

  useEffect(() => {
    if (type === 'pubModule') {
      const params = { type: 1, page_no: 1, page_size: 999 }
      api.cms.module.pageList(params).then(res => setList(res.list))
    } else if (type === 'priModule') {
      const params = { type: 2, page_id: pageId, page_no: 1, page_size: 999 }
      api.cms.module.pageList(params).then(res => setList(res.list))
    }
  }, [type])

  const handleChange = v => {
    if (type === 'component') {
      const params = { category: v, page_no: 1, page_size: 999 }
      api.cms.component.pageList(params).then(res => setList(res.list))
    }
  }

  return (
    <div className='com-list'>
      {type === 'component' && <MyMultiLevelOpt type='cascader' code={code} split=',' selectFirst onChange={handleChange} />}
      <div className='list-box'>
        {
          list?.map(l => <div className='item' key={l.id} draggable onDragStart={e => onDragStart?.(e, l)} >{type === 'component' ? l.title : l.name}</div>)
        }
      </div>
    </div>
  )

}

export interface CorMListProps {
  type: 'component' | 'pubModule' | 'priModule'
  code?: string
  pageId?: string
  onDragStart: (e, l) => void
}