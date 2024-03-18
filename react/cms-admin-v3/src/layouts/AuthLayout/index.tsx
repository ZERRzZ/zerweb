import { Navigate, Outlet, useLocation } from "react-router";
import { Spin } from "antd";
import { useContext } from "react";
import { ConfigContext } from "@/stories/ConfigStore";
import Auth from "@/lib/auth";
import { findMenuByKey, pageConfig } from "@/config/pageConfig";
import Loading from "@/components/Loading";
import { pathMatch } from "@/utils/utility";

export default function AuthLayout() {
  // 通过useSelector直接拿到store中定义的value
  const location = useLocation();
  const { state, dispatch, userHasPems } = useContext(ConfigContext);

  const checkAuth = () => {
    let needCheck = false;
    if (!state.userInfo) {
      needCheck = true;
    } else {
      let token = localStorage.getItem('token');
      if ((token && !state.userInfo.user_id) || (!token && state.userInfo.user_id)) {
        needCheck = true;
      }
    }
    if (needCheck) {
      Auth.checkLogin().then(res => {
        dispatch({ type: 'userInfo', value: res || {} });
      })
      return <Loading />;
    }
    
    let page = pageConfig.page.find(p => pathMatch(p.path, location.pathname));
    if (!page) {
      page = findMenuByKey(location.pathname);
    }
    if (!page || !userHasPems(page.requirePems)) {
      return <Navigate to="/NoPermission" state={{ from: location }} replace />;
    }
    // 渲染任何匹配的子级
    return <Outlet />;
  }

  return checkAuth();
}