import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {login} from '../api/api';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const history = useNavigate();
  
  const handleLogin = async (values) => {
    setLoading(true);
    try {

      const response = await login({email: values.email, password: values.password });
      debugger
      localStorage.setItem('jwtToken', response.token);
      localStorage.setItem('role', response.data.user.role);
      history('/');
      message.success('Logged in successfully!');
      setLoading(false);
    } catch (error) {
      message.error('Login failed. Please check your credentials.');
      setLoading(false);
    }
  };


  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      history('/');
    }
  }, []);

  return (
    <div className="login-page" style={{ maxWidth: 400, margin: '0 auto', paddingTop: '100px' }}>
      <Typography.Title level={2} style={{ textAlign: 'center' }}>Login</Typography.Title>
      <Form
        name="login_form"
        initialValues={{ remember: true }}
        onFinish={handleLogin}
      >
        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Invalid email format!' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Log In
          </Button>
        </Form.Item>
      </Form>
      <Typography.Text style={{ display: 'block', textAlign: 'center' }}>
        Don't have an account? <a href="/signup">Sign Up</a>
      </Typography.Text>
    </div>
  );
};

export default LoginPage;
