import { classNames } from "../../utils/classNames";

const ERR = { err: "Unknown error" };

export default function APIErrors({ error }: { error: any }) {
  const errors = Object.entries(error.response?.data || ERR);

  return (
    <ul
      className={classNames(
        "block sm:inline",
        errors.length > 1 && "space-y-2 list-decimal ml-6"
      )}
    >
      {errors.map(([key, value]) => (
        <li key={key}>{value as any}</li>
      ))}
    </ul>
  );
}
