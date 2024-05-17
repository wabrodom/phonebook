import { useFormik} from 'formik';
import * as yup from 'yup';


const LoginContainer = ({ onSubmit }) => {
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

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
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
      

      <button onClick={formik.handleSubmit}>
          Sign In
      </button> 
  

  </div>
 )
}

export default LoginContainer