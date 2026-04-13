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

import React, { useEffect, useState, useRef } from 'react';
import { Button, Col, Form, Row, Spin, Typography, Input } from '@douyinfe/semi-ui';
import { IconPlus, IconDelete } from '@douyinfe/semi-icons';
import {
  compareObjects,
  API,
  showError,
  showSuccess,
  showWarning,
  renderQuota,
} from '../../../helpers';
import { useTranslation } from 'react-i18next';

export default function SettingsCheckin(props) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState({
    'checkin_setting.enabled': false,
    'checkin_setting.daily_quota': 500000,
    'checkin_setting.streak_bonuses': '',
  });
  const refForm = useRef();
  const [inputsRow, setInputsRow] = useState(inputs);
  const [streakBonuses, setStreakBonuses] = useState([]);

  function handleFieldChange(fieldName) {
    return (value) => {
      setInputs((inputs) => ({ ...inputs, [fieldName]: value }));
    };
  }

  const addStreakBonus = () => {
    setStreakBonuses((prev) => [...prev, { days: '', quota: '' }]);
  };

  const removeStreakBonus = (index) => {
    setStreakBonuses((prev) => prev.filter((_, i) => i !== index));
  };

  const updateStreakBonus = (index, field, value) => {
    setStreakBonuses((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: parseInt(value) || 0 };
      return next;
    });
  };

  // 同步 streakBonuses 到 inputs
  useEffect(() => {
    const json = JSON.stringify(streakBonuses.filter(b => b.days > 0 && b.quota > 0));
    setInputs((prev) => ({ ...prev, 'checkin_setting.streak_bonuses': json }));
  }, [streakBonuses]);

  function onSubmit() {
    const updateArray = compareObjects(inputs, inputsRow);
    if (!updateArray.length) return showWarning(t('你似乎并没有修改什么'));
    const requestQueue = updateArray.map((item) => {
      let value = '';
      if (typeof inputs[item.key] === 'boolean') {
        value = String(inputs[item.key]);
      } else {
        value = String(inputs[item.key]);
      }
      return API.put('/api/option/', { key: item.key, value });
    });
    setLoading(true);
    Promise.all(requestQueue)
      .then((res) => {
        if (res.includes(undefined)) return showError(t('部分保存失败，请重试'));
        showSuccess(t('保存成功'));
        props.refresh();
      })
      .catch(() => showError(t('保存失败，请重试')))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    const currentInputs = {};
    for (let key in props.options) {
      if (Object.keys(inputs).includes(key)) {
        currentInputs[key] = props.options[key];
      }
    }
    setInputs(currentInputs);
    setInputsRow(structuredClone(currentInputs));
    refForm.current.setValues(currentInputs);
    // 解析里程碑配置
    try {
      const bonuses = currentInputs['checkin_setting.streak_bonuses'];
      const parsed = bonuses ? JSON.parse(bonuses) : [];
      setStreakBonuses(Array.isArray(parsed) ? parsed : []);
    } catch {
      setStreakBonuses([]);
    }
  }, [props.options]);

  return (
    <Spin spinning={loading}>
      <Form
        values={inputs}
        getFormApi={(formAPI) => (refForm.current = formAPI)}
        style={{ marginBottom: 15 }}
      >
        <Form.Section text={t('签到设置')}>
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8}>
              <Form.Switch
                field={'checkin_setting.enabled'}
                label={t('启用签到功能')}
                size='default'
                checkedText='｜'
                uncheckedText='〇'
                onChange={handleFieldChange('checkin_setting.enabled')}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.InputNumber
                field={'checkin_setting.daily_quota'}
                label={t('每日签到奖励')}
                extraText={t('quota 内部单位，当前约等于') + ' ' + renderQuota(inputs['checkin_setting.daily_quota'] || 0)}
                onChange={handleFieldChange('checkin_setting.daily_quota')}
                min={0}
                disabled={!inputs['checkin_setting.enabled']}
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Slot label={t('连续签到里程碑奖励')}>
                <Typography.Text type='tertiary' size='small' style={{ display: 'block', marginBottom: 8 }}>
                  {t('里程碑当天的奖励替换基础奖励，不叠加')}
                </Typography.Text>
                <div className='flex flex-col gap-2'>
                  {streakBonuses.map((bonus, idx) => (
                    <div
                      key={idx}
                      className='flex items-center gap-2 p-2 rounded-lg'
                      style={{ border: '1px solid var(--semi-color-border)', background: 'var(--semi-color-fill-0)' }}
                    >
                      <span className='text-sm whitespace-nowrap'>{t('连续第')}</span>
                      <Input
                        placeholder={t('天数')}
                        value={bonus.days || ''}
                        onChange={(v) => updateStreakBonus(idx, 'days', v)}
                        style={{ width: 80 }}
                        type='number'
                      />
                      <span className='text-sm whitespace-nowrap'>{t('天，当天总奖励')}</span>
                      <Input
                        placeholder='quota'
                        value={bonus.quota || ''}
                        onChange={(v) => updateStreakBonus(idx, 'quota', v)}
                        style={{ width: 120 }}
                        type='number'
                        suffix={bonus.quota > 0 ? renderQuota(bonus.quota) : ''}
                      />
                      <Button
                        icon={<IconDelete />}
                        type='danger'
                        theme='borderless'
                        onClick={() => removeStreakBonus(idx)}
                      />
                    </div>
                  ))}
                  <Button
                    icon={<IconPlus />}
                    theme='light'
                    onClick={addStreakBonus}
                    style={{ alignSelf: 'flex-start' }}
                    disabled={!inputs['checkin_setting.enabled']}
                  >
                    {t('添加里程碑')}
                  </Button>
                </div>
              </Form.Slot>
            </Col>
          </Row>
          <Row>
            <Button size='default' onClick={onSubmit}>
              {t('保存签到设置')}
            </Button>
          </Row>
        </Form.Section>
      </Form>
    </Spin>
  );
}
