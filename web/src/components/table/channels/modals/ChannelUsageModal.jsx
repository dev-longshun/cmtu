import React, { useEffect, useState } from 'react';
import { Modal, Table, Tag, Spin, DatePicker } from '@douyinfe/semi-ui';
import { useTranslation } from 'react-i18next';
import { API, showError, renderQuota } from '../../../../helpers';

const ChannelUsageModal = ({ visible, channelId, channelName, onClose }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [dateRange, setDateRange] = useState(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 6);
    return [start, end];
  });

  const formatDate = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchData = async () => {
    if (!channelId || !dateRange || dateRange.length < 2) return;
    setLoading(true);
    try {
      const startDate = formatDate(dateRange[0]);
      const endDate = formatDate(dateRange[1]);
      const res = await API.get(
        `/api/channel/${channelId}/daily_usage?start_date=${startDate}&end_date=${endDate}`
      );
      if (res.data.success) {
        setData(res.data.data || []);
      } else {
        showError(res.data.message);
      }
    } catch (e) {
      showError(e.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (visible && channelId) {
      fetchData();
    }
  }, [visible, channelId, dateRange]);
  const columns = [
    {
      title: t('日期'),
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: t('请求数'),
      dataIndex: 'request_count',
      key: 'request_count',
    },
    {
      title: t('消耗额度'),
      dataIndex: 'quota_used',
      key: 'quota_used',
      render: (val) => renderQuota(val || 0),
    },
    {
      title: t('Token 用量'),
      dataIndex: 'token_used',
      key: 'token_used',
      render: (val) => (val || 0).toLocaleString(),
    },
  ];

  const totalQuota = data.reduce((sum, item) => sum + (item.quota_used || 0), 0);
  const totalRequests = data.reduce((sum, item) => sum + (item.request_count || 0), 0);

  return (
    <Modal
      title={`${t('每日用量')} - ${channelName || channelId}`}
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={640}
    >
      <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
        <DatePicker
          type='dateRange'
          value={dateRange}
          onChange={setDateRange}
          style={{ width: 260 }}
        />
        <Tag color='blue'>
          {t('合计')}: {renderQuota(totalQuota)} / {totalRequests} {t('请求')}
        </Tag>
      </div>
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          size='small'
          rowKey='date'
          empty={t('暂无数据')}
        />
      </Spin>
    </Modal>
  );
};

export default ChannelUsageModal;
