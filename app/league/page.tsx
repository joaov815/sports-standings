"use client";

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { Steps } from "primereact/steps";
import { Dropdown } from "primereact/dropdown";
import { useState } from "react";

import AvatarInput from "@/components/avatar-input";
import { range, useFormValidation } from "@/utils/utils";
import FormErrorText from "@/components/form-error-text";

export default function LeaguePage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { formValues, formErrors, handleChange, handleSubmit, handleBlur } =
    useFormValidation({
      name: {
        value: "",
        validators: [
          (v) => {
            return {
              isValid: v.length > 2,
              errorMessage: "Número de caracteres inválido",
            };
          },
        ],
      },
      description: { value: "" },
      kind: { value: "" },
      imageUrl: { value: "" },
      numberOfTeams: { value: null },
      numberOfRounds: { value: null },
      teams: { value: [] },
    });

  const kindList = [{ name: "Pontos corridos", code: "P" }];

  const items = [
    {
      label: "Dados da Liga",
    },
    {
      label: "Participantes",
    },
  ];

  function uploadImage(file: File | undefined) {
    if (!file) return;

    // Faz upload....

    handleChange("imageUrl", file.name);
  }

  function submit(e: React.FormEvent) {
    if (activeIndex === 0) {
      handleSubmit(() => {
        console.log("submit first form");
        setActiveIndex(1);
      })(e);

      return;
    }

    // submit
  }

  console.log(!!formErrors.name);

  const participantsTemplate = formValues.numberOfTeams ? (
    range(formValues.numberOfTeams).map((v) => {
      return (
        <div className="flex gap-x-4 mt-20" key={v}>
          <div className="flex justify-center items-center shrink-0">
            <AvatarInput size={140} onChange={(file) => uploadImage(file)} />
          </div>
          <div className="flex flex-col gap-2 justify-center grow">
            <InputText
              placeholder="Nome"
              invalid={!!formErrors.name}
              onBlur={() => handleBlur("name")}
              className="w-full"
              value={formValues.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            <InputTextarea
              placeholder="Descrição"
              className="w-full"
              invalid={!!formErrors.description}
              value={formValues.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={4}
            />
          </div>
        </div>
      );
    })
  ) : (
    <></>
  );

  const firstStep =
    activeIndex === 0 ? (
      <>
        <div className="grid grid-cols-4 gap-4 mt-10">
          <div className="flex justify-center">
            <AvatarInput onChange={(file) => uploadImage(file)} />
          </div>
          <div className="flex flex-col justify-center col-span-3">
            <InputText
              placeholder="Nome"
              invalid={!!formErrors.name?.length}
              value={formValues.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            <FormErrorText errors={formErrors.name} />
          </div>
        </div>

        <div>
          <InputTextarea
            placeholder="Descrição"
            className="w-full"
            value={formValues.description}
            invalid={!!formErrors.name?.length}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={5}
          />
          <FormErrorText errors={formErrors.name} />
        </div>

        <div className="grid grid-cols-3 gap-x-2">
          <div>
            <Dropdown
              value={formValues.kind}
              onChange={(e) => handleChange("kind", e.value)}
              options={kindList}
              invalid={!!formErrors.name?.length}
              optionLabel="name"
              placeholder="Selecione o tipo"
              className="w-full md:w-14rem"
            />
            <FormErrorText errors={formErrors.name} />
          </div>

          <div>
            <InputNumber
              placeholder="N. times"
              showButtons
              name="numberOfTeams"
              invalid={!!formErrors.name?.length}
              min={0}
              max={30}
              value={formValues.numberOfTeams}
              onChange={(e) => handleChange("numberOfTeams", e.value)}
            />
            <FormErrorText errors={formErrors.name} />
          </div>

          <div>
            <InputNumber
              placeholder="N. turnos"
              showButtons
              min={0}
              max={4}
              invalid={!!formErrors.name?.length}
              value={formValues.numberOfRounds}
              onChange={(e) => handleChange("numberOfRounds", e.value)}
            />
            <FormErrorText errors={formErrors.name} />
          </div>
        </div>
      </>
    ) : null;

  const secondStep = activeIndex === 1 ? participantsTemplate : null;

  return (
    <div className="p-8 flex flex-col h-full">
      <Steps
        model={items}
        activeIndex={activeIndex}
        onSelect={(e) => setActiveIndex(e.index)}
        readOnly
      />

      <div className="border-2 mt-10 px-5 rounded-lg h-full overflow-y-auto">
        <form action="none" className="space-y-4">
          {firstStep}
          {secondStep}

          <div className="flex flex-row-reverse mt-10 py-2">
            <Button label="Próximo passo" type="button" onClick={submit} />
          </div>
        </form>
      </div>
    </div>
  );
}
