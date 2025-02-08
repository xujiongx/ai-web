import React, { useState, useRef } from 'react';
import { Button, Input, Toast } from 'antd-mobile';
import html2canvas from 'html2canvas';
import { Helmet } from 'react-helmet-async';
import { useRequest } from 'ahooks';
import styles from './index.module.less';
import request from '../../utils/request';
import ImagePreview from '../../components/ImagePreview';
import FestivalDecorations from '../../components/FestivalDecorations';

const Couplet: React.FC = () => {
  const [input, setInput] = useState('');

  const { loading, run: generateCouplet } = useRequest(
    async () => {
      return request.get('/mistral/couplet/generate', {
        params: {
          content: input,
        },
      });
    },
    {
      manual: true,
      onSuccess: (data) => {
        setResult(data.data.data);
      },
      onError: () => {
        Toast.show({
          content: '生成失败，请重试',
          position: 'top',
        });
      },
    }
  );

  const [result, setResult] = useState<{
    up: string;
    down: string;
    horizontal?: string;
  } | null>(null);

  const [showPreview, setShowPreview] = useState(false);

  const [previewImage, setPreviewImage] = useState('');
  const resultRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!input.trim()) {
      Toast.show({
        content: '请输入关键词',
        position: 'top',
      });
      return;
    }
    setResult(null); // 重置结果
    generateCouplet();
  };

  const handleShare = async () => {
    if (!result || !resultRef.current) return;
    
    try {
      Toast.show({
        content: '正在生成图片...',
        position: 'top',
      });
    
      const wrapper = document.createElement('div');
      wrapper.style.padding = '32px';
      wrapper.style.background = '#f4e5c9';
      wrapper.style.borderRadius = '16px';
      wrapper.style.width = '480px';
      wrapper.style.boxSizing = 'border-box';
      
      const content = resultRef.current.cloneNode(true) as HTMLElement;
      
      // 移除所有动画效果
      const animations = content.querySelectorAll('[class*="animation"]');
      animations.forEach(el => {
        (el as HTMLElement).style.animation = 'none';
      });
    
      // 调整装饰元素位置
      const lanternLeft = content.querySelector(`.${styles.lanternLeft}`);
      const lanternRight = content.querySelector(`.${styles.lanternRight}`);
      if (lanternLeft) {
        (lanternLeft as HTMLElement).style.left = '-80px';
        (lanternLeft as HTMLElement).style.top = '-40px';
      }
      if (lanternRight) {
        (lanternRight as HTMLElement).style.right = '-80px';
        (lanternRight as HTMLElement).style.top = '-40px';
      }
    
      // 调整整体布局
      const horizontalWrapper = content.querySelector(`.${styles.horizontalWrapper}`);
      if (horizontalWrapper) {
        (horizontalWrapper as HTMLElement).style.marginBottom = '40px';
        (horizontalWrapper as HTMLElement).style.position = 'relative';
      }
      
      wrapper.appendChild(content);
      document.body.appendChild(wrapper);
    
      const canvas = await html2canvas(wrapper, {
        backgroundColor: '#f4e5c9',
        scale: 3,
        useCORS: true,
        logging: false,
        allowTaint: true,
        onclone: (doc) => {
          // 在克隆后进行额外的样式调整
          const clonedContent = doc.body.firstChild as HTMLElement;
          if (clonedContent) {
            clonedContent.style.transform = 'none';
          }
        }
      });
    
      document.body.removeChild(wrapper);
    
      const image = canvas.toDataURL('image/png', 1.0);
      setPreviewImage(image);
      setShowPreview(true);
      
      Toast.clear();
    } catch (error) {
      console.error('生成图片失败:', error);
      Toast.show({
        content: '生成图片失败',
        position: 'top',
      });
    }
  };

  const handleDownload = () => {
    if (!previewImage) return;
    
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      window.open(previewImage, '_blank');
      Toast.show({
        content: '请长按图片进行保存',
        position: 'bottom',
      });
    } else {
      const link = document.createElement('a');
      link.download = `对联_${new Date().getTime()}.png`;
      link.href = previewImage;
      link.click();
    }
    setShowPreview(false);
  };

  return (
    <div className={styles.container}>
      <Helmet>
        <title>对联助手 - AI助手</title>
      </Helmet>
      <div className={styles.content}>
        <div className={styles.inputArea}>
          <Input
            placeholder='请输入关键词'
            value={input}
            onChange={setInput}
            className={styles.input}
          />
          <div className={styles.buttonGroup}>
            <Button
              color='default'
              loading={loading}
              onClick={handleGenerate}
              className={styles.generateButton}
            >
              生成对联
            </Button>
            {result && (
              <Button className={styles.shareButton} onClick={handleShare}>
                导出对联
              </Button>
            )}
          </div>
        </div>
        {result && (
          <div className={styles.resultArea} ref={resultRef}>
            {result.horizontal && (
              <div className={styles.horizontalWrapper}>
                <div className={styles.horizontal}>{result.horizontal}</div>
                <FestivalDecorations />
              </div>
            )}
            <div className={styles.couplet}>
              <div className={styles.up}>{result.up}</div>
              <div className={styles.down}>{result.down}</div>
            </div>
          </div>
        )}
      </div>
      <ImagePreview
        visible={showPreview}
        imageUrl={previewImage}
        onClose={() => setShowPreview(false)}
        onDownload={handleDownload}
      />
    </div>
  );
};


export default Couplet;