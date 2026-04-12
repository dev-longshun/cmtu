import React, { useState } from 'react';
import { Modal } from '@douyinfe/semi-ui';
import { renderQuota } from '../../../../helpers';

const RevokeRedemptionModal = ({
  visible,
  onCancel,
  record,
  banRedemptionUser,
  t,
}) => {
  const [loading, setLoading] = useState(false);

  const user = record?._user;

  const handleConfirm = async () => {
    setLoading(true);
    await banRedemptionUser(record.id);
    setLoading(false);
    onCancel();
  };

  return (
    <Modal
      title={t('确认封禁该用户？')}
      visible={visible}
      onCancel={onCancel}
      onOk={handleConfirm}
      confirmLoading={loading}
      type='warning'
    >
      <div style={{ lineHeight: '1.8' }}>
        {user && (
          <>
            <div>{t('兑换人')}: {user.username}{user.display_name ? ` (${user.display_name})` : ''}</div>
            <div>{t('当前额度')}: {renderQuota(user.quota)}</div>
          </>
        )}
        <div style={{ marginTop: 8, color: 'var(--semi-color-danger)' }}>
          {t('该用户将被永久禁用')}
        </div>
      </div>
    </Modal>
  );
};

export default RevokeRedemptionModal;
