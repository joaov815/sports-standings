import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";

import AvatarInput from "@/components/avatar-input";
import { Form } from "@/components/form";
import FormErrorText from "@/components/form-error-text";
import { useFormValidation, range } from "@/utils/utils";
import { Validators } from "@/utils/validators";

export interface TeamForm {
  name: string | null;
  description: string | null;
  imageUrl: string | null;
}

export function TeamsForm({
  numberOfTeams,
  submit,
}: {
  numberOfTeams: number;
  submit: (f: { [k: string]: any }) => void;
}) {
  const {
    formValues,
    formErrors,
    handleChangeByPath,
    handleBlurByPath,
    handleSubmit,
  } = useFormValidation({
    teams: {
      value: range(numberOfTeams).map(
        () => ({ name: null, description: null, imageUrl: null } as TeamForm)
      ),
      fields: {
        name: {
          value: null,
          validators: [Validators.required()],
        },
        description: {
          value: null,
        },
        imageUrl: {
          value: null,
        },
      },
    },
  });

  function onUploadAvatarImage(file: File | undefined, index: number) {
    if (!file) return;

    const localPath = URL.createObjectURL(file);
    handleChangeByPath(`teams.${index}.imageUrl`, localPath);
  }

  const handleFormSubmit = handleSubmit(() => {
    console.log("Teams form valid:", formValues);
    submit(formValues);
  });

  return (
    <Form className="space-y-4" onSubmit={handleFormSubmit}>
      {range(numberOfTeams).map((v, i) => (
        <div className="flex gap-x-4 mt-20" key={v}>
          <div className="flex justify-center items-center shrink-0">
            <AvatarInput
              size={140}
              onChange={(e) => onUploadAvatarImage(e, i)}
            />
          </div>
          <div className="flex flex-col gap-2 justify-center grow">
            <div>
              <InputText
                placeholder="Nome"
                invalid={!!formErrors[`teams.${i}.name`]?.length}
                onBlur={() => handleBlurByPath(`teams.${i}.name`)}
                className="w-full"
                value={formValues.teams[i].name ?? ""}
                onChange={(e) =>
                  handleChangeByPath(`teams.${i}.name`, e.target.value)
                }
              />
              <FormErrorText errors={formErrors[`teams.${i}.name`]} />
            </div>
            <div>
              <InputTextarea
                placeholder="Descrição"
                className="w-full"
                invalid={!!formErrors[`teams.${i}.description`]?.length}
                onBlur={() => handleBlurByPath(`teams.${i}.description`)}
                value={formValues.teams[i].description ?? ""}
                onChange={(e) =>
                  handleChangeByPath(`teams.${i}.description`, e.target.value)
                }
                rows={4}
              />
              <FormErrorText errors={formErrors[`teams.${i}.description`]} />
            </div>
          </div>
        </div>
      ))}
    </Form>
  );
}
