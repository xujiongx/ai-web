import React from 'react';
import { Grid } from 'antd-mobile';
import {
  MessageOutline,
  LocationOutline,
  CalculatorOutline,
  PictureOutline,
  EditSOutline,
} from 'antd-mobile-icons';
import { Helmet } from 'react-helmet-async'
import styles from './index.module.less'
import { useNavigate } from 'react-router-dom';
const tools = [
  {
    icon: <MessageOutline />,
    title: 'AI 对话',
    path: '/chat',
  },
  {
    icon: <LocationOutline />,
    title: '翻译助手',
    path: '/translate',
  },
  {
    icon: <CalculatorOutline />,
    title: '数学计算',
    path: '/calculator',
  },
  {
    icon: <PictureOutline />,
    title: '图像处理',
    path: '/image',
  },
  {
    icon: <EditSOutline />,
    title: '对联助手',
    path: '/couplet',
  },
];

const Toolbox: React.FC = () => {
  const navigate = useNavigate();

  const handleToolClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className={styles.container}>
      <Helmet>
        <title>工具箱 - AI助手</title>
      </Helmet>
      <div className={styles.content}>
        <Grid columns={2} gap={16}>
          {tools.map((tool, index) => (
            <Grid.Item key={index}>
              <div
                className={styles.toolItem}
                onClick={() => handleToolClick(tool.path)}
              >
                <div className={styles.toolIcon}>{tool.icon}</div>
                <div className={styles.toolTitle}>{tool.title}</div>
              </div>
            </Grid.Item>
          ))}
        </Grid>
      </div>
    </div>
  );
};

export default Toolbox;
