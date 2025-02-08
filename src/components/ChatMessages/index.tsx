import React, { useRef, useEffect, useState } from 'react';
import { Card, Toast } from 'antd-mobile';
import { CouponOutline, SearchOutline } from 'antd-mobile-icons';
import html2canvas from 'html2canvas';
import ImagePreview from '../ImagePreview';
import styles from './index.module.less';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

interface ChatMessagesProps {
  messages: Message[];
  loading?: boolean;
  emptyText?: string;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  loading,
  emptyText = '开始一个新的对话吧',
}) => {
  const [previewImage, setPreviewImage] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);
  
  const messageListRef = useRef<HTMLDivElement>(null);

  // 移除未使用的 messageRefs
  
  const scrollToBottom = () => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleCopy = async (content: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        // 对于支持 Clipboard API 的现代浏览器
        await navigator.clipboard.writeText(content);
      } else {
        // 降级方案：创建临时输入框
        const textArea = document.createElement('textarea');
        textArea.value = content;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          document.execCommand('copy');
          textArea.remove();
        } catch (err) {
          console.error('复制失败', err);
          textArea.remove();
          throw new Error('复制失败');
        }
      }
      Toast.show({
        content: '已复制到剪贴板',
        position: 'top',
      });
    } catch {
      Toast.show({
        content: '复制失败，请手动复制',
        position: 'top',
      });
    }
  };

  const handleShare = async (content: string, isUser: boolean) => {
    try {
      Toast.show({
        content: '正在生成图片...',
        position: 'top',
      });

      const wrapper = document.createElement('div');
      wrapper.style.padding = '24px';
      wrapper.style.background = isUser ? 'linear-gradient(135deg, #1677ff, #0056d6)' : '#ffffff';
      wrapper.style.borderRadius = '16px';
      wrapper.style.maxWidth = '600px';
      wrapper.style.width = '100%';
      wrapper.style.boxSizing = 'border-box';
      wrapper.style.position = 'fixed';
      wrapper.style.left = '-9999px';
      wrapper.style.top = '-9999px';
      wrapper.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.08)';
      
      const textDiv = document.createElement('div');
      textDiv.style.color = isUser ? '#ffffff' : '#333333';
      textDiv.style.fontSize = '15px';
      textDiv.style.lineHeight = '1.6';
      textDiv.style.whiteSpace = 'pre-wrap';
      textDiv.style.wordBreak = 'break-word';
      textDiv.style.letterSpacing = '0.2px';
      textDiv.textContent = content;
      
      wrapper.appendChild(textDiv);
      document.body.appendChild(wrapper);

      // 计算实际内容宽度
      const maxWidth = Math.min(600, window.innerWidth - 48);
      wrapper.style.width = `${maxWidth}px`;

      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(wrapper, {
        backgroundColor: isUser ? null : '#ffffff',
        scale: 2,
        useCORS: true,
        logging: false,
      });

      document.body.removeChild(wrapper);

      const image = canvas.toDataURL('image/png', 1.0);
      setPreviewImage(image);
      setPreviewVisible(true);
      
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
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      window.open(previewImage, '_blank');
      Toast.show({
        content: '请长按图片进行保存',
        position: 'bottom',
      });
    } else {
      const link = document.createElement('a');
      link.download = `消息记录_${new Date().getTime()}.png`;
      link.href = previewImage;
      link.click();
    }
    setPreviewVisible(false);
  };

  return (
    <>
      <div className={styles.messageList} ref={messageListRef}>
        {messages.length === 0 ? (
          <div className={styles.emptyState}>
            {loading ? '加载中...' : emptyText}
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={`${index}-${message.role}-${message.content.slice(0, 10)}`}
              className={styles.messageItem}
              style={{
                flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
              }}
            >
              <div
                className={styles.avatar}
                style={{
                  background:
                    message.role === 'user' ? '#fff' : 'rgba(22, 119, 255, 0.1)',
                  color: '#1677ff',
                  border: '1px solid rgba(22, 119, 255, 0.1)',
                }}
              >
                {message.role === 'user' ? '我' : 'AI'}
              </div>
              <div
                className={styles.messageWrapper}
              >
                <Card
                  className={`${styles.messageCard} ${
                    message.role === 'user'
                      ? styles.userMessage
                      : styles.aiMessage
                  }`}
                >
                  <div className={styles.text}>{message.content}</div>
                  <div className={`${styles.buttonGroup} ${
                    message.role === 'user' ? styles.rightGroup : styles.leftGroup
                  }`}>
                    <div
                      className={styles.actionButton}
                      onClick={() => handleCopy(message.content)}
                    >
                      <CouponOutline />
                    </div>
                    <div
                      className={styles.actionButton}
                      onClick={() =>
                        handleShare(message.content, message.role === 'user')
                      }
                    >
                      <SearchOutline />
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          ))
        )}
      </div>
      <ImagePreview
        visible={previewVisible}
        imageUrl={previewImage}
        onClose={() => setPreviewVisible(false)}
        onDownload={handleDownload}
      />
    </>
  );
};

export default ChatMessages;
