import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button, Empty, Layout, message, Spin } from "antd";
import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { saveAs } from "file-saver";
import http, { getRequestUrl } from "@/lib/http";
import "./index.scss"

export type FileType = 'png' | 'jpg' | 'jpeg' | 'gif' | 'doc' | 'docx' | 'pdf' | 'html' | 'xlsx' | 'xls' | 'ppt' | 'pptx';

export interface MyPreviewProps {
    isMobile?: boolean;
    fileId?: string;
    fileUrl?: string;
    fileName?: string;
    fileType?: FileType;
}

pdfjs.GlobalWorkerOptions.workerSrc = 'res/js/pdf.worker.js';

const MyPreview: React.FC<MyPreviewProps> = ({ isMobile, fileId, fileUrl, fileName, fileType }) => {
    const [fileContent, setFileContent] = useState<any>();
    const [isLoading, setLoading] = useState<boolean>(true);
    const [numPages, setNumPages] = useState(1);
    const [pageNumber, setPageNumber] = useState(1);

    const isDoc = (type?: FileType) => {
        return type == 'doc' || type == 'docx' || type == 'pdf' || type == 'ppt' || type == 'pptx' || type == 'xls' || type == 'xlsx' || type == 'html';
    }

    const isImage = (type?: FileType) => {
        return type == 'png' || type == 'jpeg' || type == 'jpg' || type == 'gif';
    }

    useEffect(() => {
        if (fileId && isDoc(fileType)) {
            setLoading(true);
            setFileContent(undefined);
            http
                .post<Blob>(
                    getRequestUrl('/1/ms/preview/network_preview'),
                    { id: fileId },
                    { responseType: 'blob' }
                )
                .then(res => {
                    const fileReader = new FileReader();
                    fileReader.addEventListener('load', () => {
                        try {
                            const resJson = JSON.parse(fileReader.result as string);
                            if (resJson?.msg) {
                                setFileContent(undefined);
                                message.warning(resJson.msg)
                            } else {
                                setPageNumber(1);
                                setFileContent(res.data);
                            }
                        } catch {
                            setPageNumber(1);
                            setFileContent(res.data);
                        }
                    })
                    fileReader.readAsText(res.data);
                })
                .catch(() => {
                    setFileContent(undefined);
                    message.error(`获取文件时发生错误`);
                })
                .finally(() => {
                    setLoading(false);
                })
        }
    }, [fileId, fileUrl, fileType])

    const handleDownload = () => {
        // 前台下载均为pdf
        if (fileName) {
            fileName = fileName.replace(/\.\w*$/, '.pdf');
        }
        saveAs(fileContent, fileName);
    }

    const handlePagination = (change: number) => {
        const targetPageNumber = pageNumber + change;
        if (targetPageNumber >= 1 && targetPageNumber <= numPages) {
            setPageNumber(targetPageNumber);
        }
    }

    const renderPreview = () => {
        if (isDoc(fileType) && fileId) {
            return <Spin spinning={isLoading} delay={600}>
                {fileContent ?
                    <Document
                        file={fileContent}
                        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                        noData={<Empty />}
                        error={<Empty />}
                        loading={<Spin />}
                    >
                        <Page pageNumber={pageNumber} renderTextLayer={false} renderAnnotationLayer={false} width={isMobile ? 340 : undefined} />
                        <div className='react-pdf-pagination'>
                            <Button shape="circle" icon={<LeftOutlined />} onClick={() => handlePagination(-1)} />
                            <span>第 {pageNumber} 页</span>
                            <Button shape="circle" icon={<RightOutlined />} onClick={() => handlePagination(1)} />
                        </div>

                    </Document>
                    :
                    <div style={{ height: 400 }}></div>
                }
            </Spin>;
        } else if (isImage(fileType) && fileUrl) {
            return <div className="my-preview-img"><img src={fileUrl} /></div>;
        }
        return undefined;
    }

    return <Layout style={{ padding: isMobile ? 12 : 24 }} className="my-preview">
        {
            renderPreview()
        }
    </Layout>
}

export default MyPreview;