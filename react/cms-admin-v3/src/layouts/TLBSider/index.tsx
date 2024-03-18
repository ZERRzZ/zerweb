import { useContext, useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router"
import { Menu } from "antd"

import './index.css'
import logo from '@/assets/images/logo.png'
import smallLogo from '@/assets/images/small_logo.jpg'
import { ConfigContext } from "@/stories/ConfigStore"
import themeConfig from "@/config/themeConfig"
import { findMenuByKey, findMenus, getAsideMenu, setMenuKey, setMenuLink, transformMenus } from "@/config/pageConfig"

const TLBSider: React.FC = () => {

  const location = useLocation()
  const navigate = useNavigate();
  const { state, userHasPems } = useContext(ConfigContext);
  const [menus, setMenus] = useState<any[]>([]);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>();


  useEffect(() => {
    let allMenus = setMenuLink(setMenuKey(getAsideMenu(userHasPems, state.menuParentKey) || []));
    let currentMenu = findMenuByKey(location.pathname);
    if (currentMenu && currentMenu.parentKey) {
      currentMenu = findMenuByKey(currentMenu.parentKey, allMenus);
    }
    let currentMenuKey = currentMenu && (currentMenu.key || currentMenu.path);
    let currentParentMenus = (currentMenuKey && findMenus(currentMenuKey, allMenus)) || undefined;
    let currentParentMenuKey = currentParentMenus?.slice(0, currentParentMenus.length - 1).map(item => item.key || item.path || '');
    setOpenKeys(currentParentMenuKey || []);
    setSelectedKeys([currentMenuKey || '']);
    setMenus(allMenus);
  }, [state.menuParentKey, state.userInfo])

  useEffect(() => {
    let allMenus = menus
    if (!allMenus) return
    let currentMenu = findMenuByKey(location.pathname)
    if (currentMenu && currentMenu.parentKey) {
      currentMenu = findMenuByKey(currentMenu.parentKey, allMenus);
    }
    if (!currentMenu) return
    let currentMenuKey = currentMenu.key || currentMenu.path
    let currentParentMenus = (currentMenuKey && findMenus(currentMenuKey, allMenus)) || undefined;
    let currentParentMenuKey = currentParentMenus?.slice(0, currentParentMenus.length - 1).map(item => item.key || item.path || '')
    let newOpenKeys = [...openKeys as string[]]
    currentParentMenuKey?.forEach(item => {
      if(!newOpenKeys.includes(item)) {
        newOpenKeys.push(item)
      }
    })
    if(newOpenKeys.length !== openKeys?.length) {
      setOpenKeys(newOpenKeys)
    }
    setSelectedKeys([currentMenuKey || ''])
  }, [location])

  // if (menus.length > 0 && !currentMenu) {
  //   let path = menus[0].path || menus[0].children[0].path;
  //   navigate(path);
  //   return <></>;
  // }

  const menuItems = useMemo(() => {
    return transformMenus(menus);
  }, [menus])

  return <>
    {
      (menuItems && menuItems.length) ?
        <aside
          style={{ position: themeConfig.sideMenuFixed ? 'sticky' : 'static', top: (themeConfig.headerFixed && themeConfig.layoutStyle !== 'leftside') ? '64px' : 0 }}
          className={themeConfig.layoutStyle === 'topside' ? 'unShow' : `${state.menuCollapsed && 'aside-collapsed'}`}
        >
          {themeConfig.layoutStyle === 'leftside' ? (state.menuCollapsed ?
            <div className={themeConfig.theme === 'dark' ? 'darkLogo' : 'slider_logo'}>
              <img height={36} src={smallLogo} />
            </div> :
            <div className={themeConfig.theme === 'dark' ? 'darkLogo' : 'slider_logo'}>
              <img height={36} src={logo} />
            </div>) : null
          }
          <Menu
            theme={themeConfig.theme}
            className="menu"
            mode="inline"
            openKeys={openKeys}
            selectedKeys={selectedKeys}
            onOpenChange={(keys) => setOpenKeys(keys)}
            onSelect={(e) => setSelectedKeys(e.selectedKeys)}
            items={menuItems}
            inlineCollapsed={state.menuCollapsed}
          />
        </aside> : undefined
    }
  </>

}

export default TLBSider