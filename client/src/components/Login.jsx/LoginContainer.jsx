import { useFormik} from 'formik';
import * as yup from 'yup';
import { useLoginDispatch } from '../../contexts/LoginContext';

const LoginContainer = () => {
  const loginUser = useLoginDispatch()

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

 
  const handleLogin = async ({ username, password }) => {
    try {
      const responseBack = (loginUser({username, password}) ) 
      const resolvetoErrorObject = await responseBack
      if (resolvetoErrorObject instanceof Error) {
        throw resolvetoErrorObject
      }

      console.log('successful login')
    } catch (err) {
      console.log('login error')
    }
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleLogin,
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
        //  style={ [styles.input, formik.errors.password && formik.touched.password && styles.error]}
       />

        {formik.touched.password && formik.errors.password && (
          <span style={{ color: theme.colors.error  }}>{formik.errors.password}</span>
        )}
      

      <button type="button" onClick={formik.handleSubmit}>
          Sign In
      </button> 
  

  </div>
 )
}

export default LoginContainer