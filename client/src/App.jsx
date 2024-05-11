import { useState, useEffect } from 'react'
import axios from "axios"

import phonebookServices from "./services/phonebook"
import FormToAddPeopleNumber from "./components/FormToAddPeopleNumber"
import FilterByName from "./components/FilterByName"
import PhoneBooks from "./components/PhoneBooks"
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [searchName, setSearchName] = useState('');
  const [notifaction, setNotification] = useState(null);
  const [notificationStyle, setNotificationStyle] = useState(null)

  const handleNameChange = (event) => setNewName(event.target.value);
  const handlePhoneChange = (event) => setNewPhone(event.target.value);
  const handleSearchChange = (event => setSearchName(event.target.value));
  
  useEffect(() => {
    phonebookServices
      .getAll()
      .then(initialPhonebook => setPersons(initialPhonebook))
  }, [])

  const addPerson = (event) => {
    event.preventDefault();

    const personObject = {
      name: newName,
      number: newPhone
    }
    
    const currentName = personObject.name;
    const personNames = persons.map(obj => obj.name);

    if (personNames.includes(currentName) ) {
      const foundPerson = persons.find(p => p.name === currentName);
      const id = foundPerson.id
      const updatePhone = {...foundPerson, number: newPhone};
      const replacePhoneMessage = "is already added to the phonebook, replace the old number with a new one?"

      if( window.confirm(`${currentName} ${replacePhoneMessage}`) ) {
        phonebookServices 
        .update(id, updatePhone)
        .then( returnedPerson => { 
          setPersons(persons.map(p => p.id !== id ? p : returnedPerson) )
          return returnedPerson
        })
        .then(returnedPerson => {
          setNotification(`Updated ${returnedPerson.name}'s number.`)
          setNotificationStyle("success")
          setTimeout(()=> {
            setNotification(null)
          }, 3000)
          return returnedPerson
        })
        .catch(error => {
          if (error.response.data.name === "ValidationError") {
            setNotification(error.response.data.error)
            setNotificationStyle("failure")
            setTimeout(()  => {
              setNotification(null)
            }, 5000)
            return;
          }
          setNotification(`${foundPerson.name} is already deleted from the list`)
          setNotificationStyle("failure")
          setTimeout(() => {
            setNotification(null)
            setPersons(persons.filter(p => p.id !== id))
          }, 5000)
          return error;
        })
      }

      setNewName('');
      setNewPhone('');
      return;
    }

    phonebookServices
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
      
        setNewName('');
        setNewPhone('');
        return returnedPerson
      })
      .then(returnedPerson => {
        setNotification(`Added ${returnedPerson.name}.`)
        setNotificationStyle("success")
        setTimeout(()=> {
          setNotification(null)
        }, 5000)
      })
      .catch(error => {
        setNotification(error.response.data.error)
        setNotificationStyle("failure")
        setTimeout(()=> {
          setNotification(null)
          setNewName('');
          setNewPhone('');
        }, 5000)
      })
  }

  const searchedPerson = searchName === ''? persons : persons.filter(obj => {
    const personName = obj.name.toLowerCase();
    if (personName.indexOf(searchName.toLowerCase()) !== -1) {
      return true;
    }
  })

  const deletePhone = (id) => {
    const filteredPersons = persons.filter(p => p.id !== id)
    const selectedDeleteName = persons.find(p => p.id === id).name || '';
    if(window.confirm("Do you really want to delete " + selectedDeleteName || '')) {
      phonebookServices
      .remove(id)
      .then( () => { 
        setPersons(filteredPersons)
      })
    } 
  }

  return (
    <div>

      <h1>Phonebook</h1>

      <Notification message={notifaction} style={notificationStyle} />
      <FilterByName 
        handleChange={handleSearchChange}
        searchName={searchName}
      />
    
     <FormToAddPeopleNumber 
        handleSubmit={addPerson}
        handleNameChange={handleNameChange}
        handlePhoneChange={handlePhoneChange}
        newName={newName}
        newPhone={newPhone}
      />  
      
      <h2>Numbers</h2>
      <PhoneBooks persons={searchedPerson} handleDelete={deletePhone} />
    </div>
  )
}




export default App