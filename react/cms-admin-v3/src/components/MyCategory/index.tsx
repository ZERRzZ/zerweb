import { useEffect, useState } from 'react'
import { Tree, message } from 'antd'
import { DataNode } from 'antd/es/tree'

import './index.css'
import { OptionModel } from '@/api/adminService'
import { getCacheDataByUrl, getCategoryOptionByCode } from '@/utils/dictUtils'

export default function MyCategory({ width = 180, code, url, direction = 'row', titles = [], visibleAll, multiSelect, split, buildDefaultValue, defaultValue, value, onChange }: MyCategoryProps) {

  if (multiSelect && direction === 'col') return <>{message.error('纵向展示不支持多选！')}</>

  const toInnerValue = (v, expand?) => {
    if (v && split) {
      if (multiSelect) {
        if (Array.isArray(v) && v.length > 0 && typeof v[0] === 'string') {
          return v.map(s => s.split(split));
        }
      } else {
        if (typeof v === 'string') {
          return v.split(split);
        }
      }
    }
    if (direction === 'col' && v && Array.isArray(v) && !expand) {
      return [v[v.length - 1]];
    }
    return v;
  }

  const toOuterValue = (v) => {
    if (direction === 'col' && v && typeof v === 'string') {
      v = findParent(v, colOptions).map(value => value.key);
    }
    if (v && split) {
      if (multiSelect) {
        if (Array.isArray(v) && v.length > 0 && Array.isArray(v[0])) {
          return v.map(s => s.join(split));
        }
      } else {
        if (Array.isArray(v)) {
          return v.join(split);
        }
      }
    }
    return v;
  }

  const [options, setOptions] = useState<CategoryData[]>([])
  const [colOptions, setColOptions] = useState<DataNode[]>([])
  const [expandKeys, setExpandKeys] = useState<any>()
  const [innerValue, setInnerValue] = useState<string[] | string[][]>([])
  const [outerValue, setOuterValue] = useState<string | string[] | string[][]>()

  const localTitles = ['一级', '二级', '三级', '四级', '五级', '六级', '七级', '八级', '九级', '十级']

  useEffect(() => {
    const v = value || defaultValue;
    if (v !== outerValue) {
      setOuterValue(v);
      setInnerValue(toInnerValue(v) || []);
      setExpandKeys(toInnerValue(v, true) || []);
    }
  }, [value])

  useEffect(() => {
    if (url)
      getCacheDataByUrl(url).then((res: OptionModel) => {
        setDefaultV(res)
        direction === 'row' ? setRowData(res.children!, 0) : setColData(res.children!)
      })
    else
      getCategoryOptionByCode(code).then(res => {
        setDefaultV(res)
        direction === 'row' ? setRowData(res.children!, 0) : setColData(res.children!)
      })
  }, [])

  const setDefaultV = (res: OptionModel) => {
    setTimeout(() => {
      if (buildDefaultValue && !defaultValue) {
        let defaultV = direction === 'row' && multiSelect ? [getFirstValues(res)] : getFirstValues(res);
        setExpandKeys(defaultV);
        const iValue = toInnerValue(defaultV);
        setInnerValue(iValue || []);
        const oValue = toOuterValue(defaultV);
        setOuterValue(oValue);
        onChange && onChange(oValue);
      }
    }, 1)
  }

  const setRowData = (data: OptionModel[], index: number) => {
    setOptions(options => {
      options.push({
        title: titles[index] || localTitles[index],
        visible: visibleAll || index === 0,
        list: data.map((v: any) => ({ title: v.title, key: v.value, visible: visibleAll || index === 0, parentKey: v.parentKey } as CategoryList))
      })
      return [...options]
    })
    const children = data.filter(v => v.children).map(v => {
      v.children?.forEach((c: any) => c.parentKey = v.value)
      return v.children
    }).flat()
    children && children.length > 0 && setRowData(children as OptionModel[], index + 1)
  }

  const setColData = (data: OptionModel[]) => {
    setColOptions(sub(data))
    function sub(data: OptionModel[]) {
      if (!data) return undefined
      return data.map(v => {
        return {
          title: v.title,
          key: v.value,
          children: sub(v.children!)
        }
      })
    }
  }

  const handleSelect = (list: CategoryList) => {
    let select = false
    if (multiSelect)
      select = !!(innerValue as string[][]).flat().find(v => list.key === v)
    else
      select = !!(innerValue as string[]).find(v => list.key === v)
    if (select) uncheck(list)
    else check(list)
    showOrHidden(select, list)
  }

  const uncheck = (list: CategoryList) => {
    let temp = [...innerValue] as string[] | string[][]
    const result = getAllChild(list)
    if (!multiSelect)
      result.forEach(l => {
        const index = (temp as string[]).findIndex(v => v === l)
        index !== -1 && (temp as string[]).splice(index, 1)
      })
    else
      temp = (temp as string[][]).map(t => t.filter(tt => !result.includes(tt))).filter(t => t.length > 0)
    onInnerValueChange(temp);
  }

  const check = (list: CategoryList) => {
    let temp = [...innerValue] as string[] | string[][]
    const result = getAllParent(list)
    if (!multiSelect)
      temp = result
    else {
      (temp as string[][]).forEach((v, i) => v.every(vv => result.includes(vv)) && temp.splice(i, 1));
      (temp as string[][]).push(result)
    }
    onInnerValueChange(temp);
  }

  const getAllParent = (list: CategoryList) => {
    const value: string[] = []
    getValueByKey(list.key)
    return value
    function getValueByKey(key: string) {
      options.forEach(o => {
        o.list.forEach(l => {
          if (l.key === key) {
            l.parentKey && getValueByKey(l.parentKey)
            value.push(l.key)
          }
        })
      })
    }
  }

  const getAllChild = (list: CategoryList) => {
    const value: string[] = []
    value.push(list.key)
    getValueByKey(list.key)
    return value
    function getValueByKey(key: string) {
      options.forEach(o => {
        o.list.forEach(l => {
          if (l.parentKey === key) {
            value.push(l.key)
            getValueByKey(l.key)
          }
        })
      })
    }
  }

  const showOrHidden = (select: boolean, list: CategoryList) => {
    if (visibleAll) return
    setOptions(options => {
      options.forEach(o => {
        if (!select)
          o.list.forEach(l => l.parentKey === list.key && (l.visible = true))
        else
          o.list.forEach(l => l.key !== list.key && getAllChild(list).includes(l.key) && (l.visible = false))
        o.visible = o.list.find(l => l.visible) ? true : false
      })
      return [...options]
    })
  }

  const setActiveClassName = (key: string) => {
    let boolean = false
    boolean = innerValue.flat().includes(key)
    return boolean ? 'active' : ''
  }

  /* 树组件 */

  const onSelect = key => {
    if (!key || key.length <= 0) return
    onInnerValueChange(key);
  }

  // 根据 value 找出所有父级元素的 value
  const findParent = (key: string, data?: DataNode[]) => {
    if (!data) {
      return undefined;
    }
    for (let i = 0; i < data.length; i++) {
      if (data[i].key === key) {
        return [data[i]];
      }
      const ret = findParent(key, data[i].children);
      if (ret) {
        ret.unshift(data[i]);
        return ret;
      }
    }
    return undefined;
  }

  // 获取第一个数据
  const getFirstValues = (data: OptionModel) => {
    const values: string[] = []
    // values.push(data.children![0].value!)
    sub(data.children!)
    function sub(data: OptionModel[]) {
      values.push(data[0].value!)
      data[0].children && sub(data[0].children)
    }
    return values
  }

  const onExpand = expandedKeys => setExpandKeys(expandedKeys)

  const onInnerValueChange = (v) => {
    setInnerValue(v || []);
    const oValue = toOuterValue(v.toString());
    setOuterValue(oValue);
    onChange && onChange(oValue);
  }

  return (
    direction === 'row' ?
      <div className='rowCategory'>
        {
          options.map((v, i) =>
            v.visible &&
            <div className='levels' key={i}>
              <span>{v.title}: </span>
              <div className='levelList'>
                {v.list.map((vv, ii) => vv.visible && <a key={ii} className={setActiveClassName(vv.key)} onClick={() => handleSelect(vv)}> {vv.title} </a>)}
              </div>
            </div>
          )
        }
      </div>
      :
      <Tree style={{ width, padding: '1em 0' }} treeData={colOptions} expandedKeys={expandKeys} selectedKeys={innerValue as string[]} onSelect={onSelect} onExpand={onExpand} />
  )

}

/**
 * 分类组件
 * @param width 宽度
 * @param code 分类编码
 * @param url 外部链接
 * @param direction 横向或纵向展示
 * @param titles 每级分类的标题
 * @param visibleAll 是否初始展开全部
 * @param multiSelect 是否多选
 * @param split 分割符
 * @param buildDefaultValue 是否需要内置默认值，默认取第一个
 * @param defaultValue 默认值
 * @param value 值
 * @param onChange 获取值
 */
export interface MyCategoryProps {
  width?: number
  code?: string
  url?: string
  direction?: 'row' | 'col'
  titles?: string[]
  visibleAll?: boolean
  multiSelect?: boolean
  split?: string
  buildDefaultValue?: boolean
  defaultValue?: string | string[] | string[][]
  value?: string[] | string[][] | string
  onChange?: (value: string[] | string[][] | string) => void
}

/**
 * 分类数据
 * @param title 每层分类标题
 * @param visible 是否可视
 * @param list 分类列表
 */
export interface CategoryData {
  title: string
  visible: boolean
  list: CategoryList[]
}

/**
 * 分类数据列表
 * @param title 名称
 * @param key 值
 * @param visible 是否可视
 * @param parentKey 父级 Key
 */
export interface CategoryList {
  title: string
  key: string
  visible: boolean
  parentKey: string
}