import React from 'react';
import { TabBar } from 'antd-mobile';
import { 
  MessageOutline,
  AppOutline,
  UserOutline
} from 'antd-mobile-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './index.module.less';

const BottomTabBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    {
      key: '/',
      icon: <AppOutline />,
      title: '首页',
    },
    {
      key: '/chat',
      icon: <MessageOutline />,
      title: '聊天',
    },
    {
      key: '/profile',
      icon: <UserOutline />,
      title: '我的',
    },
  ];

  return (
    <TabBar
      activeKey={location.pathname}
      onChange={value => navigate(value)}
      className={styles.tabBar}
    >
      {tabs.map(item => (
        <TabBar.Item
          key={item.key}
          icon={item.icon}
          title={item.title}
        />
      ))}
    </TabBar>
  );
};

export default BottomTabBar;