import { Spin } from "antd";


export default function Loading() {
    return <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Spin size="large" />
    </div>
}