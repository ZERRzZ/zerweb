import { MyFormItems } from "@/components/MyForm";
import { MyTableAction, MyTableUrl } from "@/components/MyTable";
import { PlusOutlined } from "@ant-design/icons";
import { message, Modal } from "antd";
import copy from "copy-to-clipboard"
import { useState } from "react";
import MyPreview, { FileType } from "@/components/MyPreview";
import MyCategoryTable from "@/components/MyTable/MyCategoryTable";
import './index.css'

const FileManagePage: React.FC = () => {
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
    const [preivewFileId, setPreviewFileId] = useState<string>();
    const [preivewFileUrl, setPreviewFileUrl] = useState<string>();
    const [preivewFileType, setPreviewFileType] = useState<FileType>();
    const queryFormItems: MyFormItems[] = [
        {
            type: 'text',
            item: { name: 'name_like_', label: '文件名' }
        },
        {
            type: 'text',
            item: { name: 'title_like_', label: '标题' }
        },
    ];


    const columns = [
        {
            title: '文件名',
            dataIndex: 'name',
            key: 'name',
            width: 260,
        },
        {
            title: '文件地址',
            dataIndex: 'url',
            key: 'url',
            ellipsis: true,
            option: { renderType: 'link' }

        },
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            width: 260,
        },
        {
            title: '创建时间',
            dataIndex: 'create_time',
            key: 'create_time',
            width: 160
        },
    ];

    const addFormItems: MyFormItems[] = [
        {
            type: 'myFileUpload',
            item: { name: 'file', label: '文件', rules: [{ required: true, message: '请上传' }] },
            option: {
                valueType: 'obj'
            }
        },
        {
            type: 'text',
            item: { name: 'title', label: '标题' }
        },
    ];

    const headerActions: MyTableAction[] = [
        { title: "新增", key: "add", type: "btn", icon: <PlusOutlined />, handler: { formItems: addFormItems, showType: "modal" } },
    ]

    const itemActions: MyTableAction[] = [
        { title: "复制", key: "copy", type: "btn", handler: { pick: ["url"] } },
        { title: "预览", key: "preview", type: "btn", handler: { pick: ["id", "url", "name"] } },
        { title: "删除", key: "delete", type: "confirmBtn", handler: { pick: ["id"] } },
    ]

    const requestConfig = {
        list: { url: '/1/ms/upload/file/list', method: 'get' } as MyTableUrl,
        add: { url: '/1/ms/upload/file/add', method: 'post' } as MyTableUrl,
        delete: { url: '/1/ms/upload/file/delete', method: 'post' } as MyTableUrl,
    }

    const doAction = (action: MyTableAction, item) => {
        if (action.key === 'copy') {
            copy(item.url);
            message.success('复制成功！');
            return undefined;
        } else if (action.key === 'preview') {
            let fileName = item.name as string;
            if ("zip, rar, 7z".includes(fileName.slice(-3))) {
                message.error('压缩文件无法预览')
            } else {
                setPreviewFileType(fileName.lastIndexOf('.') > 0 ? fileName.substring(fileName.lastIndexOf('.') + 1) as FileType : undefined);
                setPreviewFileId(item.id);
                setPreviewFileUrl(item.url);
                setPreviewOpen(true);
            }
            return undefined;
        }
        return undefined;
    }

    return (
        <div className="fileManage">
            <MyCategoryTable tableProps={{
                queryConfig: { formItems: queryFormItems },
                tableConfig: {
                    columns: columns,
                    rowKey: "id",
                    operateWidth: 160
                },
                actionConfig: {
                    headerActions: headerActions,
                    itemActions: itemActions,
                    doAction: doAction
                },
                filterConfig: {
                    requestParams: (action, data) => {
                        if (action.key === "add") {
                            data.url = data.file[0].url;
                            data.name = data.file[0].name;
                            delete data.file;
                        }
                        return data;
                    }
                },
                requestConfig: requestConfig
            }}
                code="file_category"
                columnName="category"
            />
            <Modal title='预览' width={'80%'} open={previewOpen} footer={null} onCancel={() => setPreviewOpen(false)}>
                <MyPreview fileId={preivewFileId} fileUrl={preivewFileUrl} fileType={preivewFileType} />
            </Modal>
        </div>
    )
}

export default FileManagePage;