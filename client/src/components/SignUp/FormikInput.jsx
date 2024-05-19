import { useField } from 'formik';

const FormikInput = ({ name, ...props}) => { 
  const [field, meta, helpers] = useField(name);
  const showError = meta.touched && meta.error;

  return (
    <div>
      <input
        placeholder={props.placeHolder}
        onChange={value => helpers.setValue(value)}
        onBlur={() => helpers.setTouched(true)}
        value={field.value}
        {...props}
      />
      {showError 
        && <span> {meta.error} </span>
      }
    </div>
  );
};

export default FormikInput;