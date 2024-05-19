import { useNavigate } from "react-router-dom";
import SingUpContainer from "./SignUpContainer";
import userService from "../../services/user";

const SignUp = () => {
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    const { username, name , password } = values;

    try {
      const newUser = await userService.signUp({ username, name, password })
      console.log(newUser)
      // await signIn({ username, password })
      navigate('/', { replace: true });
    } catch (error) {
      console.log('sign up error : ', error)
    }
   
  };


  return (
    <SingUpContainer onSubmit={onSubmit} />
  );
};

export default SignUp;