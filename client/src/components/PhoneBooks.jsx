import PersonNameAndNumber from "./PersonNameAndNumber"

const PhoneBooks = ({persons, handleDelete}) => {
    return (
      <div>
        
        <ul>
          {persons.map(object => {
            return (
              <PersonNameAndNumber 
                key={object.id} 
                object={object} 
                handleDelete={handleDelete}
              />
            )
          })
        }
        </ul>
      </div>
    )
}

export default PhoneBooks;