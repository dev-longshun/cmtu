/*
Copyright (C) 2025 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/

import React from 'react';
import { Tag, Button, Space, Popover, Dropdown } from '@douyinfe/semi-ui';
import { IconMore } from '@douyinfe/semi-icons';
import { renderQuota, timestamp2string } from '../../../helpers';
import {
  REDEMPTION_STATUS,
  REDEMPTION_STATUS_MAP,
  REDEMPTION_ACTIONS,
} from '../../../constants/redemption.constants';

/**
 * Check if redemption code is expired
 */
export const isExpired = (record) => {
  return (
    record.status === REDEMPTION_STATUS.UNUSED &&
    record.expired_time !== 0 &&
    record.expired_time < Math.floor(Date.now() / 1000)
  );
};

/**
 * Render timestamp
 */
const renderTimestamp = (timestamp) => {
  return <>{timestamp2string(timestamp)}</>;
};

/**
 * Render redemption code status
 */
const renderStatus = (status, record, t) => {
  const tags = [];

  if (isExpired(record)) {
    tags.push(
      <Tag key='expired' color='orange' shape='circle'>
        {t('已过期')}
      </Tag>
    );
  } else {
    const statusConfig = REDEMPTION_STATUS_MAP[status];
    if (statusConfig) {
      tags.push(
        <Tag key='status' color={statusConfig.color} shape='circle'>
          {t(statusConfig.text)}
        </Tag>
      );
    } else {
      tags.push(
        <Tag key='unknown' color='black' shape='circle'>
          {t('未知状态')}
        </Tag>
      );
    }
  }

  if (record.deleted_at) {
    tags.push(
      <Tag key='deleted' color='red' shape='circle' style={{ marginLeft: 4 }}>
        {t('已删除')}
      </Tag>
    );
  }

  return <>{tags}</>;
};

/**
 * Get redemption code table column definitions
 */
export const getRedemptionsColumns = ({
  t,
  manageRedemption,
  copyText,
  setEditingRedemption,
  setShowEdit,
  refresh,
  redemptions,
  activePage,
  showDeleteRedemptionModal,
  showRevokeRedemptionModal,
}) => {
  return [
    {
      title: t('ID'),
      dataIndex: 'id',
    },
    {
      title: t('名称'),
      dataIndex: 'name',
    },
    {
      title: t('状态'),
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => {
        return <div>{renderStatus(text, record, t)}</div>;
      },
    },
    {
      title: t('额度'),
      dataIndex: 'quota',
      render: (text) => {
        return (
          <div>
            <Tag color='grey' shape='circle'>
              {renderQuota(parseInt(text))}
            </Tag>
          </div>
        );
      },
    },
    {
      title: t('创建时间'),
      dataIndex: 'created_time',
      render: (text) => {
        return <div>{renderTimestamp(text)}</div>;
      },
    },
    {
      title: t('过期时间'),
      dataIndex: 'expired_time',
      render: (text) => {
        return <div>{text === 0 ? t('永不过期') : renderTimestamp(text)}</div>;
      },
    },
    {
      title: t('兑换人ID'),
      dataIndex: 'used_user_id',
      render: (text) => {
        return <div>{text === 0 ? t('无') : text}</div>;
      },
    },
    {
      title: t('兑换人'),
      dataIndex: '_user',
      render: (text, record) => {
        const user = record._user;
        if (!user) return <div>-</div>;
        return (
          <div>
            <div>{user.username}{user.display_name ? ` (${user.display_name})` : ''}</div>
            <div style={{ fontSize: 12, color: 'var(--semi-color-text-2)' }}>
              <Tag size='small' color={user.status === 1 ? 'green' : 'red'} shape='circle'>
                {user.status === 1 ? t('正常') : t('已禁用')}
              </Tag>
              {' '}{t('当前额度')}: {renderQuota(user.quota)}
            </div>
          </div>
        );
      },
    },
    {
      title: '',
      dataIndex: 'operate',
      fixed: 'right',
      width: 205,
      render: (text, record) => {
        // Create dropdown menu items for more operations
        const moreMenuItems = [
          {
            node: 'item',
            name: t('删除'),
            type: 'danger',
            onClick: () => {
              showDeleteRedemptionModal(record);
            },
          },
        ];

        if (record.status === REDEMPTION_STATUS.UNUSED && !isExpired(record)) {
          moreMenuItems.push({
            node: 'item',
            name: t('禁用'),
            type: 'warning',
            onClick: () => {
              manageRedemption(record.id, REDEMPTION_ACTIONS.DISABLE, record);
            },
          });
        } else if (!isExpired(record)) {
          moreMenuItems.push({
            node: 'item',
            name: t('启用'),
            type: 'secondary',
            onClick: () => {
              manageRedemption(record.id, REDEMPTION_ACTIONS.ENABLE, record);
            },
            disabled: record.status === REDEMPTION_STATUS.USED,
          });
        }

        if (record.status === REDEMPTION_STATUS.USED && record.used_user_id > 0) {
          moreMenuItems.push({
            node: 'item',
            name: t('封禁用户'),
            type: 'danger',
            onClick: () => {
              showRevokeRedemptionModal(record);
            },
          });
        }

        return (
          <Space>
            <Popover
              content={record.key}
              style={{ padding: 20 }}
              position='top'
            >
              <Button type='tertiary' size='small'>
                {t('查看')}
              </Button>
            </Popover>
            <Button
              size='small'
              onClick={async () => {
                await copyText(record.key);
              }}
            >
              {t('复制')}
            </Button>
            <Button
              type='tertiary'
              size='small'
              onClick={() => {
                setEditingRedemption(record);
                setShowEdit(true);
              }}
              disabled={record.status !== REDEMPTION_STATUS.UNUSED}
            >
              {t('编辑')}
            </Button>
            <Dropdown
              trigger='click'
              position='bottomRight'
              menu={moreMenuItems}
            >
              <Button type='tertiary' size='small' icon={<IconMore />} />
            </Dropdown>
          </Space>
        );
      },
    },
  ];
};
