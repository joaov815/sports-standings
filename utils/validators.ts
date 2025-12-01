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
      isValid: typeof v === "number" ? v % 2 === 0 : true,
      errorMessage,
    });
  }

  static minLength(
    val: number,
    errorMessage = "Número de caracteres inválido"
  ): Validator {
    return (v: unknown) => ({
      isValid: typeof v === "string" ? v.length >= val : true,
      errorMessage,
    });
  }

  static between(
    min: number,
    max: number,
    errorMessage = "Valor inválido"
  ): Validator {
    return (v: unknown) => ({
      isValid: typeof v === "number" ? v >= min && v <= max : true,
      errorMessage,
    });
  }
}
