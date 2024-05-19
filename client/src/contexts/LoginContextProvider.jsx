import LoginContext from "./LoginContext"
import { useReducer } from "react"
import PropTypes from 'prop-types';
import { loginReducer } from "./LoginContext";

const LoginContextProvider = (props) => {
  const [user, loginDispatch] = useReducer(loginReducer, null)

  return (
    <LoginContext.Provider value={[user, loginDispatch]}>
      {props.children}
    </LoginContext.Provider>
  )
}

export default LoginContextProvider


LoginContextProvider.propTypes = {
  children: PropTypes.node
}