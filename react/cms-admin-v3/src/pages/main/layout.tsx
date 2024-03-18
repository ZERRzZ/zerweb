import TLBLayout from "@/layouts/TLBLayout"
import { Outlet } from "react-router"

export default function MainLayout() {

  return (
    <TLBLayout>
      <Outlet />
    </TLBLayout>
  )

}