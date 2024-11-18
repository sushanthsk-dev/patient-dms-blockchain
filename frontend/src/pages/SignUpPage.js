import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';

const SignUpPage = () => {
  const [loading, setLoading] = useState(false);
  const history = useNavigate();

  const handleSignUp = async (values) => {
    setLoading(true);
    try {
      console.log('Sign-Up details:', values);
      message.success('Account created successfully!');
      setLoading(false);
    } catch (error) {
      message.error('Sign-Up failed. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      history('/'); // Redirect if logged in
    }
  }, [history]);

  return (
    <div className="signup-page" style={{ maxWidth: 400, margin: '0 auto', paddingTop: '100px' }}>
      <Typography.Title level={2} style={{ textAlign: 'center' }}>Sign Up</Typography.Title>
      <Form
        name="signup_form"
        onFinish={handleSignUp}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Username" />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Invalid email format!' }]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Please confirm your password!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The two passwords do not match!'));
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Sign Up
          </Button>
        </Form.Item>
      </Form>
      <Typography.Text style={{ display: 'block', textAlign: 'center' }}>
        Already have an account? <a href="/login">Log In</a>
      </Typography.Text>
    </div>
  );
};

export default SignUpPage;
