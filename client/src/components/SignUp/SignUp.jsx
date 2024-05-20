import { useNavigate } from "react-router-dom";
import SingUpContainer from "./SignUpContainer";
import userService from "../../services/user";
import { useLoginDispatch } from "../../contexts/LoginContext";

const SignUp = () => {
  const navigate = useNavigate();
  const loginUser = useLoginDispatch()
  const onSubmit = async (values) => {
    const { username, name , password } = values;

    try {
      const newUser = await userService.signUp({ username, name, password })
      await loginUser({ 
        username: newUser.username, 
        password 
      })
      // await signIn({ username, password })
      navigate('/phonebook', { replace: true });
    } catch (error) {
      // console.log('sign up error : ', error)
    }
   
  };


  return (
    <SingUpContainer onSubmit={onSubmit} />
  );
};

export default SignUp;