import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  message,
} from 'antd';


// import fetch api
import { configureReq, reqEmailCheck, reqRegister } from '../../fetch';
import { storeToken } from '../../localStorage';
import { useHistory } from 'react-router';

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const Register = (props) => {
  const history = useHistory();
  const { setLogin } = props;

  const [form] = Form.useForm();

  const onFinish = async(values) => {
    // console.log(values)
    const { code, msg, data } = await reqRegister(values);
   
    if (!code) {
        storeToken(data.token);
        console.log(data.username)
        configureReq();
        history.replace('/')
    } else {
        message.error(msg); 
    }
    
  };

  const handleCheckEmail = async() => {
        const email = form.getFieldValue("email");
        const { code, msg } = await reqEmailCheck({email});
        if (code) {
            message.warning(msg);
        }
  }
 
  return (
    <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      initialValues={{
        residence: ['zhejiang', 'hangzhou', 'xihu'],
        prefix: '86',
      }}
      scrollToFirstError
    >
      <Form.Item
        name="email"
        label="E-mail"
        rules={[
          {
            type: 'email',
            message: 'The input is not valid E-mail!',
          },
          {
            required: true,
            message: 'Please input your E-mail!',
          },
        ]}
        onBlur={handleCheckEmail}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="username"
        label="Nickname"
        tooltip="What do you want others to call you?"
        rules={[
          {
            required: true,
            message: 'Please input your nickname!',
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
    
      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          Register
        </Button>
        Or <a onClick={() => setLogin(true)}>Log in now!</a>
      </Form.Item>
    </Form>
  );
};

export default Register;