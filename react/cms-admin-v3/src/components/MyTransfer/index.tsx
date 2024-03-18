import React, { useEffect, useState } from "react";
import { message, Modal, Spin, Transfer } from "antd";
import { TransferItem } from "antd/lib/transfer";

interface IModalTransferProps {
  title: string;
  visible: boolean;
  loading: boolean;
  fetchList: () => Promise<TransferItem[]>;
  fetchSelected: () => Promise<string[]>;
  onCancel: () => void;
  onSubmit: (value: any) => void;
}

function arrayDiff(arr1: string[], arr2: string[]) {
  return arr1.filter(item => !arr2.includes(item));
}

const MyModalTransfer: React.FC<IModalTransferProps> = ({ title, visible, loading, fetchList, fetchSelected, onCancel, onSubmit }: IModalTransferProps) => {
  const [loadingData, setLoadingData] = useState(true);
  const [loadingRoleData, setLoadingRoleData] = useState(true);
  const [dataSource, setDataSource] = useState<TransferItem[]>([]);
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const [originalSelectedKeys, setOriginalSelectedKeys] = useState<string[]>([]);

  useEffect(() => {
    if (fetchList && visible) {
      setLoadingData(true);
      fetchList()
        .then(res => setDataSource(res))
        .catch(error => message.error(error.msg))
        .finally(() => setLoadingData(false));
    }
  }, [fetchList, visible]);

  useEffect(() => {
    if (fetchSelected && visible) {
      setLoadingRoleData(true);
      fetchSelected()
        .then(res => {
          setTargetKeys(res);
          setOriginalSelectedKeys(res);
        })
        .catch(error => message.error(error.msg))
        .finally(() => setLoadingRoleData(false));
    }
  }, [fetchSelected, visible]);

  return (
    <Modal
      width={590}
      title={title}
      open={visible}
      confirmLoading={loading}
      onCancel={onCancel}
      onOk={() => {
        const addItems = arrayDiff(targetKeys, originalSelectedKeys);
        const delItems = arrayDiff(originalSelectedKeys, targetKeys);
        const data = {
          add_items: addItems,
          delete_items: delItems,
        };
        onSubmit(data);
      }}>
      {loadingData || loadingRoleData ? (
        <Spin size="large" />
      ) : (
        <Transfer
          listStyle={{
            width: '100%',
            height: 300,
          }}
          dataSource={dataSource}
          titles={['全部', '选中']}
          rowKey={record => record.key || ''}
          targetKeys={targetKeys}
          onChange={nextTargetKeys => setTargetKeys(nextTargetKeys)}
          render={item => item.title || ''}
        />
      )}
    </Modal>
  );
};

export default MyModalTransfer;