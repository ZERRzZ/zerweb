import React, { useState, useRef } from 'react';
import { ProTable, RequestData, TableDropdown } from '@ant-design/pro-components';
import type { ProTableProps, ProColumns, ActionType, RowEditableConfig } from '@ant-design/pro-components';
import { Button, Card, Divider, Dropdown, Form, Popconfirm, Space, TablePaginationConfig } from 'antd';
import MyForm, { MyFormProps } from '@/components/MyForm';
import type { ParamsType } from '@ant-design/pro-provider';
import type { OptionConfig, ToolBarProps } from '@ant-design/pro-table/es/components/ToolBar'
import merge from 'lodash.merge'
import { EllipsisOutlined } from '@ant-design/icons';
import { AlertRenderType } from '@ant-design/pro-table/es/components/Alert';

/**
 * MyProTable props 扩展的类型
 */
type extraProps<DataType, Params, ValueType> = {
  /** 可用来操作表格的ref，如`actionRef.current.reload()`重新加载。 */
  actionRef?: React.MutableRefObject<ActionType | undefined>;
  /**
   * 顶部的筛选表单。用的是 MyForm 组件。其中 From 组件的`onFinish`无需编写。
   */
  myForm?: MyFormProps;
  /**
   * “操作”列的配置。如“编辑”“删除”操作按钮。支持气泡确认框和下拉菜单。
   * @param dom - 当前单元格的dom。不常用。
   * @param entity - 当前行的记录。相当于 antd Table 的`record`。
   * @param index - 当前行的索引。
   * @param action - 可用来操作表格，如`reload()`重新加载。
   * @returns 操作用的按钮、链接等的配置项列表
   */
  operation?: (...args: Parameters<NonNullable<ProColumns<DataType, ValueType>['render']>>) => OperationItems;
  /**
   * 工具栏的配置。如“新增”操作按钮。支持气泡确认框和下拉菜单。改写自原生的 ProTable。
   * @param action - 可用来操作表格，如`reload()`重新加载。
   * @param rows - 选中的行的信息
   * @returns 操作用的按钮、链接等的配置项列表
   */
  toolbar?: ((...args: Parameters<NonNullable<ToolBarProps<DataType>['toolBarRender']>>) => OperationItems) | false;
  /**
   * 表格的行编辑后、保存时调用的方法
   * @param key - 行id，一般是唯一id
   * @param record - 当前修改的行的值
   * @param originRow - 原始值，可以用于判断是否修改
   * @param newLineConfig - 新建一行的配置
   */
  saveRowContent?: RowEditableConfig<DataType>['onSave'];
  /**  页签 */
  tabs?: {
    /** 页签名 */
    label: string,
    /** 页签值 */
    key: string,
  }[];
  /** 分页器。与 {@link https://ant.design/components/pagination-cn antd 分页} 的区别是，为`true`时显示分页器，有默认配置 */
  pagination?: boolean | TablePaginationConfig | undefined;
  /**
   * 自定义批量操作工具栏右侧的按钮链接等
   * @param args - 一个对象，包含`selectedRowKeys` `selectedRows` `onCleanSelected` 和 `intl`（见下文）
   *  @param selectedRowKeys - 选中的行的key
   *  @param selectedRows - 选中的行的所有记录
   *  @param onCleanSelected - 清除所有选中的行的方法
   * @returns 操作用的按钮、链接等的配置项列表
   */
  rowSelectAlert?: (...args: Parameters<Exclude<AlertRenderType<DataType>, false>>) => OperationItems;
  /** “操作”列的宽度 */
  operationWidth?: number | string;
  /** 表尾一行的计算方式。`lastRowCalc`先生效，然后是`setLastRow`方法 */
  lastRowCalc?: {
    /** 求和。填入需要求和的列的`key` */
    sum?: (keyof DataType)[],
    /** 求平均值。填入需要求平均值的列的`key` */
    average?: (keyof DataType)[],
  };
  /**
   * 设置表尾一行的方法。可用于统计等。`lastRowCalc`先生效，然后是`setLastRow`方法
   * @param lastRow - 经`lastRowCalc`计算过后的表尾记录
   * @param resData - 原始的表格数据
   * @param colsData - 按列分类后的表格数据
   * @returns 表尾一行的记录
   */
  setLastRow?: (lastRow: DataType, resData: DataType[], colsData: Record<string, any[]>) => DataType;
  /**
   * 表格工具栏。可配置刷新、密度和列配置按钮。
   * 与 {@link https://procomponents.ant.design/components/table#%E8%8F%9C%E5%8D%95%E6%A0%8F-options-%E9%85%8D%E7%BD%AE ProTable options 文档}
   * 区别是，为`true`时显示这3个按钮，有默认配置
   */
  options?: boolean | OptionConfig | undefined;
}

/** 原生 ProTable 支持的、现 MyProTable 不能使用的部分属性 */
type OmitType = 'toolBarRender' | 'tableAlertRender' | 'tableAlertOptionRender';

/**
 * MyProTable props 的类型。在 ProTable props 上进行扩展。
 */
type MyProTableProps<DataType, Params, ValueType = "text">
  = Omit<ProTableProps<DataType, Params, ValueType>, OmitType | keyof extraProps<DataType, Params, ValueType>> & extraProps<DataType, Params, ValueType>;

/**
 * 操作用的按钮、链接等的配置项列表
 */
type OperationItems = {
  /** 按钮呈现的形式 */
  type: 'link' | 'button' | 'dropdown' | 'table-dropdown',
  /** 按钮上的文字 */
  text: string,
  /** 按钮的`props`属性 */
  props?: Record<string, any>,
  /** 按钮的其他配置项 */
  config?: {
    /** 是否展示。默认展示 */
    show?: boolean,
    /** 是否有气泡确认框。默认没有 */
    popConfirm?: boolean,
  }
}[]

/**
 * 列表组件。在 {@link https://procomponents.ant.design/components/table ProTable} 的基础上进行扩展，封装了列表常用功能。
 */
function MyProTable<DataType extends Record<string, any>, Params extends ParamsType = ParamsType, ValueType = "text">
  (props: MyProTableProps<DataType, Params, ValueType>): JSX.Element {
  const [formInstance] = Form.useForm();
  const {
    actionRef,
    columns = [],
    request,
    operation,
    toolbar,
    saveRowContent,
    myForm,
    tabs,
    pagination,
    operationWidth,
    lastRowCalc,
    setLastRow,
    options,
    rowSelectAlert,
    ...restProps
  } = props;
  const _actionRef = actionRef ?? useRef<ActionType>();

  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);

  // 当前的页签
  const [currentTab, setCurrentTab] = useState<string>(tabs?.at?.(0)?.key ?? '');

  // 默认的“表格工具栏”配置
  const OptionsDefault: OptionConfig = {
    fullScreen: false,
    reload: true,
    setting: false,
  }

  // 默认的分页（pagination）配置
  const PaginationDefault: TablePaginationConfig = {
    defaultPageSize: 10,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>{`共 ${total} 条`}</div>
  }

  // 默认的查询表单（MyForm组件）的props
  const MyFormPropsDefault: MyFormProps = {
    form: {
      form: formInstance,
      onFinish() {
        _actionRef.current?.reload(true);
      }
    },
    gutter: [4, 12],
  }

  // 查询表单（MyForm组件）的props
  const myFormProps = myForm && merge(MyFormPropsDefault, myForm) as MyFormProps;

  /** “操作”列的单元格的DOM */
  const renderOperation: (items: OperationItems) => JSX.Element[] = (items) => {
    const tableDropdownList: OperationItems = [];
    const dropdownList: OperationItems = [];
    const domList = items.map(item => {
      if (item?.config?.show === false) return false;
      const { ...restProps } = item.props;
      delete restProps.onClick;
      const elementProps = item.config?.popConfirm ? restProps : item.props;
      const getElement = () => {
        if (item.type === 'link') {
          return <a {...elementProps}>{item.text}</a>;
        } else if (item.type === 'button') {
          return <Button {...elementProps}>{item.text}</Button>;
        } else if (item.type === 'table-dropdown') {
          tableDropdownList.push(item);
        } else if (item.type === 'dropdown') {
          dropdownList.push(item)
        }
      }
      const element = getElement();
      if (!element) return false;

      return item.config?.popConfirm ? <Popconfirm
        title={`确认${item.text}吗？`}
        onConfirm={item.props?.onClick}
      >
        {element}
      </Popconfirm> : element;
    })

    return [
      ...domList,
      tableDropdownList.length > 0 && <TableDropdown
        key="actionGroup"
        onSelect={async (key) => {
          const clickList = tableDropdownList.map(item => (item?.props?.onClick))
          await clickList[parseInt(key)]?.();
        }}
        menus={tableDropdownList.map((item, index) => ({
          key: `${index}`,
          name: item.text
        }))}
      />,
      dropdownList.length > 0 && <Dropdown
        key="menu"
        menu={{
          items: dropdownList.map((item, index) => ({
            label: item.text,
            key: `${index}`,
          })),
          onClick: async ({ key }) => {
            const clickList = dropdownList.map(item => (item?.props?.onClick))
            await clickList[parseInt(key)]?.();
          }
        }}
      >
        <Button icon={<EllipsisOutlined />} />
      </Dropdown>
    ].filter((item): item is JSX.Element => !!item);
  }

  /** "操作"列的配置 */
  const operationCol: ProColumns<DataType, ValueType> = {
    width: operationWidth ?? 'auto',
    title: '操作',
    valueType: 'option',
    key: 'option',
    ellipsis: true,
    render: (...args) => {
      if (!operation) return;
      return <Space size={0} split={<Divider type="vertical" />}>
        {renderOperation(operation(...args))}
      </Space>
    },
  };

  const getOptions: () => false | OptionConfig | undefined = () => {
    if (options) {
      if (options === true) {
        return OptionsDefault;
      } else {
        return merge(OptionsDefault, options);
      }
    } else {
      return false;
    }
  }

  const getPagination: () => false | TablePaginationConfig | undefined = () => {
    if (pagination) {
      if (pagination === true) {
        return PaginationDefault;
      } else {
        return merge(PaginationDefault, pagination);
      }
    } else {
      return false;
    }
  }

  /** 求和 */
  const sum = (colData: (string | number)[]) => {
    const _colData = colData.map(item => !isNaN(Number(item)) ? Number(item) : 0);
    return _colData.reduce((pre, cur) => pre + cur);
  }

  /** 求平均值 */
  const average = (colData: (string | number)[]) => {
    const _sum = sum(colData);
    if (!_sum) return;
    return Number(_sum) / colData.length;
  }

  type FormatDataType = (resData: Partial<RequestData<DataType>>) => Partial<RequestData<DataType>>
  /** 处理原始数据 */
  const formatResData: FormatDataType = (res) => {
    const resData = res.data;
    // 表尾添加一行统计记录
    if (resData && Array.isArray(resData) && resData.length > 0 && (lastRowCalc || setLastRow)) {
      const colsData: Record<string, any> = {};
      Object.keys(resData[0]).forEach(key => {
        colsData[key] = resData?.map(record => record[key]);
      });
      let _lastRow: Record<string, any> = {};
      Object.keys(resData[0]).forEach(key => {
        if (lastRowCalc?.sum && Array.isArray(lastRowCalc.sum) && lastRowCalc.sum.includes(key)) {
          _lastRow[key] = sum(colsData[key]);
        }
        if (lastRowCalc?.average && Array.isArray(lastRowCalc.average) && lastRowCalc.average.includes(key)) {
          _lastRow[key] = average(colsData[key]);
        }
      })
      if (setLastRow) {
        _lastRow = setLastRow(_lastRow as DataType, resData, colsData);
      }
      resData.push(_lastRow as DataType);
    }
    return res;
  }

  return <>
    {myForm && <Card>
      <MyForm {...myFormProps} />
    </Card>}
    <ProTable<DataType, Params, ValueType>
      actionRef={actionRef}
      columns={operation ? [...columns, operationCol] : columns}
      request={request ? async (params, sort, filter) => {
        const _params: typeof params = {
          pageSize: params.pageSize,
          current: params.current,
          tab: currentTab,
          ...myFormProps?.form?.form?.getFieldsValue(),
        }
        return formatResData(await request(_params, sort, filter));
      } : undefined}
      editable={saveRowContent && {
        editableKeys,
        onChange: setEditableRowKeys,
        onSave: saveRowContent,
        // 去掉“删除”按钮
        deleteText: <></>,
      }}
      columnsState={{
        persistenceKey: 'MyProTable',
        persistenceType: 'localStorage',
      }}
      search={false}
      options={getOptions()}
      defaultSize={'large'}
      pagination={getPagination()}
      dateFormatter="string"
      toolbar={{
        menu: tabs ? {
          type: 'tab',
          activeKey: currentTab,
          items: tabs,
          onChange: (key) => {
            if (key === undefined) return;
            setCurrentTab(`${key}`);
            _actionRef.current?.reload(true)
          },
        } : undefined,
      }}
      toolBarRender={
        (...args) => (toolbar
          ? renderOperation(toolbar(...args)) : [])
      }
      tableAlertRender={({ selectedRowKeys, selectedRows, onCleanSelected }) => {
        return (
          <Space size={24}>
            <span>
              已选 {selectedRowKeys.length} 项
              <a style={{ marginInlineStart: 8 }} onClick={onCleanSelected}>
                取消选择
              </a>
            </span>
          </Space>
        );
      }}
      tableAlertOptionRender={(...args) => {
        return rowSelectAlert && (
          <Space size={16}>
            {renderOperation(rowSelectAlert(...args))}
          </Space>
        );
      }}
      {...restProps}
    />
  </>
};

export default MyProTable;