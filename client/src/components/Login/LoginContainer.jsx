import { useFormik} from 'formik';
import * as yup from 'yup';
import PropTypes from 'prop-types';

const LoginContainer = ({ handleLogin }) => {
  const initialValues = {
    username: '', 
    password: '' 
  };


  const validationSchema = yup.object().shape({
    username: yup.string()
      .required('Username is required'),
    password: yup.string()
      .required('Password is required')
  });

  const onSubmit = (values, { resetForm }) => {
    handleLogin(values)
    resetForm()
  }
 
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit
  });

 return (
  <div>
    <h1>Log In</h1>
      <input
         placeholder="Username"
         onChange={formik.handleChange('username')}
         value={formik.values.username}
       />
        {formik.touched.username && formik.errors.username && (
          <span >{formik.errors.username}</span>
        )}

       <input
         placeholder="Password"
         onChange={formik.handleChange('password')}
         value={formik.values.password}
         type='password'
        //  style={ [styles.input, formik.errors.password && formik.touched.password && styles.error]}
       />

    

      <button type="submit" onClick={formik.handleSubmit}>
          Sign In
      </button> 
  

  </div>
 )
}

export default LoginContainer

LoginContainer.propTypes = {
  handleLogin: PropTypes.func
}