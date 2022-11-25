// 为类组件的 props 赋上路由相关数据

// import React from "react"
// import { NavigateFunction, useLocation, useNavigate, useParams } from "react-router-dom"

// export interface RouterProps {
//   location: any,
//   navigate: NavigateFunction,
//   params: any
// }

// // ReactRouter V6 需自己创建一个 withRouter 组件
// export default function withRouter<P extends RouterProps>(Child: React.ComponentClass<P>) {

//   return (props) => {
//     const location = useLocation()
//     const navigate = useNavigate()
//     const params = useParams()
//     return <Child {...props as P} navigate={navigate} location={location} params={params} />
//   }

// }