import { Badge } from "antd";
import { Link } from "react-router-dom";
import { MyMenuItem, PageConfig } from "@/models/menus";
import { ClusterOutlined, FileTextOutlined, HomeOutlined, PicCenterOutlined } from "@ant-design/icons";

import themeConfig from "./themeConfig";
import { pathMatch } from "@/utils/utility";
import { ItemType } from "antd/es/menu/hooks/useItems";

export const pageConfig: PageConfig = {
  headDropdown: [],
  page: [
    { label: '登录', path: '/Login' },
    { label: '无权限', path: '/NoPermission' }
  ],
  menu: [
    { label: '首页', path: '/', icon: <HomeOutlined /> },
    {
      label: '内容管理',
      icon: <ClusterOutlined />,
      key: 'content',
      children: [
        { label: '资讯管理', path: '/content/NewsManage', requirePems: ['news_manager'] },
        { label: '案例管理', path: '/content/CaseManage', requirePems: ['case_manager'] },
        { label: '招聘管理', path: '/content/AdvertiseManage', requirePems: ['advertise_manager'] },
        { label: '数据模型管理', path: '/design/DataModel', requirePems: ['datamodel_manager'] },
        { label: '数据管理', path: '/design/DataModel/:name', parentKey: '/design/DataModel', show: false, requirePems: ['datamodel_manager'] },
      ]
    },
    {
      label: '配置管理',
      icon: <FileTextOutlined />,
      key: 'option',
      children: [
        { label: '页面配置', path: '/option/PageOption', requirePems: ['page_configuration'] },
        { label: '模板配置', path: '/option/TemplateOption', requirePems: ['module_configuration'] }
      ]
    },
    {
      label: '网站管理',
      icon: <PicCenterOutlined />,
      key: 'pageTemplate',
      children: [
        { label: '全局配置', path: '/page/WebsiteConfig', requirePems: ['page_websit_config'] },
        { label: '数据模板管理', path: '/page/TemplateManage', requirePems: ['page_template_manager'] },
        { label: '组件管理', path: '/page/ComponentManage', requirePems: ['page_component_manager'] },
        { label: '模块管理', path: '/page/ModuleManage', requirePems: ['page_module_manager'] },
        { label: '布局管理', path: '/page/LayoutManage', requirePems: ['page_layout_manager'] },
        { label: '布局设计', path: '/page/LayoutManage/:id', requirePems: ['page_layout_manager'], parentKey: '/page/LayoutManage', show: false },
        { label: '页面管理', path: '/page/PageManage', requirePems: ['page_page_manager'] },
        { label: '页面设计', path: '/page/PageManage/:id', requirePems: ['page_page_manager'], parentKey: '/page/PageManage', show: false }
      ]
    },
    {
      label: '系统管理',
      icon: <ClusterOutlined />,
      key: 'system',
      children: [
        { label: '文件管理', path: '/system/FileManage', requirePems: ['file_manager'] },
        {
          label: '字典管理',
          key: 'dict',
          children: [
            { label: '编码管理', path: '/system/DictManage', requirePems: ['dictionary_manager'] },
            { label: '分类管理', path: '/system/ClassManage', requirePems: ['category_manager'] },
          ]
        },
        {
          label: '权限管理',
          key: 'pem',
          children: [
            { label: '用户管理', path: '/system/UserManage', requirePems: ['user_manager'] },
            { label: '角色管理', path: '/system/RoleManage', requirePems: ['role_manager'] },
            { label: '资源管理', path: '/system/ResourcesManage', requirePems: ['resource_manager'] }
          ]
        },
        { label: '系统日志', path: '/system/log', requirePems: ['log_manager'] },
      ]
    }
  ],
  defaultMenuShowType: themeConfig.layoutStyle === 'topside' ? 'head' : themeConfig.autoSplitMenu ? 'split' : 'aside'
}

export const getHeadMenu = (userHasPems: any) => {
  if (pageConfig.defaultMenuShowType === 'head') {
    return filter(pageConfig.menu, userHasPems);
  } else if (pageConfig.defaultMenuShowType === 'split') {
    return filter(pageConfig.menu, userHasPems).map(item => {
      const newItem = Object.assign({}, item);
      newItem.children = undefined;
      return newItem;
    })
  }
  return undefined;
}

export const getAsideMenu = (userHasPems: any, parentKey?: string) => {
  if (pageConfig.defaultMenuShowType === 'aside') {
    return filter(pageConfig.menu, userHasPems);
  } else if (pageConfig.defaultMenuShowType === 'split' && parentKey) {
    return filter(pageConfig.menu, userHasPems).find(item => item.key === parentKey || pathMatch(item.path, parentKey))?.children;
  }
  return undefined;
}

// 根据权限路由筛选菜单
const filter = (items: MyMenuItem[], userHasPems: any) => {
  return items.map(item => {
    const newItem = Object.assign({}, item);
    newItem.children = item.children && filter(item.children, userHasPems);
    return newItem;
  }).filter(item => {
    if (!item.requirePems && !item.path && (!item.children || item.children.length == 0) || item.show === false) {
      return false;
    }
    return userHasPems(item.requirePems);
  });
}

export const findMenuByKey = (key: string, items?: MyMenuItem[]) => {
  const menus = findMenus(key, items || pageConfig.menu);
  return menus && menus[menus.length - 1];
}

export const findRootMenuByKey = (key: string) => {
  const menus = findMenus(key, pageConfig.menu);
  return menus && menus[0];
}

export const findMenusByKey = (key: string) => {
  return findMenus(key, pageConfig.menu);
}

export const findMenus = (key: string, items?: MyMenuItem[]): MyMenuItem[] | undefined => {
  if (!items) {
    return undefined;
  }
  for (let i = 0; i < items.length; i++) {
    if (items[i].key === key || pathMatch(items[i].path, key)) {
      return [items[i]];
    }
    const ret = findMenus(key, items[i].children);
    if (ret) {
      ret.unshift(items[i]);
      return ret;
    }
  }
  return undefined;
}

// 为菜单设置 key 值
export const setMenuKey = (arr: any[]) => {
  let initKey = 1
  return subSetKey(arr)
  function subSetKey(arr: any[]) {
    return arr.map((a: any) => {
      a.key = a.key || a.path || initKey++
      if (a.children) subSetKey(a.children)
      return a
    })
  }
}

// 为菜单设置 a 标签
export const setMenuLink = (arr: any[]) => {
  return arr.map(a => {
    a.path && (typeof a.label === 'string') && (a.label = <Link to={a.path} >{a.label}</Link>)
    a.children && (a.children = setMenuLink(a.children))
    return a
  })
}

// 为下拉菜单设置徽标
export const setMenuBadge = (arr: any[]) => {
  return arr.map(a => {
    a.count && (typeof a.label === 'string') && (a.label = <div className='dorpdown-badge'>{a.label}<Badge count={a.count} /></div>)
    a.children && (a.children = setMenuBadge(a.children))
    return a
  })
}

export const transformMenus = (menus?: any[]): ItemType[] | undefined => {
  if (!menus) {
    return undefined;
  }
  return menus.map(item => {
    return { icon: item.icon, label: item.label, children: transformMenus(item.children), key: item.key } as ItemType
  });
}