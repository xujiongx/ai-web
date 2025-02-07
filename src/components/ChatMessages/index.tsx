import React, { useRef, useEffect } from 'react';
import { Card, Toast } from 'antd-mobile';
import { CouponOutline } from 'antd-mobile-icons';
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
  const messageListRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className={styles.messageList} ref={messageListRef}>
      {messages.length === 0 ? (
        <div className={styles.emptyState}>{loading ? '加载中...' : emptyText}</div>
      ) : (
        messages.map((message, index) => (
          <div
            key={`${index}-${message.role}-${message.content.slice(0, 10)}`}
            className={styles.messageItem}
            style={{
              flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
            }}
          >
            <div className={styles.avatar} style={{
              background: message.role === 'user' ? '#fff' : 'rgba(22, 119, 255, 0.1)',
              color: '#1677ff',
              border: '1px solid rgba(22, 119, 255, 0.1)',
            }}>
              {message.role === 'user' ? '我' : 'AI'}
            </div>
            <div className={styles.messageWrapper}>
              <Card
                className={`${styles.messageCard} ${
                  message.role === 'user' ? styles.userMessage : styles.aiMessage
                }`}
              >
                <div className={styles.text}>{message.content}</div>
                <div 
                  className={`${styles.copyButton} ${
                    message.role === 'user' ? styles.rightButton : styles.leftButton
                  }`}
                  onClick={() => handleCopy(message.content)}
                >
                  <CouponOutline />
                </div>
              </Card>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ChatMessages;
