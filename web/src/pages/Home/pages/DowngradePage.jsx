import React from 'react';
import { useTranslation } from 'react-i18next';
import ContentCard from '../components/ContentCard';
import CodeBlock from '../components/CodeBlock';
import TabNav from '../components/TabNav';

const DowngradePage = ({ serverAddress }) => {
  const { t } = useTranslation();

  const fullSettingsJson = (sa) => JSON.stringify({
    env: {
      ANTHROPIC_BASE_URL: `${sa}/`,
      ANTHROPIC_AUTH_TOKEN: 'sk-xxxxxxxxxxxxxxxx',
      CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: '1',
      DISABLE_AUTOUPDATER: '1',
    },
  }, null, 2);

  return (
    <div className="hp-page">
      <div className="hp-breadcrumb">
        <a href={serverAddress}>{t('hp_nav_home')}</a>
        <span className="hp-breadcrumb-sep">/</span>
        <span>{t('hp_dg_breadcrumb')}</span>
      </div>
      <h1 className="hp-page-title">{t('hp_dg_title')}</h1>
      <p className="hp-page-desc">{t('hp_dg_desc')}</p>

      <ContentCard title={t('hp_dg_card1_title')} tag={t('hp_dg_card1_tag')} tagColor="green">
        <CodeBlock>{`# ${t('hp_dg_card1_comment1')}\nnpm install -g @anthropic-ai/claude-code@2.0.69\n\n# ${t('hp_dg_card1_comment2')}\nnpm install -g @anthropic-ai/claude-code@1.0.12`}</CodeBlock>
      </ContentCard>

      <ContentCard title={t('hp_dg_card2_title')}>
        <CodeBlock>{`# ${t('hp_dg_card2_comment1')}\nnpm view @anthropic-ai/claude-code versions\n\n# ${t('hp_dg_card2_comment2')}\nnpm info @anthropic-ai/claude-code@2.0.69`}</CodeBlock>
      </ContentCard>

      <ContentCard title={t('hp_dg_card3_title')} tag={t('hp_dg_card3_tag')} tagColor="purple">
        <p dangerouslySetInnerHTML={{ __html: t('hp_dg_card3_desc') }} />
      </ContentCard>

      <ContentCard step={1} title={t('hp_dg_step1_title')}>
        <CodeBlock>{`# ${t('hp_dg_step1_comment')}\nnpm install -g @anthropic-ai/claude-code@2.0.69`}</CodeBlock>
      </ContentCard>

      <ContentCard step={2} title={t('hp_dg_step2_title')}>
        <div className="hp-notice tip" dangerouslySetInnerHTML={{ __html: t('hp_dg_step2_notice') }} />
        <TabNav tabs={['Windows', 'macOS/Linux']}>
          <div>
            <p dangerouslySetInnerHTML={{ __html: t('hp_dg_step2_win_desc') }} />
            <CodeBlock copyData={() => fullSettingsJson(serverAddress)}>
              {fullSettingsJson(serverAddress)}
            </CodeBlock>
          </div>
          <div>
            <p dangerouslySetInnerHTML={{ __html: t('hp_dg_step2_unix_desc') }} />
            <CodeBlock copyData={() => fullSettingsJson(serverAddress)}>
              {fullSettingsJson(serverAddress)}
            </CodeBlock>
          </div>
        </TabNav>
      </ContentCard>

      <ContentCard step={3} title={t('hp_dg_step3_title')}>
        <CodeBlock>{`# ${t('hp_dg_step3_comment')}\nclaude --version\n\n# ${t('hp_dg_step3_output')}`}</CodeBlock>
      </ContentCard>
    </div>
  );
};

export default DowngradePage;
