import LoginForm from "./components/Login.jsx/LoginContainer"
import NavigationBar from "./components/NavigationBar"


const App = () => {



  return (
    <div>
      <NavigationBar/>
      <LoginForm onSubmit={onSubmit} />
    </div>
  )
}




export default App