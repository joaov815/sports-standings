export default function FormErrorText({ errors }: { errors?: string[] }) {
  if (!errors) return null;

  return (
    <div className="p-2 text-red-600">
      <ul className="form-errors">
        {errors?.map((err, i) => (
          <li key={i} className="form-error-text">
            {err}
          </li>
        ))}
      </ul>
    </div>
  );
}
