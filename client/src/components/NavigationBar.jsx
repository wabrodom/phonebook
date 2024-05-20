import { useCurrentUser,   useResetUser } from "../contexts/LoginContext"
import { Link } from "react-router-dom"

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
        <Link to='/phonebook'>
          <button>{user.name} phonebook</button>
        </Link>
        <button onClick={handleLogout}>log out</button>
      </>
    )
  }

  const userNotLogIn = () => {
    return (
      <>
        <Link to='/login'>
            <button>
              log in
            </button>
        </Link>
        <Link to='/signup'>
            <button>
              sign up
            </button>
        </Link>
      </>
    )
  }

  return (
    <div>
      <h1>Phone book</h1>
      <Link to='/'>
        <button>
          Home
        </button>
      </Link>
     
      {user 
        ? userLoggedIn()
        : userNotLogIn()
      }
    </div>
  )
}

export default NavigationBar