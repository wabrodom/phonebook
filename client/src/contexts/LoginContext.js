import { createContext, useContext } from "react"
import loginService from '../services/login'
import phonebookService from '../services/phonebook'


export const loginReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN' : {
      return action.payload
    }
    case 'RESET' : {
      return null
    }
    default: {
      return state
    }
  }
}
const LoginContext = createContext()


export const useCurrentUser = () => {
  return useContext(LoginContext)[0]
}

export const useSetUser = () => {
  const dispatch = useContext(LoginContext)[1]
  return (objectWithToken) => dispatch({ type: 'LOGIN', payload: objectWithToken})
}

export const useLoginDispatch = () => {
  const dispatch = useContext(LoginContext)[1]


  return async (object) => {
    try {
      const objectWithToken = await loginService.login(object)
      phonebookService.setToken(objectWithToken.token)
  
      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(objectWithToken))
  
      dispatch({ type: 'LOGIN', payload: objectWithToken})

    } catch (excecption) {
      return excecption
    }
  }
}

export const useResetUser = ()  => {
  const dispatch = useContext(LoginContext)[1]
  return () => { 
    window.localStorage.removeItem('loggedBloglistUser')
    dispatch({ type : 'RESET'})
  }
}

export default LoginContext
