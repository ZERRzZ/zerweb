import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router';
const NoPermission: React.FC = () => {
  const navigate = useNavigate()
  return (
    <Result
      status="403"
      title="403"
      subTitle="对不起，您没有进入此页面权限！"
      extra={<Button type="primary" onClick={()=>{navigate("/")}}>返回首页</Button>}
    />
  )
};

export default NoPermission;