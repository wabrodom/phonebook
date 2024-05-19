import AddPersonContainer from './AddPersonContainer';
import {useMutation, useQueryClient } from '@tanstack/react-query'
import phonebookService from "../../services/phonebook";
import { useCurrentUser, useResetUser } from "../../contexts/LoginContext";

const AddPerson = () => {
  const resetUser = useResetUser()
  const queryClient = useQueryClient()
  const user = useCurrentUser()

  const toLoad = (object) => {
    phonebookService.setToken(user.token)
    return phonebookService.create(object)
  }

  const newPersonmutation = useMutation({
    mutationFn: toLoad,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['phonebook']})
    },
    onError: () => {
      // console.log(error.message)
      resetUser()
    }
  })

  const handleAddPerson = async (object) => {
    try {
      newPersonmutation.mutate(object)
    } catch(exception) {
      // console.log(exception)
    }
  }

  return (
    <AddPersonContainer handleAddPerson={handleAddPerson} />
  );
};

export default AddPerson;