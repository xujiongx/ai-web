import React, { useState } from 'react';
import { Form, Input, Button, Toast } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.less';
import request from '../../utils/request';
import { Helmet } from 'react-helmet-async'

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { username: string; password: string }) => {
    try {
      setLoading(true);
      const response = await request.post(
        '/user/login',
        values
      );
      if (!response.data.code) {
        localStorage.setItem('token', response.data.data.token);
        Toast.show({
          content: '登录成功',
          afterClose: () => {
            navigate('/');
          },
        });
      }
    } catch (error) {
      Toast.show({
        content:
          (error as Error & { response?: { data?: { message?: string } } })
            .response?.data?.message || '登录失败',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Helmet>
        <title>登录 - AI助手</title>
      </Helmet>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1>欢迎回来</h1>
          <p>登录您的账号以继续</p>
        </div>

        <Form
          layout='vertical'
          onFinish={onFinish}
          footer={
            <Button
              block
              type='submit'
              color='primary'
              loading={loading}
              size='large'
            >
              登录
            </Button>
          }
        >
          <Form.Item
            name='username'
            label='用户名'
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder='请输入用户名' />
          </Form.Item>
          <Form.Item
            name='password'
            label='密码'
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input placeholder='请输入密码' type='password' />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
