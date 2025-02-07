import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Input, Button, Card, Toast, DotLoading } from 'antd-mobile';
import { useRequest } from 'ahooks';
import styles from './index.module.less';
import request from '../../utils/request'
import { Helmet } from 'react-helmet-async'

interface Message {
  role: 'user' | 'ai';
  content: string;
}

const ChatDetail: React.FC = () => {
  const { id } = useParams();
  const messageListRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  // 滚动到底部
  const scrollToBottom = () => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const { loading } = useRequest(
    async () => {
      const response = await request.get(
        `http://192.168.1.63:3001/mistral/conversations/${id}`
      );
      return response.data;
    },
    {
      onSuccess: (data) => {
        setMessages(data.data || []);
      },
      onError: (error) => {
        Toast.show({
          content: '获取对话失败：' + error.message,
        });
      },
    }
  );

  const { loading: sendLoading, run: sendMessage } = useRequest(
    async (content: string) => {
      const res = await request.get('http://192.168.1.63:3001/mistral', {
        params: { content, sessionId: id },
      });
      return res.data.data;
    },
    {
      manual: true,
      onSuccess: (data) => {
        setMessages((prev) => [...prev, { role: 'ai', content: data }]);
      },
      onError: (error) => {
        Toast.show({
          content: '发送失败：' + error.message,
        });
        // 移除用户最后一条消息
        setMessages((prev) => prev.slice(0, -1));
      },
    }
  );

  const handleSubmit = () => {
    if (!input.trim() || sendLoading) {
      Toast.show({
        content: sendLoading ? '正在处理中...' : '请输入内容',
      });
      return;
    }
    const userMessage = { role: 'user', content: input.trim() };
    setMessages((prev: Message[]) => [...prev, userMessage as Message]);
    setInput('');
    sendMessage(userMessage.content);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <DotLoading color='primary' />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Helmet>
        <title>对话详情 - AI助手</title>
      </Helmet>
      <div className={styles.messageList} ref={messageListRef}>
        {messages.map((message, index) => (
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
            <Card
              className={`${styles.messageCard} ${
                message.role === 'user' ? styles.userMessage : styles.aiMessage
              }`}
            >
              <div className={styles.text}>{message.content}</div>
            </Card>
          </div>
        ))}
      </div>
      <div className={styles.inputArea}>
        <div className={styles.inputWrapper}>
          <Input
            value={input}
            onChange={setInput}
            placeholder='输入消息...'
            onEnterPress={handleSubmit}
            disabled={sendLoading}
          />
          <Button
            loading={sendLoading}
            onClick={handleSubmit}
            color='primary'
            disabled={sendLoading}
          >
            发送
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatDetail;
