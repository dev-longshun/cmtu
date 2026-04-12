import React, { useState } from 'react';
import { Banner, Input, Modal, Typography } from '@douyinfe/semi-ui';
import { IconDelete } from '@douyinfe/semi-icons';
import { API, showError, showSuccess } from '../../../../helpers';

const DeleteDisabledUsersModal = ({ visible, onCancel, onSuccess, t }) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!password) return;
    setLoading(true);
    try {
      const res = await API.delete('/api/user/disabled', {
        data: { password },
      });
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
          {t('确认删除所有已禁用用户？')}
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
          description={t('此操作将永久删除所有已禁用的普通用户，不可撤销')}
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

export default DeleteDisabledUsersModal;
