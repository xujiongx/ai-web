import React, { useState } from 'react';
import { TextArea, Button, Toast } from 'antd-mobile';
import { Helmet } from 'react-helmet-async';
import { useRequest } from 'ahooks';
import styles from './index.module.less';
import request from '../../utils/request';

const Translate: React.FC = () => {
  const [input, setInput] = useState('');
  const [targetLang, setTargetLang] = useState<'en' | 'zh'>('en');

  const { loading, run: translate } = useRequest(
    async () => {
      return request.get('/mistral/translate', {
        params: {
          content: input,
          from: 'auto',
          to: targetLang,
        },
      });
    },
    {
      manual: true,
      onSuccess: (data) => {
        setResult(data.data.data.result);
      },
      onError: () => {
        Toast.show({
          content: '翻译失败，请重试',
          position: 'top',
        });
      },
    }
  );

  const [result, setResult] = useState('');

  const handleTranslate = () => {
    if (!input.trim()) {
      Toast.show({
        content: '请输入要翻译的内容',
        position: 'top',
      });
      return;
    }
    setResult('');
    translate();
  };

  const switchLanguage = () => {
    setTargetLang(targetLang === 'en' ? 'zh' : 'en');
    setInput(result);
    setResult('');
  };

  return (
    <div className={styles.container}>
      <Helmet>
        <title>翻译助手 - AI助手</title>
      </Helmet>
      <div className={styles.content}>
        <div className={styles.inputArea}>
          <TextArea
            placeholder={targetLang === 'en' ? '请输入中文' : 'Please input English'}
            value={input}
            onChange={setInput}
            className={styles.textarea}
            rows={6}
            autoSize={{ minRows: 6, maxRows: 12 }}
          />
          <div className={styles.buttonGroup}>
            <Button
              loading={loading}
              onClick={handleTranslate}
              className={styles.translateButton}
            >
              翻译
            </Button>
            <Button
              onClick={switchLanguage}
              className={styles.switchButton}
              disabled={!result}
            >
              切换语言
            </Button>
          </div>
        </div>
        {result && (
          <div className={styles.resultArea}>
            <TextArea
              value={result}
              readOnly
              className={styles.textarea}
              rows={6}
              autoSize={{ minRows: 6, maxRows: 12 }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Translate;