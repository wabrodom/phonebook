import LoginContainer from "./LoginContainer";
import { useLoginDispatch } from '../../contexts/LoginContext';
import { useNavigate } from "react-router-dom";

const Login = () => {
  const loginUser = useLoginDispatch()
  const navigate = useNavigate()

  const handleLogin = async (values) => {
    const { username, password } = values
    try {
      await loginUser({ username, password })
      navigate('/')
    } catch (err) {
      console.log('login error')
    }
  }

  return (
    <LoginContainer handleLogin={handleLogin} />
  )
}

export default Login;