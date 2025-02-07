import React from 'react';
import { List, Avatar } from 'antd-mobile';
import styles from './index.module.less';

const Profile: React.FC = () => {
  return (
    <div className={styles.container}>
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
    </div>
  );
};

export default Profile;
