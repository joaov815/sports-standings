import { useState } from "react";

export function range(length: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < length; i++) {
    result.push(i);
  }
  return result;
}

type Validator = (value: any) => {
  isValid: boolean;
  errorMessage: string;
};

interface FormField {
  value: any;
  validators?: Validator[];
}

interface FormConfig {
  [key: string]: FormField;
}

export function useFormValidation<T extends FormConfig>(initialConfig: T) {
  const [formValues, setValues] = useState(() =>
    Object.fromEntries(
      Object.entries(initialConfig).map(([key, field]) => [key, field.value])
    )
  );

  const [formErrors, setErrors] = useState<Record<string, string[]>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = (fieldName?: string) => {
    const fieldsToValidate = fieldName
      ? { [fieldName]: initialConfig[fieldName] }
      : initialConfig;

    const newErrors: Record<string, string[]> = {};

    for (const [key, field] of Object.entries(fieldsToValidate)) {
      if (!field.validators) continue;

      const fieldErrors: string[] = [];
      for (const validator of field.validators) {
        const result = validator(formValues[key]);

        if (!result.isValid) {
          fieldErrors.push(result.errorMessage);
        }
      }

      if (fieldErrors.length > 0) {
        newErrors[key] = fieldErrors;
      }
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (fieldName: string, value: any) => {
    setValues((prev) => ({ ...prev, [fieldName]: value }));
    if (touched[fieldName]) {
      validate(fieldName);
    }
  };

  const handleBlur = (fieldName: string) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    validate(fieldName);
  };

  const handleSubmit =
    (onSubmit: (values: any) => void) => (e: React.FormEvent) => {
      e.preventDefault();
      const isValid = validate();
      if (isValid) {
        onSubmit(formValues);
      }
    };

  return {
    formValues,
    formErrors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
  };
}