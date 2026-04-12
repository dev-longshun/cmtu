import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button, Typography, Tag, Spin } from '@douyinfe/semi-ui';
import { IconPlay, IconStop, IconRefresh } from '@douyinfe/semi-icons';
import dayjs from 'dayjs';
import { API, showError, isRoot } from '../../../helpers';
import { renderQuota } from '../../../helpers/render';

const { Text } = Typography;

const STORAGE_KEY_START = 'quota_tracker_start_time';
const STORAGE_KEY_ACTIVE = 'quota_tracker_active';
const POLL_INTERVAL = 30000;

function formatElapsed(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function QuotaTracker({ t }) {
  const [active, setActive] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [quota, setQuota] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [loading, setLoading] = useState(false);
  const pollRef = useRef(null);
  const tickRef = useRef(null);

  const fetchStat = useCallback(async (ts) => {
    try {
      setLoading(true);
      const res = await API.get(`/api/log/stat?start_timestamp=${ts}`);
      const { success, data } = res.data;
      if (success) {
        setQuota(data.quota || 0);
      }
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Restore state from localStorage on mount
  useEffect(() => {
    const savedActive = localStorage.getItem(STORAGE_KEY_ACTIVE) === 'true';
    const savedStart = localStorage.getItem(STORAGE_KEY_START);
    if (savedActive && savedStart) {
      const ts = parseInt(savedStart, 10);
      setStartTime(ts);
      setActive(true);
      fetchStat(ts);
    }
  }, [fetchStat]);

  // Polling interval when active
  useEffect(() => {
    if (active && startTime) {
      pollRef.current = setInterval(() => fetchStat(startTime), POLL_INTERVAL);
      return () => clearInterval(pollRef.current);
    }
  }, [active, startTime, fetchStat]);

  // Elapsed time ticker
  useEffect(() => {
    if (active && startTime) {
      const updateElapsed = () => {
        setElapsed(Math.floor(Date.now() / 1000) - startTime);
      };
      updateElapsed();
      tickRef.current = setInterval(updateElapsed, 1000);
      return () => clearInterval(tickRef.current);
    }
  }, [active, startTime]);

  const handleStart = () => {
    const ts = Math.floor(Date.now() / 1000);
    setStartTime(ts);
    setActive(true);
    setQuota(0);
    setElapsed(0);
    localStorage.setItem(STORAGE_KEY_START, String(ts));
    localStorage.setItem(STORAGE_KEY_ACTIVE, 'true');
    fetchStat(ts);
  };

  const handleStop = () => {
    setActive(false);
    localStorage.setItem(STORAGE_KEY_ACTIVE, 'false');
    if (startTime) fetchStat(startTime);
  };

  const handleReset = () => {
    setActive(false);
    setStartTime(null);
    setQuota(0);
    setElapsed(0);
    localStorage.removeItem(STORAGE_KEY_START);
    localStorage.removeItem(STORAGE_KEY_ACTIVE);
  };

  if (!isRoot()) return null;

  return (
    <div
      style={{
        padding: '20px',
        marginTop: '16px',
        border: '1px solid var(--semi-color-border)',
        borderRadius: '8px',
        background: 'var(--semi-color-bg-1)',
      }}
    >
      <div className='flex items-center gap-2 mb-4'>
        <Text strong style={{ fontSize: 16 }}>
          {t('额度消耗追踪')}
        </Text>
        {active && (
          <Tag color='green' type='light' size='small'>
            <span
              style={{
                display: 'inline-block',
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#52c41a',
                marginRight: 4,
                animation: 'pulse 1.5s infinite',
              }}
            />
            {t('追踪中')}
          </Tag>
        )}
        {!active && startTime && (
          <Tag color='grey' type='light' size='small'>
            {t('已停止')}
          </Tag>
        )}
      </div>

      {startTime && (
        <div className='flex flex-col gap-2 mb-4'>
          <div className='flex items-center gap-4 flex-wrap'>
            <Text type='tertiary'>
              {t('开始时间')}：{dayjs.unix(startTime).format('YYYY-MM-DD HH:mm:ss')}
            </Text>
            <Text type='tertiary'>
              {t('运行时长')}：{formatElapsed(elapsed)}
            </Text>
          </div>
          <div className='flex items-center gap-2'>
            <Text style={{ fontSize: 24 }} strong>
              {renderQuota(quota, 4)}
            </Text>
            {loading && <Spin size='small' />}
          </div>
        </div>
      )}

      <div className='flex gap-2'>
        {!active ? (
          <Button
            icon={<IconPlay />}
            type='primary'
            size='small'
            onClick={handleStart}
          >
            {startTime ? t('重新开始') : t('开始追踪')}
          </Button>
        ) : (
          <Button
            icon={<IconStop />}
            type='warning'
            size='small'
            onClick={handleStop}
          >
            {t('停止追踪')}
          </Button>
        )}
        {startTime && (
          <Button
            icon={<IconRefresh />}
            type='tertiary'
            size='small'
            onClick={handleReset}
          >
            {t('重置')}
          </Button>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
