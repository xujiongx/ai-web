import React from 'react';
import { List, DotLoading } from 'antd-mobile';
import { useRequest } from 'ahooks';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.less';

const Chat: React.FC = () => {
  const navigate = useNavigate();
  const { data, loading } = useRequest(async () => {
    const response = await axios.get(
      'http://192.168.1.63:3001/mistral/conversations'
    );
    return response.data;
  });

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <DotLoading color='primary' />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <List className={styles.list}>
        {data?.map(
          (conversation: {
            id: React.Key | null | undefined;
            title: string;
          }) => (
            <List.Item
              key={conversation.id}
              title={conversation.title || '未命名对话'}
              className={styles.listItem}
              arrow
              onClick={() => navigate(`/chat/${conversation.id}`)}
            />
          )
        )}
      </List>
    </div>
  );
};

export default Chat;
