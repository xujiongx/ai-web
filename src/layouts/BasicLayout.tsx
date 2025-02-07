import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomTabBar from '../components/BottomTabBar';
import styles from './BasicLayout.module.less';

const BasicLayout: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Outlet />
      </div>
      <BottomTabBar />
    </div>
  );
};

export default BasicLayout;