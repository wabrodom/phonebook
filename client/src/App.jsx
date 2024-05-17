import { useEffect } from "react"
import LoginForm from "./components/Login.jsx/LoginContainer"
import NavigationBar from "./components/NavigationBar"
import { useSetUser } from './contexts/LoginContext'

import phonebookService from "./services/phonebook"
import PhoneBooks from "./components/Phonebook/Phonebook";


const App = () => {
  const setUser = useSetUser()


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      phonebookService.setToken(user.token)
    }
  }, [])

  return (
    <div>
      <NavigationBar/>
      <LoginForm />
      <PhoneBooks />
    
    </div>
  )
}




export default App