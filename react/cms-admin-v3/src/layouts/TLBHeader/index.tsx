import { useLocation, useNavigate } from "react-router"
import { ItemType } from "antd/es/menu/hooks/useItems"
import { Avatar, Badge, Button, Divider, Drawer, Dropdown, Menu, Popover, Switch } from "antd"
import { PoweroffOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons"
import { useContext, useEffect, useMemo, useState } from "react"

import './index.css'
import Auth from "@/lib/auth"
import logo from '@/assets/images/logo.png'
import { HeadDropdown } from "@/models/menus"
import themeConfig from "@/config/themeConfig"
import { ConfigContext } from "@/stories/ConfigStore"
import { findMenuByKey, findRootMenuByKey, getHeadMenu, pageConfig, setMenuBadge, setMenuKey, setMenuLink, transformMenus } from "@/config/pageConfig"
import MyForm, { MyFormItems } from "@/components/MyForm"

const MyHeader: React.FC = () => {

  const location = useLocation()
  const navigate = useNavigate();
  const { state, dispatch, userHasPems } = useContext(ConfigContext);
  const [isDrawer, setIsDrawer] = useState(false);
  const [menus, setMenus] = useState<any[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>();
  const [dropdownMenus, setDropdownMenus] = useState<any[]>([]);

  useEffect(() => {
    const allMenus = setMenuLink(setMenuKey(getHeadMenu(userHasPems) || []));
    let currentMenu;
    if (pageConfig.defaultMenuShowType === 'split') {
      currentMenu = findRootMenuByKey(location.pathname);
    } else {
      currentMenu = findMenuByKey(location.pathname);
      if (currentMenu && currentMenu.parentKey) {
        currentMenu = findMenuByKey(currentMenu.parentKey, allMenus);
      }
    }
    const currentMenuKey = currentMenu && (currentMenu.key || currentMenu.path);
    if (pageConfig.defaultMenuShowType === 'split') {
      if (state.menuParentKey != currentMenuKey && currentMenuKey) {
        dispatch({ type: 'menuParentKey', value: currentMenuKey });
      }
    }
    setMenus(allMenus);
    setSelectedKeys([currentMenuKey || '']);
    setDropdownMenus(getDropdownMenus());
  }, [state.userInfo])

  const menuItems = useMemo(() => {
    return transformMenus(menus);
  }, [menus])

  const getDropdownMenus = () => {
    const allDropdownMenus = setMenuKey(setMenuBadge(pageConfig.headDropdown));
    if (allDropdownMenus.length <= 0) {
      allDropdownMenus.push({ key: 'systemSetting', label: '系统设置', icon: <SettingOutlined />, onClick: () => systemSetting() } as HeadDropdown)
      allDropdownMenus.push({ key: 'defaultLogout', label: '退出', icon: <PoweroffOutlined />, onClick: () => Auth.logout() } as HeadDropdown)
    } else {
      !allDropdownMenus.find((d: any) => d.key === 'defaultLogout') && allDropdownMenus.push(
        { key: 'defaultDivider', label: <Divider style={{ margin: 0 }} /> } as HeadDropdown,
        { key: 'defaultSetting', label: '系统设置', icon: <SettingOutlined />, onClick: () => systemSetting() } as HeadDropdown,
        { key: 'defaultLogout', label: '退出', icon: <PoweroffOutlined />, onClick: () => Auth.logout() } as HeadDropdown
      )
    }
    return allDropdownMenus;
  }

  // 计算总徽标
  const getTotal = (arr: any[]) => {
    return arr.reduce((pre, cur) => {
      if (cur.children) pre += getTotal(cur.children)
      if (cur.count) return pre + cur.count
      else return pre
    }, 0)
  }

  const systemSetting = () => {
    setIsDrawer(true)
  }

  const onClose = () => {
    setIsDrawer(false)
  }

  const onMenuSelect = (e) => {
    setSelectedKeys(e.selectedKeys);
    if (pageConfig.defaultMenuShowType === 'split') {
      dispatch({ type: 'menuParentKey', value: e.key });
      const rootMenu = findMenuByKey(e.key);
      const path = rootMenu && (rootMenu.path || (rootMenu.children && rootMenu.children[0].path));
      path && navigate(path);
    }
  };

  const setHeaderFixed = v => {
    localStorage.setItem('headerFixed', v)
    window.location.reload()
  }

  const setSideMenuFixed = v => {
    localStorage.setItem('sideMenuFixed', v)
    window.location.reload()
  }

  const setAutoSplitMenu = v => {
    localStorage.setItem('autoSplitMenu', v)
    window.location.reload()
  }

  const fontSizeItem: MyFormItems[] = [
    {
      type: 'number',
      item: { name: 'fontSize', initialValue: themeConfig.token.fontSize },
      option: { min: 6, max: 24 }
    },
    {
      type: 'submit',
      innerHtml: '确认'
    }
  ]

  const handleFontSizeFinish = v => {
    localStorage.setItem('fontSize', v.fontSize)
    window.location.reload()
  }

  return (
    <div className="header">
      <div className="head_left">
        <img height={36} src={logo} className={themeConfig.layoutStyle === 'leftside' ? 'unShowTop' : ''} />
        <div className="showTop">
          <Menu mode="horizontal" items={menuItems} selectedKeys={selectedKeys} onSelect={onMenuSelect} />
        </div>
      </div>
      <div className='user'>
        <Dropdown menu={{ items: dropdownMenus as ItemType[] }}>
          <Badge count={getTotal(dropdownMenus)}>
            <Avatar icon={<UserOutlined />} />
          </Badge>
        </Dropdown>
        <span>{state.userInfo?.full_name}</span>
      </div>
      <Drawer title="系统设置" placement="right" onClose={onClose} open={isDrawer}>
        <h3>主题色配置</h3>
        <div className="setting-box">
          <Button onClick={() => themeConfig.method.setTheme('light')} type={themeConfig.theme === 'dark' ? 'default' : 'primary'}>
            亮色主题
          </Button>
          <Button onClick={() => themeConfig.method.setTheme('dark')} type={themeConfig.theme === 'dark' ? 'primary' : 'default'}>
            暗色主题
          </Button>
        </div>
        <h3>颜色配置</h3>
        <div>
          <Popover content={'红色'}>
            <Button onClick={() => themeConfig.method.setColor('#ff0000')} className="colorBtn" style={{ background: '#ff0000' }}>
              <div className={themeConfig.color === '#ff0000' ? 'correct' : 'unShowTop'}></div>
            </Button>
          </Popover>
          <Popover content={'绿色'}>
            <Button onClick={() => themeConfig.method.setColor('#52c41a')} className="colorBtn" style={{ background: '#52c41a' }}>
              <div className={themeConfig.color === '#52c41a' ? 'correct' : 'unShowTop'}></div>
            </Button>
          </Popover>
          <Popover content={'蓝色(默认)'}>
            <Button onClick={() => themeConfig.method.setColor('#1890ff')} className="colorBtn" style={{ background: '#1890ff' }}>
              <div className={themeConfig.color === '#1890ff' ? 'correct' : 'unShowTop'}></div>
            </Button>
          </Popover>
          <Popover content={'紫色'}>
            <Button onClick={() => themeConfig.method.setColor('#7f16ff')} className="colorBtn" style={{ background: '#7f16ff' }}>
              <div className={themeConfig.color === '#7f16ff' ? 'correct' : 'unShowTop'}></div>
            </Button>
          </Popover>
        </div>
        <h3>导航栏配置</h3>
        <div className="setting-box">
          <Button onClick={() => themeConfig.method.setSlider('broadside')} type={themeConfig.layoutStyle === 'broadside' ? 'primary' : 'default'}>
            侧边导航
          </Button>
          <Button onClick={() => themeConfig.method.setSlider('topside')} type={themeConfig.layoutStyle === 'topside' ? 'primary' : 'default'}>
            顶部导航
          </Button>
          <Button onClick={() => themeConfig.method.setSlider('leftside')} type={themeConfig.layoutStyle === 'leftside' ? 'primary' : 'default'}>
            左右结构导航
          </Button>
        </div>
        <h3>标签配置</h3>
        <div className="setting-box">
          <Button onClick={() => themeConfig.method.setPageTabs('breadcrumb')} type={themeConfig.pageTabs === 'breadcrumb' ? 'primary' : 'default'}>
            面包屑
          </Button>
          <Button onClick={() => themeConfig.method.setPageTabs('pageTabs')} type={themeConfig.pageTabs === 'pageTabs' ? 'primary' : 'default'}>
            标签
          </Button>
        </div>
        <h3>全局样式配置</h3>
        <div>
          <p>固定 Header &nbsp;&nbsp;<Switch onChange={setHeaderFixed} checked={themeConfig.headerFixed} /></p>
          <p>固定侧边菜单 &nbsp;&nbsp;<Switch onChange={setSideMenuFixed} checked={themeConfig.sideMenuFixed} /></p>
          <p>自动分割菜单 &nbsp;&nbsp;<Switch onChange={setAutoSplitMenu} checked={themeConfig.autoSplitMenu} disabled={pageConfig.defaultMenuShowType === 'head'} /></p>
        </div>
        <h3>字体大小</h3>
        <MyForm form={{ onFinish: v => handleFontSizeFinish(v) }} items={fontSizeItem} gutter={[10, 0]} />
      </Drawer>
    </div>
  )

}

export default MyHeader