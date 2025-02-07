import React from 'react';
import { List, Avatar, Button, Toast } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.less';
import { Helmet } from 'react-helmet-async';

const Profile: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    Toast.show({
      content: '已退出登录',
      afterClose: () => {
        navigate('/login');
      },
    });
  };

  return (
    <div className={styles.container}>
      <Helmet>
        <title>个人中心 - AI助手</title>
      </Helmet>
      <List className={styles.userInfo}>
        <List.Item
          prefix={
            <Avatar
              src='https://avatars.githubusercontent.com/u/1448023?v=4'
              className={styles.avatar}
            />
          }
          title='用户名'
          description='这是个人简介'
        />
      </List>

      <List className={styles.menuList}>
        <List.Item title='我的收藏' arrow />
        <List.Item title='使用记录' arrow />
        <List.Item title='系统设置' arrow />
        <List.Item title='关于我们' arrow />
      </List>

      <div className={styles.logoutWrapper}>
        <Button block color='danger' fill='outline' onClick={handleLogout}>
          退出登录
        </Button>
      </div>
    </div>
  );
};

export default Profile;
