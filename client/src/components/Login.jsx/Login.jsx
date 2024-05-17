import { login } from '../../services/login'
import { useNavigate } from "react-router";
import LoginContainer from "./LoginContainer";

const Login = () => {
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    const { username, password } = values;

    try {
      await login({ username, password })
      navigate('/', { replace: true });
    } catch (error) {
      console.log('signIn error : ', error)
    }
   
  };


  return (
    <LoginContainer onSubmit={onSubmit} />
  );
};

export default Login;