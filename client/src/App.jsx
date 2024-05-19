
import { useCurrentUser } from './contexts/LoginContext'
import NavigationBar from "./components/NavigationBar"
import PhoneBooks from "./components/Phonebook/Phonebook";
import AddPerson from './components/Addperson/AddPerson';
import Login from './components/Login/Login';

import {
  BrowserRouter as Router,
  Routes, Route, Navigate
} from 'react-router-dom'
import GeneralInfo from './components/GeneralInfo';
import SignUp from './components/SignUp/SignUp';


const App = () => {
  const currentUser = useCurrentUser()

  return (
    
    <div>
      <Router>
        <NavigationBar/>

        <Routes>
          <Route path='/' element={<GeneralInfo />} />
          <Route path='*' element={<Navigate replace to ='/' />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/phonebook' element={ currentUser
            ? <>
                <AddPerson />
                <PhoneBooks />
              </>
            : <Navigate replace to ='/login' />
            }
          />
      

        </Routes>

      </Router>
    </div>
  )
}




export default App