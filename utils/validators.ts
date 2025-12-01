import { Validator } from "./utils";

export class Validators {
  static required(errorMessage = "Campo obrigatório"): Validator {
    return (v: unknown) => ({
      isValid: v !== null && v !== undefined,
      errorMessage,
    });
  }
  
  static evenNumber(errorMessage = "Deve ser par"): Validator {
    return (v: number) => ({
      isValid: v % 2 === 0,
      errorMessage,
    });
  }

  static minLength(
    val: number,
    errorMessage = "Número de caracteres inválido"
  ): Validator {
    return (v: string) => ({
      isValid: v.length >= val,
      errorMessage,
    });
  }

  static between(
    min: number,
    max: number,
    errorMessage = "Valor inválido"
  ): Validator {
    return (v: number) => ({
      isValid: v >= min && v <= max,
      errorMessage,
    });
  }
}
