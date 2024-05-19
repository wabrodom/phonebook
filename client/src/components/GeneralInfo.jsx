import { useState, useEffect} from "react";
import phonebookService from "../services/phonebook"

const GeneralInfo = () => {
  const [info, setInfo] = useState(null)
  const getGeneralInfo = async () => {
    const generalInfo = await phonebookService.getGeneralInfo()
    setInfo(generalInfo)
  } 

  useEffect(()=> {
    getGeneralInfo()
  }, [])

  if (info === null) return

  const {user, contactPersons} = info
  const plural = user > 1
  return (
    <div>
      <p>
        There {plural ? 'are': 'is' } {user} user{plural && 's'}. 
        And total of {contactPersons} people on everyone list.
      </p>
    </div>
  )
}

export default GeneralInfo