import adminService from "@/api/adminService";
import { MyFormItems } from "@/components/MyForm";
import MyQueryForm from "@/components/MyQueryForm";
import { Card, Empty, message, Pagination, Row, Timeline } from "antd";
import { useEffect, useMemo, useState } from "react";
import "./index.scss";

const LogPage: React.FC = (props) => {
    const defaultQuery = 'order_by_desc=operation_time';
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(20);
    const [totalSize, setTotalSize] = useState(0);
    const [query, setQuery] = useState(defaultQuery);
    const [logData, setLogData] = useState<any[]>([]);
    const [actionList, setActionList] = useState<any>([])
    const queryFormItems: MyFormItems[] = [
        {
            type: 'dateRange',
            item: { name: 'operation_time', label: '日期' }
        },
        {
            type: 'text',
            item: { name: 'operator_name', label: '操作人' }
        },
        {
            type: 'select',
            item: { name: 'action', label: '操作行为' },
            option: { style: { width: 160 }, options: actionList }
        }
    ]
    const onSearch = (values) => {
        let _query = [defaultQuery];
        if (values.operation_time_start_) {
            _query.push(`operation_time_start_=${encodeURIComponent(values.operation_time_start_)}`);
        }
        if (values.operation_time_end_) {
            _query.push(`operation_time_end_=${encodeURIComponent(values.operation_time_end_)}`);
        }
        if (values.operator_name) {
            _query.push(`operator_name=${encodeURIComponent(values.operator_name)}`);
        }
        if (values.action) {
            _query.push(`action_like_=${values.action}`);
        }
        setQuery(_query.join('&'));
        setPage(1);
    }

    const getListData = () =>
        adminService.cms.log.list({ query: query, page_no: page, page_size: size })
            .then(res => {
                if (res) {
                    setLogData(res.list || []);
                    setTotalSize(res.total || 0);
                }
            })
            .catch(() => {
                message.error('获取数据失败');
            });

    const getActionList = () => {
        adminService.cms.log.actionList().then(res => {
            setActionList(res.map(r => ({ label: r, value: r })))
        })
    }

    useEffect(() => {
        getActionList();
    }, [])

    useEffect(() => {
        getListData();
    }, [page, size, query]);

    const timeLineItems = useMemo(() => {
        return logData.map(item => {
            return {
                children: <>
                    {/* <Tag color="#2db7f5">{'系统'}</Tag> */}
                    <span className="log-time">{item.operation_time}</span>
                    <span className="log-user">{item.operator_name}</span>
                    <span className="log-action">{item.action}</span>
                    {item.target_type ? <span className="log-type">{item.target_type}</span> : undefined}
                    {item.target_name ? <span className="log-name">{item.target_name}</span> : undefined}
                    <span className="log-from">来自{item.operator_ip}</span>
                    {/* {
                        renderLink(item.target_id, item.target_type)
                    } */}
                    <span className="log-content">{item.operation_content}</span>
                </>
            };
        });
    }, [logData]);

    return <>
        <MyQueryForm formItems={queryFormItems} onSearch={onSearch} />
        <Card bodyStyle={{ padding: "8px 8px" }}>
            {totalSize ? (
                <div className="my-log">
                    <Row>
                        <Timeline mode="left" style={{ width: '100%' }} className="log-timeline" items={timeLineItems}>
                        </Timeline>
                    </Row>
                    <Row justify="center" style={{ paddingBottom: 10 }}>
                        <Pagination
                            style={{ textAlign: 'center' }}
                            defaultCurrent={1}
                            total={totalSize}
                            pageSize={size}
                            current={page}
                            onChange={(page, pageSize) => {
                                setPage(page);
                                setSize(pageSize || 15);
                            }}
                        />
                    </Row>
                </div>
            ) : (
                <Row style={{ marginTop: 24, alignContent: "center", alignItems: "center", display: "block" }} >
                    <Empty />
                </Row>
            )}
        </Card>
    </>
}

export default LogPage;