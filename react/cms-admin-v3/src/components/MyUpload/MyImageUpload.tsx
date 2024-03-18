import MyUpload, { MyUploadProps } from ".";
import env from "@/constants/env.json"
import { PlusOutlined } from "@ant-design/icons";


export default function MyImageUpload({ maxCount = 1, valueType, value, crop, onChange, disabled, children }: MyUploadProps) {

  return (
    <MyUpload
      action={env.file_upload}
      accept="png|jpg|jpeg|gif|ico"
      tokenType={1}
      listType="picture-card"
      valueSplit={","}
      valueType={valueType}
      maxSize={5}
      maxCount={maxCount}
      value={value}
      onChange={onChange}
      crop={crop}
      disabled={disabled}
    >
      {children || <PlusOutlined />}
    </MyUpload>
  )

}