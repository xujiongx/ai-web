import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Input, Button, Card, Toast } from 'antd-mobile';
import { useRequest } from 'ahooks';
import styles from './index.module.less';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

const Home: React.FC = () => {
  const messageListRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string>('');

  // 获取最近对话
  const { data: latestData, loading: latestLoading } = useRequest(async () => {
    const response = await axios.get('http://192.168.1.63:3001/mistral/latest');
    return response.data;
  });

  // 滚动到底部
  const scrollToBottom = () => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (latestData?.data) {
      setConversationId(latestData.data);
      axios
        .get(
          `http://192.168.1.63:3001/mistral/conversations/${latestData.data}`
        )
        .then((response) => {
          setMessages(response.data.data || []);
        })
        .catch((error) => {
          Toast.show({
            content: '获取对话历史失败：' + error.message,
            position: 'top',
          });
        });
    }
  }, [latestData]);

  const createNewConversation = () => {
    if (loading) return;
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
        setMessages((prev) => [...prev, { role: 'ai', content: data }]);
      },
      onError: (error) => {
        Toast.show({
          content: '请求失败：' + error.message,
          position: 'top',
        });
        // 移除用户最后一条消息
        setMessages((prev) => prev.slice(0, -1));
      },
    }
  );

  const handleSubmit = () => {
    if (!input.trim() || loading) {
      Toast.show({
        content: loading ? '正在处理中...' : '请输入问题',
        position: 'top',
      });
      return;
    }
    const userMessage = { role: 'user', content: input.trim() };
    setMessages((prev: Message[]) => [...prev, userMessage as Message]);
    setInput('');
    run(userMessage.content);
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
              <span className={styles.noConversation}>请先创建新对话</span>
            )}
          </div>
        </div>

        <div className={styles.messageList} ref={messageListRef}>
          {!conversationId ? (
            <div className={styles.emptyState}>点击「新对话」按钮开始聊天</div>
          ) : messages.length === 0 ? (
            <div className={styles.emptyState}>
              {latestLoading ? '加载中...' : '开始一个新的对话吧'}
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={`${index}-${message.role}-${message.content.slice(0, 10)}`}
                className={styles.messageItem}
                style={{
                  flexDirection:
                    message.role === 'user' ? 'row-reverse' : 'row',
                }}
              >
                <div
                  className={styles.avatar}
                  style={{
                    background:
                      message.role === 'user'
                        ? '#fff'
                        : 'rgba(22, 119, 255, 0.1)',
                    color: message.role === 'user' ? '#1677ff' : '#1677ff',
                    border: '1px solid rgba(22, 119, 255, 0.1)',
                  }}
                >
                  {message.role === 'user' ? '我' : 'AI'}
                </div>
                <Card
                  className={`${styles.messageCard} ${
                    message.role === 'user'
                      ? styles.userMessage
                      : styles.aiMessage
                  }`}
                >
                  <div className={styles.text}>{message.content}</div>
                </Card>
              </div>
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
              disabled={!conversationId || loading}
            />
            <Button
              loading={loading}
              onClick={handleSubmit}
              color='primary'
              disabled={!conversationId || loading}
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
