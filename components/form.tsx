import { Button } from "primereact/button";

export function Form({
  onSubmit,
  children,
  ...props
}: {
  onSubmit: (e: any) => any;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLFormElement>) {
  return (
    <form action="none" {...props}>
      {children}
      
      <div className="flex flex-row-reverse mt-10 py-2">
        <Button label="Próximo passo" type="button" onClick={onSubmit} />
      </div>
    </form>
  );
}
