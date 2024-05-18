import { useCurrentUser,   useResetUser } from "../contexts/LoginContext"


const NavigationBar = () => {
  const user = useCurrentUser()
  const resetUser = useResetUser()

  const handleLogout = () => {
    resetUser()
    window.localStorage.removeItem('loggedBloglistUser')
  }

  const userLoggedIn = () => {
    return (
      <>
        <span>Phonebook for {user.name} </span>
        <button onClick={handleLogout}>log out</button>
      </>
    )
  }

  return (
    <div>
      <h1>Phone book</h1>
      {user && 
        userLoggedIn()
      }
    </div>
  )
}

export default NavigationBar