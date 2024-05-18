import { useFormik} from 'formik';
import * as yup from 'yup';
import styled from 'styled-components'
import PropTypes from 'prop-types'

const Input = styled.input`
  display: block;
`;

const AddPersonContainer = ( {handleAddPerson} ) => {

  const initialValues = {
    name: '', 
    number: '',
    note: ''
  };

  const validationSchema = yup.object().shape({
    name: yup.string()
      .required('name is required')
      .min(3, 'person name is too short')
      .max(25, 'person name is too long'),
    number: yup.string()
      .required('number is required')
      .min(8, 'phonenumber min length 8, include - in between'),
    note: yup.string()
  });
 
  const onSubmit = ( values, { resetForm }) => {
    handleAddPerson(values)
    resetForm()
  }
 
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit
  });



  return (
      <div>
        <h3>Add people</h3>
      
      
          
          <Input
            placeholder="name"
            onChange={formik.handleChange('name')}
            value={formik.values.name}
          />
            {formik.touched.name && formik.errors.name && (
                <span >{formik.errors.name}</span>
            )}

          <Input
            placeholder="number"
            onChange={formik.handleChange('number')}
            value={formik.values.number}
          />
              {formik.touched.number && formik.errors.number && (
              <span >{formik.errors.number}</span>
              )}

          <Input
            placeholder="note"
            onChange={formik.handleChange('note')}
            value={formik.values.note}
            //  style={ [styles.input, formik.errors.password && formik.touched.password && styles.error]}
          />
              {formik.touched.note && formik.errors.note && (
                <span >{formik.errors.note}</span>
              )}
          
    

        <button type="submit" onClick={formik.handleSubmit}>
            Add people
        </button> 
      </div>
  )
}

export default AddPersonContainer

AddPersonContainer.propTypes = {
  handleAddPerson: PropTypes.func
}