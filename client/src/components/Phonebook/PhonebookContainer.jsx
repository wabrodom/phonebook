import styled from 'styled-components'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

const ToTheLeft = styled.div`
  text-align: right;  
`
const Li = styled.li`
  border: 1px solid;
  border-radius: 2px;
  margin: 5px;
`

const PhoneBookContainer = ({ phonebook, handleDelete }) => {
  const navigate = useNavigate()
  const removeButtonClick = (id, name) => {
    handleDelete(id, name)
    navigate('/phonebook')
  }

  return (
    <div>
      <h2>People in your list</h2>
      <ul>
          {phonebook.map((person) => (
            <Li key={person.id}>
                  <p>{person.name}
                    <span> ✆ {person.number}</span>
                  </p>
                  
                  <p>recent topic: {person.note}</p>
                  <ToTheLeft>
                    <button 
                      onClick={() => removeButtonClick(person.id, person.name)}
                      data-testid={`delete${person.name}${person.number}`}
                    >
                      🗑
                    </button>
                  </ToTheLeft>
            </Li>
          ))}
      </ul>
    </div>
  )
}

export default PhoneBookContainer;

PhoneBookContainer.propTypes =  {
  phonebook: PropTypes.array,
  handleDelete: PropTypes.func
}