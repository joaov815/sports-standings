import { useState } from "react";

export function range(length: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < length; i++) {
    result.push(i);
  }
  return result;
}

export type Validator<T = any> = (value: T) => {
  isValid: boolean;
  errorMessage: string;
};

interface IFormField<T = any> {
  value: T;
  validators?: Validator<T>[];
  fields?: Record<string, IFormField>;
}

interface FormConfig {
  [key: string]: IFormField;
}

export function useFormValidation<T extends FormConfig>(initialConfig: T) {
  const [formValues, setValues] = useState(() =>
    Object.fromEntries(
      Object.entries(initialConfig).map(([key, field]) => [key, field.value])
    )
  );

  const [formErrors, setErrors] = useState<Record<string, string[]>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const getValueByPath = (obj: any, path: string) => {
    const keys = path.split(".");
    let value = obj;
    for (const key of keys) {
      const validKey = !isNaN(Number(key)) ? Number(key) : key;
      value = value?.[validKey];
    }
    return value;
  };

  const getConfigByPath = (path: string): IFormField | null => {
    const keys = path.split(".");
    let config: any = initialConfig[keys[0]];

    for (let i = 1; i < keys.length; i++) {
      if (!config) return null;
      // Skip array indices, just get the field definition
      if (!isNaN(Number(keys[i]))) continue;
      config = config.fields?.[keys[i]];
    }

    return config;
  };

  const validateAllNested = (
    config: any,
    value: any,
    basePath: string,
    errors: Record<string, string[]>
  ) => {
    if (Array.isArray(value) && config.fields) {
      // Validate each item in the array
      value.forEach((item, index) => {
        for (const [fieldKey, fieldConfig] of Object.entries(config.fields)) {
          const fieldPath = `${basePath}.${index}.${fieldKey}`;
          const fieldValue = item[fieldKey];
          const typedFieldConfig = fieldConfig as IFormField;

          if (typedFieldConfig.validators) {
            const fieldErrors: string[] = [];
            for (const validator of typedFieldConfig.validators) {
              const result = validator(fieldValue);
              if (!result.isValid) {
                fieldErrors.push(result.errorMessage);
              }
            }
            if (fieldErrors.length > 0) {
              errors[fieldPath] = fieldErrors;
            }
          }
        }
      });
    }
  };

  const validate = (fieldPath?: string) => {
    if (fieldPath) {
      // Validate specific field by path
      const config = getConfigByPath(fieldPath);
      if (!config?.validators) return true;

      const fieldErrors: string[] = [];
      const value = getValueByPath(formValues, fieldPath);

      for (const validator of config.validators) {
        const result = validator(value);
        if (!result.isValid) {
          fieldErrors.push(result.errorMessage);
        }
      }

      if (fieldErrors.length > 0) {
        setErrors((prev) => ({ ...prev, [fieldPath]: fieldErrors }));
      } else {
        setErrors((prev) => {
          const { [fieldPath]: _, ...rest } = prev;
          return rest;
        });
      }
      return fieldErrors.length === 0;
    }

    // Validate all fields
    const newErrors: Record<string, string[]> = {};

    for (const [key, field] of Object.entries(initialConfig)) {
      // Validate the field itself
      if (field.validators) {
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

      // Validate nested fields
      if (field.fields) {
        validateAllNested(field, formValues[key], key, newErrors);
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (fieldName: string, value: any) => {
    setValues((prev) => ({ ...prev, [fieldName]: value }));

    if (touched[fieldName]) {
      validate(fieldName);
    }
  };

  const handleChangeByPath = (path: string, value: any) => {
    const pathKeys = path.split(".");

    setValues((prev) => {
      const newState = { ...prev };
      let current: any = newState;

      for (let i = 0; i < pathKeys.length - 1; i++) {
        const key = pathKeys[i];
        const validKey = !isNaN(Number(key)) ? Number(key) : key;

        if (Array.isArray(current[validKey])) {
          current[validKey] = [...current[validKey]];
        } else {
          current[validKey] = { ...current[validKey] };
        }
        current = current[validKey];
      }

      const lastKey = pathKeys[pathKeys.length - 1];
      const validLastKey = !isNaN(Number(lastKey)) ? Number(lastKey) : lastKey;
      current[validLastKey] = value;

      return newState;
    });

    if (touched[path]) {
      validate(path);
    }
  };

  const handleBlur = (fieldName: string) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    validate(fieldName);
  };

  const handleBlurByPath = (path: string) => {
    setTouched((prev) => ({ ...prev, [path]: true }));
    validate(path);
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
    handleChangeByPath,
    handleBlur,
    handleBlurByPath,
    handleSubmit,
  };
}
