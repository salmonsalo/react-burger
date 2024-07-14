import {useState, useCallback, ChangeEvent} from 'react';

type TUseFormAndValidation<T> = {
  values: T;
  handleChange: (e:ChangeEvent<HTMLInputElement>) => void;
  errors: T;
  isValid: boolean;
  resetForm: (newValues? : T, newErrors? : T, newIsValid?: boolean)  => void;
  setValues: React.Dispatch<React.SetStateAction<T>>;
  setIsValid: React.Dispatch<React.SetStateAction<boolean>>;
};

export function useFormAndValidation<T>(initialValue: T): TUseFormAndValidation<T> {
  const [ values, setValues ] = useState<T>(initialValue);
  const [ errors, setErrors ] = useState<T>(initialValue);
  const [ isValid, setIsValid ] = useState(true);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    setValues({...values, [name]: value });
    setErrors({...errors, [name]: e.target.validationMessage});
    const form = e.target.closest('form');
    setIsValid(!!(form && form.checkValidity()));
  };


  const resetForm = useCallback((newValues = initialValue, newErrors = initialValue, newIsValid = false) => {
    setValues(newValues);
    setErrors(newErrors);
    setIsValid(newIsValid);
  }, [setValues, setErrors, setIsValid]);

  return { values, handleChange, errors, isValid, resetForm, setValues, setIsValid };
}

