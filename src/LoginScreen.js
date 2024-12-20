import { useState } from 'react';
import { Button, Form, Input, Alert } from 'antd';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const URL_AUTH = "/api/auth/local"

export default function LoginScreen(props) {

  const [isLoading, setIsLoading] = useState(false)
  const [errMsg, setErrMsg] = useState(null)
  const navigate = useNavigate();

  const handleLogin = async (formData) => {
    try {
      setIsLoading(true)
      setErrMsg(null)
      const response = await axios.post(URL_AUTH, { ...formData })
      const token = response.data.jwt
      axios.defaults.headers.common = { 'Authorization': `bearer ${token}` }
      navigate('/finance');
      props.onLoginSuccess();
    } catch (err) {
      console.log(err)
      setErrMsg(err.message)
    } finally { setIsLoading(false) }
  }

  return (
    <div className="login-container">
      <div className="login-title">Finance</div>
      <h2 className="please-login">Please Login</h2>
      <Form
        className="login-form"
        onFinish={handleLogin}
        autoComplete="off">
        {errMsg &&
          <Form.Item>
            <Alert message={errMsg} type="error" />
          </Form.Item>
        }
        <Form.Item
          label="Username"
          name="identifier"
          rules={[{ required: true, }]}>
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true },]}>
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit" loading={isLoading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}