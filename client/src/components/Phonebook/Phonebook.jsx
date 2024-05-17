import { useState, useEffect} from "react"
import phonebookService from "../../services/phonebook"



const PhoneBooks = () => {
  const [user, setUser] = useState('')
  const [phonebook, setPhonebook] = useState([])

  const getPhoneBook = async () => {
    const response = await phonebookService.getAll()
    setPhonebook(response)
  }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      phonebookService.setToken(user.token)
      setUser(user.name)
      getPhoneBook()
    }
  }, [])




  if (!phonebook) return null


  console.log(phonebook)

  return (
    <div>
      <h2>{user} phonebook</h2>
      <ul>
        {
          phonebook.map(obj => 
            <li key={obj.id}>
              {obj.name}
              {obj.number}
            </li>
          )
        }
      </ul>
    </div>
  )
}

export default PhoneBooks;