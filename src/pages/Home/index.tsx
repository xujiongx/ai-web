import React, { useState } from 'react';
import axios from 'axios';
import { Input, Button, Card, Toast } from 'antd-mobile';
import { useRequest } from 'ahooks';
import styles from './index.module.less';

interface Message {
  type: 'user' | 'ai';
  content: string;
}

const Home: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string>('');

  const createNewConversation = () => {
    const newId = Date.now().toString();
    setConversationId(newId);
    setMessages([]);
    Toast.show({
      content: '已创建新对话',
      position: 'top',
    });
  };

  const { loading, run } = useRequest(
    async (content: string) => {
      const res = await axios.get('http://192.168.1.63:3001/mistral', {
        params: { content, sessionId: conversationId },
      });
      return res.data.data;
    },
    {
      manual: true,
      onSuccess: (data) => {
        setMessages((prev) => [...prev, { type: 'ai', content: data }]);
      },
      onError: (error) => {
        Toast.show({
          content: '请求失败：' + error.message,
          position: 'top',
        });
      },
    }
  );

  const handleSubmit = () => {
    if (!input.trim()) {
      Toast.show({
        content: '请输入问题',
        position: 'top',
      });
      return;
    }
    setMessages((prev) => [...prev, { type: 'user', content: input }]);
    run(input);
    setInput('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <Button
              onClick={createNewConversation}
              color='primary'
              fill='outline'
            >
              新对话
            </Button>
            {conversationId ? (
              <span className={styles.conversationId}>
                对话ID: {conversationId}
              </span>
            ) : (
              <span className={styles.noConversation}>
                请先创建新对话
              </span>
            )}
          </div>
        </div>

        <div className={styles.messageList}>
          {!conversationId ? (
            <div className={styles.emptyState}>
              点击「新对话」按钮开始聊天
            </div>
          ) : messages.length === 0 ? (
            <div className={styles.emptyState}>
              开始一个新的对话吧
            </div>
          ) : (
            messages.map((message, index) => (
              <Card
                key={index}
                className={`${styles.messageCard} ${
                  message.type === 'user' ? styles.userMessage : styles.aiMessage
                }`}
              >
                <div className={styles.messageContent}>{message.content}</div>
              </Card>
            ))
          )}
        </div>

        <div className={styles.inputArea}>
          <div className={styles.inputWrapper}>
            <Input
              value={input}
              onChange={setInput}
              placeholder={conversationId ? '请输入您的问题' : '请先创建新对话'}
              onEnterPress={handleSubmit}
              disabled={!conversationId}
            />
            <Button 
              loading={loading} 
              onClick={handleSubmit} 
              color='primary'
              disabled={!conversationId}
            >
              发送
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
