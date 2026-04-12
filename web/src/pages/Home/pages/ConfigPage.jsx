import React from 'react';
import { useTranslation } from 'react-i18next';
import ContentCard from '../components/ContentCard';
import CodeBlock from '../components/CodeBlock';
import TabNav from '../components/TabNav';

const ConfigPage = ({ serverAddress }) => {
  const { t } = useTranslation();

  const settingsJson = (sa) => JSON.stringify({
    env: {
      ANTHROPIC_BASE_URL: `${sa}/`,
      ANTHROPIC_AUTH_TOKEN: 'sk-xxxxxxxxxxxxxxxx',
      CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: '1',
    },
  }, null, 2);

  return (
    <div className="hp-page">
      <div className="hp-breadcrumb">
        <a href={serverAddress}>{t('hp_nav_home')}</a>
        <span className="hp-breadcrumb-sep">/</span>
        <span>{t('hp_config_breadcrumb')}</span>
      </div>
      <h1 className="hp-page-title">{t('hp_config_title')}</h1>
      <p className="hp-page-desc">{t('hp_config_desc')}</p>

      <TabNav tabs={['Windows', 'macOS', 'Linux']}>
        {/* Windows */}
        <div>
          <ContentCard step={1} title={t('hp_config_win_s1_title')}>
            <p dangerouslySetInnerHTML={{ __html: t('hp_config_win_s1_text') }} />
          </ContentCard>
          <ContentCard step={2} title={t('hp_config_win_s2_title')}>
            <p dangerouslySetInnerHTML={{ __html: t('hp_config_win_s2_text') }} />
            <CodeBlock>{`> node -v\nv22.21.0`}</CodeBlock>
          </ContentCard>
          <ContentCard step={3} title={t('hp_config_win_s3_title')}>
            <p>{t('hp_config_win_s3_text')}</p>
            <CodeBlock>npm install -g @anthropic-ai/claude-code</CodeBlock>
            <p dangerouslySetInnerHTML={{ __html: t('hp_config_win_s3_extra') }} />
          </ContentCard>
          <ContentCard step={4} title={t('hp_config_win_s4_title')}>
            <p dangerouslySetInnerHTML={{ __html: t('hp_config_win_s4_text1') }} />
            <p>{t('hp_config_win_s4_text2')}</p>
            <p dangerouslySetInnerHTML={{ __html: t('hp_config_win_s4_text3') }} />
            <CodeBlock copyData={() => settingsJson(serverAddress)}>
              {settingsJson(serverAddress)}
            </CodeBlock>
            <div className="hp-notice warning" dangerouslySetInnerHTML={{ __html: t('hp_config_win_s4_notice') }} />
          </ContentCard>
          <ContentCard step={5} title={t('hp_config_win_s5_title')}>
            <p dangerouslySetInnerHTML={{ __html: t('hp_config_win_s5_text') }} />
          </ContentCard>
        </div>

        {/* macOS */}
        <div>
          <ContentCard step={1} title={t('hp_config_mac_s1_title')}>
            <p>{t('hp_config_mac_s1_text')}</p>
            <CodeBlock>{`npm install -g @anthropic-ai/claude-code\nclaude -v`}</CodeBlock>
          </ContentCard>
          <ContentCard step={2} title={t('hp_config_mac_s2_title')}>
            <p dangerouslySetInnerHTML={{ __html: t('hp_config_mac_s2_text') }} />
            <CodeBlock>{`echo 'export ANTHROPIC_AUTH_TOKEN="sk-xxx"' >> ~/.zshrc\necho 'export ANTHROPIC_BASE_URL="${serverAddress}"' >> ~/.zshrc\nsource ~/.zshrc`}</CodeBlock>
            <div className="hp-notice warning" dangerouslySetInnerHTML={{ __html: t('hp_config_mac_s2_notice') }} />
          </ContentCard>
          <ContentCard step={3} title={t('hp_config_mac_s3_title')}>
            <p dangerouslySetInnerHTML={{ __html: t('hp_config_mac_s3_text') }} />
          </ContentCard>
        </div>

        {/* Linux */}
        <div>
          <ContentCard step={1} title={t('hp_config_linux_s1_title')}>
            <p>{t('hp_config_linux_s1_text')}</p>
            <CodeBlock>{`npm install -g @anthropic-ai/claude-code\nclaude -v`}</CodeBlock>
          </ContentCard>
          <ContentCard step={2} title={t('hp_config_linux_s2_title')}>
            <p dangerouslySetInnerHTML={{ __html: t('hp_config_linux_s2_ubuntu') }} />
            <CodeBlock>{`echo 'export ANTHROPIC_AUTH_TOKEN="sk-xxx"' >> ~/.bashrc\necho 'export ANTHROPIC_BASE_URL="${serverAddress}"' >> ~/.bashrc\nsource ~/.bashrc`}</CodeBlock>
            <p dangerouslySetInnerHTML={{ __html: t('hp_config_linux_s2_fedora') }} />
            <CodeBlock>{`echo 'export ANTHROPIC_AUTH_TOKEN="sk-xxx"' >> ~/.zshrc\necho 'export ANTHROPIC_BASE_URL="${serverAddress}"' >> ~/.zshrc\nsource ~/.zshrc`}</CodeBlock>
            <div className="hp-notice warning" dangerouslySetInnerHTML={{ __html: t('hp_config_linux_s2_notice') }} />
          </ContentCard>
          <ContentCard step={3} title={t('hp_config_linux_s3_title')}>
            <p dangerouslySetInnerHTML={{ __html: t('hp_config_linux_s3_text') }} />
          </ContentCard>
        </div>
      </TabNav>
    </div>
  );
};

export default ConfigPage;
