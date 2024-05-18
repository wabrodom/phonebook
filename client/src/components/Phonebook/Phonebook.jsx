import { useCurrentUser, useResetUser } from '../../contexts/LoginContext';
import phonebookService from '../../services/phonebook'
import { useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import PhoneBookContainer from './PhonebookContainer';

const PhoneBook = () => {
  const user = useCurrentUser()
  const queryClient = useQueryClient()
  const resetUser = useResetUser()

  const bundleGetAll = () => {
    phonebookService.setToken(user.token)
    return phonebookService.getAll()
  }
  const bundleRemove = (id) => {
    phonebookService.setToken(user.token)
    return phonebookService.remove(id)
  }
  const result = useQuery({
    queryKey: ['phonebook'],
    queryFn:  bundleGetAll
   })

   const removeBlogMutataion = useMutation({
    mutationFn: bundleRemove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['phonebook']})
    },
    onError: (error) => {
      console.log(error)
      resetUser()
    }
  })

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  const deleteAPersonInfo = async (id, name) => {
    if (window.confirm(`You want to remove ${name}`)) {
      try {
        removeBlogMutataion.mutate(id)
      } catch(exception) {
        // console.log(exception)
      }
    }
  }

  const phonebook= result.data

  return (
    <PhoneBookContainer phonebook={phonebook} handleDelete={deleteAPersonInfo} />
  )
}

export default PhoneBook;