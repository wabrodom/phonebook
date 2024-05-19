
import { useFormik } from 'formik'
import * as yup from 'yup';

const SingUpContainer = ({ onSubmit }) => {

  const initialValues = { 
    username: '',
    name: '',
    password: '',
  };


  const validationSchema = yup.object().shape({
    username: yup.string().required('username is required').min(2),
    name: yup.string().required('name is required'),
    password: yup.string().required('password is required'),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit
  });


  return (
    <div>
      <div>
        <input
          placeholder="Username"
          onChange={formik.handleChange('username')}
          onBlur={() => formik.setTouched(true)}
          value={formik.values.username}
        />
          {formik.touched.username && formik.errors.username && (
            <span >{formik.errors.username}</span>
          )}
      </div>

      <div>
        <input
          placeholder="Name"
          onChange={formik.handleChange('name')}
          value={formik.values.name}
        />
          {formik.touched.name && formik.errors.name && (
            <span >{formik.errors.name}</span>
          )}
      </div>

      <div>
        <input
          placeholder="Password"
          onChange={formik.handleChange('password')}
          value={formik.values.password}
        />
          {formik.touched.password && formik.errors.password && (
            <span >{formik.errors.password}</span>
          )}
      </div>

      <button type="submit" onClick={formik.handleSubmit}>
          Sign up
      </button> 

    </div>
  );
};

export default SingUpContainer;



