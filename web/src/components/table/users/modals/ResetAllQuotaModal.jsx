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

import React, { useState } from 'react';
import { Banner, Input, Modal, Typography } from '@douyinfe/semi-ui';
import { IconDelete } from '@douyinfe/semi-icons';
import { API, showError, showSuccess } from '../../../../helpers';

const ResetAllQuotaModal = ({ visible, onCancel, onSuccess, t }) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!password) return;
    setLoading(true);
    try {
      const res = await API.post('/api/user/reset-all-quota', { password });
      const { success, message } = res.data;
      if (success) {
        showSuccess(message);
        setPassword('');
        onCancel();
        onSuccess?.();
      } else {
        showError(message);
      }
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPassword('');
    onCancel();
  };

  return (
    <Modal
      title={
        <div className='flex items-center'>
          <IconDelete className='mr-2 text-red-500' />
          {t('确认清空所有用户额度？')}
        </div>
      }
      visible={visible}
      onCancel={handleClose}
      onOk={handleConfirm}
      okButtonProps={{ type: 'danger', loading }}
      size='small'
      centered
      className='modern-modal'
    >
      <div className='space-y-4 py-4'>
        <Banner
          type='danger'
          description={t('此操作将把所有普通用户的额度归零，不可撤销')}
          closeIcon={null}
          className='!rounded-lg'
        />
        <div>
          <Typography.Text strong className='block mb-2'>
            {t('请输入超级管理员密码以确认')}
          </Typography.Text>
          <Input
            mode='password'
            placeholder={t('请输入超级管理员密码以确认')}
            value={password}
            onChange={setPassword}
            size='large'
            className='!rounded-lg'
          />
        </div>
      </div>
    </Modal>
  );
};

export default ResetAllQuotaModal;
