import MyUpload, { MyUploadProps } from ".";
import env from "@/constants/env.json"
import { Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";


export default function MyDocUpload({ maxCount = 1, valueType='json', value, onChange, disabled, children }: MyUploadProps) {
    return <MyUpload
        action={env.file_upload}
        accept="doc|docx|ppt|pptx|txt|json|csv|xlsx|xls|pdf"
        tokenType={2}
        maxSize={100}
        chunkSize={2}
        valueSplit={","}
        valueType={valueType}
        maxCount={maxCount}
        value={value}
        onChange={onChange}
        disabled={disabled}
    >
        {children || <Button icon={<UploadOutlined />}>上传文件</Button>}
    </MyUpload>
}