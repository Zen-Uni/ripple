/**
 * @description Login module
 */
 import { Form, Input, Button, Checkbox, message } from 'antd';
 import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { configureReq, reqLogin } from '../../fetch';
import { storeToken } from '../../localStorage';
import { useHistory } from 'react-router';

     
 const Login = (props) => {
    const history = useHistory();


    const { setLogin } = props;
    const onFinish = async (values) => {
      const { code, data, msg } = await reqLogin(values);
      if (!code) {
        storeToken(data.token);
        configureReq();
        history.replace('/');
      } else {
        message.error(msg);
      }
    };
  
    return (
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: 'Please input your Email!',
            },
          ]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your Password!',
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
  
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
          Or <a onClick={() => setLogin(false)}>register now!</a>
        </Form.Item>
      </Form>
    );
  };
 

export default Login;