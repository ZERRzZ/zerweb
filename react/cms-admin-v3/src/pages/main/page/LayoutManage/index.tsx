import { PlusOutlined } from '@ant-design/icons'

import './index.scss'
import { MyFormItems } from '@/components/MyForm'
import MyCategoryTable from '@/components/MyTable/MyCategoryTable'
import { MyTableAction, MyTableRequestConfig } from '@/components/MyTable'

export default function LayoutManage() {

  const addItems: MyFormItems[] = [
    {
      type: 'text',
      item: { name: 'name', label: '名称', rules: [{ required: true, message: '请填写名称' }] }
    },
    {
      type: 'text',
      item: { name: 'sn_id', label: 'sn_id', rules: [{ required: true, message: '请填写 sn_id' }] },
    },
    {
      type: 'myImageUpload',
      item: { name: 'ex_image', label: '缩略图' }
    }
  ]

  const upItems: MyFormItems[] = [
    {
      type: 'multiLevelOpt',
      item: { name: 'category', label: '分类', rules: [{ required: true, message: '请选择分类' }] },
      option: { code: 'cms_layout_category', split: "," }
    },
    {
      type: 'text',
      item: { name: 'name', label: '名称', rules: [{ required: true, message: '请填写名称' }] }
    },
    {
      type: 'text',
      item: { name: 'sn_id', label: 'sn_id', rules: [{ required: true, message: '请填写 sn_id' }] },
      option: { disabled: true }
    },
    {
      type: 'myImageUpload',
      item: { name: 'ex_image', label: '缩略图' }
    }
  ]

  const columns = [
    { width: 60, title: 'ID', dataIndex: 'id' },
    { title: '名称', dataIndex: 'name' },
    { title: 'sn_id', dataIndex: 'sn_id' },
    {
      width: 100,
      title: '缩略图',
      dataIndex: 'ex_image',
      option: { renderType: 'image' }
    }
  ]

  const requestConfig: MyTableRequestConfig = {
    list: { url: '/1/cms/layout/page_list', method: 'get' },
    add: { url: '/1/cms/layout/add', method: 'post' },
    edit: { url: '/1/cms/layout/update', method: 'post' },
    delete: { url: '/1/cms/layout/delete', method: 'post' }
  }

  const headerActions: MyTableAction[] = [{ title: "新增", key: "add", type: "btn", icon: <PlusOutlined />, handler: { formItems: addItems, showType: "drawer" } }]

  const itemActions: MyTableAction[] = [
    { title: '编辑', key: 'edit', type: 'btn', handler: { pick: 'all', formItems: upItems, showType: "drawer", requireDetail: true } },
    { title: '设计', key: 'design', type: "link", linkFormater: item => `/page/LayoutManage/${item.id}` },
    { title: '删除', key: 'delete', type: 'confirmBtn', handler: { pick: ['id'] } }
  ]

  return (
    <MyCategoryTable
      tableProps={{ requestConfig, tableConfig: { columns: columns, operateWidth: 150 }, actionConfig: { headerActions, itemActions, itemShowNumber: 3 } }}
      code="cms_layout_category"
      columnName="category"
    />
  )

}