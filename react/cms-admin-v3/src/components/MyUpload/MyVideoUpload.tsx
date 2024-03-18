import MyUpload, { MyUploadProps } from ".";
import env from "@/constants/env.json"
import { Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";


export default function MyVideoUpload({ maxCount = 1, valueType, value, onChange, disabled, children }: MyUploadProps) {
    return <MyUpload
        action={env.file_upload_chunk}
        accept="mp4"
        tokenType={3}
        maxSize={1024}
        isChunk={true}
        chunkSize={2}
        valueSplit={","}
        valueType={valueType}
        maxCount={maxCount}
        value={value}
        onChange={onChange}
        disabled={disabled}
    >
        {children || <Button icon={<UploadOutlined />}>上传视频</Button>}
    </MyUpload>
}