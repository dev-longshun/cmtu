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

import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Spin } from '@douyinfe/semi-ui';
import { IconUserAdd, IconRefresh } from '@douyinfe/semi-icons';
import CompactModeToggle from '../../common/ui/CompactModeToggle';
import { API, showError, isRoot } from '../../../helpers';
import { renderQuota } from '../../../helpers/render';

const { Text } = Typography;

const UsersDescription = ({ compactMode, setCompactMode, t }) => {
  const [totalQuota, setTotalQuota] = useState(null);
  const [loading, setLoading] = useState(false);
  const root = isRoot();

  const fetchTotalQuota = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get('/api/user/total_quota');
      const { success, data } = res.data;
      if (success) {
        setTotalQuota(data.quota);
      }
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (root) {
      fetchTotalQuota();
    }
  }, [root, fetchTotalQuota]);

  return (
    <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-2 w-full'>
      <div className='flex items-center gap-4'>
        <div className='flex items-center text-blue-500'>
          <IconUserAdd className='mr-2' />
          <Text>{t('用户管理')}</Text>
        </div>
        {root && (
          <div className='flex items-center gap-1 text-grey-500'>
            <Text size='small' type='tertiary'>
              {t('普通用户剩余额度总计')}:
            </Text>
            {loading ? (
              <Spin size='small' />
            ) : (
              <Text size='small' type='tertiary' strong>
                {totalQuota !== null ? renderQuota(totalQuota) : '-'}
              </Text>
            )}
            <IconRefresh
              size='small'
              style={{ cursor: 'pointer', marginLeft: 2 }}
              onClick={fetchTotalQuota}
            />
          </div>
        )}
      </div>
      <CompactModeToggle
        compactMode={compactMode}
        setCompactMode={setCompactMode}
        t={t}
      />
    </div>
  );
};

export default UsersDescription;
