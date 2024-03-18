import React, { useEffect, useRef, useState } from "react"
import { Dropdown, Tabs } from "antd"
import { CloseOutlined, PicCenterOutlined, VerticalLeftOutlined, VerticalRightOutlined } from '@ant-design/icons'
import { useLocation, useNavigate } from "react-router"
import { findMenuByKey } from "@/config/pageConfig"
import './index.css'

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

export default function MyPageTabs() {

  const location = useLocation()
  const navigate = useNavigate()

  // 初始生成一个标签页
  const defaultPanes = new Array(1).fill(null).map((_, index) => {
    const id = String(index + 1);
    return {
      label: `${findMenuByKey(location.pathname)?.label}`, key: id, path: location.pathname
    };
  });
  const [activeKey, setActiveKey] = useState(defaultPanes[0].key);
  const [items, setItems] = useState(defaultPanes);
  const [beChooseItem, setBeChooseItem] = useState(defaultPanes[0])
  const newTabIndex = useRef(0);

  // 切换标签页
  const onChange = (key: string) => {
    const item = items.find(item => item.key === key)
    if (item) {
      navigate(item.path)
    }
    setActiveKey(key);
  };

  useEffect(() => {
    if (location.pathname) {
      add(location.pathname)
    }
  }, [location])
  // 新增标签页
  const add = (e) => {
    const newActiveKey = `newTab${newTabIndex.current++}`;
    const isNewItem = items.find(item => item.label === findMenuByKey(e)?.label)
    if (!isNewItem) {
      setItems([...items, {
        label: `${findMenuByKey(e)?.label}`, key: newActiveKey, path: e
      }]);
      setActiveKey(newActiveKey);
    } else {
      setActiveKey(isNewItem.key)
    }
  };

  if (location.pathname) {
    () => add(location.pathname)
  }

  // 删除标签页
  const remove = (targetKey: TargetKey) => {
    const targetIndex = items.findIndex((pane) => pane.key === targetKey);
    const newPanes = items.filter((pane) => pane.key !== targetKey);
    if (newPanes.length && targetKey === activeKey) {
      const { key } = newPanes[targetIndex === newPanes.length ? targetIndex - 1 : targetIndex];
      const item = items.find(item => item.key === key)
      if (item) {
        navigate(item.path)
      }
      setActiveKey(key);
    }
    setItems(newPanes);
  };

  // 标签页的点击事件
  const clickTab = (e) => {
    if (e.button == 0) {
      // 鼠标左键点击Tab标签事件
    } else if (e.button == 1) {
      // 鼠标滚轮点击Tab标签事件
    } else {
      // 鼠标右键点击Tab标签事件
      const item = items.find(item => item.label === e.target.innerHTML)
      if (item) {
        setBeChooseItem(item)
      }
    }
    e.preventDefault();
  }

  const dropdown = [
    {
      key: 'closeThis',
      label: '关闭当前',
      icon: <CloseOutlined />,
      disabled: items.length === 1,
      onClick: () => closeTabs('closeThis')
    }, {
      key: 'closeOthers',
      label: '关闭其他',
      icon: <PicCenterOutlined />,
      disabled: items.length === 1,
      onClick: () => closeTabs('closeOthers')
    }, {
      type: 'divider',
    }, {
      key: 'closeLeft',
      label: '关闭左侧',
      icon: <VerticalRightOutlined />,
      disabled: beChooseItem.key === items[0].key,
      onClick: () => closeTabs('closeLeft')
    }, {
      key: 'closeRight',
      label: '关闭右侧',
      icon: <VerticalLeftOutlined />,
      disabled: beChooseItem.key === items[items.length - 1].key,
      onClick: () => closeTabs('closeRight')
    },
  ]

  const closeTabs = (e) => {
    const index = items.indexOf(beChooseItem)
    if (e === 'closeThis') {
      remove(beChooseItem.key)
    } else if (e === 'closeOthers') {
      const newPanes = items.filter((pane) => pane.key === beChooseItem.key);
      setItems(newPanes)
      setActiveKey(beChooseItem.key)
    } else if (e === 'closeLeft') {
      const newPanes = items.slice(index)
      setItems(newPanes)
      setActiveKey(beChooseItem.key)
    } else if (e === 'closeRight') {
      const newPanes = items.slice(0, index + 1)
      setItems(newPanes)
      setActiveKey(beChooseItem.key)
    }
  }

  return <>
    <Dropdown menu={{ items: dropdown as any }} trigger={['contextMenu']}>
      <Tabs
        hideAdd
        onChange={onChange}
        activeKey={activeKey}
        type={items.length === 1 ? "card" : "editable-card"}
        onEdit={remove}
        items={items}
        onMouseDown={clickTab}
        tabBarGutter={0}
      />
    </Dropdown>
  </>

}